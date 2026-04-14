const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("simpeg_token");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
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
