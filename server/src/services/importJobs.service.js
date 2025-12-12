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

      const transformedJobs = this.#transformJobs(rawJobs, stats);

      await this.#queueJobs(transformedJobs, stats, logId);

      await this.#finalizeLog(logId, stats, startTime);

      logger.info(
        `Import queuing completed: ${stats.totalQueued} jobs queued for processing`
      );
      return stats;
    } catch (error) {
      logger.error(`Import failed for ${feedUrl}:`, error.message);

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
          stats.failedToQueue.push({
            jobData: rawJob,
            reason: "Missing required fields: job_id or title",
          });
          continue;
        }

        transformed.push(job);
      } catch (error) {
        stats.failedToQueue.push({
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

  async #queueJobs(jobs, stats, logId) {
    logger.info(`Queueing ${jobs.length} jobs for processing`);

    const queuePromises = jobs.map(async (job) => {
      try {
        await jobQueue.add("process-job", { job, importLogId: logId });
        stats.totalQueued++;
      } catch (error) {
        logger.error(`Failed to queue job ${job.job_id}:`, error);
        stats.failedToQueue.push({
          jobData: job,
          reason: `Queue error: ${error.message}`,
        });
      }
    });

    await Promise.all(queuePromises);
  }

  async #finalizeLog(logId, stats, startTime, errorMessage = null) {
    const endTime = new Date();
    const duration = endTime - startTime;

    await ImportLog.findByIdAndUpdate(logId, {
      total_fetched: stats.totalFetched,
      total_queued: stats.totalQueued,
      total_failed: stats.failedToQueue.length,
      finished_at: endTime,
      duration_ms: duration,
      error_message: errorMessage,
      failed_jobs: stats.failedToQueue.slice(0, 100),
    });
  }
}

module.exports = new JobImportService();
