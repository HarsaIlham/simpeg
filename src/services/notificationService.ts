import { apiFetch } from "../utils/api";
import type { ApiResponse } from "../types/api";

export const notificationService = {
  
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
