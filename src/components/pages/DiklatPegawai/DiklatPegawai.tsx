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
import { useDebounce } from "../../../hooks/useDebounce"
import { useDisclosure } from "../../../hooks/useDisclosure"
import { getGlobalUser } from "../../../contexts/AuthContext"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

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
    const queryClient = useQueryClient()

    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [filterJenis, setFilterJenis] = useState("")

    const [serverErrorsJenis, setServerErrorsJenis] = useState<Record<string, string[]> | undefined>(undefined)
    const [selectedDiklat, setSelectedDiklat] = useState<CardDiklatData | null>(null)
    const [modalMode, setModalMode] = useState<string>("")
    const jadwalModalDisclosure = useDisclosure(false)
    const jenisModalDisclosure = useDisclosure(false)
    const cetakRekapModalDisclosure = useDisclosure(false)

    const [currentPage, setCurrentPage] = useState(1)

    const [popup, setPopup] = useState<PopupState>({
        isOpen: false,
        variant: "checklist",
        title: "",
        message: "",
    })

    const user = getGlobalUser();
    const role = user?.role.toLowerCase();

    const showPopup = (variant: PopupState["variant"], title: string, message: string) => {
        setPopup({ isOpen: true, variant, title, message })
    }

    const closePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }))
    }

    const { data: response, isLoading: queryIsLoading, error: queryError } = useQuery({
        queryKey: ["diklatPegawai", currentPage, debouncedSearch, filterJenis],
        queryFn: () => hrdDiklatService.getAll({
            page: currentPage,
            per_page: ITEMS_PER_PAGE,
            search: debouncedSearch || undefined,
            jenis: filterJenis || undefined,
        }),
    });

    const isLoading = queryIsLoading;
    const error = queryError ? (queryError as any).message || "Gagal mengambil data diklat." : null;

    const diklatList = useMemo(() => {
        if (!response?.success || !response?.data) return [];
        const responseData = response.data as any;
        const rawList = responseData?.data || responseData?.list || [];
        return rawList.map(mapHrdItemToCardDiklat);
    }, [response]);

    const responseData = response?.data as any;
    const totalPages = responseData?.last_page || 1;
    const totalItems = responseData?.total || 0;
    const perPage = responseData?.per_page || ITEMS_PER_PAGE;

    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearch])

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
    }, [])

    const handleTambahDropdown = () => {
        setServerErrorsJenis(undefined)
        jenisModalDisclosure.onOpen()
    }

    const addJenisMutation = useMutation({
        mutationFn: (jenisBaru: string) => masterDataService.createTipeDiklat(jenisBaru),
        onSuccess: async (_res: any, variables: string) => {
            await refetchTipeDiklat();
            jenisModalDisclosure.onClose();
            showPopup("checklist", "Berhasil", `Jenis diklat "${variables}" berhasil ditambahkan.`);
        },
        onError: (err: any) => {
            if (err?.errors) {
                const mappedErrors: Record<string, string[]> = {};
                if (err.errors.nama) {
                    mappedErrors.jenis_baru = err.errors.nama;
                }
                setServerErrorsJenis(mappedErrors);
            }
            showPopup("error", "Gagal", err?.message || "Terjadi kesalahan saat menambah jenis diklat.");
        }
    });

    const isSubmittingJenis = addJenisMutation.isPending;

    const handleSubmitJenis = async (jenisBaru: string) => {
        addJenisMutation.mutate(jenisBaru);
    }

    const handleCetakRekap = () => {
        cetakRekapModalDisclosure.onOpen()
    }

    const cetakRekapMutation = useMutation({
        mutationFn: (payload: CetakRekapPayload) => generateRekapDiklatExcel(
            diklatList,
            payload.bulanAwal,
            payload.tahunAwal,
            payload.bulanAkhir,
            payload.tahunAkhir,
        ),
        onSuccess: () => {
            cetakRekapModalDisclosure.onClose();
            showPopup("checklist", "Berhasil", "Rekap berhasil diunduh.");
        },
        onError: (err: any) => {
            showPopup("error", "Gagal", err?.message || "Gagal mencetak rekap.");
        }
    });

    const isSubmittingCetakRekap = cetakRekapMutation.isPending;

    const handleSubmitCetakRekap = async (payload: CetakRekapPayload) => {
        cetakRekapMutation.mutate(payload);
    }

    const handleTambahJadwal = () => {
        setSelectedDiklat(null)
        setModalMode("Tambah Jadwal Diklat")
        jadwalModalDisclosure.onOpen()
    }

    const submitJadwalMutation = useMutation({
        mutationFn: ({ id, payload }: { id?: number; payload: CreateMasterDiklatRequest }) => {
            if (id !== undefined) {
                return hrdDiklatService.updateMasterDiklat(id, payload);
            }
            return hrdDiklatService.createMasterDiklat(payload);
        },
        onSuccess: (_res, variables) => {
            jadwalModalDisclosure.onClose();
            setSelectedDiklat(null);
            const isEdit = variables.id !== undefined;
            showPopup("checklist", "Berhasil", `Jadwal diklat berhasil ${isEdit ? "diperbarui" : "ditambahkan"}.`);
            queryClient.invalidateQueries({ queryKey: ["diklatPegawai"] });
        },
        onError: (err: any) => {
            showPopup("error", "Gagal", err?.message || "Gagal menyimpan jadwal diklat.");
        }
    });

    const isSubmittingJadwal = submitJadwalMutation.isPending;

    const handleSubmitJadwal = async (formData: FormData) => {
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

        submitJadwalMutation.mutate({
            id: modalMode === "Edit Diklat" && selectedDiklat ? selectedDiklat.id : undefined,
            payload
        });
    }

    const handleTambahPeserta = (diklat: CardDiklatData) => {
        navigate(`/diklat-pegawai/${diklat.id}/peserta`, {
            state: {
                diklatData: {
                    id: diklat.id,
                    namaDiklat: diklat.namaDiklat,
                    status: diklat.status,
                },
            },
        })
    }

    const handleEdit = (diklat: CardDiklatData) => {
        setSelectedDiklat(diklat)
        setModalMode("Edit Diklat")
        jadwalModalDisclosure.onOpen()
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
                            value={searchQuery}
                            onChange={setSearchQuery}
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
                        {role !== 'direktur' && (
                            <Button
                                label="Cetak Rekap"
                                variant="primary"
                                size="md"
                                onClick={handleCetakRekap}
                            />
                        )}

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
                    diklatList.map((diklat: any) => (
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
                isOpen={jenisModalDisclosure.isOpen}
                onClose={jenisModalDisclosure.onClose}
                title="Tambah Jenis Diklat"
            >
                <FormTambahJenisDiklat
                    isSubmitting={isSubmittingJenis}
                    serverErrors={serverErrorsJenis}
                    onSubmit={handleSubmitJenis}
                    onCancel={jenisModalDisclosure.onClose}
                />
            </Modal>

            <Modal
                isOpen={cetakRekapModalDisclosure.isOpen}
                onClose={cetakRekapModalDisclosure.onClose}
                title="Cetak Rekap"
            >
                <FormCetakRekap
                    isSubmitting={isSubmittingCetakRekap}
                    onSubmit={handleSubmitCetakRekap}
                    onCancel={cetakRekapModalDisclosure.onClose}
                />
            </Modal>

            <Modal
                isOpen={jadwalModalDisclosure.isOpen && (modalMode === "Tambah Jadwal Diklat" || modalMode === "Edit Diklat")}
                onClose={() => { jadwalModalDisclosure.onClose(); setSelectedDiklat(null); }}
                title={modalMode}
            >
                <FormTambahJadwalDiklat
                    initialData={selectedDiklat}
                    isEdit={modalMode === "Tambah Jadwal Diklat" || modalMode === "Edit Diklat"}
                    onCancel={() => { jadwalModalDisclosure.onClose(); setSelectedDiklat(null); }}
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