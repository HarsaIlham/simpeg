import { apiFetch } from "../utils/api";
import type { ApiResponse, Notifikasi } from "../types/api";

export const notificationService = {

  getNotifications: async (type: "info" | "action" = "info"): Promise<ApiResponse<{ type: string; notifications: Notifikasi[] }>> => {
    const response = await apiFetch(`/notifications?type=${type}`);
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },
  
  markAsRead: async (id: number): Promise<ApiResponse> => {
    const response = await apiFetch(`/notifications/${id}/read`, {
      method: "PATCH",
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  markAllAsRead: async (): Promise<ApiResponse<{ updated_count: number }>> => {
    const response = await apiFetch("/notifications/read-all", {
      method: "PATCH",
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },
};
