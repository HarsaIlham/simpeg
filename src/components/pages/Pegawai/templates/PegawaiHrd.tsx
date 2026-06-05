import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter as FilterIcon, UsersRound } from "lucide-react";
import Card from "../../../ui/atoms/Card";
import FilterBar from "../../../ui/molecules/FilterBar";
import MainHeaderSection from "../../../ui/molecules/MainHeaderSection";
import Topbar from "../../../ui/organisms/Topbar/Topbar";
import styles from "./PegawaiHrd.module.css";
import StatCard from "../../../ui/molecules/StatCard";
import Button from "../../../ui/atoms/Button";
import DataTable from "../../../ui/organisms/DataTable";
import Pagination from "../../../ui/molecules/Pagination";
import { useAuth } from "../../../../contexts/AuthContext";
import { useMasterData } from "../../../../hooks/useMasterData";
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

const STATUS_DATA_OPTIONS = [
    { value: "", label: "Semua Status" },
    { value: "lengkap", label: "Lengkap" },
    { value: "belum-lengkap", label: "Belum Lengkap" },
];

const JENIS_PEGAWAI_OPTIONS = [
    { value: "", label: "Semua Jenis" },
    { value: "PNS", label: "PNS" },
    { value: "PPPK", label: "PPPK" },
    { value: "Pegawai Kontrak", label: "Pegawai Kontrak" },
];

const PENDIDIKAN_OPTIONS = [
    { value: "", label: "Semua Pendidikan" },
    { value: "D3", label: "D3" },
    { value: "D4", label: "D4" },
    { value: "S1", label: "S1" },
    { value: "S2", label: "S2" },
    { value: "S3", label: "S3" },
];

const STATUS_PEGAWAI_OPTIONS = [
    { value: "", label: "Semua Status" },
    { value: "aktif", label: "Aktif" },
    { value: "tidak aktif", label: "Tidak Aktif" },
];

const PROFESI_OPTIONS = [
    { value: "", label: "Semua Profesi" },
    { value: "Dokter Spesialis Penyakit Dalam", label: "Dokter Spesialis Penyakit Dalam" },
    { value: "Dokter Spesialis Bedah", label: "Dokter Spesialis Bedah" },
    { value: "Perawat", label: "Perawat" },
    { value: "Apoteker", label: "Apoteker" },
    { value: "Dokter Spesialis Anak", label: "Dokter Spesialis Anak" },
];

const PegawaiHrd = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === "admin";
    const [pegawaiList, setPegawaiList] = useState<PegawaiItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [statusdata, setStatusData] = useState("");
    const [jenisPegawai, setJenisPegawai] = useState("");
    const [pendidikan, setPendidikan] = useState("");
    const [statusPegawai, setStatusPegawai] = useState("");
    const [profesi, setProfesi] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { options: filterJenisPegawaiOptions } = useMasterData("jenisPegawai", "Semua Jenis Pegawai", JENIS_PEGAWAI_OPTIONS);
    const { options: filterProfesiOptions } = useMasterData("profesi", "Semua Profesi", PROFESI_OPTIONS);

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

    const handleRoleChange = useCallback(async (id: number, newRole: "admin" | "hrd" | "direktur" | "pegawai") => {
        try {
            const response = await pegawaiService.changeRole(id, newRole);
            if (response.success) {
                setPegawaiList(prev => prev.map(p => p.id === id ? { ...p, role: newRole } : p));
            }
        } catch (err: any) {
            alert(err?.message || "Gagal mengubah role pegawai.");
        }
    }, []);

    const handleDetailClick = (id: number) => {
        navigate(`/pegawai/${id}`);
    };

    const totalCount = pegawaiList.length;
    const hrdCount = pegawaiList.filter((p) => p.role === "hrd").length;
    const direkturCount = pegawaiList.filter((p) => p.role === "direktur").length;
    const adminCount = pegawaiList.filter((p) => p.role === "admin").length;

    const filteredPegawai = useMemo(() => {
        return pegawaiList.filter((item) => {
            const matchesSearch = searchValue
                ? item.nama.toLowerCase().includes(searchValue.toLowerCase()) ||
                  item.nik.includes(searchValue) ||
                  item.profesi.toLowerCase().includes(searchValue.toLowerCase())
                : true;

            const matchesStatusData = statusdata
                ? item.statusData === statusdata
                : true;

            const matchesJenisPegawai = jenisPegawai
                ? item.jenisPegawai === jenisPegawai
                : true;

            const matchesPendidikan = pendidikan
                ? item.pendidikan === pendidikan
                : true;

            const matchesStatusPegawai = statusPegawai
                ? item.statusPegawai === statusPegawai
                : true;

            const matchesProfesi = profesi
                ? item.profesi === profesi
                : true;

            return matchesSearch && matchesStatusData && matchesJenisPegawai && matchesPendidikan && matchesStatusPegawai && matchesProfesi;
        });
    }, [pegawaiList, searchValue, statusdata, jenisPegawai, pendidikan, statusPegawai, profesi]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue, statusdata, jenisPegawai, pendidikan, statusPegawai, profesi]);

    const itemsPerPage = 10;
    const totalItems = filteredPegawai.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const activePage = Math.min(currentPage, totalPages);

    const paginatedPegawai = useMemo(() => {
        const startIndex = (activePage - 1) * itemsPerPage;
        return filteredPegawai.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredPegawai, activePage]);

    const filters = useMemo(() => [
        {
            name: "status-data",
            options: STATUS_DATA_OPTIONS,
            value: statusdata,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                setStatusData(e.target.value);
            },
            icon: <FilterIcon size={16} />
        },
        {
            name: "jenis-pegawai",
            options: filterJenisPegawaiOptions,
            value: jenisPegawai,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                setJenisPegawai(e.target.value);
            },
            icon: <FilterIcon size={16} />
        },
        {
            name: "pendidikan",
            options: PENDIDIKAN_OPTIONS,
            value: pendidikan,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                setPendidikan(e.target.value);
            },
            icon: <FilterIcon size={16} />
        },
        {
            name: "status-pegawai",
            options: STATUS_PEGAWAI_OPTIONS,
            value: statusPegawai,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                setStatusPegawai(e.target.value);
            },
            icon: <FilterIcon size={16} />
        },
        {
            name: "profesi",
            options: filterProfesiOptions,
            value: profesi,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                setProfesi(e.target.value);
            },
            icon: <FilterIcon size={16} />
        },
    ], [statusdata, filterJenisPegawaiOptions, jenisPegawai, pendidikan, statusPegawai, filterProfesiOptions, profesi]);

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
                <select
                    value={row.role}
                    onChange={(e) => handleRoleChange(row.id, e.target.value as any)}
                    className={styles.roleSelect}
                    disabled={!isAdmin}
                >
                    <option value="pegawai">Pegawai</option>
                    <option value="hrd">HRD</option>
                    <option value="direktur">Direktur</option>
                    <option value="admin">Admin</option>
                </select>
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
    ], [handleRoleChange, isAdmin]);

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
                            customWidth="640px"
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                            filters={filters}
                            searchPlaceholder="Cari nama, Jabatan.."
                        />
                    </Card>

                    <div className={styles.filterRight}>
                        <Button
                            label="Tahun masuk"
                            variant="primary"
                            size="sm"
                            onClick={() => {}}
                        />
                    </div>

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
        </>
    );
};

export default PegawaiHrd;
