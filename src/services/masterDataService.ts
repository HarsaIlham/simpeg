import { apiFetch } from "../utils/api";
import type { ApiResponse, MasterDataResponse } from "../types/api";

/**
 * Endpoint master data untuk dropdown form.
 * Setiap endpoint mengembalikan array { id, nama }.
 */
const MASTER_DATA_ENDPOINTS = {
    kategoriDiklat: "/form/kategori-diklat",
    tipeDiklat: "/form/tipe-diklat",
    jenisPegawai: "/form/jenis-pegawai",
    unitKerja: "/form/unit-kerja",
    jenisBiaya: "/form/jenis-biaya",
    golonganRuang: "/form/golongan-ruang",
    profesi: "/form/profesi",
    jenisSip: "/form/jenis-sip",
} as const;

export type MasterDataKey = keyof typeof MASTER_DATA_ENDPOINTS;

/**
 * Fetch satu jenis master data berdasarkan key.
 */
const fetchMasterData = async (key: MasterDataKey): Promise<MasterDataResponse> => {
    const endpoint = MASTER_DATA_ENDPOINTS[key];
    const response = await apiFetch(endpoint);
    const json: ApiResponse<MasterDataResponse> = await response.json();

    if (!response.ok || !json.success || !json.data) {
        console.warn(`[MasterData] Gagal fetch ${key}:`, json.message);
        return [];
    }

    return json.data;
};

export const masterDataService = {
    fetchMasterData,

    getKategoriDiklat: () => fetchMasterData("kategoriDiklat"),
    getTipeDiklat: () => fetchMasterData("tipeDiklat"),
    getJenisPegawai: () => fetchMasterData("jenisPegawai"),
    getUnitKerja: () => fetchMasterData("unitKerja"),
    getJenisBiaya: () => fetchMasterData("jenisBiaya"),
    getGolonganRuang: () => fetchMasterData("golonganRuang"),
    getProfesi: () => fetchMasterData("profesi"),
    getJenisSip: () => fetchMasterData("jenisSip"),

    createTipeDiklat: async (nama: string): Promise<ApiResponse<any>> => {
        const response = await apiFetch("/form/tipe-diklat", {
            method: "POST",
            body: JSON.stringify({ nama }),
        });
        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    },
};
