import { apiFetch } from "../utils/api";
import type {
  CvGeneratedResponse,
  ApiResponse,
} from "../types/api";

export type CvData = CvGeneratedResponse;

export const cvService = {
  getCvData: async (pegawaiId?: number): Promise<CvData> => {
    const url = pegawaiId ? `/generate/cv?pegawai_id=${pegawaiId}` : `/generate/cv`;

    const cvRes = await apiFetch(url);
    const cvDataRes = await cvRes.json() as ApiResponse<CvGeneratedResponse>;

    if (!cvDataRes.success || !cvDataRes.data) {
      throw new Error(cvDataRes.message || "Gagal mengambil data CV.");
    }

    return cvDataRes.data;
  },
};
