const { Queue } = require("bullmq");
const { createRedisConnection } = require("../config/redis");

const redisConnection = createRedisConnection();

const jobQueue = new Queue("job-importer", {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: {
      age: 60 * 60 * 1000,
      count: 1000
    },
  },
});

module.exports = {
  jobQueue,
};
