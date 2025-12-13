const ImportLog = require("../models/import_logs.mo");
const { fetchJobFeedXml } = require("./fetchJobs.service");
const { parseXmlString } = require("./xmlParser.service");
const { jobQueue } = require("../queues/jobQueues");
const logger = require("../utils/logger.ut");

class JobImportService {
  async importFromFeed(feedUrl) {
    const startTime = new Date();
    const stats = {
      totalFetched: 0,
      totalQueued: 0,
      failedToQueue: [],
    };

    let logId = null;

    try {
      const importLog = await ImportLog.create({
        feed_url: feedUrl,
        total_fetched: 0,
        total_queued: 0,
        started_at: startTime,
      });
      logId = importLog._id;

      logger.info(`Starting import from feed: ${feedUrl}`);

      const rawJobs = await this.#importJobsFromFeed(feedUrl);
      stats.totalFetched = rawJobs.length;

      logger.info(`Fetched ${stats.totalFetched} jobs from feed`);

      const transformedJobs = this.#transformJobs(rawJobs);

      await this.#queueJobs(transformedJobs, stats, logId);

      await this.#finalizeLog(logId, stats);

      logger.info(
        `Import queuing completed: ${stats.totalQueued} jobs queued for processing`
      );
      return stats;
    } catch (error) {
      logger.error(`Import failed for ${feedUrl}:`, error.message);
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
      const job = this.#mapRawJobToSchema(rawJob);
      transformed.push(job);
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

  async #queueJobs(jobs, stats, logId) {
    const BATCH_SIZE = process.env.JOB_BATCH_SIZE || 10000;
    const totalJobs = jobs.length;

    logger.info(`Queueing ${totalJobs} jobs in batches of ${BATCH_SIZE}`);

    for (let i = 0; i < totalJobs; i += BATCH_SIZE) {
      const batch = jobs.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(totalJobs / BATCH_SIZE);

      try {
        const bulkJobs = batch.map((job) => ({
          name: "process-job",
          data: { job, importLogId: logId },
        }));

        await jobQueue.addBulk(bulkJobs);
        stats.totalQueued += batch.length;

        logger.info(
          `Batch ${batchNumber}/${totalBatches}: Queued ${batch.length} jobs (Total: ${stats.totalQueued}/${totalJobs})`
        );

        if (i + BATCH_SIZE < totalJobs) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        logger.error(`Failed to queue batch ${batchNumber}:`, error);

        batch.forEach((job) => {
          stats.failedToQueue.push({
            jobData: job,
            reason: `Batch queue error: ${error.message}`,
          });
        });
      }
    }

    logger.info(
      `Finished queuing: ${stats.totalQueued} jobs successfully queued`
    );
  }

  async #finalizeLog(logId, stats) {
    const endTime = new Date();

    await ImportLog.findByIdAndUpdate(logId, {
      total_fetched: stats.totalFetched,
      total_queued: stats.totalQueued,
      total_failed: stats.failedToQueue.length,
      finished_at: endTime,
      failed_jobs: stats.failedToQueue.slice(0, 100),
    });
  }
}

module.exports = new JobImportService();
