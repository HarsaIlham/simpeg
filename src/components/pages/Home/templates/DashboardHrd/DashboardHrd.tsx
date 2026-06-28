import { GraduationCap, Stethoscope, Users } from "lucide-react";
import { useState } from "react";
import MainHeaderSection from "../../../../ui/molecules/MainHeaderSection";
import Topbar from "../../../../ui/organisms/Topbar/Topbar";
import Card from "../../../../ui/atoms/Card";
import Tabs from "../../../../ui/molecules/Tabs";
import TabPegawai from "./TabPegawai";
import TabDiklatAsn from "./TabDiklatAsn";
import TabDiklatNakes from "./TabDiklatNakes";
import { dashboardService } from "../../../../../services/dashboardService";
import styles from "./DashboardHrd.module.css";
import { getGlobalUser } from "../../../../../contexts/AuthContext";

import { useQuery } from "@tanstack/react-query";

const TAB_ITEMS = [
    { id: "pegawai", label: "Pegawai", icon: <Users size={16} /> },
    { id: "diklat-asn", label: "Diklat ASN", icon: <GraduationCap size={16} /> },
    { id: "diklat-tenaga-kesehatan", label: "Diklat Tenaga Kesehatan", icon: <Stethoscope size={16} /> },
];

const DashboardHrd = () => {
    const user = getGlobalUser();
    const role = user?.role;
    const [activeTab, setActiveTab] = useState("pegawai");

    const { data: response, isLoading: queryIsLoading, error: queryError } = useQuery({
        queryKey: ["dashboardHrd"],
        queryFn: () => dashboardService.getHrdDashboard(),
    });

    const dashboard = response?.success ? response.data?.dashboard : null;
    const isLoading = queryIsLoading;
    const error = queryError ? (queryError as any).message || "Gagal mengambil data dashboard." : null;

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
