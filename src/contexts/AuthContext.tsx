import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import type { User, UserRole } from "../stores/useAuthStore";

export type { User, UserRole };

export const getGlobalUser = (): User | null => {
  const user = useAuthStore.getState().user;
  if (!user) {
    const storedUser = localStorage.getItem("simpeg_user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
  }
  return user;
};

export const getGlobalToken = (): string | null => {
  const token = useAuthStore.getState().token;
  if (!token) {
    return localStorage.getItem("simpeg_token");
  }
  return token;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};

export const useAuth = () => {
  const { user, token, login, logout, isLoading } = useAuthStore();
  return { user, token, login, logout, isLoading };
};
