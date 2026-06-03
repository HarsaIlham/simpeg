import {
  CheckCircle2,
  Award,
  Clock,
  ClipboardList,
  CalendarDays,
} from "lucide-react";
import styles from "./DashboardPegawai.module.css";
import Topbar from "../../../ui/organisms/Topbar/Topbar";
import MainHeaderSection from "../../../ui/molecules/MainHeaderSection";
import Card from "../../../ui/atoms/Card";
import StatCard from "../../../ui/molecules/StatCard";
import CardHeader from "../../../ui/molecules/CardHeader";
import ActionItem from "../../../ui/molecules/ActionItem";
import ScheduleItem from "../../../ui/molecules/ScheduleItem";
import DataField from "../../../ui/molecules/DataField";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { dashboardService } from "../../../../services/dashboardService";
import type { DashboardPegawaiData, Notifikasi } from "../../../../types/api";

const DashboardPegawai = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState<DashboardPegawaiData | null>(null);
  const [notifications, setNotifications] = useState<Notifikasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardService.getDashboard();
        if (response.success && response.data) {
          setDashboard(response.data.dashboard);
          setNotifications(response.data.dashboard.list_notifikasi ?? []);
        }
      } catch (err: any) {
        console.error("Gagal memuat dashboard:", err);
        setError(err.message ?? "Gagal memuat data dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatDateRange = (start: string, end: string) => {
    const fmt = (d: string) =>
      new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    return `${fmt(start)} - ${fmt(end)}`;
  };

  return (
    <>
      <Topbar title="Dashboard SIMPEG" notifications={notifications} />

      <div className={styles.container}>
        <MainHeaderSection
          title={`Selamat Datang, ${dashboard?.nama ?? user?.nama ?? "Pegawai"}`}
          subtitle="Berikut adalah ringkasan data kepegawaian Anda"
        />

        {error && (
          <div style={{
            padding: "12px 16px",
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "16px",
          }}>
            {error}
          </div>
        )}

        <div className={styles.statsRow}>
          <StatCard
            icon={<CheckCircle2 size={24} />}
            value={
              dashboard
                ? (dashboard.list_aksi && dashboard.list_aksi.length === 0)
                  ? "Lengkap"
                  : "Belum Lengkap"
                : undefined
            }
            label="Kelengkapan Data"
            variant="green"
            isLoading={isLoading}
            onClick={() => navigate("/profil")}
          />
          <StatCard
            icon={<Award size={24} />}
            value={dashboard?.jumlah_diklat_selesai}
            label="Diklat Selesai"
            variant="teal"
            isLoading={isLoading}
            onClick={() => navigate("/data-diklat?status=selesai")}
          />
          <StatCard
            icon={<Clock size={24} />}
            value={dashboard?.list_jadwal_diklat_mendatang.length}
            label="Diklat Mendatang"
            variant="amber"
            isLoading={isLoading}
            onClick={() => navigate("/data-diklat?status=mendatang")}
          />
        </div>

        <div className={styles.twoColSection}>
          <Card>
            <CardHeader
              icon={<ClipboardList size={18} />}
              title="Aksi yang Diperlukan"
            />
            <div className={styles.gap}>
              {isLoading ? (
                <span style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
                  Memuat...
                </span>
              ) : (
                <>
                  {dashboard?.list_aksi && dashboard.list_aksi.length > 0 ? (
                    dashboard.list_aksi.map((aksi) => {
                      const desc = aksi.action_payload?.keterangan?.join(", ") || aksi.message;
                      return (
                        <ActionItem 
                          key={aksi.id} 
                          title={aksi.title} 
                          desc={desc} 
                        />
                      );
                    })
                  ) : (
                    <span style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
                      Tidak ada aksi yang diperlukan
                    </span>
                  )}
                </>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader
              icon={<CalendarDays size={18} />}
              title="Jadwal Diklat Mendatang"
            />
            <div className={styles.gap}>
              {isLoading ? (
                <span style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
                  Memuat...
                </span>
              ) : dashboard?.list_jadwal_diklat_mendatang?.length ? (
                dashboard.list_jadwal_diklat_mendatang.map((jadwal) => (
                  <ScheduleItem
                    key={jadwal.jadwal_id}
                    title={jadwal.nama_kegiatan}
                    date={formatDateRange(jadwal.tanggal_mulai, jadwal.tanggal_selesai)}
                  />
                ))
              ) : (
                <span style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
                  Tidak ada jadwal diklat mendatang
                </span>
              )}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Informasi Profil"
            className={styles.profileHeaderAdjust}
          />
          <div className={styles.profileGrid}>
            <DataField label="NIP" value={dashboard?.nip ?? "-"} />
            <DataField label="Jabatan" value={dashboard?.jabatan ?? "-"} />
            <DataField label="Unit Kerja" value={dashboard?.unit_kerja ?? "-"} />
            <DataField label="Status Kepegawaian" value={dashboard?.jenis_jabatan ?? "-"} />
          </div>
        </Card>
      </div>
    </>
  );
};

export default DashboardPegawai;
