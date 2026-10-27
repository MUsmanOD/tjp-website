let csrfToken,
  csrfPromise,
  refreshPromise,
  generation = 0;
export function clearAuth() {
  csrfToken = undefined;
  generation++;
}
async function csrf() {
  if (!csrfToken) {
    csrfPromise ??= fetch("/api/v1/auth/csrf", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("INTERNAL");
        return (await r.json()).token;
      })
      .finally(() => {
        csrfPromise = null;
      });
    csrfToken = await csrfPromise;
  }
  return csrfToken;
}
export async function api(
  path,
  { method = "GET", body, headers = {}, retry = true } = {},
) {
  const requestGeneration = generation;
  const response = await fetch("/api/v1" + path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(method !== "GET"
        ? { "Content-Type": "application/json", "X-CSRF-Token": await csrf() }
        : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (data.csrf) csrfToken = data.csrf;
  if (
    response.status === 401 &&
    retry &&
    (!path.startsWith("/auth/") ||
      ["/auth/me", "/auth/sessions", "/auth/logout"].includes(path))
  ) {
    const refresh = async () => {
      const check = await fetch("/api/v1/auth/me", { cache: "no-store" });
      if (check.ok) return;
      return api("/auth/refresh", { method: "POST", retry: false });
    };
    if (!refreshPromise)
      refreshPromise = (
        navigator.locks
          ? navigator.locks.request("tjp-refresh", refresh)
          : refresh()
      ).finally(() => {
        refreshPromise = null;
      });
    try {
      await refreshPromise;
      return api(path, { method, body, headers, retry: false });
    } catch {
      window.dispatchEvent(new Event("tjp-session-expired"));
    }
  }
  if (!response.ok) {
    const error = new Error(data.code || "INTERNAL");
    error.fields = data.fields || {};
    error.status = response.status;
    throw error;
  }
  if (
    path.startsWith("/admin/") ||
    path === "/auth/me" ||
    path === "/auth/sessions"
  ) {
    if (requestGeneration !== generation) throw new Error("UNAUTHORIZED");
    window.dispatchEvent(new Event("tjp-auth-activity"));
  }
  return data;
}
