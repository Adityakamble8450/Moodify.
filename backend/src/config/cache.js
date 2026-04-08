const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  enableOfflineQueue: true,
});

redis.on("connect", () => {
  console.log("✅ Connected to Redis Cloud");
});

redis.on("ready", () => {
  console.log("✅ Redis is ready");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.code, "-", err.message);
});

redis.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});

module.exports = redis;``