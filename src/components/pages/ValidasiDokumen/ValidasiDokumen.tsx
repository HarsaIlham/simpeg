import { useState, useEffect, useCallback } from "react"
import styles from "./ValidasiDokumen.module.css"
import Topbar from "../../ui/organisms/Topbar/Topbar"
import MainHeaderSection from "../../ui/molecules/MainHeaderSection"
import Card from "../../ui/atoms/Card"
import SearchInput from "../../ui/molecules/SearchInput"
import CardDiklat from "../../ui/organisms/CardDiklat"
import type { CardDiklatData } from "../../ui/organisms/CardDiklat/CardDiklat"
import Popup from "../../ui/molecules/Popup"
import PdfViewerModal from "../../ui/molecules/PdfViewerModal"
import { hrdDiklatService } from "../../../services/hrdDiklatService"
import { mapHrdItemToCardDiklat } from "../../../utils/diklatUtils"
import { getProxiedFileUrl } from "../../../utils/api"

interface PopupState {
    isOpen: boolean
    variant: "success" | "error" | "warning" | "checklist"
    title: string
    message: string
}

interface ConfirmState {
    isOpen: boolean
    diklat: CardDiklatData | null
}

const ValidasiDokumen = () => {
    const [search, setSearch] = useState("")
    const [diklatList, setDiklatList] = useState<CardDiklatData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    const [confirm, setConfirm] = useState<ConfirmState>({
        isOpen: false,
        diklat: null,
    })

    const [popup, setPopup] = useState<PopupState>({
        isOpen: false,
        variant: "checklist",
        title: "",
        message: "",
    })

    const [previewFile, setPreviewFile] = useState<{ url: string; namaDiklat: string } | null>(null)

    const showPopup = (variant: PopupState["variant"], title: string, message: string) => {
        setPopup({ isOpen: true, variant, title, message })
    }

    const closePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }))
    }

    const fetchDiklat = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await hrdDiklatService.getMenungguValidasi()
            if (response.success && response.data) {
                const mapped = response.data.list.map(mapHrdItemToCardDiklat)
                setDiklatList(mapped)
            } else {
                setError(response.message || "Gagal mengambil data.")
            }
        } catch (err: unknown) {
            const errorObj = err as { message?: string }
            setError(errorObj?.message || "Terjadi kesalahan saat mengambil data.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDiklat()
    }, [fetchDiklat])

    const filteredData = diklatList.filter((item) => {
        const matchSearch =
            item.namaDiklat.toLowerCase().includes(search.toLowerCase()) ||
            item.jenisDiklat.toLowerCase().includes(search.toLowerCase()) ||
            item.kategori.toLowerCase().includes(search.toLowerCase()) ||
            item.penyelenggara.toLowerCase().includes(search.toLowerCase()) ||
            (item.pegawaiNama?.toLowerCase().includes(search.toLowerCase()) ?? false)
        return matchSearch
    })

    const openConfirm = (diklat: CardDiklatData) => {
        setConfirm({ isOpen: true, diklat })
    }

    const closeConfirm = () => {
        setConfirm({ isOpen: false, diklat: null })
    }

    const handleViewDocument = (url: string, namaDiklat: string) => {
        const proxied = getProxiedFileUrl(url)
        setPreviewFile({ url: proxied, namaDiklat })
    }

    const handleValidasi = async (statusValidasi: boolean) => {
        if (!confirm.diklat?.idJadwalDiklat) return

        setIsUpdating(true)
        try {
            await hrdDiklatService.updateValidasi(confirm.diklat.idJadwalDiklat, statusValidasi)
            closeConfirm()
            showPopup(
                "checklist",
                "Berhasil",
                `Status validasi berhasil diperbarui menjadi "${statusValidasi ? "Valid" : "Tidak Valid"}".`
            )
            await fetchDiklat()
        } catch (err: unknown) {
            const errorObj = err as { message?: string }
            closeConfirm()
            showPopup("error", "Gagal", errorObj?.message || "Gagal memperbarui status validasi.")
        } finally {
            setIsUpdating(false)
        }
    }

    if (isLoading) {
        return (
            <>
                <Topbar title="Validasi Dokumen" />
                <MainHeaderSection title="Validasi Dokumen" subtitle="Kelola validasi dokumen diklat pegawai" />
                <Card className={styles.emptyState}>
                    <p className={styles.emptyText}>Memuat data validasi dokumen...</p>
                </Card>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Topbar title="Validasi Dokumen" />
                <MainHeaderSection title="Validasi Dokumen" subtitle="Kelola validasi dokumen diklat pegawai" />
                <Card className={styles.emptyState}>
                    <p className={styles.emptyText}>{error}</p>
                </Card>
            </>
        )
    }

    return (
        <>
            <Topbar title="Validasi Dokumen" />
            <MainHeaderSection title="Validasi Dokumen" subtitle="Kelola validasi dokumen diklat pegawai" />

            <Card className={styles.cardSearch}>
                <div className={styles.cardHeader}>
                    <div className={styles.searchWrapper}>
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            placeholder="Cari diklat atau nama pegawai..."
                        />
                    </div>
                </div>
            </Card>

            <div className={styles.cardList}>
                {filteredData.length > 0 ? (
                    filteredData.map((diklat) => (
                        <CardDiklat
                            key={`${diklat.idJadwalDiklat}-${diklat.id}`}
                            data={diklat}
                            onValidasi={() => openConfirm(diklat)}
                            onViewDocument={(url) => handleViewDocument(url, diklat.namaDiklat)}
                        />
                    ))
                ) : (
                    <Card className={styles.emptyState}>
                        <p className={styles.emptyText}>
                            Tidak ada diklat yang menunggu validasi dokumen.
                        </p>
                    </Card>
                )}
            </div>

            <Popup
                isOpen={confirm.isOpen}
                onClose={closeConfirm}
                variant="success"
                title="Konfirmasi Validasi Data"
                message={`Pilih status validasi untuk dokumen diklat "${confirm.diklat?.namaDiklat}" milik ${confirm.diklat?.pegawaiNama}.`}
                confirmLabel="Valid"
                dangerLabel="Tidak Valid"
                onConfirm={() => handleValidasi(true)}
                onDanger={() => handleValidasi(false)}
                onCancel={closeConfirm}
                isLoading={isUpdating}
            />

            <Popup
                isOpen={popup.isOpen}
                onClose={closePopup}
                variant={popup.variant}
                title={popup.title}
                message={popup.message}
                confirmLabel="Ok"
            />

            <PdfViewerModal
                isOpen={!!previewFile}
                onClose={() => setPreviewFile(null)}
                fileUrl={previewFile?.url || null}
                title={`Sertifikat - ${previewFile?.namaDiklat || ""}`}
                fileName={`Sertifikat_${previewFile?.namaDiklat || "Dokumen"}`}
            />
        </>
    )
}

export default ValidasiDokumen

