import { Ratelimit } from "@upstash/ratelimit";
import {red as redis} from "../server/redis";

export const postingRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});
