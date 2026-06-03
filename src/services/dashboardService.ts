import { apiFetch } from "../utils/api";
import type { ApiResponse, DashboardResponse, DashboardHrdResponse } from "../types/api";

export const dashboardService = {

  getDashboard: async (): Promise<ApiResponse<DashboardResponse>> => {
    const response = await apiFetch("/dashboard");
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  getHrdDashboard: async (): Promise<ApiResponse<DashboardHrdResponse>> => {
    const response = await apiFetch("/dashboard");
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },
};
