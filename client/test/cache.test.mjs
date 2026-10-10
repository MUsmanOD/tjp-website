import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ApiError,
  apiQueryOptions,
  requestJson,
} from "../src/lib/api-client.mjs";
import {
  cachePolicy,
  createQueryClient,
  shouldRetryRequest,
} from "../src/lib/query-client.mjs";

function setup(
  t,
  fetchImplementation = async () => Response.json({ status: "ok" }),
) {
  const client = createQueryClient();
  const fetchMock = t.mock.method(globalThis, "fetch", fetchImplementation);
  t.after(() => client.clear());
  return { client, fetchMock };
}

test("fresh data is reused without a second request", async (t) => {
  const { client, fetchMock } = setup(t);
  const options = apiQueryOptions("/api/health");
  assert.deepEqual(await client.fetchQuery(options), { status: "ok" });
  assert.deepEqual(await client.fetchQuery(options), { status: "ok" });
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("concurrent callers share a single in-flight request", async (t) => {
  let release;
  const pending = new Promise((resolve) => {
    release = resolve;
  });
  const { client, fetchMock } = setup(t, async () => {
    await pending;
    return Response.json({ status: "ok" });
  });
  const options = apiQueryOptions("/api/health");
  const first = client.fetchQuery(options);
  const second = client.fetchQuery(options);
  release();
  assert.deepEqual(await Promise.all([first, second]), [
    { status: "ok" },
    { status: "ok" },
  ]);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("stale entries refetch after their freshness window", async (t) => {
  const { client, fetchMock } = setup(t);
  const options = apiQueryOptions("/api/health");
  client.setQueryData(
    options.queryKey,
    { status: "old" },
    {
      updatedAt: Date.now() - cachePolicy.staleTime - 1000,
    },
  );
  assert.deepEqual(await client.fetchQuery(options), { status: "ok" });
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("explicit invalidation refetches even previously fresh data", async (t) => {
  const { client, fetchMock } = setup(t);
  const options = apiQueryOptions("/api/health");
  await client.fetchQuery(options);
  await client.invalidateQueries({ queryKey: options.queryKey });
  await client.fetchQuery(options);
  assert.equal(fetchMock.mock.callCount(), 2);
});

test("parameters and identity scopes keep cached resources separate", async (t) => {
  const { client, fetchMock } = setup(t);
  for (const scope of ["public", "user-a", "user-b"]) {
    await client.fetchQuery(apiQueryOptions("/api/health", { scope }));
  }
  await client.fetchQuery(
    apiQueryOptions("/api/health", { params: { page: 2 } }),
  );
  assert.equal(fetchMock.mock.callCount(), 4);
  assert.equal(client.getQueryCache().getAll().length, 4);
});

test("separate providers do not share cache contents", async (t) => {
  const { client } = setup(t);
  const otherClient = createQueryClient();
  t.after(() => otherClient.clear());
  const options = apiQueryOptions("/api/health");
  await client.fetchQuery(options);
  assert.equal(otherClient.getQueryData(options.queryKey), undefined);
});

test("HTTP failures are not cached as successful data and recovery works", async (t) => {
  let failed = true;
  const { client, fetchMock } = setup(t, async () =>
    failed
      ? new Response(null, { status: 404 })
      : Response.json({ status: "ok" }),
  );
  const options = apiQueryOptions("/api/health");
  await assert.rejects(
    client.fetchQuery(options),
    (error) => error instanceof ApiError && error.status === 404,
  );
  assert.equal(client.getQueryData(options.queryKey), undefined);
  failed = false;
  assert.deepEqual(await client.fetchQuery(options), { status: "ok" });
  assert.equal(fetchMock.mock.callCount(), 2);
});

test("server failures retry twice with a bounded policy", async (t) => {
  const { client, fetchMock } = setup(
    t,
    async () => new Response(null, { status: 503 }),
  );
  await assert.rejects(
    client.fetchQuery(apiQueryOptions("/api/health", { retryDelay: 0 })),
    ApiError,
  );
  assert.equal(fetchMock.mock.callCount(), 3);
  for (const status of [400, 401, 403, 404, 429]) {
    assert.equal(shouldRetryRequest(0, new ApiError(status)), false);
  }
  assert.equal(shouldRetryRequest(0, new TypeError("Network failure")), true);
  assert.equal(shouldRetryRequest(2, new TypeError("Network failure")), false);
  assert.equal(shouldRetryRequest(0, new SyntaxError("Invalid JSON")), false);
});

test("cancelling a query aborts its underlying fetch", async (t) => {
  let signal;
  const { client } = setup(t, async (_url, options) => {
    signal = options.signal;
    return new Promise((_resolve, reject) => {
      signal.addEventListener(
        "abort",
        () => reject(new DOMException("Aborted", "AbortError")),
        { once: true },
      );
    });
  });
  const options = apiQueryOptions("/api/health");
  const rejection = assert.rejects(client.fetchQuery(options));
  await client.cancelQueries({ queryKey: options.queryKey });
  await rejection;
  assert.equal(signal.aborted, true);
  assert.equal(client.getQueryData(options.queryKey), undefined);
});

test("request parameters are encoded and HTTP caching is bypassed", async (t) => {
  const { fetchMock } = setup(t);
  await requestJson("/api/health", {
    params: { search: "a & b", page: 0, omitted: undefined },
  });
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url.searchParams.get("search"), "a & b");
  assert.equal(url.searchParams.get("page"), "0");
  assert.equal(url.searchParams.has("omitted"), false);
  assert.equal(options.cache, "no-store");
  await assert.rejects(requestJson("//other.example/api"), /single slash/);
});

test("empty successful responses are supported", async (t) => {
  setup(t, async () => new Response(null, { status: 204 }));
  assert.equal(await requestJson("/api/health"), null);
});
