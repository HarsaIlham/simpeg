import { Award, CircleCheckBig, Clock, FileText } from "lucide-react";
import MainHeaderSection from "../../../../ui/molecules/MainHeaderSection";
import StatCard from "../../../../ui/molecules/StatCard";
import Topbar from "../../../../ui/organisms/Topbar/Topbar";
import styles from "./DashboardAdmin.module.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import type { CardRequestData } from "./components/CardRequest/CardRequest";
import Card from "../../../../ui/atoms/Card";
import Modal from "../../../../ui/organisms/Modal";
import Button from "../../../../ui/atoms/Button";
import Textarea from "../../../../ui/atoms/Textarea";
import Badge from "../../../../ui/atoms/Badge";
import Popup from "../../../../ui/molecules/Popup";
import Tabs from "../../../../ui/molecules/Tabs";
import DataChangeCard from "../../../../ui/molecules/DataChangeCard";
import DataTable, { type Column } from "../../../../ui/organisms/DataTable";
import { formatRelativeDate } from "../../../../../utils/dateUtils";
import { changeRequestService } from "../../../../../services/changeRequestService";
import type { AdminChangeRequest, ChangeRequestDetail } from "../../../../../types/api";


const mapToCardRequestData = (item: AdminChangeRequest): CardRequestData => ({
  id: item.id,
  sender: item.by_user.nama,
  senderRole: item.by_user.role,
  fitur: item.fitur,
  status: item.status,
  note: item.note,
  jumlahDetail: item.jumlah_detail,
  tanggalPengajuan: item.created_at,
  nik: item.by_user.username,
});

const COLUMN_LABELS: Record<string, string> = {
  nama: "Nama",
  nip: "NIP",
  nik: "NIK",
  email: "Email",
  no_telp: "No. Telepon",
  tanggal_lahir: "Tanggal Lahir",
  jenis_kelamin: "Jenis Kelamin",
  agama: "Agama",
  status_kawin: "Status Kawin",
  alamat: "Alamat",
  profesi: "Profesi",
  jabatan_sekarang: "Jabatan",
  pangkat: "Pangkat",
  golongan_ruang: "Golongan/Ruang",
  unit_kerja: "Unit Kerja",
  jenis_pegawai: "Jenis Pegawai",
  tgl_masuk: "Tanggal Masuk",
  tmt_cpns: "TMT CPNS",
  tmt_pns: "TMT PNS",
  tmt_pangkat: "TMT Pangkat",
  pendidikan_terakhir: "Pendidikan Terakhir",
  status_pegawai: "Status Pegawai",
  no_kk: "No. KK",
};


const buildFieldList = (details: ChangeRequestDetail[], type: "old" | "new") =>
  details.map((d) => ({
    label: COLUMN_LABELS[d.kolom] || d.kolom,
    value: (type === "old" ? d.old_value : d.value) || "—",
  }));

const DashboardAdmin = () => {
  const [requestList, setRequestList] = useState<CardRequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState("semua");

  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<ChangeRequestDetail[]>([]);
  const [detailStatus, setDetailStatus] = useState<string>("");
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [actionNote, setActionNote] = useState("");
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);
  const [feedbackPopup, setFeedbackPopup] = useState<{
    isOpen: boolean; variant: "success" | "error"; title: string; message: string;
  }>({ isOpen: false, variant: "success", title: "", message: "" });

  const showFeedback = (variant: "success" | "error", title: string, message: string) => {
    setFeedbackPopup({ isOpen: true, variant, title, message });
  };

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await changeRequestService.getAll();
      if (response.success && response.data) {
        setRequestList(response.data.map(mapToCardRequestData));
      } else {
        setError(response.message || "Gagal mengambil data pengajuan.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Terjadi kesalahan saat mengambil data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const pendingCount = requestList.filter(r => r.status === "pending").length;
  const approvedCount = requestList.filter(r => r.status === "approved").length;
  const rejectedCount = requestList.filter(r => r.status === "rejected").length;

  const filteredList = useMemo(() => {
    if (activeFilter === "semua") return requestList;
    return requestList.filter(r => r.status === activeFilter);
  }, [requestList, activeFilter]);

  const handleTinjau = async (id: number) => {
    setSelectedRequestId(id);
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    setDetailData([]);
    try {
      const response = await changeRequestService.getDetail(id);
      if (response.success && response.data) {
        setDetailData(response.data.details);
        setDetailStatus(response.data.status);
      } else {
        showFeedback("error", "Gagal", "Gagal mengambil detail pengajuan.");
        setIsDetailOpen(false);
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      showFeedback("error", "Gagal", errorObj?.message || "Terjadi kesalahan.");
      setIsDetailOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedRequestId(null);
    setDetailData([]);
    setActionNote("");
    setIsRejectMode(false);
  };

  const handleAction = async (type: "accept" | "reject") => {
    if (!selectedRequestId) return;
    setIsActionSubmitting(true);
    try {
      if (type === "accept") {
        await changeRequestService.accept(selectedRequestId, actionNote || undefined);
        showFeedback("success", "Disetujui", "Pengajuan perubahan data berhasil disetujui.");
      } else {
        await changeRequestService.reject(selectedRequestId, actionNote || undefined);
        showFeedback("success", "Ditolak", "Pengajuan perubahan data berhasil ditolak.");
      }
      handleCloseDetail();
      await fetchRequests();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      showFeedback("error", "Gagal", errorObj?.message || "Terjadi kesalahan saat memproses pengajuan.");
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const filterTabs = [
    { id: "semua", label: `Semua (${requestList.length})` },
    { id: "pending", label: `Menunggu (${pendingCount})` },
    { id: "approved", label: `Disetujui (${approvedCount})` },
    { id: "rejected", label: `Ditolak (${rejectedCount})` },
  ];

  const columns = useMemo<Column<CardRequestData>[]>(() => [
    {
      key: "pegawai",
      label: "Pegawai",
      width: "25%",
      render: (row) => (
        <div>
          <strong style={{ fontWeight: 600, color: "var(--color-text)" }}>{row.sender}</strong>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "12px", textTransform: "capitalize" }}>
            {row.senderRole}
          </div>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "12px", textTransform: "capitalize" }}>
            {row.nik ? `NIK : ${row.nik}` : ""}
          </div>
        </div>
      ),
    },
    {
      key: "jenis",
      label: "Jenis",
      width: "20%",
      render: (row) => <Badge variant="info">{row.fitur}</Badge>,
    },
    {
      key: "deskripsi",
      label: "Deskripsi",
      width: "15%",
      render: (row) => <span>{row.note}</span>,
    },
    {
      key: "tanggalPengajuan",
      label: "Tanggal Pengajuan",
      width: "20%",
      render: (row) => <span>{formatRelativeDate(row.tanggalPengajuan)}</span>,
    },
    {
      key: "status",
      label: "Status",
      width: "10%",
      render: (row) => {
        const config =
          row.status === "approved"
            ? { label: "Disetujui", variant: "success" as const }
            : row.status === "rejected"
              ? { label: "Ditolak", variant: "danger" as const }
              : { label: "Menunggu", variant: "warning" as const };
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "aksi",
      label: "Aksi",
      width: "10%",
      align: "center",
      render: (row) => (
        <Button
          label="Detail"
          variant="primary"
          size="sm"
          onClick={() => handleTinjau(row.id)}
        />
      ),
    },
  ], []);

  return (
    <>
      <Topbar title="Dashboard Admin" />
      <MainHeaderSection
        title="Selamat Datang, Admin"
        subtitle="Kelola sistem dan persetujuan perubahan data"
      />

      <div className={styles.statsRow}>
        <StatCard icon={<Clock size={24} />} value={pendingCount} label="Menunggu Persetujuan" variant="amber" />
        <StatCard icon={<CircleCheckBig size={24} />} value={approvedCount} label="Disetujui" variant="teal" />
        <StatCard icon={<FileText size={24} />} value={rejectedCount} label="Ditolak" variant="blue" />
        <StatCard icon={<Award size={24} />} value={requestList.length} label="Total Pengajuan" variant="purple" />
      </div>

      <div className={styles.filterContainer}>
        <Card>
          <Tabs tabs={filterTabs} activeTab={activeFilter} onChange={setActiveFilter} />
        </Card>
      </div>


      {isLoading ? (
        <p className={styles.loadingState}>
          Memuat data pengajuan...
        </p>
      ) : error ? (
        <p className={styles.errorState}>
          {error}
        </p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredList}
          rowKey={(row) => row.id}
          emptyMessage="Belum ada pengajuan perubahan data."
          maxVisibleRows={10}
        />
      )}

      {isDetailOpen && (
        <Modal
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          title="Detail Perubahan Data"
        >
          {isDetailLoading ? (
            <p className={styles.loadingState}>
              Memuat detail...
            </p>
          ) : (
            <div className={styles.detailModal}>
              <div className={styles.badgeContainer}>
                <Badge variant={detailStatus === "pending" ? "warning" : detailStatus === "approved" ? "success" : "danger"}>
                  {detailStatus === "pending" ? "Menunggu" : detailStatus === "approved" ? "Disetujui" : "Ditolak"}
                </Badge>
              </div>

              <div className={styles.detailCards}>
                <DataChangeCard
                  variant="old"
                  title="Data Lama"
                  fields={buildFieldList(detailData, "old")}
                />
                <DataChangeCard
                  variant="new"
                  title="Data Baru"
                  fields={buildFieldList(detailData, "new")}
                />
              </div>

              {detailStatus === "pending" && (
                <>
                  {isRejectMode && (
                    <Textarea
                      id="action-note"
                      name="action-note"
                      label="Catatan Penolakan"
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      rows={4}
                      placeholder="Masukkan alasan penolakan..."
                      required
                    />
                  )}
                  <div className={styles.actionButtons}>
                    {!isRejectMode ? (
                      <>
                        <Button
                          label={isActionSubmitting ? "Memproses..." : "Setujui"}
                          variant="primary"
                          onClick={() => handleAction("accept")}
                          disabled={isActionSubmitting}
                        />
                        <Button
                          label="Tolak"
                          variant="danger"
                          onClick={() => setIsRejectMode(true)}
                          disabled={isActionSubmitting}
                        />
                      </>
                    ) : (
                      <>
                        <Button
                          label={isActionSubmitting ? "Memproses..." : "Tolak Pengajuan"}
                          variant="danger"
                          onClick={() => handleAction("reject")}
                          disabled={isActionSubmitting}
                        />
                        <Button
                          label="Batal"
                          variant="secondary"
                          onClick={() => {
                            setIsRejectMode(false);
                            setActionNote("");
                          }}
                          disabled={isActionSubmitting}
                        />
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </Modal>
      )}

      <Popup
        isOpen={feedbackPopup.isOpen}
        onClose={() => setFeedbackPopup(prev => ({ ...prev, isOpen: false }))}
        variant={feedbackPopup.variant}
        title={feedbackPopup.title}
        message={feedbackPopup.message}
        confirmLabel="OK"
      />
    </>
  );
};

export default DashboardAdmin;
