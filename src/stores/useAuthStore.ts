import { create } from "zustand";
import { authService } from "../services/authService";
import type { ProfileData } from "../types/api";
import { queryClient } from "../utils/queryClient";

export type UserRole = "admin" | "pegawai" | "hrd" | "direktur";

export interface User {
  id: number;
  nik: string;
  role: UserRole;
  nama: string;
  avatarUrl?: string | null | 'loading';
}

interface AuthState {
  user: User | null;
  profile: ProfileData | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, tokenData: string) => void;
  logout: () => void;
  initialize: () => void;
  updateUser: (userData: Partial<User>) => void;
  setProfile: (profile: ProfileData | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  token: null,
  isLoading: true,
  login: (userData, tokenData) => {
    localStorage.setItem("simpeg_user", JSON.stringify(userData));
    localStorage.setItem("simpeg_token", tokenData);
    set({ user: userData, token: tokenData });
  },
  updateUser: (userData) => {
    set((state) => {
      if (!state.user) return {};
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem("simpeg_user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
  logout: async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("simpeg_user");
      localStorage.removeItem("simpeg_token");
      queryClient.clear();
      set({ user: null, token: null, profile: null });
    }
  },
  setProfile: (profile) => set({ profile }),
  initialize: () => {
    const storedUser = localStorage.getItem("simpeg_user");
    const storedToken = localStorage.getItem("simpeg_token");
    if (storedUser && storedToken) {
      try {
        set({ user: JSON.parse(storedUser), token: storedToken, isLoading: false });
      } catch (error) {
        console.error("Gagal membaca memori penyimpanan sesi:", error);
        localStorage.removeItem("simpeg_user");
        localStorage.removeItem("simpeg_token");
        set({ user: null, token: null, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  }
}));
