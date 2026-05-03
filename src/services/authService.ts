/**
 * Auth service — /v1/auth.
 * Wraps backend AuthResponse, persists session, exposes /me.
 */
import { apiGet, apiPost, SESSION_KEY } from "./apiClient";
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  SignupPayload,
} from "@/types/api";

function persist(res: AuthResponse) {
  if (typeof window === "undefined") return;
  if (res.success && res.token) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(res));
  }
}

export const authService = {
  /** POST /v1/auth/login */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiPost<AuthResponse, LoginPayload>(
      "/auth/login",
      payload,
    );
    persist(res);
    return res;
  },

  /** POST /v1/auth/signup */
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const res = await apiPost<AuthResponse, SignupPayload>(
      "/auth/signup",
      payload,
    );
    persist(res);
    return res;
  },

  /** GET /v1/auth/me — requires Bearer token. */
  me(): Promise<AuthUser> {
    return apiGet<AuthUser>("/auth/me");
  },

  logout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SESSION_KEY);
    }
  },

  current(): AuthResponse | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthResponse) : null;
    } catch {
      return null;
    }
  },
};
