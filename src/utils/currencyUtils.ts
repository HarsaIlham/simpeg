
export const formatRupiah = (amount: string | number | null | undefined): string => {
    if (amount === null || amount === undefined || amount === "") return "-";
    const strVal = String(amount);
    if (strVal === "Tidak Tersedia") return "-";
    const clean = strVal.replace(/\D/g, "");
    if (!clean) return "-";
    return `Rp. ${Number(clean).toLocaleString("id-ID")}`;
};
