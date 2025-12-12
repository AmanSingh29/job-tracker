const { Queue } = require("bullmq");
const { createRedisConnection } = require("../config/redis");

const redisConnection = createRedisConnection();

const jobQueue = new Queue("job-importer", {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: {
      age: 150,
    },
  },
});

module.exports = {
  jobQueue,
};
