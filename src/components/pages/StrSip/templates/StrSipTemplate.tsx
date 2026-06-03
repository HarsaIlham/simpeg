import { useState, useMemo, useCallback, useEffect } from "react";
import { FileText, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import Topbar from "../../../ui/organisms/Topbar/Topbar";
import MainHeaderSection from "../../../ui/molecules/MainHeaderSection";
import FilterBar from "../../../ui/molecules/FilterBar";
import StatCard from "../../../ui/molecules/StatCard";
import DataTable from "../../../ui/organisms/DataTable";
import Badge from "../../../ui/atoms/Badge";
import Card from "../../../ui/atoms/Card";
import type { StrSipRecord, StrSipJenis, StrSipStatus } from "../../../../types/api";
import type { Column } from "../../../ui/organisms/DataTable";
import styles from "./StrSipTemplate.module.css";
import { strSipService } from "../../../../services/strSipService";
import { getProxiedFileUrl } from "../../../../utils/api";
import PdfViewerModal from "../../../ui/molecules/PdfViewerModal";

const STATUS_BADGE_MAP: Record<StrSipStatus, { label: string; variant: "success" | "warning" | "danger" }> = {
    aktif: { label: "Aktif", variant: "success" },
    hampir_habis: { label: "Hampir Habis", variant: "warning" },
    tidak_aktif: { label: "Tidak Aktif", variant: "danger" },
};

const JENIS_BADGE_MAP: Record<StrSipJenis, { variant: "info" | "parent" }> = {
    STR: { variant: "info" },
    SIP: { variant: "parent" },
};

const JENIS_OPTIONS = [
    { value: "", label: "STR/SIP" },
    { value: "STR", label: "STR" },
    { value: "SIP", label: "SIP" },
];

const STATUS_OPTIONS = [
    { value: "", label: "Semua Status" },
    { value: "aktif", label: "Aktif" },
    { value: "hampir habis", label: "Hampir Habis" },
    { value: "tidak_aktif", label: "Tidak Aktif" },
];

const formatDate = (iso: string): string => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const matchesSearch = (record: StrSipRecord, query: string): boolean => {
    const q = query.toLowerCase();
    return (
        record.nama.toLowerCase().includes(q) ||
        record.nip.includes(q) ||
        record.nomor.toLowerCase().includes(q)
    );
};

const buildColumns = (onViewDocument: (doc: string) => void): Column<StrSipRecord>[] => [
    {
        key: "nama",
        label: "Nama",
        width: "22%",
        render: (row) => (
            <div className={styles.nameCell}>
                <span className={styles.nameText}>{row.nama}</span>
                <span className={styles.nipText}>NIP: {row.nip}</span>
                <span className={styles.profesiText}>{row.profesi}</span>
            </div>
        ),
    },
    {
        key: "jenis",
        label: "Jenis",
        width: "10%",
        render: (row) => (
            <Badge variant={JENIS_BADGE_MAP[row.jenis].variant}>
                {row.jenis}
            </Badge>
        ),
    },
    {
        key: "nomor",
        label: "Nomor",
        width: "16%",
    },
    {
        key: "dokumen",
        label: "Dokumen",
        width: "11%",
        render: (row) =>
            row.dokumen ? (
                <button
                    className={styles.docLink}
                    onClick={() => onViewDocument(row.dokumen!)}
                    type="button"
                >
                    Lihat Dokumen
                </button>
            ) : (
                <span className={styles.noDoc}>—</span>
            ),
    },
    {
        key: "tanggalTerbit",
        label: "Tanggal Terbit",
        width: "15%",
        render: (row) => formatDate(row.tanggalTerbit),
    },
    {
        key: "tanggalHabis",
        label: "Tanggal Habis",
        width: "15%",
        render: (row) => formatDate(row.tanggalHabis),
    },
    {
        key: "status",
        label: "Status",
        width: "11%",
        render: (row) => {
            const { label, variant } = STATUS_BADGE_MAP[row.status];
            return <Badge variant={variant}>{label}</Badge>;
        },
    },
];



const mapApiItemToStrSipRecord = (item: any): StrSipRecord => {
    let mappedStatus: StrSipStatus = "tidak_aktif";
    const statusStr = item.status.toLowerCase();

    if (statusStr === "aktif") {
        mappedStatus = "aktif";
    } else if (statusStr === "hampir habis") {
        mappedStatus = "hampir_habis";
    } else if (statusStr === "tidak aktif") {
        mappedStatus = "tidak_aktif";
    }

    const strSipType = (item.str_sip || "").toUpperCase();

    return {
        id: item.id,
        nama: item.nama,
        nip: item.nip || "-",
        profesi: item.profesi || "-",
        jenis: strSipType === "SIP" ? "SIP" : "STR",
        nomor: item.nomor || "-",
        dokumen: item.link_pdf || null,
        tanggalTerbit: item.tanggal_terbit || "",
        tanggalHabis: item.tanggal_selesai || "",
        status: mappedStatus,
    };
};

const StrSipTemplate = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterJenis, setFilterJenis] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const [allData, setAllData] = useState<StrSipRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<{ url: string; title: string } | null>(null);

    const summary = useMemo(() => {
        const total = allData.length;
        const aktif = allData.filter((r) => r.status === "aktif").length;
        const hampirHabis = allData.filter((r) => r.status === "hampir_habis").length;
        const tidakAktif = allData.filter((r) => r.status === "tidak_aktif").length;

        return { total, aktif, hampirHabis, tidakAktif };
    }, [allData]);

    const fetchStrSipData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await strSipService.getStrSipData();
            if (response.success && response.data) {
                const mappedRecords = (response.data.items || []).map(mapApiItemToStrSipRecord);
                setAllData(mappedRecords);
            } else {
                setError(response.message || "Gagal mengambil data STR/SIP.");
            }
        } catch (err: unknown) {
            const errorObj = err as { message?: string };
            setError(errorObj?.message || "Terjadi kesalahan saat mengambil data STR/SIP.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStrSipData();
    }, [fetchStrSipData]);

    const filteredData = useMemo(() => {
        return allData.filter((record) => {
            if (searchQuery && !matchesSearch(record, searchQuery)) return false;
            if (filterJenis && record.jenis !== filterJenis) return false;
            if (filterStatus && record.status !== filterStatus) return false;
            return true;
        });
    }, [allData, searchQuery, filterJenis, filterStatus]);

    const handleViewDocument = useCallback((docPath: string) => {
        if (!docPath) return;
        setPreviewFile({ url: getProxiedFileUrl(docPath), title: "Dokumen STR/SIP" });
    }, []);

    const columns = useMemo(
        () => buildColumns(handleViewDocument),
        [handleViewDocument]
    );

    const filters = useMemo(() => [
        {
            name: "jenis",
            options: JENIS_OPTIONS,
            value: filterJenis,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setFilterJenis(e.target.value),
        },
        {
            name: "status",
            options: STATUS_OPTIONS,
            value: filterStatus,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value),
        },
    ], [filterJenis, filterStatus]);

    if (isLoading) {
        return (
            <>
                <Topbar title="STR/SIP" />
                <MainHeaderSection
                    title="STR/SIP"
                    subtitle="Manajemen STR (Surat Tanda Registrasi) dan SIP (Surat Izin Praktik)"
                />
                <Card>
                    <p style={{ color: "#6b7280", fontSize: "16px" }}>Memuat data STR/SIP...</p>
                </Card>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Topbar title="STR/SIP" />
                <MainHeaderSection
                    title="STR/SIP"
                    subtitle="Manajemen STR (Surat Tanda Registrasi) dan SIP (Surat Izin Praktik)"
                />
                <Card>
                    <p style={{ color: "#ef4444", fontSize: "16px" }}>{error}</p>
                </Card>
            </>
        );
    }

    return (
        <>
            <Topbar title="STR/SIP" />

            <MainHeaderSection
                title="STR/SIP"
                subtitle="Manajemen STR (Surat Tanda Registrasi) dan SIP (Surat Izin Praktik)"
            />

            <Card>
                <FilterBar
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Cari Pegawai, NIP, Nomor STR/SIP..."
                    filters={filters}
                />
                
            </Card>

            <div className={styles.statsRow}>
                <StatCard
                    icon={<FileText size={24} />}
                    value={summary.total}
                    label="Total STR/SIP"
                    variant="green"
                />
                <StatCard
                    icon={<CheckCircle size={24} />}
                    value={summary.aktif}
                    label="Aktif"
                    variant="blue"
                />
                <StatCard
                    icon={<AlertTriangle size={24} />}
                    value={summary.hampirHabis}
                    label="Hampir Habis"
                    variant="amber"
                />
                <StatCard
                    icon={<XCircle size={24} />}
                    value={summary.tidakAktif}
                    label="Tidak Aktif"
                    variant="red"
                />
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                rowKey={(row) => `${row.jenis}-${row.id}`}
                emptyMessage={`Tidak ada data ${filterJenis ? `"${filterJenis}"` : "STR/SIP"} 
                                yang ${filterStatus ? `statusnya "${filterStatus}"` : ""} 
                                .`}
                maxVisibleRows={5}
            />

            <PdfViewerModal
                isOpen={!!previewFile}
                onClose={() => setPreviewFile(null)}
                fileUrl={previewFile?.url || null}
                title={previewFile?.title || "Dokumen"}
                fileName={previewFile?.title || "Dokumen"}
            />
        </>
    );
};

export default StrSipTemplate;
