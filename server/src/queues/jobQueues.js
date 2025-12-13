const { Queue } = require("bullmq");
const { createRedisConnection } = require("../config/redis");

const redisConnection = createRedisConnection();

const jobQueue = new Queue("job-importer", {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 1000,
  },
});

module.exports = {
  jobQueue,
};
