import { getGlobalToken } from "../contexts/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = getGlobalToken();

    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        "Accept": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem("simpeg_user");
        localStorage.removeItem("simpeg_token");
        
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
    }

    return response;
};

export const getFileUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const baseUrl = BASE_URL.replace(/\/api$/, "");
    return `${baseUrl}/${path.replace(/^\//, "")}`;
};

/**
 * Mengubah URL file dari backend menjadi relative path
 * agar bisa diakses lewat Vite proxy (menghindari CORS).
 * Contoh: "http://127.0.0.1:8000/dokumen/pangkat/file.pdf" -> "/dokumen/pangkat/file.pdf"
 */
export const getProxiedFileUrl = (url: string | null | undefined): string => {
    if (!url) return "";
    try {
        const backendBase = BASE_URL.replace(/\/api$/, "");
        if (url.startsWith(backendBase)) {
            return url.replace(backendBase, "");
        }
        if (url.startsWith("http")) {
            const parsed = new URL(url);
            return parsed.pathname;
        }
        return url.startsWith("/") ? url : `/${url}`;
    } catch {
        return url;
    }
};
