const { Worker } = require("bullmq");
const logger = require("../utils/logger.ut");
const { createRedisConnection } = require("../config/redis");
const {
  processJob,
  updateLogOnSuccess,
  updateLogOnError,
} = require("../services/processJob.service");
const { WORKER_CONCURRENCY } = require("../config/env");

const createJobWorker = () => {
  const concurrency = parseInt(WORKER_CONCURRENCY || "10", 10);
  const connection = createRedisConnection();

  const worker = new Worker(
    "job-importer",
    async (job) => {
      const { job: jobData, importLogId } = job.data;
      return await processJob(jobData, importLogId);
    },
    {
      connection,
      concurrency,
    }
  );

  worker.on("completed", (job, result) => {
    updateLogOnSuccess(result);
    logger.info(`Job ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    updateLogOnError(err);
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
