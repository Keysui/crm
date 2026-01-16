import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

const createFallbackRateLimit = () => ({
  limit: async () => ({ 
    success: true, 
    limit: 5, 
    remaining: 4, 
    reset: Date.now() + 900000 
  }),
})

export const loginRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
    })
  : createFallbackRateLimit()

export const passwordResetRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
    })
  : createFallbackRateLimit()
