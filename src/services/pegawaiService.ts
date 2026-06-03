import { apiFetch } from "../utils/api";
import type { ApiResponse, PegawaiData, PegawaiListResponse, DetailPegawaiResponse } from "../types/api";

const BASE_URL = "/pegawai";

export const pegawaiService = {
  getAll: async (): Promise<ApiResponse<PegawaiListResponse>> => {
    try {
      const response = await apiFetch(BASE_URL, {
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

  getById: async (id: number): Promise<ApiResponse<DetailPegawaiResponse>> => {
    try {
      const response = await apiFetch(`${BASE_URL}/${id}`, {
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

  create: async (payload: Omit<PegawaiData, "id">): Promise<ApiResponse<PegawaiData>> => {
    try {
      const response = await apiFetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
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

  update: async (id: number, payload: Partial<PegawaiData>): Promise<ApiResponse<PegawaiData>> => {
    try {
      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
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

  delete: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
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

  changeRole: async (id: number, role: "admin" | "hrd" | "direktur" | "pegawai"): Promise<ApiResponse<{ id: number; nik: string; nama: string; role: string }>> => {
    try {
      const response = await apiFetch(`${BASE_URL}/${id}/change-role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
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
