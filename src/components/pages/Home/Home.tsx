import {
  CheckCircle2,
  Award,
  Clock,
  ClipboardList,
  CalendarDays,
} from "lucide-react";
import styles from "./Home.module.css";
import Topbar from "../../ui/organisms/Topbar/Topbar";
import MainHeaderSection from "../../ui/molecules/MainHeaderSection";
import Card from "../../ui/atoms/Card";
import StatCard from "../../ui/molecules/StatCard";
import CardHeader from "../../ui/molecules/CardHeader";
import ActionItem from "../../ui/molecules/ActionItem";
import ScheduleItem from "../../ui/molecules/ScheduleItem";
import DataField from "../../ui/molecules/DataField";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({ kelengkapan: "", diklatSelesai: 0, diklatMendatang: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatsData({
        kelengkapan: "85%",
        diklatSelesai: 5,
        diklatMendatang: 2
      });
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <>
      <Topbar title="Dashboard SIMPEG" />

      <div className={styles.container}>
        <MainHeaderSection title="Selamat Datang, Ahmad" subtitle="Berikut adalah ringkasan data kepegawaian Anda" />

        <div className={styles.statsRow}>
          <StatCard
            icon={<CheckCircle2 size={24} />}
            value={statsData.kelengkapan}
            label="Kelengkapan Data"
            variant="green"
            isLoading={isLoading}
            onClick={() => navigate('/profil')}
          />
          <StatCard
            icon={<Award size={24} />}
            value={statsData.diklatSelesai}
            label="Diklat Selesai"
            variant="teal"
            isLoading={isLoading}
            onClick={() => navigate('/data-diklat')}
          />
          <StatCard
            icon={<Clock size={24} />}
            value={statsData.diklatMendatang}
            label="Diklat Mendatang"
            variant="amber"
            isLoading={isLoading}
            onClick={() => navigate('/data-diklat')}
          />
        </div>

        <div className={styles.twoColSection}>
          <Card>
            <CardHeader icon={<ClipboardList size={18} />} title="Aksi yang Diperlukan" />
            <div className={styles.gap}>
              <ActionItem title="Lengkapi Data Keluarga" desc="Data keluarga belum lengkap" />
              <ActionItem title="Update STR" desc="STR akan habis dalam 90 hari" />
            </div>
          </Card>

          <Card>
            <CardHeader icon={<CalendarDays size={18} />} title="Jadwal Diklat Mendatang" />
            <div className={styles.gap}>
              <ScheduleItem title="ACLS Training" date="15 April 2026 - 17 April 2026" />
              <ScheduleItem title="Manajemen Keperawatan" date="20 April 2026 - 22 April 2026" />
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Informasi Profil" className={styles.profileHeaderAdjust} />
          <div className={styles.profileGrid}>
            <DataField label="NIP" value="198501012010011001" />
            <DataField label="Jabatan" value="Dokter Umum" />
            <DataField label="Unit Kerja" value="Poliklinik Umum" />
            <DataField label="Status Kepegawaian" value="PNS" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default Home;