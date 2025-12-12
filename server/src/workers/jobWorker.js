const { Worker } = require("bullmq");
const processJobService = require("../services/processJob.service");
const logger = require("../utils/logger.ut");
const { createRedisConnection } = require("../config/redis");

const createJobWorker = () => {
  const concurrency = parseInt(process.env.WORKER_CONCURRENCY || "10", 10);
  const connection = createRedisConnection();

  const worker = new Worker(
    "job-importer",
    async (job) => {
      const { job: jobData, importLogId } = job.data;
      return await processJobService.processJob(jobData, importLogId);
    },
    {
      connection,
      concurrency,
    }
  );

  worker.on("completed", (job) => {
    logger.info(`Job ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Job ${job.id} failed:`, err);
  });

  worker.on("error", (err) => {
    logger.error("Worker error:", err);
  });

  logger.info(`Worker started with concurrency: ${concurrency}`);

  return worker;
};

module.exports = {
  createJobWorker,
};
