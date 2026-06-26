import { apiFetch } from "../utils/api";
import type { ApiResponse, PaginatedResponse } from "../types/api";

export interface StrSipHrdItem {
    id: number;
    pegawai_id: number;
    nama: string;
    nip: string;
    profesi: string;
    str_sip: "STR" | "SIP";
    jenis: string | null;
    nomor: string;
    link_dokumen: string | null;
    tanggal_terbit: string;
    tanggal_habis: string;
    status: string;
    is_current: boolean;
}

export interface StrSipHrdSummary {
    total: number;
    aktif: number;
    hampir_habis: number;
    tidak_aktif: number;
}

export interface StrSipHrdResponseData {
    summary: StrSipHrdSummary;
    items: PaginatedResponse<StrSipHrdItem>;
}

export const strSipService = {
    getStrSipData: async (params?: {
        page?: number;
        per_page?: number;
        search?: string;
        jenis?: string;
        status?: string;
        tanggal_dari?: string;
        tanggal_sampai?: string;
    }): Promise<ApiResponse<StrSipHrdResponseData>> => {
        try {
            const queryParams = new URLSearchParams();
            if (params?.page) queryParams.append("page", String(params.page));
            if (params?.per_page) queryParams.append("per_page", String(params.per_page));
            if (params?.search) queryParams.append("search", params.search);
            if (params?.jenis) queryParams.append("tipe", params.jenis);
            if (params?.status) queryParams.append("status", params.status);
            if (params?.tanggal_dari) queryParams.append("tanggal_dari", params.tanggal_dari);
            if (params?.tanggal_sampai) queryParams.append("tanggal_sampai", params.tanggal_sampai);

            const queryString = queryParams.toString();
            const url = `/str-sip${queryString ? `?${queryString}` : ""}`;

            const response = await apiFetch(url, {
                method: "GET",
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw responseData;
            }

            return responseData;
        } catch (error) {
            throw error;
        }
    },

    sendReminderStrSip: async (
        pegawaiId: number,
        tipeDokumen: "str" | "sip",
        dokumenId: number
    ): Promise<ApiResponse> => {
        try {
            const response = await apiFetch(`/hrd/pegawai/${pegawaiId}/reminder/str-sip`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tipe_dokumen: tipeDokumen,
                    dokumen_id: dokumenId,
                }),
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw responseData;
            }

            return responseData;
        } catch (error) {
            throw error;
        }
    },
};
