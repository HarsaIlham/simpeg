import { apiFetch } from "../utils/api";
import type {
  ApiResponse,
  RiwayatPangkatListResponse,
  RiwayatPangkatMutationResponse,
} from "../types/api";

const BASE = "/riwayat-karir/pangkat";

export const pangkatService = {
  getAll: async (): Promise<ApiResponse<RiwayatPangkatListResponse>> => {
    const response = await apiFetch(BASE);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  create: async (
    formData: FormData
  ): Promise<ApiResponse<RiwayatPangkatMutationResponse>> => {
    const response = await apiFetch(BASE, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  update: async (
    id: number,
    formData: FormData
  ): Promise<ApiResponse<RiwayatPangkatMutationResponse>> => {
    formData.append("_method", "PATCH");
    const response = await apiFetch(`${BASE}/${id}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiFetch(`${BASE}/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
};
