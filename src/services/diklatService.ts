import { apiFetch } from "../utils/api";
import type { ApiResponse, DiklatResponse } from "../types/api";

export const diklatService = {

  getDiklat: async (): Promise<ApiResponse<DiklatResponse>> => {
    const response = await apiFetch("/diklat");
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