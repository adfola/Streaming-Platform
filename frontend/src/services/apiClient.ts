/**
 * Centralized axios "API gateway".
 *
 * - Single base URL from VITE_PUBLIC_API_BASE_URL (.env).
 * - Request interceptor: attaches Bearer token from auth storage.
 * - Response interceptor: normalizes error shape, auto-logs out on 401.
 * - Generic helpers (apiGet/apiPost/apiPut/apiDelete) keep services tiny
 *   and fully typed via TypeScript generics.
 */
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const BASE_URL: string =
  (import.meta.env.VITE_PUBLIC_API_BASE_URL as string | undefined) ??
  "http://localhost:5126/v1";

export const SESSION_KEY = "lv:session";

/** Read token from persisted session (browser-only). */
function readToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string };
    return parsed.token ?? null;
  } catch {
    return null;
  }
}

/** Pre-configured axios instance — every service uses this. */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// ─── Request interceptor: inject auth token ───
apiClient.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Normalized error surfaced to the UI. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Response interceptor: unify error shape ───
apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string; error?: string }>) => {
    const status = err.response?.status ?? 0;
    const message =
      err.response?.data?.message ??
      err.response?.data?.error ??
      err.message ??
      "Network error";

    // Auto-clear stale session on 401
    if (status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem(SESSION_KEY);
    }

    return Promise.reject(new ApiError(status, message, err.response?.data));
  },
);

// ─── Typed helpers ───
export async function apiGet<T>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res: AxiosResponse<T> = await apiClient.get(path, config);
  return res.data;
}

export async function apiPost<T, B = unknown>(
  path: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res: AxiosResponse<T> = await apiClient.post(path, body, config);
  return res.data;
}

export async function apiPut<T, B = unknown>(
  path: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res: AxiosResponse<T> = await apiClient.put(path, body, config);
  return res.data;
}

export async function apiDelete<T = void>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res: AxiosResponse<T> = await apiClient.delete(path, config);
  return res.data;
}
