import { useEffect } from "react";
import { useMasterDataStore } from "../stores/masterDataStore";
import type { MasterDataKey } from "../services/masterDataService";
import type { MasterDataItem } from "../types/api";

export interface SelectOption {
    value: string;
    label: string;
}

const toSelectOptions = (
    items: MasterDataItem[],
    placeholder?: string,
    useIdAsValue?: boolean
): SelectOption[] => {
    const options: SelectOption[] = placeholder
        ? [{ value: "", label: placeholder }]
        : [];

    return [
        ...options,
        ...items.map((item) => ({
            value: useIdAsValue ? String(item.id) : item.nama,
            label: item.nama,
        })),
    ];
};

/**
 * Hook dengan Zustand store untuk mengambil satu jenis master data
 * dan mengembalikannya sebagai array SelectOption.
 * Zustand store menangani caching global, deduplikasi request, dan
 * mengeliminasi kebutuhan untuk prop drilling.
 *
 * @param key - Jenis master data yang akan di-fetch
 * @param placeholder - Teks placeholder untuk option pertama (opsional)
 * @param fallback - Fallback options jika API gagal (opsional)
 * @param useIdAsValue - Gunakan `id` sebagai value select option, bukan `nama` (opsional)
 */
export const useMasterData = (
    key: MasterDataKey,
    placeholder?: string,
    fallback?: SelectOption[],
    useIdAsValue?: boolean
) => {
    const fetchMasterData = useMasterDataStore((state) => state.fetchMasterData);
    const refetchMasterData = useMasterDataStore((state) => state.refetchMasterData);
    const entry = useMasterDataStore((state) => state.cache[key]);

    useEffect(() => {
        fetchMasterData(key);
    }, [key, fetchMasterData]);

    const items = entry?.items || [];
    const isLoading = entry?.isLoading ?? true;
    const options: SelectOption[] =
        items.length > 0 ? toSelectOptions(items, placeholder, useIdAsValue) : (fallback ?? []);

    return {
        options,
        items,
        isLoading,
        error: entry?.error ?? null,
        refetch: () => refetchMasterData(key),
    };
};

export const useMultipleMasterData = (
    keys: Partial<Record<MasterDataKey, string | undefined>>,
    useIdAsValue?: boolean
) => {
    const fetchMasterData = useMasterDataStore((state) => state.fetchMasterData);
    const cache = useMasterDataStore((state) => state.cache);

    const entries = Object.entries(keys) as [MasterDataKey, string | undefined][];

    useEffect(() => {
        entries.forEach(([key]) => {
            fetchMasterData(key);
        });
    }, [JSON.stringify(Object.keys(keys)), fetchMasterData]);

    const isLoading = entries.some(([key]) => cache[key]?.isLoading ?? true);

    const data: Record<string, SelectOption[]> = {};
    entries.forEach(([key, placeholder]) => {
        const items = cache[key]?.items || [];
        data[key] = items.length > 0 ? toSelectOptions(items, placeholder, useIdAsValue) : [];
    });

    return {
        data: data as Record<MasterDataKey, SelectOption[]>,
        isLoading,
    };
};
