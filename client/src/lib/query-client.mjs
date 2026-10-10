import { QueryClient } from "@tanstack/react-query";

export const cachePolicy = Object.freeze({
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  maxRetries: 2,
});

export function shouldRetryRequest(failureCount, error) {
  if (failureCount >= cachePolicy.maxRetries || error?.name === "AbortError")
    return false;
  // Do not retry invalid requests, auth failures, or rate limits automatically.
  if (typeof error?.status === "number") return error.status >= 500;
  return error instanceof TypeError; // Fetch network errors; do not retry malformed JSON.
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: cachePolicy.staleTime,
        gcTime: cachePolicy.gcTime,
        retry: shouldRetryRequest,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: { retry: false },
    },
  });
}
