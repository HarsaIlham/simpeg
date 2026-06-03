import { useState } from "react";
import { Plus, Award, Briefcase, ClipboardList, FileText, GraduationCap } from "lucide-react";

import Button from "../../../../ui/atoms/Button";
import Card from "../../../../ui/atoms/Card";
import Tabs from "../../../../ui/molecules/Tabs";
import Modal from "../../../../ui/organisms/Modal";
import Popup from "../../../../ui/molecules/Popup";

import CardPendidikan from "../../../../ui/organisms/CardPendidikan";
import type { CardPendidikanData } from "../../../../ui/organisms/CardPendidikan/CardPendidikan";
import CardJabatan from "../../../../ui/organisms/CardJabatan";
import type { CardJabatanData } from "../../../../ui/organisms/CardJabatan/CardJabatan";
import CardPangkat from "../../../../ui/organisms/CardPangkat";
import type { CardPangkatData } from "../../../../ui/organisms/CardPangkat/CardPangkat";
import CardStr from "../../../../ui/organisms/CardStr";
import type { CardStrData } from "../../../../ui/organisms/CardStr/CardStr";
import CardSip from "../../../../ui/organisms/CardSip";
import type { CardSipData } from "../../../../ui/organisms/CardSip/CardSip";
import CardPenugasanKlinis from "../../../../ui/organisms/CardPenugasanKlinis";
import type { CardPenugasanKlinisData } from "../../../../ui/organisms/CardPenugasanKlinis/CardPenugasanKlinis";

import FormPendidikan from "../../../../ui/organisms/FormPendidikan";
import FormJabatan from "../../../../ui/organisms/FormJabatan";
import FormPangkat from "../../../../ui/organisms/FormPangkat";
import FormStrsip from "../../../../ui/organisms/FormStrsip";
import FormPenugasanKlinis from "../../../../ui/organisms/FormPenugasanKlinis";

import { pendidikanService } from "../../../../../services/pendidikanService";
import { jabatanService } from "../../../../../services/jabatanService";
import { pangkatService } from "../../../../../services/pangkatService";
import { strService } from "../../../../../services/strService";
import { sipService } from "../../../../../services/sipService";
import { penugasanKlinisService } from "../../../../../services/penugasanKlinisService";

import styles from "../DetailPegawai.module.css";

/* ─── Tab items ─── */

const TAB_ITEMS = [
    { id: "pendidikan", label: "Pendidikan", icon: <GraduationCap size={16} /> },
    { id: "jabatan", label: "Jabatan", icon: <Briefcase size={16} /> },
    { id: "pangkat", label: "Pangkat", icon: <Award size={16} /> },
    { id: "str-sip", label: "STR/SIP", icon: <FileText size={16} /> },
    { id: "penugasan", label: "Penugasan Klinis", icon: <ClipboardList size={16} /> },
];

/* ─── Types ─── */

interface TabRiwayatProps {
    jabatanList: CardJabatanData[];
    strList: CardStrData[];
    sipList: CardSipData[];
    penugasanList: CardPenugasanKlinisData[];
    pendidikanList: CardPendidikanData[];
    pangkatList?: CardPangkatData[];
    isAdmin?: boolean;
    onRefresh?: () => void;
    isLoadingJabatan?: boolean;
    isLoadingStr?: boolean;
    isLoadingSip?: boolean;
    isLoadingPenugasan?: boolean;
    isLoadingPendidikan?: boolean;
    isLoadingPangkat?: boolean;
    errorJabatan?: string | null;
    errorStr?: string | null;
    errorSip?: string | null;
    errorPenugasan?: string | null;
    errorPendidikan?: string | null;
    errorPangkat?: string | null;
}

interface FeedbackState {
    isOpen: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
}

/* ─── Component ─── */

const TabRiwayat = ({
    jabatanList,
    strList,
    sipList,
    penugasanList,
    pendidikanList,
    pangkatList = [],
    isAdmin = false,
    onRefresh,
    isLoadingJabatan,
    isLoadingStr,
    isLoadingSip,
    isLoadingPenugasan,
    isLoadingPendidikan,
    isLoadingPangkat,
    errorJabatan,
    errorStr,
    errorSip,
    errorPenugasan,
    errorPendidikan,
    errorPangkat,
}: TabRiwayatProps) => {
    const [activeTab, setActiveTab] = useState("pendidikan");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string[]> | undefined>(undefined);
    const [strsipType, setStrsipType] = useState<"" | "STR" | "SIP">("");

    // Feedback popup
    const [feedback, setFeedback] = useState<FeedbackState>({
        isOpen: false, variant: "success", title: "", message: "",
    });

    const showFeedback = (variant: "success" | "error", title: string, message: string) => {
        setFeedback({ isOpen: true, variant, title, message });
    };

    /* ─── Modal helpers ─── */

    const getActiveTabLabel = () => TAB_ITEMS.find(t => t.id === activeTab)?.label ?? "";

    const getModalTitle = () => {
        if (activeTab === "str-sip") return `Tambah Data ${strsipType || "STR/SIP"}`;
        return `Tambah Data ${getActiveTabLabel()}`;
    };

    const handleOpenModal = () => {
        setServerErrors(undefined);
        setStrsipType("");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setServerErrors(undefined);
    };

    /* ─── Submit handlers ─── */

    const handleSubmitPendidikan = async (formData: FormData) => {
        setIsSubmitting(true); setServerErrors(undefined);
        try {
            await pendidikanService.create(formData);
            showFeedback("success", "Berhasil", "Riwayat pendidikan berhasil ditambahkan.");
            setIsModalOpen(false);
            onRefresh?.();
        } catch (err: unknown) {
            const e = err as { message?: string; errors?: Record<string, string[]> };
            if (e?.errors) setServerErrors(e.errors);
            else showFeedback("error", "Gagal", e?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally { setIsSubmitting(false); }
    };

    const handleSubmitJabatan = async (formData: FormData) => {
        setIsSubmitting(true); setServerErrors(undefined);
        try {
            await jabatanService.create(formData);
            showFeedback("success", "Berhasil", "Riwayat jabatan berhasil ditambahkan.");
            setIsModalOpen(false);
            onRefresh?.();
        } catch (err: unknown) {
            const e = err as { message?: string; errors?: Record<string, string[]> };
            if (e?.errors) setServerErrors(e.errors);
            else showFeedback("error", "Gagal", e?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally { setIsSubmitting(false); }
    };

    const handleSubmitPangkat = async (formData: FormData) => {
        setIsSubmitting(true); setServerErrors(undefined);
        try {
            await pangkatService.create(formData);
            showFeedback("success", "Berhasil", "Riwayat pangkat berhasil ditambahkan.");
            setIsModalOpen(false);
            onRefresh?.();
        } catch (err: unknown) {
            const e = err as { message?: string; errors?: Record<string, string[]> };
            if (e?.errors) setServerErrors(e.errors);
            else showFeedback("error", "Gagal", e?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally { setIsSubmitting(false); }
    };

    const handleSubmitStrSip = async (formData: FormData) => {
        setIsSubmitting(true); setServerErrors(undefined);
        try {
            if (strsipType === "STR") {
                await strService.create(formData);
                showFeedback("success", "Berhasil", "Riwayat STR berhasil ditambahkan.");
            } else {
                await sipService.create(formData);
                showFeedback("success", "Berhasil", "Riwayat SIP berhasil ditambahkan.");
            }
            setIsModalOpen(false);
            onRefresh?.();
        } catch (err: unknown) {
            const e = err as { message?: string; errors?: Record<string, string[]> };
            if (e?.errors) setServerErrors(e.errors);
            else showFeedback("error", "Gagal", e?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally { setIsSubmitting(false); }
    };

    const handleSubmitPenugasan = async (formData: FormData) => {
        setIsSubmitting(true); setServerErrors(undefined);
        try {
            await penugasanKlinisService.create(formData);
            showFeedback("success", "Berhasil", "Riwayat penugasan klinis berhasil ditambahkan.");
            setIsModalOpen(false);
            onRefresh?.();
        } catch (err: unknown) {
            const e = err as { message?: string; errors?: Record<string, string[]> };
            if (e?.errors) setServerErrors(e.errors);
            else showFeedback("error", "Gagal", e?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally { setIsSubmitting(false); }
    };

    /* ─── Render helpers ─── */

    const renderEmptyOrError = (isLoading: boolean | undefined, error: string | null | undefined, emptyMsg: string, listLen: number) => {
        if (isLoading) return <Card><p className={styles.emptyText}>Memuat data...</p></Card>;
        if (error) return <Card><p style={{ color: "var(--color-danger, #DC2626)" }} className={styles.emptyText}>{error}</p></Card>;
        if (listLen === 0) return <Card><p className={styles.emptyText}>{emptyMsg}</p></Card>;
        return null;
    };

    const renderModalForm = () => {
        switch (activeTab) {
            case "pendidikan":
                return (
                    <FormPendidikan
                        initialData={null} isEdit={false}
                        isSubmitting={isSubmitting} serverErrors={serverErrors}
                        onCancel={handleCloseModal} onSubmit={handleSubmitPendidikan}
                    />
                );
            case "jabatan":
                return (
                    <FormJabatan
                        initialData={null}
                        onCancel={handleCloseModal} onSubmit={handleSubmitJabatan}
                    />
                );
            case "pangkat":
                return (
                    <FormPangkat
                        initialData={null} isEdit={false}
                        isSubmitting={isSubmitting} serverErrors={serverErrors}
                        onCancel={handleCloseModal} onSubmit={handleSubmitPangkat}
                    />
                );
            case "str-sip":
                return (
                    <FormStrsip
                        initialStrData={null} initialSipData={null}
                        isEdit={false} isSubmitting={isSubmitting}
                        serverErrors={serverErrors}
                        onCancel={handleCloseModal} onSubmit={handleSubmitStrSip}
                        onTypeChange={(type) => setStrsipType(type)}
                    />
                );
            case "penugasan":
                return (
                    <FormPenugasanKlinis
                        initialData={null}
                        isSubmitting={isSubmitting} serverErrors={serverErrors}
                        onCancel={handleCloseModal} onSubmit={handleSubmitPenugasan}
                    />
                );
            default:
                return null;
        }
    };

    /* ─── JSX ─── */

    return (
        <>
            {/* Sub-tabs */}
            <div className={styles.tabsWrapper}>
                <Card>
                    <Tabs tabs={TAB_ITEMS} activeTab={activeTab} onChange={setActiveTab} />
                </Card>
            </div>

            {/* Tambah button (admin only) */}
            {isAdmin && (
                <div className={styles.buttonContainer}>
                    <Button
                        variant="primary"
                        icon={<Plus size={20} />}
                        label={`Tambah Data ${getActiveTabLabel()}`}
                        onClick={handleOpenModal}
                    />
                </div>
            )}

            {/* Card list */}
            <div className={styles.recordList}>
                {activeTab === "pendidikan" && (
                    renderEmptyOrError(isLoadingPendidikan, errorPendidikan, "Belum ada data pendidikan.", pendidikanList.length) || (
                        <div className={styles.riwayatSection}>
                            {pendidikanList.map((item) => <CardPendidikan key={item.id} data={item} />)}
                        </div>
                    )
                )}

                {activeTab === "jabatan" && (
                    renderEmptyOrError(isLoadingJabatan, errorJabatan, "Belum ada data jabatan.", jabatanList.length) || (
                        <div className={styles.riwayatSection}>
                            {jabatanList.map((item) => <CardJabatan key={item.id} data={item} />)}
                        </div>
                    )
                )}

                {activeTab === "pangkat" && (
                    renderEmptyOrError(isLoadingPangkat, errorPangkat, "Belum ada data pangkat.", pangkatList.length) || (
                        <div className={styles.riwayatSection}>
                            {pangkatList.map((item) => <CardPangkat key={item.id} data={item} />)}
                        </div>
                    )
                )}

                {activeTab === "str-sip" && (
                    <>
                        {isLoadingStr || isLoadingSip ? (
                            <Card><p className={styles.emptyText}>Memuat data...</p></Card>
                        ) : errorStr || errorSip ? (
                            <Card><p style={{ color: "var(--color-danger, #DC2626)" }} className={styles.emptyText}>{errorStr || errorSip}</p></Card>
                        ) : strList.length === 0 && sipList.length === 0 ? (
                            <Card><p className={styles.emptyText}>Belum ada data STR/SIP.</p></Card>
                        ) : (
                            <>
                                {strList.length > 0 && (
                                    <div className={styles.riwayatSection}>
                                        {strList.map((item) => <CardStr key={item.id} data={item} />)}
                                    </div>
                                )}
                                {sipList.length > 0 && (
                                    <div className={styles.riwayatSection} style={{ marginTop: strList.length > 0 ? "12px" : 0 }}>
                                        {sipList.map((item) => <CardSip key={item.id} data={item} />)}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {activeTab === "penugasan" && (
                    renderEmptyOrError(isLoadingPenugasan, errorPenugasan, "Belum ada data penugasan klinis.", penugasanList.length) || (
                        <div className={styles.riwayatSection}>
                            {penugasanList.map((item) => <CardPenugasanKlinis key={item.id} data={item} />)}
                        </div>
                    )
                )}
            </div>

            {/* Add modal */}
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={getModalTitle()}>
                    {renderModalForm()}
                </Modal>
            )}

            {/* Feedback popup */}
            <Popup
                isOpen={feedback.isOpen}
                onClose={() => setFeedback(prev => ({ ...prev, isOpen: false }))}
                variant={feedback.variant}
                title={feedback.title}
                message={feedback.message}
                confirmLabel="OK"
            />
        </>
    );
};

export default TabRiwayat;
