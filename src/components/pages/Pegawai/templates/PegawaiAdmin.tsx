import { useCallback, useEffect, useMemo, useState } from "react";
import { UsersRound, SquarePen, UserRoundPlus } from "lucide-react";
import Card from "../../../ui/atoms/Card";
import FilterBar from "../../../ui/molecules/FilterBar";
import MainHeaderSection from "../../../ui/molecules/MainHeaderSection";
import Topbar from "../../../ui/organisms/Topbar/Topbar";
import styles from "./PegawaiAdmin.module.css";
import StatCard from "../../../ui/molecules/StatCard";
import DataTable from "../../../ui/organisms/DataTable";
import Pagination from "../../../ui/molecules/Pagination";
import Modal from "../../../ui/organisms/Modal";
import Popup from "../../../ui/molecules/Popup";
import FormEditRoleStatus from "../../../ui/organisms/FormEditRoleStatus";
import FormTambahPegawai from "../components/FormTambahPegawai";
import { pegawaiService } from "../../../../services/pegawaiService";
import Button from "../../../ui/atoms/Button";
import { useNavigate } from "react-router";

export interface PegawaiItem {
    id: number;
    nama: string;
    jabatan: string;
    unitKerja: string;
    nik: string;
    email: string;
    noTelepon: string;
    status: string;
    role: "admin" | "hrd" | "direktur" | "pegawai";
    statusData: "lengkap" | "belum-lengkap";
    jenisPegawai: string;
    pendidikan: string;
    statusPegawai: string;
}

const capitalize = (str: string) => {
    if (!str) return "-";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const ITEMS_PER_PAGE = 10;

const PegawaiAdmin = () => {
    const navigate = useNavigate();
    const [pegawaiList, setPegawaiList] = useState<PegawaiItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [perPage, setPerPage] = useState(ITEMS_PER_PAGE);

    const [statCounts, setStatCounts] = useState({
        totalPegawai: 0,
        hrdCount: 0,
        direkturCount: 0,
        pegawaiAktif: 0,
    });

    const [editingPegawai, setEditingPegawai] = useState<PegawaiItem | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [popup, setPopup] = useState({
        isOpen: false,
        variant: "success" as "success" | "error" | "warning" | "checklist",
        title: "",
        message: "",
    });

    const showPopup = (variant: typeof popup.variant, title: string, message: string) => {
        setPopup({ isOpen: true, variant, title, message });
    };

    const closePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }));
    };

    const fetchPegawai = useCallback(async (page: number = 1, search?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await pegawaiService.getAll({
                page,
                per_page: ITEMS_PER_PAGE,
                search: search || undefined,
            });
            if (response.success && response.data) {
                const responseData = response.data as any;
                const paginatedPegawai = responseData.pegawai;

                const rawList = paginatedPegawai?.data || [];
                const mapped: PegawaiItem[] = rawList.map((item: any) => ({
                    id: item.id_pegawai,
                    nama: item.nama || "",
                    nik: item.nik || "",
                    jabatan: item.jabatan || "-",
                    status: item.status || "Aktif",
                    unitKerja: item.unit_kerja || "-",
                    role: item.role || "pegawai",
                    email: item.email || "-",
                    noTelepon: item.no_telp || "-",
                    statusData: item.status_kelengkapan === "Lengkap" ? "lengkap" : "belum-lengkap",
                    jenisPegawai: item.jenis_pegawai || "",
                    pendidikan: item.pendidikan || "",
                    statusPegawai: item.status || "",
                }));
                setPegawaiList(mapped);

                setCurrentPage(paginatedPegawai?.current_page || 1);
                setTotalPages(paginatedPegawai?.last_page || 1);
                setTotalItems(paginatedPegawai?.total || 0);
                setPerPage(paginatedPegawai?.per_page || ITEMS_PER_PAGE);
                setStatCounts({
                    totalPegawai: responseData.total_pegawai ?? 0,
                    hrdCount: responseData.jumlah_hrd ?? 0,
                    direkturCount: responseData.jumlah_direktur ?? 0,
                    pegawaiAktif: responseData.jumlah_pegawai_aktif ?? 0,
                });
            }
        } catch (err: any) {
            setError(err?.message || "Gagal mengambil data pegawai.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPegawai(1);
    }, [fetchPegawai]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        fetchPegawai(page, searchValue);
    }, [fetchPegawai, searchValue]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchPegawai(1, searchValue);
        }, 700);
        return () => clearTimeout(timer);
    }, [searchValue, fetchPegawai]);

    const handleEditClick = (pegawai: PegawaiItem) => {
        setEditingPegawai(pegawai);
    };

    const handleModalClose = () => {
        setEditingPegawai(null);
    };

    const handleSave = async (role: string, status: string) => {
        if (!editingPegawai) return;

        setIsSaving(true);
        try {
            const response = await pegawaiService.changeRole(
                editingPegawai.id,
                role as any,
                status
            );
            if (response.success) {
                handleModalClose();
                showPopup("checklist", "Berhasil", `Role dan status ${editingPegawai.nama} berhasil diperbarui.`);
                fetchPegawai(currentPage, searchValue);
            }
        } catch (err: any) {
            showPopup("error", "Gagal", err?.message || "Gagal memperbarui hak akses dan status.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreatePegawai = async (payload: { nik: string; nama: string; password?: string }) => {
        setIsSaving(true);
        try {
            const response = await pegawaiService.create(payload);
            if (response.success) {
                setIsAddModalOpen(false);
                showPopup("checklist", "Berhasil", `Pegawai ${payload.nama} berhasil ditambahkan.`);
                fetchPegawai(1);
            }
        } catch (err: any) {
            let errorMsg = "Gagal menambahkan pegawai.";
            if (err?.errors?.nik) {
                errorMsg = "NIK sudah terdaftar.";
            } else if (err?.message) {
                errorMsg = err.message;
            }
            showPopup("error", "Gagal", errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    const displayedPegawai = useMemo(() => {
        return pegawaiList;
    }, [pegawaiList]);

    const handleDetailClick = (id: number) => {
        navigate(`/pegawai/${id}`);
    };

    const columns = useMemo(() => [
        {
            key: "nama",
            label: "Nama/NIK",
            width: "20%",
            render: (row: PegawaiItem) =>
                <div>
                    <span className={styles.empName}>{row.nama}</span>
                    <div className={styles.empNik}><small>NIK: {row.nik}</small></div>
                </div>
        },
        {
            key: "jabatan",
            label: "Jabatan",
            width: "12%",
            render: (row: PegawaiItem) => <span>{row.jabatan}</span>
        },
        {
            key: "unitkerja",
            label: "Unit Kerja",
            width: "15%",
            render: (row: PegawaiItem) => <span>{row.unitKerja}</span>
        },
        {
            key: "kontak",
            label: "Kontak",
            width: "23%",

            render: (row: PegawaiItem) =>
                <div>
                    <span>{row.email}</span>
                    <div className={styles.empNik}><small>{row.noTelepon}</small></div>
                </div>
        },
        {
            key: "status",
            label: "Status",
            width: "10%",
            render: (row: PegawaiItem) => <span className={row.status.toLowerCase() === "aktif" ? styles.statusActive : styles.statusInactive}>{row.status}</span>
        },
        {
            key: "role",
            label: "role",
            width: "12%",
            render: (row: PegawaiItem) => (
                <span>{capitalize(row.role)}</span>
            )
        },
        {
            key: "aksi",
            label: "Aksi",
            width: "8%",
            render: (row: PegawaiItem) => (
                <button
                    type="button"
                    onClick={() => handleEditClick(row)}
                    className={styles.editBtn}
                    aria-label="Edit Pegawai"
                >
                    <SquarePen size={18} />
                </button>
            )
        },
        {
            key: "detail",
            label: "Detail",
            width: "8%",
            render: (row: PegawaiItem) => (
                <Button
                    label="Detail"
                    variant="primary"
                    size="sm"
                    onClick={() => handleDetailClick(row.id)}
                />
            )
        }
    ], []);

    return (
        <>
            <Topbar title="Pegawai" />
            <MainHeaderSection title="Pegawai" subtitle="Manajemen detail pegawai terintegrasi dan terstruktur" />

            <div className={styles.statsRow}>
                <StatCard
                    icon={<UsersRound size={24} />}
                    value={String(statCounts.totalPegawai)}
                    label="Pegawai"
                    variant="green"
                />
                <StatCard
                    icon={<UsersRound size={24} />}
                    value={String(statCounts.hrdCount)}
                    label="HRD"
                    variant="blue"
                />
                <StatCard
                    icon={<UsersRound size={24} />}
                    value={String(statCounts.direkturCount)}
                    label="Direktur"
                    variant="purple"
                />
                <StatCard
                    icon={<UsersRound size={24} />}
                    value={String(statCounts.pegawaiAktif)}
                    label="Pegawai Aktif"
                    variant="amber"
                />
            </div>

            <>
                <Card className={styles.row}>
                    <FilterBar
                        customWidth="640px"
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        filters={[]}
                        searchPlaceholder="Cari nama atau NIK "
                    />
                    <Button
                        icon={<UserRoundPlus size={20} />}
                        label="Tambah Pegawai"
                        variant="primary"
                        size="md"
                        onClick={() => setIsAddModalOpen(true)}
                    />
                </Card>

                <div className={styles.tableWrapper}>
                    {isLoading ? (
                        <div className={styles.centeredState}>
                            <div className={styles.spinner} />
                            <p className={styles.stateText}>Memuat data pegawai...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.centeredState}>
                            <p className={styles.errorText}>{error}</p>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={displayedPegawai}
                            rowKey={(row) => row.id}
                            emptyMessage="Tidak ada data pegawai yang cocok."
                            maxVisibleRows={10}
                        />)}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={perPage}
                    onPageChange={handlePageChange}
                    itemName="pegawai"
                />
            </>

            {isAddModalOpen && (
                <Modal
                    title="Tambah Pegawai Baru"
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                >
                    <FormTambahPegawai
                        onSubmit={handleCreatePegawai}
                        onCancel={() => setIsAddModalOpen(false)}
                        isSaving={isSaving}
                    />
                </Modal>
            )}

            {editingPegawai && (
                <Modal
                    title="Edit Hak Akses & Status"
                    isOpen={!!editingPegawai}
                    onClose={handleModalClose}
                >
                    <FormEditRoleStatus
                        initialRole={editingPegawai.role}
                        initialStatus={editingPegawai.statusPegawai.toLowerCase()}
                        pegawai={editingPegawai}
                        onSubmit={handleSave}
                        onCancel={handleModalClose}
                        isSaving={isSaving}
                    />
                </Modal>
            )}

            <Popup
                isOpen={popup.isOpen}
                onClose={closePopup}
                variant={popup.variant}
                title={popup.title}
                message={popup.message}
                confirmLabel="Ok"
            />
        </>
    );
};

export default PegawaiAdmin;
