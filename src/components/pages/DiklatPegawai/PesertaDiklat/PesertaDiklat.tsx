import { useState, useMemo, useCallback, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import styles from "./PesertaDiklat.module.css"
import Topbar from "../../../ui/organisms/Topbar/Topbar"
import MainHeaderSection from "../../../ui/molecules/MainHeaderSection"
import Card from "../../../ui/atoms/Card"
import SearchInput from "../../../ui/molecules/SearchInput"
import Select from "../../../ui/atoms/Select"
import Button from "../../../ui/atoms/Button"
import Checkbox from "../../../ui/atoms/Checkbox"
import DataTable from "../../../ui/organisms/DataTable"
import type { Column } from "../../../ui/organisms/DataTable/DataTable"
import Popup from "../../../ui/molecules/Popup"
import { hrdDiklatService } from "../../../../services/hrdDiklatService"
import type { PesertaDiklatItem } from "../../../../types/api"
import { useMasterData } from "../../../../hooks/useMasterData"
import { Send } from "lucide-react"

const STATUS_OPTIONS = [
    { value: "", label: "Semua Status" },
    { value: "terdaftar", label: "Terdaftar" },
    { value: "belum", label: "Belum Terdaftar" },
]

const PROFESI_OPTIONS = [
    { value: "", label: "Semua Profesi" },
    { value: "perawat", label: "Perawat" },
    { value: "dokter", label: "Dokter" },
    { value: "analis-kesehatan", label: "Analis Kesehatan" },
    { value: "apoteker", label: "Apoteker" },
    { value: "ahli-gizi", label: "Ahli Gizi" },
    { value: "bidan", label: "Bidan" },
    { value: "radiografer", label: "Radiografer" },
    { value: "fisioterapis", label: "Fisioterapis" },
]

const UNIT_KERJA_OPTIONS = [
    { value: "", label: "Semua Unit Kerja" },
    { value: "laboratorium", label: "Laboratorium" },
    { value: "radiologi", label: "Radiologi" },
    { value: "farmasi", label: "Farmasi" },
    { value: "kamar-operasi", label: "Kamar Operasi" },
]

interface PopupState {
    isOpen: boolean
    variant: "success" | "error" | "warning" | "checklist"
    title: string
    message: string
}

const PesertaDiklat = () => {
    const { options: profesiOptions } = useMasterData("profesi", "Semua Profesi", PROFESI_OPTIONS);
    const { options: unitKerjaOptions } = useMasterData("unitKerja", "Semua Unit Kerja", UNIT_KERJA_OPTIONS);

    const navigate = useNavigate()
    const location = useLocation()

    const diklatData = location.state?.diklatData as {
        id: number
        namaDiklat: string
    } | undefined
    const diklatId = diklatData?.id ?? 0
    const diklatName = diklatData?.namaDiklat ?? "Diklat"

    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [filterProfesi, setFilterProfesi] = useState("")
    const [filterUnitKerja, setFilterUnitKerja] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [mode, setMode] = useState<"view" | "add">("view")

    const [pegawaiList, setPegawaiList] = useState<PesertaDiklatItem[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

    const [popup, setPopup] = useState<PopupState>({
        isOpen: false,
        variant: "checklist",
        title: "",
        message: "",
    })

    const showPopup = useCallback(
        (variant: PopupState["variant"], title: string, message: string) => {
            setPopup({ isOpen: true, variant, title, message })
        },
        [],
    )

    const closePopup = useCallback(() => {
        setPopup((prev) => ({ ...prev, isOpen: false }))
    }, [])

    const fetchPeserta = useCallback(async (targetMode: "view" | "add") => {
        if (!diklatId) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            const section = targetMode === "add" ? "all" : undefined
            const response = await hrdDiklatService.getPeserta(diklatId, section)
            if (response.success && response.data) {
                setPegawaiList(response.data.list)

                const registeredIds = response.data.list
                    .filter((p) => p.status)
                    .map((p) => p.pegawai_id)
                setSelectedIds(new Set(registeredIds))
            }
        } catch (err: unknown) {
            const errorObj = err as { message?: string }
            showPopup("error", "Gagal", errorObj?.message || "Gagal mengambil data peserta.")
        } finally {
            setIsLoading(false)
        }
    }, [diklatId, showPopup])

    useEffect(() => {
        fetchPeserta(mode)
    }, [fetchPeserta, mode])

    useEffect(() => {
        if (mode === "view") {
            setFilterStatus("")
        }
    }, [mode])

    const filteredPegawai = useMemo(() => {
        return pegawaiList.filter((p) => {
            const matchSearch =
                p.nama.toLowerCase().includes(search.toLowerCase()) ||
                p.nik.toLowerCase().includes(search.toLowerCase()) ||
                p.profesi.toLowerCase().includes(search.toLowerCase()) ||
                p.unit_kerja.toLowerCase().includes(search.toLowerCase())

            const isTerdaftar = selectedIds.has(p.pegawai_id)

            if (mode === "view" && !isTerdaftar) {
                return false
            }

            const matchStatus =
                !filterStatus ||
                (filterStatus === "terdaftar" && isTerdaftar) ||
                (filterStatus === "belum" && !isTerdaftar)
            const matchProfesi = !filterProfesi || p.profesi.toLowerCase() === filterProfesi.toLowerCase()
            const matchUnitKerja = !filterUnitKerja || p.unit_kerja.toLowerCase() === filterUnitKerja.toLowerCase()

            return matchSearch && matchStatus && matchProfesi && matchUnitKerja
        })
    }, [search, filterStatus, filterProfesi, filterUnitKerja, selectedIds, pegawaiList, mode])

    const handleToggle = useCallback((id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }, [])

    const handleSelectAll = useCallback(() => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            filteredPegawai.forEach((p) => next.add(p.pegawai_id))
            return next
        })
    }, [filteredPegawai])

    const handleDeselectAll = useCallback(() => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            filteredPegawai.forEach((p) => next.delete(p.pegawai_id))
            return next
        })
    }, [filteredPegawai])

    const handleSimpan = useCallback(async () => {
        setIsSaving(true)
        try {
            const pesertaIds = Array.from(selectedIds)
            await hrdDiklatService.syncPeserta(diklatId, pesertaIds)
            showPopup(
                "checklist",
                "Berhasil",
                `${pesertaIds.length} peserta berhasil disimpan untuk ${diklatName}.`,
            )
            setMode("view")
        } catch (err: unknown) {
            const errorObj = err as { message?: string }
            showPopup("error", "Gagal", errorObj?.message || "Gagal menyimpan peserta.")
        } finally {
            setIsSaving(false)
        }
    }, [selectedIds, diklatId, diklatName, showPopup])

    // const handleBatal = useCallback(() => {
    //     navigate(-1)
    // }, [navigate])

    const columns: Column<PesertaDiklatItem>[] = useMemo(() => {
        const baseColumns: Column<PesertaDiklatItem>[] = [
            {
                key: "nama",
                label: "Nama",
                width: "22%",
            },
            {
                key: "unit_kerja",
                label: "Unit Kerja",
                width: "25%",
            },
            {
                key: "nik",
                label: "NIK",
                width: "22%",
            },
            {
                key: "profesi",
                label: "Profesi",
                width: "18%",
            },
        ]

        if (mode === "view") {
            return [
                ...baseColumns,
                {
                    key: "dokumen",
                    label: "Dokumen",
                    width: "18%",
                },
                {
                    key: "ingatkan",
                    label: "Ingatkan",
                    width: "11%",
                    render: (row) => (
                        <Button
                            icon={<Send size={14} />}
                            size="sm"
                            variant="info"
                            onClick={() => console.log("ingatkan", row)}
                        />
                    ),
                },
            ]
        } else {
            return [
                ...baseColumns,
                {
                    key: "terdaftar",
                    label: "Terdaftar",
                    width: "13%",
                    render: (row: PesertaDiklatItem) => (
                        <div className={styles.checkboxCell}>
                            <Checkbox
                                id={`peserta-${row.pegawai_id}`}
                                checked={selectedIds.has(row.pegawai_id)}
                                onChange={() => handleToggle(row.pegawai_id)}
                            />
                        </div>
                    ),
                },
            ]
        }
    }, [mode, selectedIds, handleToggle])

    if (isLoading) {
        return (
            <>
                <Topbar title="Peserta Diklat" />
                <MainHeaderSection
                    title={`Peserta Diklat ${diklatName}`}
                    subtitle="Manajemen peserta diklat"
                />
                <Card className={styles.searchCard}>
                    <p>Memuat data peserta...</p>
                </Card>
            </>
        )
    }

    return (
        <>
            <Topbar title="Peserta Diklat" />

            <MainHeaderSection
                title={`Peserta Diklat ${diklatName}`}
                subtitle="Manajemen peserta diklat"
            />

            <Card className={styles.searchCard}>
                <div className={styles.searchWrapper}>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Cari Pegawai, NIK, Jabatan..."
                        id="search-peserta"
                    />
                </div>
            </Card>

            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    {mode === "add" && (
                        <Select
                            name="status"
                            id="filter-status-peserta"
                            options={STATUS_OPTIONS}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        />
                    )}
                    <Select
                        name="profesi"
                        id="filter-profesi-peserta"
                        options={profesiOptions}
                        value={filterProfesi}
                        onChange={(e) => setFilterProfesi(e.target.value)}
                    />
                    <Select
                        name="unit kerja"
                        id="filter-unit-kerja-peserta"
                        options={unitKerjaOptions}
                        value={filterUnitKerja}
                        onChange={(e) => setFilterUnitKerja(e.target.value)}
                    />
                </div>
                <div className={styles.toolbarRight}>
                    {mode === "view" ? (
                        <Button
                            label="Tambah Peserta"
                            variant="success"
                            size="md"
                            onClick={() => setMode("add")}
                        />
                    ) : (
                        <>
                            <Button
                                label="Pilih Semua"
                                variant="info"
                                size="md"
                                onClick={handleSelectAll}
                            />
                            <Button
                                label="Batalkan Pilih Semua"
                                variant="dangerSoft"
                                size="md"
                                onClick={handleDeselectAll}
                            />
                        </>
                    )}
                </div>
            </div>

            <Card className={styles.tableSection} padding="none">
                <DataTable<PesertaDiklatItem>
                    columns={columns}
                    data={filteredPegawai}
                    rowKey={(row) => row.pegawai_id}
                    emptyMessage="Tidak ada pegawai yang ditemukan."
                    maxVisibleRows={6}
                />
            </Card>

            <div className={styles.footerActions}>
                {mode === "view" ? (
                    <Button
                        label="Kembali"
                        variant="secondary"
                        size="md"
                        onClick={() => navigate(-1)}
                    />
                ) : (
                    <>
                        <Button
                            label={isSaving ? "Menyimpan..." : "Simpan"}
                            variant="primary"
                            size="md"
                            onClick={handleSimpan}
                            disabled={isSaving}
                        />
                        <Button
                            label="Batal"
                            variant="secondary"
                            size="md"
                            onClick={() => {
                                const registeredIds = pegawaiList
                                    .filter((p) => p.status)
                                    .map((p) => p.pegawai_id)
                                setSelectedIds(new Set(registeredIds))
                                setMode("view")
                            }}
                            disabled={isSaving}
                        />
                    </>
                )}
            </div>

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

export default PesertaDiklat
