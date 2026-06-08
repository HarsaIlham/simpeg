import { apiFetch } from "../utils/api";
import type { ApiResponse, PegawaiData, PegawaiListResponse, DetailPegawaiResponse } from "../types/api";

const BASE_URL = "/pegawai";

export const pegawaiService = {
  getAll: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status_kelengkapan?: string;
    jenis_pegawai?: string;
    pendidikan?: string;
    status_pegawai?: string;
    profesi?: string;
  }): Promise<ApiResponse<PegawaiListResponse>> => {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.set("page", String(params.page));
      if (params?.per_page) query.set("per_page", String(params.per_page));
      if (params?.search) query.set("search", params.search);
      if (params?.status_kelengkapan) query.set("status_kelengkapan", params.status_kelengkapan);
      if (params?.jenis_pegawai) query.set("jenis_pegawai", params.jenis_pegawai);
      if (params?.pendidikan) query.set("pendidikan", params.pendidikan);
      if (params?.status_pegawai) query.set("status_pegawai", params.status_pegawai);
      if (params?.profesi) query.set("profesi", params.profesi);
      const qs = query.toString();
      const url = qs ? `${BASE_URL}?${qs}` : BASE_URL;

      const response = await apiFetch(url, {
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

  changeRole: async (
    id: number,
    role?: "admin" | "hrd" | "direktur" | "pegawai",
    status_pegawai?: string
  ): Promise<ApiResponse<{ id: number; nik: string; nama: string; role: string; status_pegawai: string }>> => {
    try {
      const body: Record<string, string> = {};
      if (role) body.role = role;
      if (status_pegawai) body.status_pegawai = status_pegawai;

      const response = await apiFetch(`${BASE_URL}/${id}/change-role`, {
        method: "PATCH",
        body: JSON.stringify(body),
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
