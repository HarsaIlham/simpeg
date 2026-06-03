import { create } from "zustand";
import { masterDataService, type MasterDataKey } from "../services/masterDataService";
import type { MasterDataItem } from "../types/api";

interface MasterDataEntry {
    items: MasterDataItem[];
    isLoading: boolean;
    error: string | null;
    fetchedAt: number | null;
}

interface MasterDataState {
    cache: Partial<Record<MasterDataKey, MasterDataEntry>>;

    fetchMasterData: (key: MasterDataKey) => Promise<void>;

    refetchMasterData: (key: MasterDataKey) => Promise<void>;
}

const STALE_TIME = 10 * 60 * 1000;

const pendingRequests = new Set<MasterDataKey>();

export const useMasterDataStore = create<MasterDataState>((set, get) => ({
    cache: {},

    fetchMasterData: async (key: MasterDataKey) => {
        const existing = get().cache[key];

        if (
            existing?.fetchedAt &&
            Date.now() - existing.fetchedAt < STALE_TIME &&
            existing.items.length > 0
        ) {
            return;
        }

        if (pendingRequests.has(key)) {
            return;
        }

        pendingRequests.add(key);

        set((state) => ({
            cache: {
                ...state.cache,
                [key]: {
                    items: existing?.items ?? [],
                    isLoading: true,
                    error: null,
                    fetchedAt: existing?.fetchedAt ?? null,
                },
            },
        }));

        try {
            const items = await masterDataService.fetchMasterData(key);
            set((state) => ({
                cache: {
                    ...state.cache,
                    [key]: {
                        items,
                        isLoading: false,
                        error: null,
                        fetchedAt: Date.now(),
                    },
                },
            }));
        } catch (err) {
            set((state) => ({
                cache: {
                    ...state.cache,
                    [key]: {
                        items: existing?.items ?? [],
                        isLoading: false,
                        error: err instanceof Error ? err.message : "Terjadi kesalahan",
                        fetchedAt: existing?.fetchedAt ?? null,
                    },
                },
            }));
        } finally {
            pendingRequests.delete(key);
        }
    },

    refetchMasterData: async (key: MasterDataKey) => {
        set((state) => ({
            cache: {
                ...state.cache,
                [key]: {
                    items: [],
                    isLoading: false,
                    error: null,
                    fetchedAt: null,
                },
            },
        }));

        pendingRequests.delete(key);

        await get().fetchMasterData(key);
    },
}));
