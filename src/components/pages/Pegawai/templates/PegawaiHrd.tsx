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
import Badge from "../../../ui/atoms/Badge";
import DataTable from "../../../ui/organisms/DataTable";
import Pagination from "../../../ui/molecules/Pagination";
import Modal from "../../../ui/organisms/Modal";
import Input from "../../../ui/atoms/Input";
import { getGlobalUser } from "../../../../contexts/AuthContext";
import { useMasterData } from "../../../../hooks/useMasterData";
import { useDebounce } from "../../../../hooks/useDebounce";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import { pegawaiService } from "../../../../services/pegawaiService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface PegawaiItem {
    id: number;
    nama: string;
    jabatan: string;
    nik: string;
    unitKerja: string;
    status: string;
    role: "admin" | "hrd" | "direktur" | "pegawai";
    statusData: "Lengkap" | "Tidak Lengkap";
    jenisPegawai: string;
    pendidikan: string;
    statusPegawai: string;
}

const STATUS_DATA_OPTIONS = [
    { value: "", label: "Semua Status" },
    { value: "lengkap", label: "Lengkap" },
    { value: "belum-lengkap", label: "Tidak Lengkap" },
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

const UNIT_KERJA_OPTIONS = [
    { value: "", label: "Semua Unit Kerja" },
    { value: "Laboratorium", label: "Laboratorium" },
    { value: "Radiologi", label: "Radiologi" },
    { value: "Farmasi", label: "Farmasi" },
    { value: "Kamar Operasi", label: "Kamar Operasi" },
];

const ITEMS_PER_PAGE = 10;

const PegawaiHrd = () => {
    const user = getGlobalUser();
    const navigate = useNavigate();
    const isAdmin = user?.role === "admin";
    const queryClient = useQueryClient();

    const [searchValue, setSearchValue] = useState("");
    const [statusdata, setStatusData] = useState("");
    const [jenisPegawai, setJenisPegawai] = useState("");
    const [pendidikan, setPendidikan] = useState("");
    const [statusPegawai, setStatusPegawai] = useState("");
    const [unitKerja, setUnitKerja] = useState("");

    const [tahunMasuk, setTahunMasuk] = useState("");
    const [tglMasukDari, setTglMasukDari] = useState("");
    const [tglMasukSampai, setTglMasukSampai] = useState("");
    const dateModalDisclosure = useDisclosure(false);

    const [tempTahunMasuk, setTempTahunMasuk] = useState("");
    const [tempTglMasukDari, setTempTglMasukDari] = useState("");
    const [tempTglMasukSampai, setTempTglMasukSampai] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const { options: filterJenisPegawaiOptions } = useMasterData("jenisPegawai", "Semua Jenis Pegawai", JENIS_PEGAWAI_OPTIONS);
    const { options: filterUnitKerjaOptions } = useMasterData("unitKerja", "Semua Unit Kerja", UNIT_KERJA_OPTIONS);

    const debouncedSearch = useDebounce(searchValue, 500);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    const currentFilters = useMemo(() => ({
        search: debouncedSearch || undefined,
        status_kelengkapan: statusdata || undefined,
        jenis_pegawai: jenisPegawai || undefined,
        pendidikan: pendidikan || undefined,
        status_pegawai: statusPegawai || undefined,
        unit_kerja: unitKerja || undefined,
        tahun_masuk: tahunMasuk || undefined,
        tgl_masuk_dari: tglMasukDari || undefined,
        tgl_masuk_sampai: tglMasukSampai || undefined,
    }), [debouncedSearch, statusdata, jenisPegawai, pendidikan, statusPegawai, unitKerja, tahunMasuk, tglMasukDari, tglMasukSampai]);

    const { data: response, isLoading, error: queryError } = useQuery({
        queryKey: ["pegawai", currentPage, currentFilters],
        queryFn: () => pegawaiService.getAll({
            page: currentPage,
            per_page: ITEMS_PER_PAGE,
            search: currentFilters.search,
            status_kelengkapan: currentFilters.status_kelengkapan,
            jenis_pegawai: currentFilters.jenis_pegawai,
            pendidikan: currentFilters.pendidikan,
            status_pegawai: currentFilters.status_pegawai,
            unit_kerja: currentFilters.unit_kerja,
            tahun_masuk: currentFilters.tahun_masuk,
            tgl_masuk_dari: currentFilters.tgl_masuk_dari,
            tgl_masuk_sampai: currentFilters.tgl_masuk_sampai,
        }),
    });

    const error = queryError ? (queryError as any).message || "Gagal mengambil data pegawai." : null;

    const pegawaiList = useMemo(() => {
        if (!response?.success || !response?.data) return [];
        const rawList = (response.data as any).pegawai?.data || [];
        return rawList.map((item: any) => ({
            id: item.id_pegawai,
            nama: item.nama || "",
            nik: item.nik || "",
            jabatan: item.jabatan || "-",
            unitKerja: item.unit_kerja || "-",
            status: item.status || "Aktif",
            role: item.role || "pegawai",
            statusData: item.status_kelengkapan?.toLowerCase() === "lengkap" ? "Lengkap" : "Tidak Lengkap",
            jenisPegawai: item.jenis_pegawai || "-",
            pendidikan: item.pendidikan_terakhir || "-",
            statusPegawai: item.status || "-",
        }));
    }, [response]);

    const statCounts = useMemo(() => {
        if (!response?.success || !response?.data) {
            return { totalPegawai: 0, hrdCount: 0, direkturCount: 0, adminCount: 0 };
        }
        const responseData = response.data as any;
        return {
            totalPegawai: responseData.total_pegawai ?? 0,
            hrdCount: responseData.jumlah_hrd ?? 0,
            direkturCount: responseData.jumlah_direktur ?? 0,
            adminCount: responseData.jumlah_admin ?? 0,
        };
    }, [response]);

    const totalPages = (response?.data as any)?.pegawai?.last_page || 1;
    const totalItems = (response?.data as any)?.pegawai?.total || 0;
    const perPage = (response?.data as any)?.pegawai?.per_page || ITEMS_PER_PAGE;

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const changeRoleMutation = useMutation({
        mutationFn: ({ id, newRole }: { id: number; newRole: "admin" | "hrd" | "direktur" | "pegawai" }) =>
            pegawaiService.changeRole(id, newRole),
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["pegawai"] });
                queryClient.invalidateQueries({ queryKey: ["pegawaiAdmin"] });
            }
        },
        onError: (err: any) => {
            alert(err?.message || "Gagal mengubah role pegawai.");
        }
    });

    const handleRoleChange = useCallback((id: number, newRole: "admin" | "hrd" | "direktur" | "pegawai") => {
        changeRoleMutation.mutate({ id, newRole });
    }, [changeRoleMutation]);

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
                setCurrentPage(1);
            },
            icon: <FilterIcon size={16} />
        },
        {
            name: "jenis-pegawai",
            options: filterJenisPegawaiOptions,
            value: jenisPegawai,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                setJenisPegawai(e.target.value);
                setCurrentPage(1);
            },
            icon: <FilterIcon size={16} />
        },
        {
            name: "pendidikan",
            options: PENDIDIKAN_OPTIONS,
            value: pendidikan,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                setPendidikan(e.target.value);
                setCurrentPage(1);
            },
            icon: <FilterIcon size={16} />
        },
        {
            name: "status-pegawai",
            options: STATUS_PEGAWAI_OPTIONS,
            value: statusPegawai,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                setStatusPegawai(e.target.value);
                setCurrentPage(1);
            },
            icon: <FilterIcon size={16} />
        },
        {
            name: "unit-kerja",
            options: filterUnitKerjaOptions,
            value: unitKerja,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                setUnitKerja(e.target.value);
                setCurrentPage(1);
            },
            icon: <FilterIcon size={16} />
        },
    ], [statusdata, filterJenisPegawaiOptions, jenisPegawai, pendidikan, statusPegawai, filterUnitKerjaOptions, unitKerja]);

    const columns = useMemo(() => [
        {
            key: "nama",
            label: "Nama",
            width: "18%",
            render: (row: PegawaiItem) => <span className={styles.empName}>{row.nama}</span>
        },
        {
            key: "pendidikan",
            label: "Pendidikan",
            width: "10%",
            render: (row: PegawaiItem) => <span>{row.pendidikan}</span>
        },
        {
            key: "nik",
            label: "NIK",
            width: "12%",
            render: (row: PegawaiItem) => <span>{row.nik}</span>
        },
        {
            key: "unitKerja",
            label: "Unit Kerja",
            width: "18%",
            render: (row: PegawaiItem) => <span>{row.unitKerja}</span>
        },
        {
            key: "status",
            label: "Status",
            width: "11%",
            render: (row: PegawaiItem) => (
                <Badge variant={row.status.toLowerCase() === "aktif" ? "success" : "danger"}>
                    {row.status.toLowerCase() === "aktif" ? "Aktif" : "Tidak Aktif"}
                </Badge>
            )
        },
        {
            key: "statusKelengkapan",
            label: "Kelengkapan",
            width: "15%",
            render: (row: PegawaiItem) => (
                <Badge variant={row.statusData.toLowerCase() === "lengkap" ? "success" : "danger"}>
                    {row.statusData.toLowerCase() === "lengkap" ? "Lengkap" : "Tidak Lengkap"}
                </Badge>
            )
        },
        {
            key: "role",
            label: "role",
            width: "8%",
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
                <Card className={styles.gap}>
                    <FilterBar
                        customWidth="640px"
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        filters={filterBarFilters}
                        searchPlaceholder="Cari nama atau NIK"
                    >
                        <Button
                            label={
                                tahunMasuk || tglMasukDari || tglMasukSampai
                                    ? "Filter Masuk: Aktif"
                                    : "Tahun masuk"
                            }
                            icon={<FilterIcon size={16} />}
                            variant={tahunMasuk || tglMasukDari || tglMasukSampai ? "success" : "primary"}
                            size="md"
                            onClick={() => {
                                setTempTahunMasuk(tahunMasuk);
                                setTempTglMasukDari(tglMasukDari);
                                setTempTglMasukSampai(tglMasukSampai);
                                dateModalDisclosure.onOpen();
                            }}
                        />
                    </FilterBar>
                </Card>


                <div>
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

            {dateModalDisclosure.isOpen && (
                <Modal
                    title="Filter Tanggal Masuk Pegawai"
                    isOpen={dateModalDisclosure.isOpen}
                    onClose={dateModalDisclosure.onClose}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                                    setCurrentPage(1);
                                    dateModalDisclosure.onClose();
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
                                    setCurrentPage(1);
                                    dateModalDisclosure.onClose();
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
