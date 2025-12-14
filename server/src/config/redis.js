const { Redis } = require("ioredis");
const logger = require("../utils/logger.ut");
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = require("./env");

const redisConfig = {
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT || "6379"),
  password: REDIS_PASSWORD,
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
