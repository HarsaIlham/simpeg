import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import styles from "./VerifikasiKelayakan.module.css"
import Topbar from "../../ui/organisms/Topbar/Topbar"
import MainHeaderSection from "../../ui/molecules/MainHeaderSection"
import Card from "../../ui/atoms/Card"
import SearchInput from "../../ui/molecules/SearchInput"
import CardDiklat from "../../ui/organisms/CardDiklat"
import type { CardDiklatData } from "../../ui/organisms/CardDiklat/CardDiklat"
import Popup from "../../ui/molecules/Popup"
import { hrdDiklatService } from "../../../services/hrdDiklatService"
import { mapHrdItemToCardDiklat } from "../../../utils/diklatUtils"
import PdfViewerModal from "../../ui/molecules/PdfViewerModal"
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

const VerifikasiKelayakan = () => {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState("")
    const [previewFile, setPreviewFile] = useState<{ url: string; namaDiklat: string } | null>(null)

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

    const showPopup = (variant: PopupState["variant"], title: string, message: string) => {
        setPopup({ isOpen: true, variant, title, message })
    }

    const closePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }))
    }

    const { data: response, isLoading: queryIsLoading, error: queryError } = useQuery({
        queryKey: ["menungguKelayakan"],
        queryFn: hrdDiklatService.getMenungguKelayakan,
    })

    const isLoading = queryIsLoading
    const error = queryError ? (queryError as any).message || "Terjadi kesalahan saat mengambil data." : null

    const diklatList = useMemo(() => {
        if (!response?.success || !response?.data) return []
        return response.data.list.map(mapHrdItemToCardDiklat)
    }, [response])

    const filteredData = useMemo(() => {
        return diklatList.filter((item) => {
            const matchSearch =
                item.namaDiklat.toLowerCase().includes(search.toLowerCase()) ||
                item.jenisDiklat.toLowerCase().includes(search.toLowerCase()) ||
                item.kategori.toLowerCase().includes(search.toLowerCase()) ||
                item.penyelenggara.toLowerCase().includes(search.toLowerCase()) ||
                (item.pegawaiNama?.toLowerCase().includes(search.toLowerCase()) ?? false)
            return matchSearch
        })
    }, [diklatList, search])

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

    const updateKelayakanMutation = useMutation({
        mutationFn: ({ idJadwalDiklat, statusKelayakan }: { idJadwalDiklat: number; statusKelayakan: boolean }) => {
            return hrdDiklatService.updateKelayakan(idJadwalDiklat, statusKelayakan)
        },
        onSuccess: (_res, variables) => {
            closeConfirm()
            showPopup(
                "checklist",
                "Berhasil",
                `Status kelayakan berhasil diperbarui menjadi "${variables.statusKelayakan ? "Layak" : "Tidak Layak"}".`
            )
            queryClient.invalidateQueries({ queryKey: ["menungguKelayakan"] })
        },
        onError: (err: any) => {
            closeConfirm()
            showPopup("error", "Gagal", err?.message || "Gagal memperbarui status kelayakan.")
        }
    })

    const isUpdating = updateKelayakanMutation.isPending

    const handleConfirmKelayakan = async (statusKelayakan: boolean) => {
        if (!confirm.diklat?.idJadwalDiklat) return
        updateKelayakanMutation.mutate({ idJadwalDiklat: confirm.diklat.idJadwalDiklat, statusKelayakan })
    }

    if (isLoading) {
        return (
            <>
                <Topbar title="Verifikasi Kelayakan" />
                <MainHeaderSection title="Verifikasi Kelayakan" subtitle="Kelola verifikasi kelayakan diklat pegawai" />
                <Card className={styles.emptyState}>
                    <p className={styles.emptyText}>Memuat data verifikasi kelayakan...</p>
                </Card>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Topbar title="Verifikasi Kelayakan" />
                <MainHeaderSection title="Verifikasi Kelayakan" subtitle="Kelola verifikasi kelayakan diklat pegawai" />
                <Card className={styles.emptyState}>
                    <p className={styles.emptyText}>{error}</p>
                </Card>
            </>
        )
    }

    return (
        <>
            <Topbar title="Verifikasi Kelayakan" />
            <MainHeaderSection title="Verifikasi Kelayakan" subtitle="Kelola verifikasi kelayakan diklat pegawai" />

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
                            onVerifikasi={() => openConfirm(diklat)}
                            onViewDocument={(url) => handleViewDocument(url, diklat.namaDiklat)}
                        />
                    ))
                ) : (
                    <Card className={styles.emptyState}>
                        <p className={styles.emptyText}>
                            Tidak ada diklat yang menunggu verifikasi kelayakan.
                        </p>
                    </Card>
                )}
            </div>

            <Popup
                isOpen={confirm.isOpen}
                onClose={closeConfirm}
                variant="success"
                title="Konfirmasi Kelayakan Data"
                message={`Pilih status kelayakan untuk diklat "${confirm.diklat?.namaDiklat}" milik ${confirm.diklat?.pegawaiNama}.`}
                confirmLabel="Layak"
                dangerLabel="Tidak Layak"
                onConfirm={() => handleConfirmKelayakan(true)}
                onDanger={() => handleConfirmKelayakan(false)}
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

export default VerifikasiKelayakan
