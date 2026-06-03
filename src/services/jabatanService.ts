import { apiFetch } from "../utils/api";

import type { RiwayatJabatanListResponse, RiwayatJabatanMutationResponse, ApiResponse } from "../types/api";

const BASE = "/riwayat-karir/jabatan";

export const jabatanService = {
    async getAll(): Promise<ApiResponse<RiwayatJabatanListResponse>> {
        const response = await apiFetch(BASE);
        const data = await response.json();
        if (!response.ok) throw data;
        return data;
    },
    async create(
        formData: FormData
    ): Promise<ApiResponse<RiwayatJabatanMutationResponse>> {
        const response = await apiFetch(BASE, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw data;
        return data;
    },
    async update(
        id: number,
        formData: FormData
    ): Promise<ApiResponse<RiwayatJabatanMutationResponse>> {
        formData.append("_method", "PATCH");
        const response = await apiFetch(`${BASE}/${id}`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw data;
        return data;
    },
    async delete(id: number): Promise<ApiResponse<void>> {
        const response = await apiFetch(`${BASE}/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        if (!response.ok) throw data;
        return data;
    },
}