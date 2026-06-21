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
import Modal from "../../../ui/organisms/Modal";
import Input from "../../../ui/atoms/Input";
import { getGlobalUser } from "../../../../contexts/AuthContext";
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

const ITEMS_PER_PAGE = 10;

const PegawaiHrd = () => {
    const user = getGlobalUser();
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

    // Date/Year entry filters
    const [tahunMasuk, setTahunMasuk] = useState("");
    const [tglMasukDari, setTglMasukDari] = useState("");
    const [tglMasukSampai, setTglMasukSampai] = useState("");
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);

    const [tempTahunMasuk, setTempTahunMasuk] = useState("");
    const [tempTglMasukDari, setTempTglMasukDari] = useState("");
    const [tempTglMasukSampai, setTempTglMasukSampai] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [perPage, setPerPage] = useState(ITEMS_PER_PAGE);

    const [statCounts, setStatCounts] = useState({
        totalPegawai: 0,
        hrdCount: 0,
        direkturCount: 0,
        adminCount: 0,
    });

    const { options: filterJenisPegawaiOptions } = useMasterData("jenisPegawai", "Semua Jenis Pegawai", JENIS_PEGAWAI_OPTIONS);
    const { options: filterProfesiOptions } = useMasterData("profesi", "Semua Profesi", PROFESI_OPTIONS);

    const fetchPegawai = useCallback(async (
        page: number = 1,
        filters?: {
            search?: string;
            status_kelengkapan?: string;
            jenis_pegawai?: string;
            pendidikan?: string;
            status_pegawai?: string;
            profesi?: string;
            tahun_masuk?: string;
            tgl_masuk_dari?: string;
            tgl_masuk_sampai?: string;
        }
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await pegawaiService.getAll({
                page,
                per_page: ITEMS_PER_PAGE,
                search: filters?.search || undefined,
                status_kelengkapan: filters?.status_kelengkapan || undefined,
                jenis_pegawai: filters?.jenis_pegawai || undefined,
                pendidikan: filters?.pendidikan || undefined,
                status_pegawai: filters?.status_pegawai || undefined,
                profesi: filters?.profesi || undefined,
                tahun_masuk: filters?.tahun_masuk || undefined,
                tgl_masuk_dari: filters?.tgl_masuk_dari || undefined,
                tgl_masuk_sampai: filters?.tgl_masuk_sampai || undefined,
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
                    profesi: item.profesi || item.unit_kerja || "-",
                    status: item.status || "Aktif",
                    role: item.role || "pegawai",
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
                    adminCount: responseData.jumlah_admin ?? 0,
                });
            }
        } catch (err: any) {
            setError(err?.message || "Gagal mengambil data pegawai.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const currentFilters = useMemo(() => ({
        search: searchValue || undefined,
        status_kelengkapan: statusdata || undefined,
        jenis_pegawai: jenisPegawai || undefined,
        pendidikan: pendidikan || undefined,
        status_pegawai: statusPegawai || undefined,
        profesi: profesi || undefined,
        tahun_masuk: tahunMasuk || undefined,
        tgl_masuk_dari: tglMasukDari || undefined,
        tgl_masuk_sampai: tglMasukSampai || undefined,
    }), [searchValue, statusdata, jenisPegawai, pendidikan, statusPegawai, profesi, tahunMasuk, tglMasukDari, tglMasukSampai]);

    useEffect(() => {
        fetchPegawai(1);
    }, [fetchPegawai]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchPegawai(1, currentFilters);
        }, 700);
        return () => clearTimeout(timer);
    }, [currentFilters, fetchPegawai]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        fetchPegawai(page, currentFilters);
    }, [fetchPegawai, currentFilters]);

    const handleRoleChange = useCallback(async (id: number, newRole: "admin" | "hrd" | "direktur" | "pegawai") => {
        try {
            const response = await pegawaiService.changeRole(id, newRole);
            if (response.success) {
                fetchPegawai(currentPage, currentFilters);
            }
        } catch (err: any) {
            alert(err?.message || "Gagal mengubah role pegawai.");
        }
    }, [currentPage, currentFilters, fetchPegawai]);

    const handleDetailClick = (id: number) => {
        navigate(`/pegawai/${id}`);
    };

    const filterBarFilters = useMemo(() => [
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
                    value={String(statCounts.adminCount)}
                    label="Admin"
                    variant="amber"
                />
            </div>
            <>
                <Card>
                    <FilterBar
                        customWidth="640px"
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        filters={filterBarFilters}
                        searchPlaceholder="Cari nama atau NIK"
                    />
                </Card>

                <div className={styles.filterRight}>
                    <Button
                        label={
                            tahunMasuk || tglMasukDari || tglMasukSampai 
                            ? "Filter Masuk: Aktif" 
                            : "Tahun masuk"
                        }
                        variant={tahunMasuk || tglMasukDari || tglMasukSampai ? "success" : "primary"}
                        size="sm"
                        onClick={() => {
                            setTempTahunMasuk(tahunMasuk);
                            setTempTglMasukDari(tglMasukDari);
                            setTempTglMasukSampai(tglMasukSampai);
                            setIsDateModalOpen(true);
                        }}
                    />
                </div>

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
                            data={pegawaiList}
                            rowKey={(row) => row.id}
                            emptyMessage="Tidak ada data pegawai yang cocok."
                            maxVisibleRows={10}
                        />
                    )}
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

            {isDateModalOpen && (
                <Modal
                    title="Filter Tanggal / Tahun Masuk Pegawai"
                    isOpen={isDateModalOpen}
                    onClose={() => setIsDateModalOpen(false)}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <Input
                                id="filter-tahun-masuk"
                                name="tahun_masuk"
                                label="Berdasarkan Tahun Masuk"
                                placeholder="Contoh: 2026"
                                type="text"
                                onlyNumbers={true}
                                value={tempTahunMasuk}
                                onChange={(e) => {
                                    setTempTahunMasuk(e.target.value);
                                    if (e.target.value) {
                                        setTempTglMasukDari("");
                                        setTempTglMasukSampai("");
                                    }
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <Input
                                    id="filter-tgl-masuk-dari"
                                    name="tgl_masuk_dari"
                                    label="Dari Tanggal"
                                    type="date"
                                    value={tempTglMasukDari}
                                    onChange={(e) => {
                                        setTempTglMasukDari(e.target.value);
                                        if (e.target.value) {
                                            setTempTahunMasuk("");
                                        }
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input
                                    id="filter-tgl-masuk-sampai"
                                    name="tgl_masuk_sampai"
                                    label="Sampai Tanggal"
                                    type="date"
                                    value={tempTglMasukSampai}
                                    onChange={(e) => {
                                        setTempTglMasukSampai(e.target.value);
                                        if (e.target.value) {
                                            setTempTahunMasuk("");
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                            <Button
                                label="Reset Filter"
                                variant="secondary"
                                type="button"
                                onClick={() => {
                                    setTahunMasuk("");
                                    setTglMasukDari("");
                                    setTglMasukSampai("");
                                    setIsDateModalOpen(false);
                                }}
                            />
                            <Button
                                label="Terapkan"
                                variant="primary"
                                type="button"
                                onClick={() => {
                                    setTahunMasuk(tempTahunMasuk);
                                    setTglMasukDari(tempTglMasukDari);
                                    setTglMasukSampai(tempTglMasukSampai);
                                    setIsDateModalOpen(false);
                                }}
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default PegawaiHrd;
