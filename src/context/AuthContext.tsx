import { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { appToaster } from "../toaster";
import { apiFetch } from "../lib/api/client";
import type { AuthState, SystemRole, User } from "./authState";

const AUTH_TOKEN_KEY = "vantage_auth_token";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function parseUserFromToken(token: string): User | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const id = payload.sub ?? payload.user_id ?? payload.id;
  const username = payload.username ?? payload.preferred_username;
  const full_name = payload.full_name ?? payload.name ?? payload.fullName;
  const email = payload.email;
  const system_role = payload.system_role ?? payload.role ?? payload.systemRole;

  if (
    typeof id !== "string" ||
    typeof username !== "string" ||
    typeof full_name !== "string" ||
    typeof email !== "string" ||
    typeof system_role !== "string"
  ) {
    return null;
  }

  return {
    id,
    username,
    full_name,
    email,
    system_role: system_role as SystemRole,
  };
}

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const validateStoredToken = useCallback(async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    const parsed = parseUserFromToken(token);
    if (!parsed) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setIsLoading(false);
      return;
    }

    // Optionally verify token with backend (lightweight check)
    try {
      await apiFetch("/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(parsed);
    } catch {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    validateStoredToken();
  }, [validateStoredToken]);

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      const token = response.access_token;
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      const parsed = parseUserFromToken(token);
      if (!parsed) {
        throw new Error("Invalid token received from server");
      }

      setUser(parsed);

      const toaster = await appToaster;
      toaster.show({
        message: `Welcome, ${parsed.full_name}`,
        intent: "success",
      });
    },
    []
  );

  const hasRole = useCallback(
    (roles: SystemRole[]) => {
      if (!user) return false;
      return roles.some((r) => r === user.system_role);
    },
    [user]
  );

  const hasAnyRole = useCallback(
    (roles: SystemRole[]) => {
      if (!user) return false;
      return roles.some((r) => r === user.system_role);
    },
    [user]
  );

  const value: AuthState = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
