import { apiFetch } from "../utils/api";
import type { ApiResponse } from "../types/api";

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
    items: StrSipHrdItem[];
}

export const strSipService = {
    getStrSipData: async (): Promise<ApiResponse<StrSipHrdResponseData>> => {
        try {
            const response = await apiFetch("/str-sip", {
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
};
