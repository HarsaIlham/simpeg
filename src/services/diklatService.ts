import { apiFetch } from "../utils/api";
import type { ApiResponse, DiklatResponse } from "../types/api";

export const diklatService = {

  getDiklat: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    jenis?: string;
    status?: string;
  }): Promise<ApiResponse<DiklatResponse>> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.per_page) query.set("per_page", String(params.per_page));
    if (params?.search) query.set("search", params.search);
    if (params?.jenis) query.set("jenis", params.jenis);
    if (params?.status) query.set("status", params.status);
    const qs = query.toString();
    const url = qs ? `/diklat?${qs}` : "/diklat";

    const response = await apiFetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  createDiklat: async (
    formData: FormData
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiFetch("/diklat", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  updateDiklat: async (
    id: number,
    formData: FormData
  ): Promise<ApiResponse<unknown>> => {
    formData.append("_method", "PATCH");
    const response = await apiFetch(`/diklat/${id}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  deleteDiklat: async (id: number): Promise<ApiResponse<unknown>> => {
    const response = await apiFetch(`/diklat/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },
};