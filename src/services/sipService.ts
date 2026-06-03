import { apiFetch } from "../utils/api";
import type {
  ApiResponse,
  RiwayatSipListResponse,
  RiwayatSipMutationResponse,
} from "../types/api";

const BASE = "/riwayat-karir/sip";

export const sipService = {
  getAll: async (): Promise<ApiResponse<RiwayatSipListResponse>> => {
    const response = await apiFetch(BASE);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  create: async (
    formData: FormData
  ): Promise<ApiResponse<RiwayatSipMutationResponse>> => {
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
  ): Promise<ApiResponse<RiwayatSipMutationResponse>> => {
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
