import { create } from "zustand";
import type { KeluargaRingkasanResponse } from "../types/api";

interface KeluargaState {
    keluargaData: KeluargaRingkasanResponse | null;
    setKeluargaData: (data: KeluargaRingkasanResponse | null) => void;
    clearKeluargaData: () => void;
}

export const useKeluargaStore = create<KeluargaState>((set) => ({
    keluargaData: null,
    setKeluargaData: (data) => set({ keluargaData: data }),
    clearKeluargaData: () => set({ keluargaData: null }),
}));
