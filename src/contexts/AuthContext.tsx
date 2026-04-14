import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";


export type UserRole = "admin" | "pegawai" | "hrd" | "direktur";

export interface User {
  id: number;
  nik: string;
  role: UserRole;
  nama: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, tokenData: string) => void;
  logout: () => void;
  isLoading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // const [user, setUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>({
    id: 999,
    nik: "12345",
    role: "pegawai",
    nama: "Admin (Mode Tanpa API)"
  });
  const [token, setToken] = useState<string | null>("TOKEN_DUMMY");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    /* 
    const storedUser = localStorage.getItem("simpeg_user");
    const storedToken = localStorage.getItem("simpeg_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("Gagal membaca memori penyimpanan sesi:", error);
        localStorage.removeItem("simpeg_user");
        localStorage.removeItem("simpeg_token");
      }
    }
    
    setIsLoading(false);
    */
  }, []);

  const login = (userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("simpeg_user", JSON.stringify(userData));
    localStorage.setItem("simpeg_token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
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
