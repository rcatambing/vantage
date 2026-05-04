const API_BASE = "/api";

const AUTH_TOKEN_KEY = "vantage_auth_token";

/** Read the stored JWT from localStorage. */
function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/** Clear the stored token and broadcast a logout event. */
function clearAuthAndLogout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event("vantage:auth:logout"));
}

/** Attempt to refresh the access token. Placeholder for refresh logic. */
async function refreshToken(): Promise<string | null> {
  // TODO: Implement refresh token endpoint call
  // const refresh = localStorage.getItem("vantage_refresh_token");
  // if (!refresh) return null;
  // const res = await fetch(`${API_BASE}/auth/refresh`, { method: "POST", body: JSON.stringify({ refresh_token: refresh }) });
  // if (!res.ok) return null;
  // const data = await res.json();
  // localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
  // return data.access_token;
  return null;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let token = getStoredToken();
  const method = (init?.method ?? "GET").toUpperCase();
  // Only set Content-Type for requests with a body
  const hasBody = method !== "GET" && method !== "DELETE" && method !== "HEAD";

  const makeRequest = (accessToken: string | null) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    return fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...init?.headers,
      },
    }).finally(() => clearTimeout(timeout));
  };

  let res = await makeRequest(token);

  // Handle 401 by attempting token refresh once
  if (res.status === 401) {
    const newToken = await refreshToken();
    if (newToken) {
      token = newToken;
      res = await makeRequest(token);
    } else {
      clearAuthAndLogout();
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? body?.title ?? `API error ${res.status}`);
  }

  return res.json();
}
