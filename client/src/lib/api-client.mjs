import { queryOptions } from "@tanstack/react-query";

const apiOrigin = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(status) {
    super(`API request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function requestJson(path, { params = {}, signal } = {}) {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("API paths must start with a single slash.");
  }

  const url = new URL(`${apiOrigin}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null)
      url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
    // TanStack Query owns freshness; a second browser HTTP cache must not serve stale API data.
    cache: "no-store",
  });

  if (!response.ok) throw new ApiError(response.status);
  if (response.status === 204) return null;
  return response.json();
}

// Parameters and identity are part of the key, so different resources never collide.
export function apiQueryOptions(
  path,
  { params = {}, scope = "public", ...options } = {},
) {
  return queryOptions({
    ...options,
    queryKey: ["api", apiOrigin, scope, path, params],
    queryFn: ({ signal }) => requestJson(path, { params, signal }),
  });
}
