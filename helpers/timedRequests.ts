import { APIResponse } from "@playwright/test";

// request duration
export async function timedRequest(
  fn: () => Promise<APIResponse>,
  maxDurationMs: number = 5000
): Promise<{ response: APIResponse; duration: number }> {
  const start = Date.now();
  const response = await fn();
  const duration = Date.now() - start;

  if (duration > maxDurationMs) {
    throw new Error(`Expected request < ${maxDurationMs}ms but took ${duration}ms`);
  }

  return { response, duration }
}