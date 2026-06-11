import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";


export type UserRole = "admin" | "pegawai" | "hrd" | "direktur";

export interface User {
  id: number;
  nik: string;
  role: UserRole;
  nama: string;
}

let globalUser: User | null = null;
let globalToken: string | null = null;

export const getGlobalUser = (): User | null => {
  if (!globalUser) {
    const storedUser = localStorage.getItem("simpeg_user");
    if (storedUser) {
      try {
        globalUser = JSON.parse(storedUser);
      } catch {
        globalUser = null;
      }
    }
  }
  return globalUser;
};

export const getGlobalToken = (): string | null => {
  if (!globalToken) {
    globalToken = localStorage.getItem("simpeg_token");
  }
  return globalToken;
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, tokenData: string) => void;
  logout: () => void;
  isLoading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("simpeg_user");
    const storedToken = localStorage.getItem("simpeg_token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        globalUser = parsedUser;
        globalToken = storedToken;
      } catch (error) {
        console.error("Gagal membaca memori penyimpanan sesi:", error);
        localStorage.removeItem("simpeg_user");
        localStorage.removeItem("simpeg_token");
        globalUser = null;
        globalToken = null;
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    globalUser = userData;
    globalToken = tokenData;
    localStorage.setItem("simpeg_user", JSON.stringify(userData));
    localStorage.setItem("simpeg_token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    globalUser = null;
    globalToken = null;
    localStorage.removeItem("simpeg_user");
    localStorage.removeItem("simpeg_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Peringatan: useAuth harus digunakan di dalam cakupan komponen <AuthProvider>");
  }
  return context;
};
