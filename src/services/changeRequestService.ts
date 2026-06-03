import { apiFetch } from "../utils/api";
import type {
  ApiResponse,
  AdminChangeRequest,
  ChangeRequestDetailResponse,
  ChangeRequestActionResponse,
} from "../types/api";

const BASE = "/admin/change-requests";

export const changeRequestService = {
  getAll: async (
    status?: string,
    fitur?: string
  ): Promise<ApiResponse<AdminChangeRequest[]>> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (fitur) params.append("fitur", fitur);

    const query = params.toString();
    const url = query ? `${BASE}?${query}` : BASE;

    const response = await apiFetch(url);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  getDetail: async (
    id: number
  ): Promise<ApiResponse<ChangeRequestDetailResponse>> => {
    const response = await apiFetch(`${BASE}/${id}`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  accept: async (
    id: number,
    note?: string
  ): Promise<ApiResponse<ChangeRequestActionResponse>> => {
    const response = await apiFetch(`${BASE}/${id}/accept`, {
      method: "PATCH",
      body: JSON.stringify(note ? { note } : {}),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  reject: async (
    id: number,
    note?: string
  ): Promise<ApiResponse<ChangeRequestActionResponse>> => {
    const response = await apiFetch(`${BASE}/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify(note ? { note } : {}),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
};