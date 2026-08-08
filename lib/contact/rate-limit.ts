import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** Free-tier friendly: 5 submissions per IP per rolling hour. */
export const CONTACT_RATE_LIMIT = 5;
export const CONTACT_RATE_WINDOW = "1 h" as const;

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; remaining: number; reset: number }
  | { ok: false; misconfigured: true };

export type RateLimitCheck = (identifier: string) => Promise<RateLimitResult>;

function hasRedisEnv(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (!hasRedisEnv()) return null;
  if (!ratelimit) {
    const redis = Redis.fromEnv();
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(CONTACT_RATE_LIMIT, CONTACT_RATE_WINDOW),
      prefix: "portfolio:contact",
      analytics: false,
    });
  }
  return ratelimit;
}

/**
 * Sliding-window limit by identifier (typically client IP).
 * Returns misconfigured when Upstash env is missing — caller maps to 503.
 */
export async function checkContactRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  const limiter = getRatelimit();
  if (!limiter) {
    return { ok: false, misconfigured: true };
  }

  const result = await limiter.limit(identifier);
  if (result.success) {
    return { ok: true, remaining: result.remaining };
  }
  return {
    ok: false,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/** Extract a stable client IP for rate limiting (Vercel + reverse proxies). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}
