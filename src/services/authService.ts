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

    changePassword: async (oldPassword: string, newPassword: string, confirmPassword: string) => {
        try {
            const response = await apiFetch("/auth/change-password", {
                method: "POST",
                body: JSON.stringify({
                    password_lama: oldPassword,
                    password_baru: newPassword,
                    password_baru_confirmation: confirmPassword
                }),
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

    logout: async () => {
        const response = await apiFetch("/logout", {
            method: "POST",
        });

        const responseData = await response.json();
        return responseData;
    }
};
