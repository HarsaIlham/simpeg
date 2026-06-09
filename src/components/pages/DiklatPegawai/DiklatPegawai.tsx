import { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./DiklatPegawai.module.css"
import Topbar from "../../ui/organisms/Topbar/Topbar"
import MainHeaderSection from "../../ui/molecules/MainHeaderSection"
import Card from "../../ui/atoms/Card"
import SearchInput from "../../ui/molecules/SearchInput"
import Button from "../../ui/atoms/Button"
import Select from "../../ui/atoms/Select"
import CardDiklat from "../../ui/organisms/CardDiklat"
import type { CardDiklatData } from "../../ui/organisms/CardDiklat/CardDiklat"
import Popup from "../../ui/molecules/Popup"
import Modal from "../../ui/organisms/Modal"
import Pagination from "../../ui/molecules/Pagination"
import FormTambahJenisDiklat from "../../ui/organisms/FormTambahJenisDiklat/FormTambahJenisDiklat"
import FormTambahJadwalDiklat from "../../ui/organisms/FormTambahJadwalDiklat"
import { hrdDiklatService } from "../../../services/hrdDiklatService"
import { masterDataService } from "../../../services/masterDataService"
import { mapHrdItemToCardDiklat, JENIS_OPTIONS } from "../../../utils/diklatUtils"
import type { CreateMasterDiklatRequest } from "../../../types/api"
import FormCetakRekap from "./components/FormCetakRekap"
import type { CetakRekapPayload } from "./components/FormCetakRekap/FormCetakRekap"
import { generateRekapDiklatExcel } from "../../../utils/generateRekapDiklatPdf"
import { useMasterData } from "../../../hooks/useMasterData"

interface PopupState {
    isOpen: boolean
    variant: "success" | "error" | "warning" | "checklist"
    title: string
    message: string
}

const ITEMS_PER_PAGE = 7

const DiklatPegawai = () => {
    const { options: filterJenisOptions, refetch: refetchTipeDiklat } = useMasterData("tipeDiklat", "Semua Jenis", JENIS_OPTIONS)
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [filterJenis, setFilterJenis] = useState("")
    const [diklatList, setDiklatList] = useState<CardDiklatData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isModalJenisOpen, setIsModalJenisOpen] = useState(false)
    const [isSubmittingJenis, setIsSubmittingJenis] = useState(false)
    const [serverErrorsJenis, setServerErrorsJenis] = useState<Record<string, string[]> | undefined>(undefined)
    const [isSubmittingJadwal, setIsSubmittingJadwal] = useState(false)
    const [isModalCetakRekapOpen, setIsModalCetakRekapOpen] = useState(false)
    const [isSubmittingCetakRekap, setIsSubmittingCetakRekap] = useState(false)
    const [selectedDiklat, setSelectedDiklat] = useState<CardDiklatData | null>(null)
    const [modalMode, setModalMode] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [perPage, setPerPage] = useState(ITEMS_PER_PAGE)

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

    const currentFilters = useMemo(() => ({
        search: search || undefined,
        jenis: filterJenis || undefined,
    }), [search, filterJenis])

    const fetchDiklat = useCallback(async (
        page: number = 1,
        filters?: { search?: string; jenis?: string }
    ) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await hrdDiklatService.getAll({
                page,
                per_page: ITEMS_PER_PAGE,
                search: filters?.search,
                jenis: filters?.jenis,
            })
            if (response.success && response.data) {
                const responseData = response.data as any

                const rawList = responseData?.data || responseData?.list || []
                const mapped = rawList.map(mapHrdItemToCardDiklat)
                setDiklatList(mapped)

                if (responseData?.current_page !== undefined) {
                    setCurrentPage(responseData.current_page)
                    setTotalPages(responseData.last_page || 1)
                    setTotalItems(responseData.total || 0)
                    setPerPage(responseData.per_page || ITEMS_PER_PAGE)
                }
            } else {
                setError(response.message || "Gagal mengambil data diklat.")
            }
        } catch (err: unknown) {
            const errorObj = err as { message?: string }
            setError(errorObj?.message || "Terjadi kesalahan saat mengambil data diklat.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDiklat(1)
    }, [fetchDiklat])

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1)
            fetchDiklat(1, currentFilters)
        }, 700)
        return () => clearTimeout(timer)
    }, [currentFilters, fetchDiklat])

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
        fetchDiklat(page, currentFilters)
    }, [fetchDiklat, currentFilters])

    const handleTambahDropdown = () => {
        setServerErrorsJenis(undefined)
        setIsModalJenisOpen(true)
    }

    const handleSubmitJenis = async (jenisBaru: string) => {
        setIsSubmittingJenis(true)
        setServerErrorsJenis(undefined)
        try {
            await masterDataService.createTipeDiklat(jenisBaru)
            await refetchTipeDiklat()
            setIsModalJenisOpen(false)
            showPopup("checklist", "Berhasil", `Jenis diklat "${jenisBaru}" berhasil ditambahkan.`)
        } catch (err: unknown) {
            const errorObj = err as { message?: string; errors?: Record<string, string[]> }
            if (errorObj?.errors) {
                const mappedErrors: Record<string, string[]> = {}
                if (errorObj.errors.nama) {
                    mappedErrors.jenis_baru = errorObj.errors.nama
                }
                setServerErrorsJenis(mappedErrors)
            }
            showPopup("error", "Gagal", errorObj?.message || "Terjadi kesalahan saat menambah jenis diklat.")
        } finally {
            setIsSubmittingJenis(false)
        }
    }

    const handleCetakRekap = () => {
        setIsModalCetakRekapOpen(true)
    }

    const handleSubmitCetakRekap = async (payload: CetakRekapPayload) => {
        setIsSubmittingCetakRekap(true)
        try {
            await generateRekapDiklatExcel(
                diklatList,
                payload.bulanAwal,
                payload.tahunAwal,
                payload.bulanAkhir,
                payload.tahunAkhir,
            )
            setIsModalCetakRekapOpen(false)
            showPopup("checklist", "Berhasil", "Rekap berhasil diunduh.")
        } catch (err: unknown) {
            const errorObj = err as { message?: string }
            showPopup("error", "Gagal", errorObj?.message || "Gagal mencetak rekap.")
        } finally {
            setIsSubmittingCetakRekap(false)
        }
    }

    const handleTambahJadwal = () => {
        setSelectedDiklat(null)
        setModalMode("Tambah Jadwal Diklat")
        setIsModalOpen(true)
    }

    const handleSubmitJadwal = async (formData: FormData) => {
        setIsSubmittingJadwal(true)
        try {
            if (modalMode === "Edit Diklat" && selectedDiklat) {
                showPopup("checklist", "Berhasil", "Jadwal diklat berhasil diperbarui.")
                setDiklatList(prev => prev.map(item => item.id === selectedDiklat.id ? {
                    ...item,
                    namaDiklat: formData.get("nama_kegiatan") as string,
                    kategori: formData.get("kategori") as string,
                    jenisDiklat: formData.get("jenis_diklat") as string,
                    penyelenggara: formData.get("penyelenggara") as string,
                    tempat: formData.get("lokasi") as string,
                    tanggalMulai: formData.get("tanggal_mulai") as string,
                    tanggalSelesai: formData.get("tanggal_selesai") as string,
                    jamPelajaran: formData.get("jp") as string,
                    waktu: formData.get("waktu") as string,
                    jenisBiaya: formData.get("jenis_biaya") as string || "Tidak Tersedia",
                    totalBiaya: formData.get("total_biaya") ? `Rp. ${Number(formData.get("total_biaya")).toLocaleString("id-ID")}` : "Tidak Tersedia",
                    catatan: formData.get("catatan") as string,
                } : item))
                setIsModalOpen(false)
                setSelectedDiklat(null)
                return
            }

            const payload: CreateMasterDiklatRequest = {
                nama_kegiatan: formData.get("nama_kegiatan") as string,
                kategori: formData.get("kategori") as string,
                jenis_diklat: formData.get("jenis_diklat") as string,
                penyelenggara: formData.get("penyelenggara") as string,
                lokasi: formData.get("lokasi") as string,
                tanggal_mulai: formData.get("tanggal_mulai") as string,
                tanggal_selesai: formData.get("tanggal_selesai") as string,
                jp: Number(formData.get("jp")),
                waktu: formData.get("waktu") as string || undefined,
                jenis_pelaksana: formData.get("jenis_pelaksana") as "internal" | "external",
                jenis_biaya: formData.get("jenis_biaya") as string || undefined,
                total_biaya: formData.get("total_biaya") ? Number(formData.get("total_biaya")) : undefined,
                catatan: formData.get("catatan") as string || undefined,
            }

            await hrdDiklatService.createMasterDiklat(payload)
            setIsModalOpen(false)
            showPopup("checklist", "Berhasil", "Jadwal diklat berhasil ditambahkan.")
            await fetchDiklat(currentPage, currentFilters)
        } catch (err: unknown) {
            const errorObj = err as { message?: string }
            showPopup("error", "Gagal", errorObj?.message || "Gagal menambahkan jadwal diklat.")
        } finally {
            setIsSubmittingJadwal(false)
        }
    }

    const handleTambahPeserta = (diklat: CardDiklatData) => {
        navigate(`/diklat-pegawai/${diklat.id}/peserta`, {
            state: {
                diklatData: {
                    id: diklat.id,
                    namaDiklat: diklat.namaDiklat,
                },
            },
        })
    }

    const handleEdit = (diklat: CardDiklatData) => {
        setSelectedDiklat(diklat)
        setModalMode("Edit Diklat")
        setIsModalOpen(true)
    }

    if (isLoading) {
        return (
            <>
                <Topbar title="Diklat Pegawai" />
                <MainHeaderSection title="Diklat Pegawai" subtitle="Kelola riwayat pelatihan dan pendidikan lanjutan" />
                <Card className={styles.emptyState}>
                    <p className={styles.emptyText}>Memuat data diklat...</p>
                </Card>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Topbar title="Diklat Pegawai" />
                <MainHeaderSection title="Diklat Pegawai" subtitle="Kelola riwayat pelatihan dan pendidikan lanjutan" />
                <Card className={styles.emptyState}>
                    <p className={styles.emptyText}>{error}</p>
                </Card>
            </>
        )
    }

    return (
        <>
            <Topbar title="Diklat Pegawai" />
            <MainHeaderSection title="Diklat Pegawai" subtitle="Kelola riwayat pelatihan dan pendidikan lanjutan" />

            <Card className={styles.cardSearch}>
                <div className={styles.cardHeader}>
                    <div className={styles.searchWrapper}>
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            placeholder="Cari Diklat..."
                        />
                    </div>
                    <Select
                        name="jenis"
                        id="filter-jenis-diklat"
                        options={filterJenisOptions}
                        value={filterJenis}
                        onChange={(e) => setFilterJenis(e.target.value)}
                    />
                    <div className={styles.buttonGroup}>
                        <Button
                            label="Tambah Jenis Diklat"
                            variant="primary"
                            size="md"
                            onClick={handleTambahDropdown}
                        />
                        <Button
                            label="Cetak Rekap"
                            variant="primary"
                            size="md"
                            onClick={handleCetakRekap}
                        />
                        <Button
                            label="Tambah Jadwal Diklat"
                            variant="primary"
                            size="md"
                            onClick={handleTambahJadwal}
                        />
                    </div>
                </div>
            </Card>

            <div className={styles.cardList}>
                {diklatList.length > 0 ? (
                    diklatList.map((diklat) => (
                        <CardDiklat
                            key={diklat.id}
                            data={diklat}
                            onTambahPeserta={() => handleTambahPeserta(diklat)}
                            onEdit={() => handleEdit(diklat)}
                            onDelete={() => { }}
                        />
                    ))

                ) : (
                    <Card className={styles.emptyState}>
                        <p className={styles.emptyText}>
                            Tidak ada data diklat yang ditemukan.
                        </p>
                    </Card>
                )}
            </div>

            {totalPages > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={perPage}
                    onPageChange={handlePageChange}
                    itemName="diklat"
                />
            )}

            <Modal
                isOpen={isModalJenisOpen}
                onClose={() => setIsModalJenisOpen(false)}
                title="Tambah Jenis Diklat"
            >
                <FormTambahJenisDiklat
                    isSubmitting={isSubmittingJenis}
                    serverErrors={serverErrorsJenis}
                    onSubmit={handleSubmitJenis}
                    onCancel={() => setIsModalJenisOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isModalCetakRekapOpen}
                onClose={() => setIsModalCetakRekapOpen(false)}
                title="Cetak Rekap"
            >
                <FormCetakRekap
                    isSubmitting={isSubmittingCetakRekap}
                    onSubmit={handleSubmitCetakRekap}
                    onCancel={() => setIsModalCetakRekapOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isModalOpen && (modalMode === "Tambah Jadwal Diklat" || modalMode === "Edit Diklat")}
                onClose={() => { setIsModalOpen(false); setSelectedDiklat(null); }}
                title={modalMode}
            >
                <FormTambahJadwalDiklat
                    initialData={selectedDiklat}
                    isEdit={modalMode === "Tambah Jadwal Diklat" || modalMode === "Edit Diklat"}
                    onCancel={() => { setIsModalOpen(false); setSelectedDiklat(null); }}
                    onSubmit={handleSubmitJadwal}
                    isLoading={isSubmittingJadwal}
                />
            </Modal>

            <Popup
                isOpen={popup.isOpen}
                onClose={closePopup}
                variant={popup.variant}
                title={popup.title}
                message={popup.message}
                confirmLabel="Ok"
            />
        </>
    )
}

export default DiklatPegawai