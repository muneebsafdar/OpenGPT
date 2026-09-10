import redis from "../../../shared/redis/redis.js";

const Limits = {
  code: 5,
  image: 3,
  pdf: 2,
  ppt: 4,
  chat: 20,
  search: 5,
};

export const rateLimiter = async (userId, agent) => {
  console.log(userId);

  if (!userId) {
    const error = new Error("User ID is required.");
    error.statusCode = 400;
    throw error;
  }

  const maxLimit = Limits[agent];
  if (!maxLimit) {
    const error = new Error(`Invalid agent type: ${agent}`);
    error.statusCode = 400;
    throw error;
  }

  try {
    const key = `rate_limit:${userId}:${agent}`;

    // Increment count atomically
    const currentCount = await redis.incr(key);

    // Set 2-minute (120s) expiration on first request
    if (currentCount === 1) {
      await redis.expire(key, 120);
    }

    // Check limit threshold
    if (currentCount > maxLimit) {
      const ttl = await redis.ttl(key);

      // Create and throw the rate limit error
      const error = new Error(
        `Limit exceeded for ${agent} requests. Please try again in ${ttl} seconds.`
      );
      error.statusCode = 429;
      error.ttl = ttl;
      error.message = "limit exceeded";
      throw error;
    }

    return {
      currentCount,
      remaining: maxLimit - currentCount,
    };
  } catch (error) {
    // Re-throw our 429 rate limit error so calling functions can catch it
    if (error.statusCode === 429) {
      throw error;
    }

    // Fail-open strategy: log Redis connection/server errors without blocking the user
    console.error("Rate Limiter Redis Error:", error);
    return { warning: "Redis unavailable", error: error.message };
  }
};