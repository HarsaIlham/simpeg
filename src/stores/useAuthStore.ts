import { create } from "zustand";

export type UserRole = "admin" | "pegawai" | "hrd" | "direktur";

export interface User {
  id: number;
  nik: string;
  role: UserRole;
  nama: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, tokenData: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  login: (userData, tokenData) => {
    localStorage.setItem("simpeg_user", JSON.stringify(userData));
    localStorage.setItem("simpeg_token", tokenData);
    set({ user: userData, token: tokenData });
  },
  logout: () => {
    localStorage.removeItem("simpeg_user");
    localStorage.removeItem("simpeg_token");
    set({ user: null, token: null });
  },
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
