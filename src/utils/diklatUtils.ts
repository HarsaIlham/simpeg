import type { DiklatPegawaiHrdItem } from "../types/api"
import type { CardDiklatData } from "../components/ui/organisms/CardDiklat/CardDiklat"

export const formatTanggal = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

export const formatRupiah = (amount: number): string => {
    return amount.toLocaleString("id-ID")
}

export const normalizeStatus = (status: string): "mendatang" | "berlangsung" | "selesai" => {
    if (status === "belum terlaksana") return "mendatang"
    return status as "mendatang" | "berlangsung" | "selesai"
}

export const mapHrdItemToCardDiklat = (item: DiklatPegawaiHrdItem): CardDiklatData => ({
    id: item.id_diklat,
    namaDiklat: item.nama,
    kategori: item.kategori,
    jenisDiklat: item.jenis,
    tanggalMulai: formatTanggal(item.tanggal_mulai),
    tanggalSelesai: formatTanggal(item.tanggal_selesai),
    tempat: item.tempat,
    waktu: item.waktu,
    jamPelajaran: item.jp != null ? String(item.jp) : "-",
    jenisBiaya: item.jenis_biaya ?? "Tidak Tersedia",
    totalBiaya: item.total_biaya ? `Rp. ${formatRupiah(item.total_biaya)}` : "Tidak Tersedia",
    penyelenggara: item.pelaksana,
    jenisPelaksana: item.jenis_pelaksana,
    pencatat: item.created_by,
    catatan: item.catatan,
    status: normalizeStatus(item.status),
    hasLaporan: !!item.sertif_file_path,
    sertifikat: item.sertif_file_path || "",
    pegawaiNama: item.pegawai_nama,
    pegawaiNik: item.pegawai_nik,
    idJadwalDiklat: item.id_jadwal_diklat,
    uploadLaporan: item.uploadlaporan,
})

export const JENIS_OPTIONS = [
    { value: "", label: "Semua Jenis" },
    { value: "Tenaga Kesehatan", label: "Tenaga Kesehatan" },
    { value: "ASN", label: "ASN" },
]

