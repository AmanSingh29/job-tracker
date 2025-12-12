const { Redis } = require("ioredis");
const logger = require("../utils/logger.ut");

const redisConfig = {
  username: "default",
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
};

const createRedisConnection = () => {
  const redis = new Redis(redisConfig);
  redis.on("connect", () => {
    logger.info("Redis connected successfully");
  });

  redis.on("error", (err) => {
    logger.error("Redis error:", err);
  });
  return redis;
};

module.exports = {
  createRedisConnection,
};
