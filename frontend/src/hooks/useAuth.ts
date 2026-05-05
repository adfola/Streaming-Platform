/**
 * useAuth — reactive session synced with localStorage + /v1/auth/me.
 */
import { useEffect, useState } from "react";
import { authService } from "@/services";
import type { AuthResponse, AuthUser } from "@/types/api";

export function useAuth() {
  const [session, setSession] = useState<AuthResponse | null>(() =>
    authService.current(),
  );

  useEffect(() => {
    const sync = () => setSession(authService.current());
    window.addEventListener("storage", sync);

    // Refresh user from /auth/me if we have a token (keeps profile up to date).
    if (session?.token) {
      authService
        .me()
        .then((user: AuthUser) => {
          const next: AuthResponse = { ...(session ?? { success: true, message: "" }), user };
          window.localStorage.setItem("lv:session", JSON.stringify(next));
          setSession(next);
        })
        .catch(() => {
          // Token invalid → clear
          authService.logout();
          setSession(null);
        });
    }

    return () => window.removeEventListener("storage", sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: !!session?.token,
    async login(email: string, password: string) {
      const res = await authService.login({ email, password });
      setSession(res);
      return res;
    },
    async signup(fullName: string, email: string, password: string) {
      const res = await authService.signup({ fullName, email, password });
      setSession(res);
      return res;
    },
    logout() {
      authService.logout();
      setSession(null);
    },
  };
}
