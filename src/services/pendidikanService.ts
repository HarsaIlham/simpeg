import { apiFetch } from "../utils/api";
import type {
  ApiResponse,
  RiwayatPendidikanLabel,
  RiwayatPendidikanMutationResponse,
} from "../types/api";

const BASE = "/riwayat-karir/pendidikan";

export const pendidikanService = {

  getAll: async (): Promise<ApiResponse<RiwayatPendidikanLabel>> => {
    const response = await apiFetch(BASE);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  create: async (
    formData: FormData
  ): Promise<ApiResponse<RiwayatPendidikanMutationResponse>> => {
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
  ): Promise<ApiResponse<RiwayatPendidikanMutationResponse>> => {
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
