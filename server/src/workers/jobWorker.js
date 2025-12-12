const { Worker } = require("bullmq");
const logger = require("../utils/logger.ut");
const { createRedisConnection } = require("../config/redis");

const createJobWorker = () => {
  const concurrency = parseInt(process.env.WORKER_CONCURRENCY || "20");
  const connection = createRedisConnection();

  const work = () => new Promise((res, rej) => setTimeout(() => res(), 5000));

  const worker = new Worker(
    "job-importer",
    async (job) => {
      logger.info(`Processing job: ${job.id}`);
      await work();
    },
    {
      connection,
      concurrency,
    }
  );

  worker.on("completed", (job) => {
    logger.info(`Job ${job.id} completed`);
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
