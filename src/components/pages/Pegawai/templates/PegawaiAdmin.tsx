import { useCallback, useEffect, useMemo, useState } from "react";
import { UsersRound, SquarePen } from "lucide-react";
import Card from "../../../ui/atoms/Card";
import FilterBar from "../../../ui/molecules/FilterBar";
import MainHeaderSection from "../../../ui/molecules/MainHeaderSection";
import Topbar from "../../../ui/organisms/Topbar/Topbar";
import styles from "./PegawaiAdmin.module.css";
import StatCard from "../../../ui/molecules/StatCard";
import Button from "../../../ui/atoms/Button";
import DataTable from "../../../ui/organisms/DataTable";
import Pagination from "../../../ui/molecules/Pagination";
import Modal from "../../../ui/organisms/Modal";
import Input from "../../../ui/atoms/Input";
import Select from "../../../ui/atoms/Select";
import { pegawaiService } from "../../../../services/pegawaiService";

export interface PegawaiItem {
    id: number;
    nama: string;
    jabatan: string;
    nik: string;
    profesi: string;
    status: string;
    role: "admin" | "hrd" | "direktur" | "pegawai";
    statusData: "lengkap" | "belum-lengkap";
    jenisPegawai: string;
    pendidikan: string;
    statusPegawai: string;
}

const ROLE_OPTIONS = [
    { value: "pegawai", label: "Pegawai" },
    { value: "hrd", label: "HRD" },
    { value: "direktur", label: "Direktur" },
    { value: "admin", label: "Admin" },
];

const STATUS_OPTIONS = [
    { value: "aktif", label: "Aktif" },
    { value: "cuti", label: "Cuti" },
    { value: "berhenti", label: "Berhenti" },
    { value: "pensiun", label: "Pensiun" },
];

const capitalize = (str: string) => {
    if (!str) return "-";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const PegawaiAdmin = () => {
    const [pegawaiList, setPegawaiList] = useState<PegawaiItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [editingPegawai, setEditingPegawai] = useState<PegawaiItem | null>(null);
    const [formRole, setFormRole] = useState<string>("");
    const [formStatus, setFormStatus] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    const fetchPegawai = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await pegawaiService.getAll();
            if (response.success && response.data) {
                const rawList = (response.data as any).pegawai?.data || [];
                const mapped: PegawaiItem[] = rawList.map((item: any) => ({
                    id: item.id_pegawai,
                    nama: item.nama || "",
                    nik: item.nik || "",
                    jabatan: item.jabatan || "-",
                    profesi: item.profesi || item.unit_kerja || "-",
                    status: item.status || "Aktif",
                    role: item.role || "pegawai",
                    statusData: item.status_kelengkapan === "Lengkap" ? "lengkap" : "belum-lengkap",
                    jenisPegawai: item.jenis_pegawai || "",
                    pendidikan: item.pendidikan || "",
                    statusPegawai: item.status || "",
                }));
                setPegawaiList(mapped);
            }
        } catch (err: any) {
            setError(err?.message || "Gagal mengambil data pegawai.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPegawai();
    }, [fetchPegawai]);

    const handleEditClick = (pegawai: PegawaiItem) => {
        setEditingPegawai(pegawai);
        setFormRole(pegawai.role);
        setFormStatus(pegawai.statusPegawai.toLowerCase());
    };

    const handleModalClose = () => {
        setEditingPegawai(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPegawai) return;

        setIsSaving(true);
        try {
            const response = await pegawaiService.changeRole(
                editingPegawai.id,
                formRole as any,
                formStatus
            );
            if (response.success) {
                setPegawaiList((prev) =>
                    prev.map((p) =>
                        p.id === editingPegawai.id
                            ? {
                                  ...p,
                                  role: formRole as any,
                                  status: capitalize(formStatus),
                                  statusPegawai: capitalize(formStatus),
                              }
                            : p
                    )
                );
                handleModalClose();
            }
        } catch (err: any) {
            alert(err?.message || "Gagal memperbarui hak akses dan status.");
        } finally {
            setIsSaving(false);
        }
    };

    const totalCount = pegawaiList.length;
    const hrdCount = pegawaiList.filter((p) => p.role === "hrd").length;
    const direkturCount = pegawaiList.filter((p) => p.role === "direktur").length;
    const adminCount = pegawaiList.filter((p) => p.role === "admin").length;

    const filteredPegawai = useMemo(() => {
        return pegawaiList.filter((item) => {
            if (!searchValue) return true;
            const term = searchValue.toLowerCase();
            return (
                item.nama.toLowerCase().includes(term) ||
                item.nik.includes(term) ||
                item.profesi.toLowerCase().includes(term) ||
                item.jabatan.toLowerCase().includes(term)
            );
        });
    }, [pegawaiList, searchValue]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue]);

    const itemsPerPage = 10;
    const totalItems = filteredPegawai.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const activePage = Math.min(currentPage, totalPages);

    const paginatedPegawai = useMemo(() => {
        const startIndex = (activePage - 1) * itemsPerPage;
        return filteredPegawai.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredPegawai, activePage]);

    const columns = useMemo(() => [
        {
            key: "nama",
            label: "Nama",
            width: "20%",
            render: (row: PegawaiItem) => <span className={styles.empName}>{row.nama}</span>
        },
        {
            key: "jabatan",
            label: "Jabatan",
            width: "12%",
            render: (row: PegawaiItem) => <span>{row.jabatan}</span>
        },
        {
            key: "nik",
            label: "NIK",
            width: "15%",
        },
        {
            key: "profesi",
            label: "Profesi",
            width: "23%",
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
        }
    ], []);

    return (
        <>
            <Topbar title="Pegawai" />
            <MainHeaderSection title="Pegawai" subtitle="Manajemen detail pegawai terintegrasi dan terstruktur" />

            <div className={styles.statsRow}>
                <StatCard
                    icon={<UsersRound size={24} />}
                    value={String(totalCount)}
                    label="Pegawai"
                    variant="green"
                />
                <StatCard
                    icon={<UsersRound size={24} />}
                    value={String(hrdCount)}
                    label="HRD"
                    variant="blue"
                />
                <StatCard
                    icon={<UsersRound size={24} />}
                    value={String(direkturCount)}
                    label="Direktur"
                    variant="purple"
                />
                <StatCard
                    icon={<UsersRound size={24} />}
                    value={String(adminCount)}
                    label="Admin"
                    variant="amber"
                />
            </div>

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
                <>
                    <Card>
                        <FilterBar
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                            filters={[]}
                            searchPlaceholder="Cari nama, Jabatan.."
                        />
                    </Card>

                    <div className={styles.tableWrapper}>
                        <DataTable
                            columns={columns}
                            data={paginatedPegawai}
                            rowKey={(row) => row.id}
                            emptyMessage="Tidak ada data pegawai yang cocok."
                            maxVisibleRows={10}
                        />
                    </div>

                    <Pagination
                        currentPage={activePage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        itemName="pegawai"
                    />
                </>
            )}

            {editingPegawai && (
                <Modal
                    title="Edit Hak Akses & Status"
                    isOpen={!!editingPegawai}
                    onClose={handleModalClose}
                >
                    <form onSubmit={handleSave} className={styles.editForm}>
                        <p className={styles.formInstructions}>
                            Sesuaikan peran (role) sistem dan status kepegawaian untuk: <strong>{editingPegawai.nama}</strong>
                        </p>

                        <div className={styles.formGroup}>
                            <label htmlFor="edit-role" className={styles.label}>Role / Hak Akses</label>
                            <Select
                                id="edit-role"
                                name="role"
                                options={ROLE_OPTIONS}
                                value={formRole}
                                onChange={(e) => setFormRole(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="edit-status" className={styles.label}>Status Pegawai</label>
                            <Select
                                id="edit-status"
                                name="status"
                                options={STATUS_OPTIONS}
                                value={formStatus}
                                onChange={(e) => setFormStatus(e.target.value)}
                            />
                        </div>

                        <div className={styles.buttonGroup}>
                            <Button
                                type="submit"
                                label={isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                                variant="primary"
                                disabled={isSaving}
                            />
                            <Button
                                type="button"
                                label="Batal"
                                variant="secondary"
                                onClick={handleModalClose}
                                disabled={isSaving}
                            />
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
};

export default PegawaiAdmin;
