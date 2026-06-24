import { useState, useEffect, useCallback } from "react";
import {Info, Eye, EyeOff, RefreshCw } from "lucide-react";
import Topbar from "../../ui/organisms/Topbar/Topbar";
import MainHeaderSection from "../../ui/molecules/MainHeaderSection";
import Card from "../../ui/atoms/Card";
import Input from "../../ui/atoms/Input";
import Button from "../../ui/atoms/Button";
import Popup from "../../ui/molecules/Popup";
import { settingService } from "../../../services/settingService";
import type { WhatsappSettingData } from "../../../services/settingService";
import styles from "./Pengaturan.module.css";

const Pengaturan = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [waData, setWaData] = useState<WhatsappSettingData | null>(null);

    const [tokenInput, setTokenInput] = useState("");
    const [showToken, setShowToken] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await settingService.getWhatsappSetting();
            if (response.success && response.data) {
                setWaData(response.data);
                setTokenInput(response.data.whatsapp_token || "");
            } else {
                setError(response.message || "Gagal mengambil pengaturan.");
            }
        } catch (err: unknown) {
            const errorObj = err as { message?: string };
            setError(errorObj?.message || "Terjadi kesalahan saat mengambil pengaturan.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await settingService.updateWhatsappSetting(tokenInput);
            setPopupState({
                isOpen: true,
                variant: "checklist",
                title: "Berhasil",
                message: response.message || "Token WhatsApp berhasil diperbarui.",
            });
            // Refresh data to get updated device status
            await fetchSettings();
        } catch (err: unknown) {
            const errorObj = err as { message?: string };
            setPopupState({
                isOpen: true,
                variant: "error",
                title: "Gagal",
                message: errorObj?.message || "Gagal memperbarui token WhatsApp.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getConnectionStatus = () => {
        if (!waData || !waData.whatsapp_token) {
            return { label: "Belum Dikonfigurasi", type: "unconfigured" as const };
        }
        if (waData.device?.status) {
            return { label: "Terhubung", type: "connected" as const };
        }
        return { label: "Tidak Terhubung", type: "disconnected" as const };
    };

    const status = getConnectionStatus();


    if (isLoading) {
        return (
            <>
                <Topbar title="Pengaturan" />
                <MainHeaderSection
                    title="Pengaturan"
                    subtitle="Kelola pengaturan sistem aplikasi SIMPEG"
                />
                <Card>
                    <p className={styles.loadingState}>Memuat pengaturan...</p>
                </Card>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Topbar title="Pengaturan" />
                <MainHeaderSection
                    title="Pengaturan"
                    subtitle="Kelola pengaturan sistem aplikasi SIMPEG"
                />
                <Card>
                    <p className={styles.errorState}>{error}</p>
                </Card>
            </>
        );
    }

    return (
        <>
            <Topbar title="Pengaturan" />

            <MainHeaderSection
                title="Pengaturan"
                subtitle="Kelola pengaturan sistem aplikasi SIMPEG"
            />

            <div className={styles.settingsLayout}>
                {/* WhatsApp Configuration Card */}
                <Card>
                    <div className={styles.waCard}>
                        {/* Header */}
                        <div className={styles.waCardHeader}>
                            <div className={styles.waCardHeaderText}>
                                <h3 className={styles.waCardTitle}>Integrasi WhatsApp</h3>
                                <p className={styles.waCardSubtitle}>
                                    Konfigurasi API Fonnte untuk pengiriman reminder WhatsApp
                                </p>
                            </div>
                        </div>

                        {/* Connection Status */}
                        <div className={styles.statusRow}>
                            <div
                                className={`${styles.statusBadge} ${status.type === "connected"
                                    ? styles.statusConnected
                                    : status.type === "disconnected"
                                        ? styles.statusDisconnected
                                        : styles.statusUnconfigured
                                    }`}
                            >
                                <span
                                    className={`${styles.statusDot} ${status.type === "connected"
                                        ? styles.statusDotGreen
                                        : status.type === "disconnected"
                                            ? styles.statusDotRed
                                            : styles.statusDotYellow
                                        }`}
                                />
                                {status.label}
                            </div>
                        </div>
                        {status.type === "connected" && waData?.device && (
                            <span className={styles.deviceInfo}>
                                Nomor: {waData.device.device}
                            </span>
                        )}

                        {/* Token Input */}
                        <div className={styles.tokenForm}>
                            <div className={styles.tokenInputGroup}>
                                <div className={styles.tokenInputWrapper}>
                                    <Input
                                        label="API Token Fonnte"
                                        name="whatsapp_token"
                                        id="whatsapp-token"
                                        type={showToken ? "text" : "password"}
                                        placeholder="Masukkan token API Fonnte..."
                                        value={tokenInput}
                                        onChange={(e) => setTokenInput(e.target.value)}
                                        rightNode={
                                            <button
                                                type="button"
                                                onClick={() => setShowToken(!showToken)}
                                                className={styles.eyeBtn}
                                            >
                                                {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        }
                                    />
                                </div>
                                <div className={styles.tokenActions}>
                                    <Button
                                        label={isSaving ? "Menyimpan..." : "Simpan"}
                                        variant="primary"
                                        size="md"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                    />
                                    <Button
                                        icon={<RefreshCw size={16} />}
                                        variant="secondary"
                                        size="md"
                                        iconOnly
                                        onClick={fetchSettings}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            {status.type === "connected" && waData?.device && (
                                <span className={styles.expDate}>
                                    Kadaluarsa pada : {waData.device.expired}
                                </span>
                            )}
                            <p className={styles.helpText}>
                                Dapatkan API token dari{" "}
                                <a
                                    href="https://fonnte.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.helpLink}
                                >
                                    fonnte.com
                                </a>
                                . Token digunakan untuk mengirimkan reminder STR/SIP melalui WhatsApp.
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className={styles.infoBox}>
                            <Info size={18} className={styles.infoBoxIcon} />
                            <div className={styles.infoBoxContent}>
                                <h4 className={styles.infoBoxTitle}>Cara Konfigurasi</h4>
                                <p className={styles.infoBoxText}>
                                    1. Daftar atau login ke fonnte.com<br />
                                    2. Hubungkan nomor WhatsApp dengan scan QR code<br />
                                    3. Salin API Token dari dashboard Fonnte<br />
                                    4. Tempelkan token di form di atas dan klik Simpan
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <Popup
                isOpen={popupState.isOpen}
                onClose={() => setPopupState((prev) => ({ ...prev, isOpen: false }))}
                variant={popupState.variant}
                title={popupState.title}
                message={popupState.message}
                confirmLabel="Ok"
            />
        </>
    );
};

export default Pengaturan;
