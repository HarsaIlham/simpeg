import { apiFetch } from "../utils/api";
import type {
  ApiResponse,
  KeluargaRingkasanResponse,
  PasanganItem,
  AnakItem,
  OrangTuaItem,
  KontakDaruratItem,
  TanggunganLainItem,
} from "../types/api";

const BASE = "/keluarga";

export const keluargaService = {
  getRingkasan: async (): Promise<ApiResponse<KeluargaRingkasanResponse>> => {
    const response = await apiFetch(BASE);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  createPasangan: async (
    formData: FormData
  ): Promise<ApiResponse<PasanganItem>> => {
    const response = await apiFetch(`${BASE}/pasangan`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  updatePasangan: async (
    id: number,
    formData: FormData
  ): Promise<ApiResponse<PasanganItem>> => {
    formData.append("_method", "PATCH");
    const response = await apiFetch(`${BASE}/pasangan/${id}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  deletePasangan: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiFetch(`${BASE}/pasangan/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  createAnak: async (
    formData: FormData
  ): Promise<ApiResponse<AnakItem>> => {
    const response = await apiFetch(`${BASE}/anak`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  updateAnak: async (
    id: number,
    formData: FormData
  ): Promise<ApiResponse<AnakItem>> => {
    formData.append("_method", "PATCH");
    const response = await apiFetch(`${BASE}/anak/${id}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  deleteAnak: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiFetch(`${BASE}/anak/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  createOrangTua: async (
    payload: Record<string, string>
  ): Promise<ApiResponse<OrangTuaItem>> => {
    const response = await apiFetch(`${BASE}/orang-tua`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  updateOrangTua: async (
    id: number,
    payload: Record<string, string>
  ): Promise<ApiResponse<OrangTuaItem>> => {
    const response = await apiFetch(`${BASE}/orang-tua/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  deleteOrangTua: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiFetch(`${BASE}/orang-tua/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  createKontakDarurat: async (
    payload: Record<string, string>
  ): Promise<ApiResponse<KontakDaruratItem>> => {
    const response = await apiFetch(`${BASE}/kontak-darurat`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  updateKontakDarurat: async (
    id: number,
    payload: Record<string, string>
  ): Promise<ApiResponse<KontakDaruratItem>> => {
    const response = await apiFetch(`${BASE}/kontak-darurat/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  deleteKontakDarurat: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiFetch(`${BASE}/kontak-darurat/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  createTanggunganLain: async (
    payload: { nama: string; hubungan_keluarga: string; status_tanggungan?: boolean }
  ): Promise<ApiResponse<TanggunganLainItem>> => {
    const response = await apiFetch(`${BASE}/tanggungan-lain`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  updateTanggunganLain: async (
    id: number,
    payload: { nama: string; hubungan_keluarga: string; status_tanggungan?: boolean }
  ): Promise<ApiResponse<TanggunganLainItem>> => {
    const response = await apiFetch(`${BASE}/tanggungan-lain/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  deleteTanggunganLain: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiFetch(`${BASE}/tanggungan-lain/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
};
