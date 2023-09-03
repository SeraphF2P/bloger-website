import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const postingRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "1 m"),
  analytics: true,
});
