import { apiFetch } from "../utils/api";
import type { ApiResponse } from "../types/api";

const getBaseUrl = (pegawaiId: number) => `/hrd/pegawai/${pegawaiId}`;

export const hrdPegawaiService = {
  // ==========================================
  // 21.1 Update Data Inti Pegawai
  // ==========================================
  updateInti: async (
    pegawaiId: number,
    payload: {
      nik?: string;
      nip?: string | null;
      nama?: string;
      jenis_pegawai_id?: number | null;
      profesi_id?: number | null;
      golongan_ruang_id?: number | null;
      status_pegawai?: string;
      tgl_masuk?: string | null;
      tmt_cpns?: string | null;
      tmt_pns?: string | null;
    }
  ): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/inti`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  // ==========================================
  // 21.2 Update Data Pribadi Pegawai
  // ==========================================
  updatePribadi: async (
    pegawaiId: number,
    formData: FormData
  ): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/pribadi`, {
      method: "POST", // POST acts as an alias for PATCH for multipart form support
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  // ==========================================
  // 21.3 Data Keluarga Pegawai (HRD)
  // ==========================================

  // Pasangan
  getPasangan: async (pegawaiId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/pasangan`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  createPasangan: async (pegawaiId: number, formData: FormData): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/pasangan`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  updatePasangan: async (pegawaiId: number, keluargaId: number, formData: FormData): Promise<ApiResponse<any>> => {
    formData.append("_method", "PATCH");
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/pasangan/${keluargaId}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  deletePasangan: async (pegawaiId: number, keluargaId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/pasangan/${keluargaId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  // Anak
  getAnak: async (pegawaiId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/anak`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  createAnak: async (pegawaiId: number, formData: FormData): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/anak`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  updateAnak: async (pegawaiId: number, keluargaId: number, formData: FormData): Promise<ApiResponse<any>> => {
    formData.append("_method", "PATCH");
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/anak/${keluargaId}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  deleteAnak: async (pegawaiId: number, keluargaId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/anak/${keluargaId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  // Orang Tua
  getOrangTua: async (pegawaiId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/orang-tua`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  createOrangTua: async (pegawaiId: number, payload: any): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/orang-tua`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  updateOrangTua: async (pegawaiId: number, keluargaId: number, payload: any): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/orang-tua/${keluargaId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  deleteOrangTua: async (pegawaiId: number, keluargaId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/orang-tua/${keluargaId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  // Kontak Darurat
  getKontakDarurat: async (pegawaiId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/kontak-darurat`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  createKontakDarurat: async (pegawaiId: number, payload: any): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/kontak-darurat`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  updateKontakDarurat: async (pegawaiId: number, keluargaId: number, payload: any): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/kontak-darurat/${keluargaId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  deleteKontakDarurat: async (pegawaiId: number, keluargaId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/kontak-darurat/${keluargaId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  // Tanggungan Lain
  getTanggunganLain: async (pegawaiId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/tanggungan-lain`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  createTanggunganLain: async (pegawaiId: number, payload: any): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/tanggungan-lain`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  updateTanggunganLain: async (pegawaiId: number, keluargaId: number, payload: any): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/tanggungan-lain/${keluargaId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  deleteTanggunganLain: async (pegawaiId: number, keluargaId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/keluarga/tanggungan-lain/${keluargaId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  // ==========================================
  // 21.4 Riwayat Karir Pegawai (HRD)
  // ==========================================

  // Jabatan
  getJabatan: async (pegawaiId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/jabatan`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  createJabatan: async (pegawaiId: number, formData: FormData): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/jabatan`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  updateJabatan: async (pegawaiId: number, riwayatId: number, formData: FormData): Promise<ApiResponse<any>> => {
    formData.append("_method", "PATCH");
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/jabatan/${riwayatId}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  deleteJabatan: async (pegawaiId: number, riwayatId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/jabatan/${riwayatId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  // STR
  getStr: async (pegawaiId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/str`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  createStr: async (pegawaiId: number, formData: FormData): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/str`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  updateStr: async (pegawaiId: number, riwayatId: number, formData: FormData): Promise<ApiResponse<any>> => {
    formData.append("_method", "PATCH");
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/str/${riwayatId}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  deleteStr: async (pegawaiId: number, riwayatId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/str/${riwayatId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  // SIP
  getSip: async (pegawaiId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/sip`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  createSip: async (pegawaiId: number, formData: FormData): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/sip`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  updateSip: async (pegawaiId: number, riwayatId: number, formData: FormData): Promise<ApiResponse<any>> => {
    formData.append("_method", "PATCH");
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/sip/${riwayatId}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  deleteSip: async (pegawaiId: number, riwayatId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/sip/${riwayatId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  // Penugasan Klinis
  getPenugasanKlinis: async (pegawaiId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/penugasan-klinis`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  createPenugasanKlinis: async (pegawaiId: number, formData: FormData): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/penugasan-klinis`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  updatePenugasanKlinis: async (pegawaiId: number, riwayatId: number, formData: FormData): Promise<ApiResponse<any>> => {
    formData.append("_method", "PATCH");
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/penugasan-klinis/${riwayatId}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  deletePenugasanKlinis: async (pegawaiId: number, riwayatId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/penugasan-klinis/${riwayatId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  // Pangkat
  getPangkat: async (pegawaiId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/pangkat`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  createPangkat: async (pegawaiId: number, formData: FormData): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/pangkat`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  updatePangkat: async (pegawaiId: number, riwayatId: number, formData: FormData): Promise<ApiResponse<any>> => {
    formData.append("_method", "PATCH");
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/pangkat/${riwayatId}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  deletePangkat: async (pegawaiId: number, riwayatId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/pangkat/${riwayatId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  // Pendidikan
  getPendidikan: async (pegawaiId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/pendidikan`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  createPendidikan: async (pegawaiId: number, formData: FormData): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/pendidikan`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  updatePendidikan: async (pegawaiId: number, riwayatId: number, formData: FormData): Promise<ApiResponse<any>> => {
    formData.append("_method", "PATCH");
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/pendidikan/${riwayatId}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
  deletePendidikan: async (pegawaiId: number, riwayatId: number): Promise<ApiResponse<any>> => {
    const response = await apiFetch(`${getBaseUrl(pegawaiId)}/riwayat-karir/pendidikan/${riwayatId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
};
