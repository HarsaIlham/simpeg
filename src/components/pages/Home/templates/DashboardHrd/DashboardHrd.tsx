import { GraduationCap, Stethoscope, Users } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import MainHeaderSection from "../../../../ui/molecules/MainHeaderSection";
import Topbar from "../../../../ui/organisms/Topbar/Topbar";
import Card from "../../../../ui/atoms/Card";
import Tabs from "../../../../ui/molecules/Tabs";
import TabPegawai from "./TabPegawai";
import TabDiklatAsn from "./TabDiklatAsn";
import TabDiklatNakes from "./TabDiklatNakes";
import { dashboardService } from "../../../../../services/dashboardService";
import type { DashboardHrdDashboard } from "../../../../../types/api";
import styles from "./DashboardHrd.module.css";
import { getGlobalUser } from "../../../../../contexts/AuthContext";

const TAB_ITEMS = [
    { id: "pegawai", label: "Pegawai", icon: <Users size={16} /> },
    { id: "diklat-asn", label: "Diklat ASN", icon: <GraduationCap size={16} /> },
    { id: "diklat-tenaga-kesehatan", label: "Diklat Tenaga Kesehatan", icon: <Stethoscope size={16} /> },
];

const DashboardHrd = () => {
    const user = getGlobalUser();
    const role = user?.role;
    const [activeTab, setActiveTab] = useState("pegawai");
    const [dashboard, setDashboard] = useState<DashboardHrdDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await dashboardService.getHrdDashboard();
            if (res.success && res.data) {
                setDashboard(res.data.dashboard);
            } else {
                setError(res.message || "Gagal mengambil data dashboard.");
            }
        } catch (err: unknown) {
            const errorObj = err as { message?: string };
            setError(errorObj?.message || "Terjadi kesalahan.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const renderTabContent = () => {
        if (error) {
            return (
                <Card className={styles.paddingCard}>
                    <p style={{ padding: "24px", textAlign: "center", color: "#9ca3af" }}>{error}</p>
                </Card>
            );
        }

        switch (activeTab) {
            case "pegawai":
                return <TabPegawai data={dashboard?.pegawai ?? null} isLoading={isLoading} />;
            case "diklat-asn":
                return <TabDiklatAsn data={dashboard?.diklat_asn ?? null} isLoading={isLoading} />;
            case "diklat-tenaga-kesehatan":
                return <TabDiklatNakes data={dashboard?.diklat_tenkes ?? null} isLoading={isLoading} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Topbar title={`Dashboard ${role === "hrd" ? "HRD" : "Direktur"}`} />
            <MainHeaderSection
                title={`Dashboard ${role === "hrd" ? "HRD" : "Direktur"}`}
                subtitle="Sistem Informasi Kepegawaian RS Kalisat"
            />

            <Card padding="xs" className={styles.paddingCard}>
                <Tabs tabs={TAB_ITEMS} activeTab={activeTab} onChange={setActiveTab} />
            </Card>

            {renderTabContent()}
        </>
    );
};

export default DashboardHrd;
