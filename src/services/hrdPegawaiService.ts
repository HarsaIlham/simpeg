import { apiFetch } from "../utils/api";
import type { ApiResponse } from "../types/api";

const getBaseUrl = (pegawaiId: number) => `/hrd/pegawai/${pegawaiId}`;

const createCrudService = (subPath: string) => {
  return {
    get: async (pegawaiId: number): Promise<ApiResponse<any>> => {
      const response = await apiFetch(`${getBaseUrl(pegawaiId)}/${subPath}`);
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    },
    create: async (pegawaiId: number, payload: any): Promise<ApiResponse<any>> => {
      const response = await apiFetch(`${getBaseUrl(pegawaiId)}/${subPath}`, {
        method: "POST",
        body: payload instanceof FormData ? payload : JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    },
    update: async (pegawaiId: number, id: number, payload: any): Promise<ApiResponse<any>> => {
      const isForm = payload instanceof FormData;
      if (isForm) {
        payload.append("_method", "PATCH");
      }
      const response = await apiFetch(`${getBaseUrl(pegawaiId)}/${subPath}/${id}`, {
        method: isForm ? "POST" : "PATCH",
        body: isForm ? payload : JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    },
    delete: async (pegawaiId: number, id: number): Promise<ApiResponse<any>> => {
      const response = await apiFetch(`${getBaseUrl(pegawaiId)}/${subPath}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    },
  };
};

const pasangan = createCrudService("keluarga/pasangan");
const anak = createCrudService("keluarga/anak");
const orangTua = createCrudService("keluarga/orang-tua");
const kontakDarurat = createCrudService("keluarga/kontak-darurat");
const tanggunganLain = createCrudService("keluarga/tanggungan-lain");
const jabatan = createCrudService("riwayat-karir/jabatan");
const str = createCrudService("riwayat-karir/str");
const sip = createCrudService("riwayat-karir/sip");
const penugasanKlinis = createCrudService("riwayat-karir/penugasan-klinis");
const pangkat = createCrudService("riwayat-karir/pangkat");
const pendidikan = createCrudService("riwayat-karir/pendidikan");

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

  // Pasangan
  getPasangan: pasangan.get,
  createPasangan: pasangan.create,
  updatePasangan: pasangan.update,
  deletePasangan: pasangan.delete,

  // Anak
  getAnak: anak.get,
  createAnak: anak.create,
  updateAnak: anak.update,
  deleteAnak: anak.delete,

  // Orang Tua
  getOrangTua: orangTua.get,
  createOrangTua: orangTua.create,
  updateOrangTua: orangTua.update,
  deleteOrangTua: orangTua.delete,

  // Kontak Darurat
  getKontakDarurat: kontakDarurat.get,
  createKontakDarurat: kontakDarurat.create,
  updateKontakDarurat: kontakDarurat.update,
  deleteKontakDarurat: kontakDarurat.delete,

  // Tanggungan Lain
  getTanggunganLain: tanggunganLain.get,
  createTanggunganLain: tanggunganLain.create,
  updateTanggunganLain: tanggunganLain.update,
  deleteTanggunganLain: tanggunganLain.delete,

  // Jabatan
  getJabatan: jabatan.get,
  createJabatan: jabatan.create,
  updateJabatan: jabatan.update,
  deleteJabatan: jabatan.delete,

  // STR
  getStr: str.get,
  createStr: str.create,
  updateStr: str.update,
  deleteStr: str.delete,

  // SIP
  getSip: sip.get,
  createSip: sip.create,
  updateSip: sip.update,
  deleteSip: sip.delete,

  // Penugasan Klinis
  getPenugasanKlinis: penugasanKlinis.get,
  createPenugasanKlinis: penugasanKlinis.create,
  updatePenugasanKlinis: penugasanKlinis.update,
  deletePenugasanKlinis: penugasanKlinis.delete,

  // Pangkat
  getPangkat: pangkat.get,
  createPangkat: pangkat.create,
  updatePangkat: pangkat.update,
  deletePangkat: pangkat.delete,

  // Pendidikan
  getPendidikan: pendidikan.get,
  createPendidikan: pendidikan.create,
  updatePendidikan: pendidikan.update,
  deletePendidikan: pendidikan.delete,
};
