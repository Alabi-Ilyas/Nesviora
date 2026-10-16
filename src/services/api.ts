// Thin fetch wrapper for the Nesviora backend.
// - Access token is kept in memory only (never localStorage).
// - Refresh token is an httpOnly cookie, so every request is sent with credentials.
// - On a 401 it tries one silent refresh, then retries the request once.

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000/api';

let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  auth?: boolean; // attach the Bearer token (default true)
  retry?: boolean; // allow one refresh-and-retry on 401 (default true)
}

let refreshing: Promise<string | null> | null = null;

export function refreshAccessToken(): Promise<string | null> {
  if (!refreshing) {
    refreshing = fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) return null;
        const json = await res.json();
        accessToken = json.data.accessToken as string;
        return accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

function errorMessage(json: any, fallback: string): string {
  if (json && Array.isArray(json.details) && json.details.length > 0) {
    return json.details.map((d: { message: string }) => d.message).join(' ');
  }
  return (json && json.message) || fallback;
}

async function request<T>(method: string, path: string, body?: unknown, opts: RequestOptions = {}): Promise<T> {
  const { auth = true, retry = true } = opts;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0);
  }

  if (res.status === 401 && auth && retry) {
    const fresh = await refreshAccessToken();
    if (fresh) return request<T>(method, path, body, { auth, retry: false });
    accessToken = null;
    window.dispatchEvent(new Event('auth:logout'));
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) throw new ApiError(errorMessage(json, `Request failed (${res.status})`), res.status);
  return (json ? json.data : undefined) as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>('GET', path, undefined, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) => request<T>('POST', path, body ?? {}, opts),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) => request<T>('PATCH', path, body ?? {}, opts),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>('DELETE', path, undefined, opts),
};
