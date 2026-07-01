import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FileText, CheckCircle, AlertTriangle, XCircle, Send } from "lucide-react";
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
import { useDebounce } from "../../../hooks/useDebounce";
import { getProxiedFileUrl } from "../../../utils/api";
import { getGlobalUser } from "../../../contexts/AuthContext";
import PdfViewerModal from "../../ui/molecules/PdfViewerModal";

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

const buildColumns = (
    onViewDocument: (docPath: string) => void,
    onSendNotification: (row: StrSipRecord) => void,
    isHrd: boolean
): Column<StrSipRecord>[] => {
    const cols: Column<StrSipRecord>[] = [
        {
            key: "nama",
            label: "Nama/NIP",
            width: "20%",
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
            width: "7%",
            render: (row) => {
                const { variant } = JENIS_BADGE_MAP[row.jenis];
                return <Badge variant={variant}>{row.jenis}</Badge>;
            },
        },
        {
            key: "nomor",
            label: "Nomor Dokumen",
            width: "25%",
            align: "center",
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
            render: (row) => row.status !== "aktif" && (
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
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");

    const [previewFile, setPreviewFile] = useState<{ url: string; title: string } | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const debouncedSearch = useDebounce(searchQuery, 500);

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

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, filterJenis, filterStatus, filterDateFrom, filterDateTo]);

    const { data: response, isLoading: queryIsLoading, error: queryError } = useQuery({
        queryKey: ["strSipData", currentPage, debouncedSearch, filterJenis, filterStatus, filterDateFrom, filterDateTo],
        queryFn: () => strSipService.getStrSipData({
            page: currentPage,
            per_page: ITEMS_PER_PAGE,
            search: debouncedSearch || undefined,
            jenis: filterJenis || undefined,
            status: filterStatus || undefined,
            tanggal_dari: filterDateFrom || undefined,
            tanggal_sampai: filterDateTo || undefined,
        }),
    });

    const isLoading = queryIsLoading;
    const error = queryError ? (queryError as any).message || "Terjadi kesalahan saat mengambil data STR/SIP." : null;

    const allData = useMemo(() => {
        if (!response?.success || !response?.data) return [];
        const rawList = response.data.items.data || [];
        return rawList.map(mapApiItemToStrSipRecord);
    }, [response]);

    const totalPages = response?.data?.items?.last_page || 1;
    const totalItems = response?.data?.items?.total || 0;

    const summary = useMemo(() => {
        const backendSummary = response?.data?.summary;
        return {
            total: backendSummary?.total ?? 0,
            aktif: backendSummary?.aktif ?? 0,
            hampirHabis: backendSummary?.hampir_habis ?? 0,
            tidakAktif: backendSummary?.tidak_aktif ?? 0,
        };
    }, [response]);

    const sendReminderMutation = useMutation({
        mutationFn: async (record: StrSipRecord) => {
            const tipeDokumen = record.jenis.toLowerCase() as "str" | "sip";
            return strSipService.sendReminderStrSip(
                record.pegawaiId,
                tipeDokumen,
                record.id
            );
        },
        onSuccess: (res, record) => {
            setConfirmNotify({ isOpen: false, record: null });
            setPopupState({
                isOpen: true,
                variant: "checklist",
                title: "Berhasil",
                message: res.message || `Reminder ${record.jenis} nomor ${record.nomor} berhasil dikirim ke ${record.nama}.`,
            });
        },
        onError: (err: any, record) => {
            setConfirmNotify({ isOpen: false, record: null });
            setPopupState({
                isOpen: true,
                variant: "error",
                title: "Gagal",
                message: err?.message || `Gagal mengirimkan reminder untuk ${record.nama}.`,
            });
        }
    });

    const isSending = sendReminderMutation.isPending;

    const handleOpenNotifyConfirm = useCallback((row: StrSipRecord) => {
        setConfirmNotify({
            isOpen: true,
            record: row,
        });
    }, []);

    const handleSendNotification = useCallback(async () => {
        if (!confirmNotify.record) return;
        sendReminderMutation.mutate(confirmNotify.record);
    }, [confirmNotify.record, sendReminderMutation]);

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
                <div className={styles.filterContainer}>
                    <FilterBar
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchPlaceholder="Cari Pegawai, NIP, Nomor STR/SIP..."
                        filters={filters}
                    />
                    <div className={styles.dateFilters}>
                        <div className={styles.dateInputGroup}>
                            <span className={styles.dateLabel}>Kadaluarsa Dari:</span>
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={filterDateFrom}
                                onChange={(e) => setFilterDateFrom(e.target.value)}
                            />
                        </div>
                        <div className={styles.dateInputGroup}>
                            <span className={styles.dateLabel}>Sampai:</span>
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={filterDateTo}
                                onChange={(e) => setFilterDateTo(e.target.value)}
                            />
                        </div>
                        {(filterDateFrom || filterDateTo) && (
                            <button
                                className={styles.clearDatesBtn}
                                onClick={() => {
                                    setFilterDateFrom("");
                                    setFilterDateTo("");
                                }}
                            >
                                Hapus Filter Tanggal
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            <div className={styles.statsRow}>
                <StatCard
                    icon={<FileText size={24} />}
                    value={summary.total}
                    label={`Total ${filterJenis || "STR/SIP"}`}
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
            <div>
                {(isLoading ? (
                    <div className={styles.centeredState}>
                        <div className={styles.spinner} />
                        <p className={styles.stateText}>Memuat data STR/SIP...</p>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={allData}
                        rowKey={(row) => `${row.jenis}-${row.id}`}
                        emptyMessage={`Tidak ada data ${filterJenis ? `"${filterJenis}"` : "STR/SIP"} yang ${filterStatus ? `berstatus "${STATUS_BADGE_MAP[filterStatus as StrSipStatus]?.label || filterStatus}"` : ""}.`}
                        maxVisibleRows={10}
                    />
                ))}
            </div>

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