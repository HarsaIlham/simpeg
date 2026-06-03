import { CheckCircle, CircleAlert, Users } from "lucide-react";
import StatCard from "../../../../ui/molecules/StatCard";
import BarChartWidget from "../../../../ui/molecules/BarChartWidget";
import PieChartWidget from "../../../../ui/molecules/PieChartWidget";
import type { DashboardHrdPegawai, ChartDataItem } from "../../../../../types/api";
import styles from "./DashboardHrd.module.css";

const toChartData = (record: Record<string, number>): ChartDataItem[] =>
    Object.entries(record).map(([label, value]) => ({ label, value }));

interface TabPegawaiProps {
    data: DashboardHrdPegawai | null;
    isLoading: boolean;
}

const TabPegawai = ({ data, isLoading }: TabPegawaiProps) => {
    return (
        <>
            <div className={styles.statsRow}>
                <StatCard
                    value={data?.total_pegawai ?? 0}
                    label="Total Pegawai"
                    icon={<Users size={24} />}
                    variant="green"
                    isLoading={isLoading}
                />
                <StatCard
                    value={data?.total_pegawai_kurang_lengkap ?? 0}
                    label="Belum Lengkap"
                    icon={<CircleAlert size={24} />}
                    variant="amber"
                    isLoading={isLoading}
                />
                <StatCard
                    value={data?.total_pegawai_lengkap ?? 0}
                    label="Data Lengkap"
                    icon={<CheckCircle size={24} />}
                    variant="green"
                    isLoading={isLoading}
                />
            </div>

            <div className={styles.chartsGrid}>
                <BarChartWidget
                    title="Jenis Pegawai"
                    data={data ? toChartData(data.jenis_pegawai) : []}
                    isLoading={isLoading}
                />
                <BarChartWidget
                    title="Profesi Pegawai"
                    data={data ? toChartData(data.profesi) : []}
                    isLoading={isLoading}
                />
                <PieChartWidget
                    title="Tingkat Pendidikan"
                    data={data ? toChartData(data.tingkat_pendidikan) : []}
                    isLoading={isLoading}
                />
                <BarChartWidget
                    title="Tahun Masuk (5 Tahun Terakhir)"
                    data={data ? toChartData(data.tahun_masuk_5_tahun_terakhir) : []}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
};

export default TabPegawai;
