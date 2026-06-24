import { apiFetch } from "../utils/api";
import type { ApiResponse } from "../types/api";

export interface WhatsappSettingData {
    whatsapp_token: string;
    device: {
        status: boolean;
        reason?: string;
        device?: string;
        expired?: string;
        [key: string]: unknown;
    } | null;
}

export const settingService = {
    getWhatsappSetting: async (): Promise<ApiResponse<WhatsappSettingData>> => {
        try {
            const response = await apiFetch("/settings/whatsapp", {
                method: "GET",
            });
            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    updateWhatsappSetting: async (token: string): Promise<ApiResponse<{ whatsapp_token: string }>> => {
        try {
            const response = await apiFetch("/settings/whatsapp", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ whatsapp_token: token }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            return data;
        } catch (error) {
            throw error;
        }
    },
};
