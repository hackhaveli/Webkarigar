/**
 * Retries a Prisma operation up to `maxAttempts` times with exponential backoff.
 * Use this around any DB call that runs during long-running streaming operations
 * where the Supabase pooler may drop connections intermittently.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  {
    maxAttempts = 3,
    baseDelayMs = 500,
    label = 'DB operation',
  }: { maxAttempts?: number; baseDelayMs?: number; label?: string } = {}
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isConnErr =
        err?.message?.includes("Can't reach database") ||
        err?.code === 'P1001' ||
        err?.code === 'P1002';

      if (!isConnErr || attempt === maxAttempts) {
        throw err;
      }

      const delay = baseDelayMs * 2 ** (attempt - 1);
      console.warn(`[${label}] Attempt ${attempt} failed (DB unreachable), retrying in ${delay}ms…`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError;
}
