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


const TAB_ITEMS = [
    { id: "pendidikan", label: "Pendidikan", icon: <GraduationCap size={16} /> },
    { id: "jabatan", label: "Jabatan", icon: <Briefcase size={16} /> },
    { id: "pangkat", label: "Pangkat", icon: <Award size={16} /> },
    { id: "str-sip", label: "STR/SIP", icon: <FileText size={16} /> },
    { id: "penugasan", label: "Penugasan Klinis", icon: <ClipboardList size={16} /> },
];


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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string[]> | undefined>(undefined);
    const [strsipType, setStrsipType] = useState<"" | "STR" | "SIP">("");

    const [selectedPendidikan, setSelectedPendidikan] = useState<CardPendidikanData | null>(null);
    const [selectedJabatan, setSelectedJabatan] = useState<CardJabatanData | null>(null);
    const [selectedPangkat, setSelectedPangkat] = useState<CardPangkatData | null>(null);
    const [selectedStr, setSelectedStr] = useState<CardStrData | null>(null);
    const [selectedSip, setSelectedSip] = useState<CardSipData | null>(null);
    const [selectedPenugasan, setSelectedPenugasan] = useState<CardPenugasanKlinisData | null>(null);

    // Feedback popup
    const [feedback, setFeedback] = useState<FeedbackState>({
        isOpen: false, variant: "success", title: "", message: "",
    });

    const showFeedback = (variant: "success" | "error", title: string, message: string) => {
        setFeedback({ isOpen: true, variant, title, message });
    };


    const getActiveTabLabel = () => TAB_ITEMS.find(t => t.id === activeTab)?.label ?? "";

    const getModalTitle = () => {
        if (activeTab === "pendidikan") return selectedPendidikan ? "Edit Data Pendidikan" : "Tambah Data Pendidikan";
        if (activeTab === "jabatan") return selectedJabatan ? "Edit Data Jabatan" : "Tambah Data Jabatan";
        if (activeTab === "pangkat") return selectedPangkat ? "Edit Data Pangkat" : "Tambah Data Pangkat";
        if (activeTab === "str-sip") {
            if (selectedStr) return "Edit Data STR";
            if (selectedSip) return "Edit Data SIP";
            return `Tambah Data ${strsipType || "STR/SIP"}`;
        }
        if (activeTab === "penugasan") return selectedPenugasan ? "Edit Data Penugasan Klinis" : "Tambah Data Penugasan Klinis";
        return `Tambah Data ${getActiveTabLabel()}`;
    };

    const clearSelections = () => {
        setSelectedPendidikan(null);
        setSelectedJabatan(null);
        setSelectedPangkat(null);
        setSelectedStr(null);
        setSelectedSip(null);
        setSelectedPenugasan(null);
    };

    const handleOpenModal = () => {
        setServerErrors(undefined);
        clearSelections();
        setStrsipType("");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        clearSelections();
        setServerErrors(undefined);
    };


    const handleEditPendidikan = (item: CardPendidikanData) => {
        setServerErrors(undefined);
        clearSelections();
        setSelectedPendidikan(item);
        setIsModalOpen(true);
    };

    const handleEditJabatan = (item: CardJabatanData) => {
        setServerErrors(undefined);
        clearSelections();
        setSelectedJabatan(item);
        setIsModalOpen(true);
    };

    const handleEditPangkat = (item: CardPangkatData) => {
        setServerErrors(undefined);
        clearSelections();
        setSelectedPangkat(item);
        setIsModalOpen(true);
    };

    const handleEditStr = (item: CardStrData) => {
        setServerErrors(undefined);
        clearSelections();
        setSelectedStr(item);
        setStrsipType("STR");
        setIsModalOpen(true);
    };

    const handleEditSip = (item: CardSipData) => {
        setServerErrors(undefined);
        clearSelections();
        setSelectedSip(item);
        setStrsipType("SIP");
        setIsModalOpen(true);
    };

    const handleEditPenugasan = (item: CardPenugasanKlinisData) => {
        setServerErrors(undefined);
        clearSelections();
        setSelectedPenugasan(item);
        setIsModalOpen(true);
    };


    const handleSubmitPendidikan = async (formData: FormData) => {
        setIsSubmitting(true); setServerErrors(undefined);
        try {
            if (selectedPendidikan) {
                await pendidikanService.update(selectedPendidikan.id, formData);
                showFeedback("success", "Berhasil", "Riwayat pendidikan berhasil diupdate.");
            } else {
                await pendidikanService.create(formData);
                showFeedback("success", "Berhasil", "Riwayat pendidikan berhasil ditambahkan.");
            }
            setIsModalOpen(false);
            clearSelections();
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
            if (selectedJabatan) {
                await jabatanService.update(selectedJabatan.id, formData);
                showFeedback("success", "Berhasil", "Riwayat jabatan berhasil diupdate.");
            } else {
                await jabatanService.create(formData);
                showFeedback("success", "Berhasil", "Riwayat jabatan berhasil ditambahkan.");
            }
            setIsModalOpen(false);
            clearSelections();
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
            if (selectedPangkat) {
                await pangkatService.update(selectedPangkat.id, formData);
                showFeedback("success", "Berhasil", "Riwayat pangkat berhasil diupdate.");
            } else {
                await pangkatService.create(formData);
                showFeedback("success", "Berhasil", "Riwayat pangkat berhasil ditambahkan.");
            }
            setIsModalOpen(false);
            clearSelections();
            onRefresh?.();
        } catch (err: unknown) {
            const e = err as { message?: string; errors?: Record<string, string[]> };
            if (e?.errors) setServerErrors(e.errors);
            else showFeedback("error", "Gagal", e?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally { setIsSubmitting(false); }
    };

    const handleSubmitStrSip = async (formData: FormData) => {
        setIsSubmitting(true); setServerErrors(undefined);
        const isStr = strsipType === "STR" || !!selectedStr;
        try {
            if (isStr) {
                if (selectedStr) {
                    await strService.update(selectedStr.id, formData);
                    showFeedback("success", "Berhasil", "Riwayat STR berhasil diupdate.");
                } else {
                    await strService.create(formData);
                    showFeedback("success", "Berhasil", "Riwayat STR berhasil ditambahkan.");
                }
            } else {
                if (selectedSip) {
                    await sipService.update(selectedSip.id, formData);
                    showFeedback("success", "Berhasil", "Riwayat SIP berhasil diupdate.");
                } else {
                    await sipService.create(formData);
                    showFeedback("success", "Berhasil", "Riwayat SIP berhasil ditambahkan.");
                }
            }
            setIsModalOpen(false);
            clearSelections();
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
            if (selectedPenugasan) {
                await penugasanKlinisService.update(selectedPenugasan.id, formData);
                showFeedback("success", "Berhasil", "Riwayat penugasan klinis berhasil diupdate.");
            } else {
                await penugasanKlinisService.create(formData);
                showFeedback("success", "Berhasil", "Riwayat penugasan klinis berhasil ditambahkan.");
            }
            setIsModalOpen(false);
            clearSelections();
            onRefresh?.();
        } catch (err: unknown) {
            const e = err as { message?: string; errors?: Record<string, string[]> };
            if (e?.errors) setServerErrors(e.errors);
            else showFeedback("error", "Gagal", e?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally { setIsSubmitting(false); }
    };


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
                        initialData={selectedPendidikan} isEdit={!!selectedPendidikan}
                        isSubmitting={isSubmitting} serverErrors={serverErrors}
                        onCancel={handleCloseModal} onSubmit={handleSubmitPendidikan}
                        isPegawai={false}
                    />
                );
            case "jabatan":
                return (
                    <FormJabatan
                        initialData={selectedJabatan}
                        onCancel={handleCloseModal} onSubmit={handleSubmitJabatan}
                        isPegawai={false}
                    />
                );
            case "pangkat":
                return (
                    <FormPangkat
                        initialData={selectedPangkat} isEdit={!!selectedPangkat}
                        isSubmitting={isSubmitting} serverErrors={serverErrors}
                        onCancel={handleCloseModal} onSubmit={handleSubmitPangkat}
                        isPegawai={false}
                    />
                );
            case "str-sip":
                return (
                    <FormStrsip
                        initialStrData={selectedStr}
                        initialSipData={selectedSip}
                        isEdit={!!selectedStr || !!selectedSip}
                        isSubmitting={isSubmitting}
                        serverErrors={serverErrors}
                        forceType={selectedStr ? "STR" : selectedSip ? "SIP" : undefined}
                        onCancel={handleCloseModal}
                        onSubmit={handleSubmitStrSip}
                        onTypeChange={(type) => setStrsipType(type)}
                        isPegawai={false}
                    />
                );
            case "penugasan":
                return (
                    <FormPenugasanKlinis
                        initialData={selectedPenugasan}
                        isSubmitting={isSubmitting} serverErrors={serverErrors}
                        onCancel={handleCloseModal} onSubmit={handleSubmitPenugasan}
                        isPegawai={false}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className={styles.tabsWrapper}>
                <Card>
                    <Tabs tabs={TAB_ITEMS} activeTab={activeTab} onChange={setActiveTab} />
                </Card>
            </div>

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

            <div className={styles.recordList}>
                {activeTab === "pendidikan" && (
                    renderEmptyOrError(isLoadingPendidikan, errorPendidikan, "Belum ada data pendidikan.", pendidikanList.length) || (
                        <div className={styles.riwayatSection}>
                            {pendidikanList.map((item) =>
                                <CardPendidikan
                                    key={item.id}
                                    data={item}
                                    onEdit={isAdmin ? () => handleEditPendidikan(item) : undefined}
                                    onDelete={() => void {}}
                                />
                            )}
                        </div>
                    )
                )}

                {activeTab === "jabatan" && (
                    renderEmptyOrError(isLoadingJabatan, errorJabatan, "Belum ada data jabatan.", jabatanList.length) || (
                        <div className={styles.riwayatSection}>
                            {jabatanList.map((item) =>
                                <CardJabatan
                                    key={item.id}
                                    data={item}
                                    onEdit={isAdmin ? () => handleEditJabatan(item) : undefined}
                                    onDelete={() => void {}}
                                />
                            )}
                        </div>
                    )
                )}

                {activeTab === "pangkat" && (
                    renderEmptyOrError(isLoadingPangkat, errorPangkat, "Belum ada data pangkat.", pangkatList.length) || (
                        <div className={styles.riwayatSection}>
                            {pangkatList.map((item) =>
                                <CardPangkat
                                    key={item.id}
                                    data={item}
                                    onEdit={isAdmin ? () => handleEditPangkat(item) : undefined}
                                    onDelete={() => void {}}
                                />
                            )}
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
                                        {strList.map((item) =>
                                            <CardStr
                                                key={item.id}
                                                data={item}
                                                onEdit={isAdmin ? () => handleEditStr(item) : undefined}
                                            />
                                        )}
                                    </div>
                                )}
                                {sipList.length > 0 && (
                                    <div className={styles.riwayatSection} style={{ marginTop: strList.length > 0 ? "12px" : 0 }}>
                                        {sipList.map((item) =>
                                            <CardSip
                                                key={item.id}
                                                data={item}
                                                onEdit={isAdmin ? () => handleEditSip(item) : undefined}
                                            />
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {activeTab === "penugasan" && (
                    renderEmptyOrError(isLoadingPenugasan, errorPenugasan, "Belum ada data penugasan klinis.", penugasanList.length) || (
                        <div className={styles.riwayatSection}>
                            {penugasanList.map((item) =>
                                <CardPenugasanKlinis
                                    key={item.id}
                                    data={item}
                                    onEdit={isAdmin ? () => handleEditPenugasan(item) : undefined}
                                />
                            )}
                        </div>
                    )
                )}
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={getModalTitle()}>
                    {renderModalForm()}
                </Modal>
            )}

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
