const API_BASE = "/api";

/**
 * Stub: returns null until JWT authentication is implemented.
 * When auth is added, read the token from React context or localStorage here.
 * TODO: When cookie-based auth is added, include credentials: "include"
 *       and an X-CSRF-Token header in the request below.
 */
function getStoredToken(): string | null {
  return null;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const method = (init?.method ?? "GET").toUpperCase();
  // Only set Content-Type for requests with a body
  const hasBody = method !== "GET" && method !== "DELETE" && method !== "HEAD";

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? body?.title ?? `API error ${res.status}`);
  }

  return res.json();
}
