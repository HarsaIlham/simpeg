import { useState, useMemo, useCallback, useEffect } from "react";
import { FileText, CheckCircle, AlertTriangle, XCircle, Bell, Send } from "lucide-react";
import Topbar from "../../ui/organisms/Topbar/Topbar";
import MainHeaderSection from "../../ui/molecules/MainHeaderSection";
import FilterBar from "../../ui/molecules/FilterBar";
import StatCard from "../../ui/molecules/StatCard";
import DataTable from "../../ui/organisms/DataTable";
import Badge from "../../ui/atoms/Badge";
import Card from "../../ui/atoms/Card";
import Button from "../../ui/atoms/Button";
import Popup from "../../ui/molecules/Popup";
import Pagination from "../../ui/molecules/Pagination";
import type { StrSipRecord, StrSipJenis, StrSipStatus } from "../../../types/api";
import type { Column } from "../../ui/organisms/DataTable";
import styles from "./StrSip.module.css";
import { strSipService } from "../../../services/strSipService";
import { getProxiedFileUrl } from "../../../utils/api";
import PdfViewerModal from "../../ui/molecules/PdfViewerModal";
import { getGlobalUser } from "../../../contexts/AuthContext";

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
    { value: "", label: "Semua Tipe" },
    { value: "STR", label: "STR" },
    { value: "SIP", label: "SIP" },
];

const STATUS_OPTIONS = [
    { value: "", label: "Semua Status" },
    { value: "aktif", label: "Aktif" },
    { value: "hampir_habis", label: "Hampir Habis" },
    { value: "tidak_aktif", label: "Tidak Aktif" },
];

const ITEMS_PER_PAGE = 10;

const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
};

const matchesSearch = (record: StrSipRecord, query: string) => {
    const q = query.toLowerCase();
    return (
        record.nama.toLowerCase().includes(q) ||
        record.nip.toLowerCase().includes(q) ||
        record.nomor.toLowerCase().includes(q) ||
        record.profesi.toLowerCase().includes(q)
    );
};

const buildColumns = (
    onViewDocument: (docPath: string) => void,
    onSendNotification: (row: StrSipRecord) => void,
    isHrd: boolean
): Column<StrSipRecord>[] => {
    const cols: Column<StrSipRecord>[] = [
        {
            key: "nama",
            label: "Nama/NIP",
            width: "25%",
            render: (row) => (
                <div className={styles.nameCell}>
                    <span className={styles.nameText}>{row.nama}</span>
                    <span className={styles.nipText}>NIP. {row.nip}</span>
                    <span className={styles.profesiText}>{row.profesi}</span>
                </div>
            ),
        },
        {
            key: "jenis",
            label: "Tipe",
            width: "8%",
            render: (row) => {
                const { variant } = JENIS_BADGE_MAP[row.jenis];
                return <Badge variant={variant}>{row.jenis}</Badge>;
            },
        },
        {
            key: "nomor",
            label: "Nomor Dokumen",
            width: "15%",
            align: "left",
            render: (row) => <span>{row.nomor}</span>,
        },
        {
            key: "dokumen",
            label: "Dokumen",
            width: "12%",
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
            width: "13%",
            render: (row) => formatDate(row.tanggalTerbit),
        },
        {
            key: "tanggalHabis",
            label: "Tanggal Habis",
            width: "13%",
            render: (row) => formatDate(row.tanggalHabis),
        },
        {
            key: "status",
            label: "Status",
            width: "10%",
            render: (row) => {
                const { label, variant } = STATUS_BADGE_MAP[row.status];
                return <Badge variant={variant}>{label}</Badge>;
            },
        },
    ];

    if (isHrd) {
        cols.push({
            key: "ingatkan",
            label: "Ingatkan",
            width: "11%",
            render: (row) => (
                <Button
                    icon={<Send size={14} />}
                    size="sm"
                    variant="info"
                    onClick={() => onSendNotification(row)}
                />
            ),
        });
    }

    return cols;
};

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
        pegawaiId: item.pegawai_id,
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

const StrSip = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterJenis, setFilterJenis] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const [allData, setAllData] = useState<StrSipRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<{ url: string; title: string } | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [summary, setSummary] = useState({
        total: 0,
        aktif: 0,
        hampirHabis: 0,
        tidakAktif: 0,
    });

    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [confirmNotify, setConfirmNotify] = useState<{
        isOpen: boolean;
        record: StrSipRecord | null;
    }>({
        isOpen: false,
        record: null,
    });

    const [popupState, setPopupState] = useState<{
        isOpen: boolean;
        variant: "success" | "error" | "warning" | "info" | "checklist";
        title: string;
        message: string;
    }>({
        isOpen: false,
        variant: "success",
        title: "",
        message: "",
    });

    const [isSending, setIsSending] = useState(false);

    const handleOpenNotifyConfirm = useCallback((row: StrSipRecord) => {
        setConfirmNotify({
            isOpen: true,
            record: row,
        });
    }, []);

    const handleSendNotification = useCallback(async () => {
        if (!confirmNotify.record) return;
        const record = confirmNotify.record;
        const tipeDokumen = record.jenis.toLowerCase() as "str" | "sip";
        setIsSending(true);
        try {
            const response = await strSipService.sendReminderStrSip(
                record.pegawaiId,
                tipeDokumen,
                record.id
            );
            setConfirmNotify({ isOpen: false, record: null });
            setPopupState({
                isOpen: true,
                variant: "checklist",
                title: "Berhasil",
                message: response.message || `Reminder ${record.jenis} nomor ${record.nomor} berhasil dikirim ke ${record.nama}.`,
            });
        } catch (err: unknown) {
            const errorObj = err as { message?: string };
            setConfirmNotify({ isOpen: false, record: null });
            setPopupState({
                isOpen: true,
                variant: "error",
                title: "Gagal",
                message: errorObj?.message || `Gagal mengirimkan reminder untuk ${record.nama}.`,
            });
        } finally {
            setIsSending(false);
        }
    }, [confirmNotify.record]);

    const fetchStrSipData = useCallback(async (page: number, search: string, jenis: string, status: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await strSipService.getStrSipData({
                page,
                per_page: ITEMS_PER_PAGE,
                search: search || undefined,
                jenis: jenis || undefined,
                status: status || undefined,
            });
            if (response.success && response.data) {
                const paginatedItems = response.data.items;
                const rawList = paginatedItems.data || [];
                const mappedRecords = rawList.map(mapApiItemToStrSipRecord);
                setAllData(mappedRecords);

                setCurrentPage(paginatedItems.current_page || 1);
                setTotalPages(paginatedItems.last_page || 1);
                setTotalItems(paginatedItems.total || 0);

                const backendSummary = response.data.summary;
                if (backendSummary) {
                    setSummary({
                        total: backendSummary.total ?? 0,
                        aktif: backendSummary.aktif ?? 0,
                        hampirHabis: backendSummary.hampir_habis ?? 0,
                        tidakAktif: backendSummary.tidak_aktif ?? 0,
                    });
                }
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

    // Debounce search query input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Reset to page 1 when filter options change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterJenis, filterStatus]);

    // Trigger fetch when dependency states change
    useEffect(() => {
        fetchStrSipData(currentPage, debouncedSearch, filterJenis, filterStatus);
    }, [currentPage, debouncedSearch, filterJenis, filterStatus, fetchStrSipData]);

    const handleViewDocument = useCallback((docPath: string) => {
        if (!docPath) return;
        setPreviewFile({ url: getProxiedFileUrl(docPath), title: "Dokumen STR/SIP" });
    }, []);

    const user = getGlobalUser();
    const isHrd = user?.role === "hrd";

    const columns = useMemo(
        () => buildColumns(handleViewDocument, handleOpenNotifyConfirm, isHrd),
        [handleViewDocument, handleOpenNotifyConfirm, isHrd]
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
                data={allData}
                rowKey={(row) => `${row.jenis}-${row.id}`}
                emptyMessage={`Tidak ada data ${filterJenis ? `"${filterJenis}"` : "STR/SIP"} yang ${filterStatus ? `statusnya "${filterStatus}"` : ""}.`}
                maxVisibleRows={10}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={(page) => setCurrentPage(page)}
                itemName="STR/SIP"
            />

            <PdfViewerModal
                isOpen={!!previewFile}
                onClose={() => setPreviewFile(null)}
                fileUrl={previewFile?.url || null}
                title={previewFile?.title || "Dokumen"}
                fileName={previewFile?.title || "Dokumen"}
            />

            <Popup
                isOpen={confirmNotify.isOpen}
                onClose={() => setConfirmNotify({ isOpen: false, record: null })}
                variant="warning"
                title="Kirim Pengingat WhatsApp"
                message={`Kirim pengingat masa berlaku dokumen ${confirmNotify.record?.jenis} nomor ${confirmNotify.record?.nomor} ke ${confirmNotify.record?.nama} melalui WhatsApp?`}
                confirmLabel="Kirim"
                cancelLabel="Batal"
                onConfirm={handleSendNotification}
                onCancel={() => setConfirmNotify({ isOpen: false, record: null })}
                isLoading={isSending}
            />

            <Popup
                isOpen={popupState.isOpen}
                onClose={() => setPopupState(prev => ({ ...prev, isOpen: false }))}
                variant={popupState.variant}
                title={popupState.title}
                message={popupState.message}
                confirmLabel="Ok"
            />
        </>
    );
};

export default StrSip;