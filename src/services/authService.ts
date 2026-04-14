import { apiFetch } from "../utils/api";

interface LoginCredentials {
    nik: string;
    password: string;
}

export const authService = {
    login: async (credentials: LoginCredentials) => {
        try {
            const response = await apiFetch("/login", {
                method: "POST",
                body: JSON.stringify(credentials),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw responseData; 
            }

            return responseData;
        } catch (error) {
            throw error;
        }
    },
};
