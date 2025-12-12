const Job = require("../models/jobs.mo");
const ImportLog = require("../models/import_logs.mo");
const { fetchJobFeedXml } = require("./fetchJobs.service");
const { parseXmlString } = require("./xmlParser.service");
const logger = require("../utils/logger.ut");

class JobImportService {
  constructor() {
    this.BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "100", 10);
    this.MAX_RETRIES = parseInt(process.env.MAX_RETRIES || "3", 10);
  }

  async importFromFeed(feedUrl) {
    const startTime = new Date();
    const stats = {
      totalFetched: 0,
      totalImported: 0,
      newJobs: 0,
      updatedJobs: 0,
      failedJobs: [],
    };

    let logId = null;

    try {
      const importLog = await ImportLog.create({
        feed_url: feedUrl,
        total_fetched: 0,
        total_imported: 0,
        total_failed: 0,
        new_jobs: 0,
        updated_jobs: 0,
        started_at: startTime,
        status: "in_progress",
      });
      logId = importLog._id;

      logger.info(`Starting import from feed: ${feedUrl}`);

      const rawJobs = await this.#importJobsFromFeed(feedUrl);
      stats.totalFetched = rawJobs.length;

      logger.info(`Fetched ${stats.totalFetched} jobs from feed`);

      const transformedJobs = this.#transformJobs(rawJobs, stats);

      await this.#processBatches(transformedJobs, stats, logId);

      await this.#finalizeLog(logId, stats, startTime);

      logger.info(`Import completed: ${stats.totalImported} jobs imported`);
      return stats;
    } catch (error) {
      logger.error(`Import failed for ${feedUrl}:`, error);

      if (logId) {
        await this.#finalizeLog(logId, stats, startTime, error.message);
      }

      throw error;
    }
  }

  async #importJobsFromFeed(feed_url) {
    try {
      const jobsInXml = await fetchJobFeedXml(feed_url);
      const parsed = parseXmlString(jobsInXml);
      const items = parsed?.rss?.channel?.item || [];
      const canonicalItems = Array.isArray(items) ? items : [items];
      return canonicalItems;
    } catch (error) {
      throw error;
    }
  }

  #transformJobs(rawJobs, stats) {
    const transformed = [];

    for (const rawJob of rawJobs) {
      try {
        const job = this.#mapRawJobToSchema(rawJob);

        if (!job.job_id || !job.title) {
          stats.failedJobs.push({
            jobData: rawJob,
            reason: "Missing required fields: job_id or title",
          });
          continue;
        }

        transformed.push(job);
      } catch (error) {
        stats.failedJobs.push({
          jobData: rawJob,
          reason: `Transformation error: ${error.message}`,
        });
      }
    }

    return transformed;
  }

  #mapRawJobToSchema(rawJob) {
    return {
      job_id: rawJob.id,
      title: rawJob.title || "",
      company: rawJob["job_listing:company"] || "Unknown",
      location: rawJob["job_listing:location"] || "Remote",
      type: rawJob["job_listing:job_type"] || "Full-time",
      description: rawJob.description || "",
      link: rawJob.link || rawJob.guid || "",
      published_at: this.#parseDate(rawJob.pubDate),
    };
  }

  #parseDate(dateStr) {
    if (!dateStr) return new Date();
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  async #processBatches(jobs, stats, logId) {
    const batches = this.#createBatches(jobs, this.BATCH_SIZE);

    logger.info(
      `Processing ${batches.length} batches of size ${this.BATCH_SIZE}`
    );

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];

      try {
        await this.#processSingleBatch(batch, stats);

        if ((i + 1) % 10 === 0) {
          await this.#updateProgress(logId, stats);
          logger.info(`Processed ${i + 1}/${batches.length} batches`);
        }
      } catch (error) {
        logger.error(`Batch ${i + 1} failed:`, error);
        batch.forEach((job) => {
          stats.failedJobs.push({
            jobData: job,
            reason: `Batch processing error: ${error.message}`,
          });
        });
      }
    }
  }

  async #processSingleBatch(batch, stats) {
    const operations = [];

    for (const job of batch) {
      operations.push({
        updateOne: {
          filter: { job_id: job.job_id },
          update: { $set: job },
          upsert: true,
        },
      });
    }

    try {
      const result = await Job.bulkWrite(operations, { ordered: false });

      stats.newJobs += result.upsertedCount || 0;
      stats.updatedJobs += result.modifiedCount || 0;
      stats.totalImported +=
        (result.upsertedCount || 0) + (result.modifiedCount || 0);
    } catch (error) {
      if (error.writeErrors) {
        error.writeErrors.forEach((writeError) => {
          const failedJob = batch[writeError.index];
          stats.failedJobs.push({
            jobData: failedJob,
            reason: `DB Error: ${writeError.errmsg}`,
          });
        });

        if (error.result) {
          stats.newJobs += error.result.nUpserted || 0;
          stats.updatedJobs += error.result.nModified || 0;
          stats.totalImported +=
            (error.result.nUpserted || 0) + (error.result.nModified || 0);
        }
      } else {
        throw error;
      }
    }
  }

  #createBatches(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  async #updateProgress(logId, stats) {
    await ImportLog.findByIdAndUpdate(logId, {
      total_imported: stats.totalImported,
      new_jobs: stats.newJobs,
      updated_jobs: stats.updatedJobs,
      total_failed: stats.failedJobs.length,
    });
  }

  async #finalizeLog(logId, stats, startTime, errorMessage = null) {
    const endTime = new Date();
    const duration = endTime - startTime;

    await ImportLog.findByIdAndUpdate(logId, {
      total_fetched: stats.totalFetched,
      total_imported: stats.totalImported,
      total_failed: stats.failedJobs.length,
      new_jobs: stats.newJobs,
      updated_jobs: stats.updatedJobs,
      finished_at: endTime,
      duration_ms: duration,
      status: errorMessage ? "failed" : "completed",
      error_message: errorMessage,
      failed_jobs: stats.failedJobs.slice(0, 100),
    });
  }
}

module.exports = new JobImportService();
