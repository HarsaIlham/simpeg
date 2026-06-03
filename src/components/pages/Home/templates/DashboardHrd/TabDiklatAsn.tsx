import { CheckCircle, Users } from "lucide-react";
import StatCard from "../../../../ui/molecules/StatCard";
import BarChartWidget from "../../../../ui/molecules/BarChartWidget";
import PieChartWidget from "../../../../ui/molecules/PieChartWidget";
import type { DashboardHrdDiklat, ChartDataItem } from "../../../../../types/api";
import styles from "./DashboardHrd.module.css";

const toChartData = (record: Record<string, number>): ChartDataItem[] =>
    Object.entries(record).map(([label, value]) => ({ label, value }));

interface TabDiklatAsnProps {
    data: DashboardHrdDiklat | null;
    isLoading: boolean;
}

const TabDiklatAsn = ({ data, isLoading }: TabDiklatAsnProps) => {
    const belumSudah: ChartDataItem[] = data
        ? [
            { label: "Sudah Ikut", value: data.pegawai_sudah_ikut },
            { label: "Belum Ikut", value: data.pegawai_belum_ikut },
        ]
        : [];

    return (
        <>
            <div className={styles.statsRow}>
                <StatCard
                    value={data?.total_diklat ?? 0}
                    label="Total Diklat ASN"
                    icon={<Users size={24} />}
                    variant="green"
                    isLoading={isLoading}
                />
                <StatCard
                    value={data?.selesai ?? 0}
                    label="Selesai"
                    icon={<CheckCircle size={24} />}
                    variant="blue"
                    isLoading={isLoading}
                />
            </div>

            <div className={styles.chartsGrid}>
                <PieChartWidget
                    title="Belum/Sudah Diklat"
                    data={belumSudah}
                    isLoading={isLoading}
                />
                <BarChartWidget
                    title="Kategori Diklat ASN"
                    data={data ? toChartData(data.diklat_per_kategori) : []}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
};

export default TabDiklatAsn;
