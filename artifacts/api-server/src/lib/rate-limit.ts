export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

type RateLimiterOptions = {
  max: number;
  windowMs: number;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

export function createRateLimiter({
  max,
  windowMs,
}: RateLimiterOptions): (key: string) => RateLimitResult {
  const buckets = new Map<string, RateLimitBucket>();

  return (key: string): RateLimitResult => {
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (bucket.count >= max) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
      };
    }

    bucket.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  };
}
