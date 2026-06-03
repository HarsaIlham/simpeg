import { apiFetch } from "../utils/api";
import type {
  ApiResponse,
  DiklatPegawaiHrdListResponse,
  CreateMasterDiklatRequest,
  CreateMasterDiklatResponse,
  PesertaDiklatResponse,
  SyncPesertaResponse,
  UpdateStatusKelayakanResponse,
  UpdateStatusValidasiResponse,
} from "../types/api";


export const hrdDiklatService = {
  
  getAll: async (): Promise<ApiResponse<DiklatPegawaiHrdListResponse>> => {
    const response = await apiFetch("/diklat/all");
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  createMasterDiklat: async (
    payload: CreateMasterDiklatRequest
  ): Promise<ApiResponse<CreateMasterDiklatResponse>> => {
    const response = await apiFetch("/hrd/diklat", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  getPeserta: async (
    diklatId: number
  ): Promise<ApiResponse<PesertaDiklatResponse>> => {
    const response = await apiFetch(`/hrd/diklat/${diklatId}/peserta`);
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  syncPeserta: async (
    diklatId: number,
    pegawaiIds: number[]
  ): Promise<ApiResponse<SyncPesertaResponse>> => {
    const response = await apiFetch(`/hrd/diklat/${diklatId}/peserta`, {
      method: "POST",
      body: JSON.stringify({ pegawai_ids: pegawaiIds }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  getMenungguKelayakan: async (): Promise<
    ApiResponse<DiklatPegawaiHrdListResponse>
  > => {
    const response = await apiFetch("/hrd/diklat/status/layak");
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  updateKelayakan: async (
    idJadwalDiklat: number,
    statusKelayakan: boolean
  ): Promise<ApiResponse<UpdateStatusKelayakanResponse>> => {
    const response = await apiFetch(
      `/hrd/diklat/${idJadwalDiklat}/status/layak`,
      {
        method: "PATCH",
        body: JSON.stringify({ status_kelayakan: statusKelayakan }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },


  getMenungguValidasi: async (): Promise<
    ApiResponse<DiklatPegawaiHrdListResponse>
  > => {
    const response = await apiFetch("/hrd/diklat/status/validasi");
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  updateValidasi: async (
    idJadwalDiklat: number,
    statusValidasi: boolean
  ): Promise<ApiResponse<UpdateStatusValidasiResponse>> => {
    const response = await apiFetch(
      `/hrd/diklat/${idJadwalDiklat}/status/validasi`,
      {
        method: "PATCH",
        body: JSON.stringify({ status_validasi: statusValidasi }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  getLaporanDiklat: async (
    bulanAwal: number,
    tahunAwal: number,
    bulanAkhir: number,
    tahunAkhir: number
  ): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams({
      bulan_awal: String(bulanAwal),
      tahun_awal: String(tahunAwal),
      bulan_akhir: String(bulanAkhir),
      tahun_akhir: String(tahunAkhir),
    });
    const response = await apiFetch(`/generate/laporan-diklat?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },
};
