import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../ui/atoms/Button";
import Card from "../../../../ui/atoms/Card";
import CardDiklat from "../../../../ui/organisms/CardDiklat";
import type { CardDiklatData } from "../../../../ui/organisms/CardDiklat/CardDiklat";
import Modal from "../../../../ui/organisms/Modal";
import FormLaporanDiklat from "../../../../ui/organisms/FormLaporanDiklat";
import Popup from "../../../../ui/molecules/Popup";
import { diklatService } from "../../../../../services/diklatService";
import styles from "../DetailPegawai.module.css";

interface TabDiklatProps {
    diklatList: CardDiklatData[];
    isAdmin: boolean;
    onRefresh?: () => void;
}

const TabDiklat = ({ diklatList, isAdmin, onRefresh }: TabDiklatProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDiklat, setSelectedDiklat] = useState<CardDiklatData | null>(null);
    const [popup, setPopup] = useState<{
        isOpen: boolean;
        variant: "success" | "error" | "warning" | "checklist";
        title: string;
        message: string;
    }>({
        isOpen: false,
        variant: "success",
        title: "",
        message: "",
    });

    const showPopup = (variant: "success" | "error" | "warning" | "checklist", title: string, message: string) => {
        setPopup({ isOpen: true, variant, title, message });
    };

    const closePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }));
    };

    const handleTambahDiklat = () => {
        setSelectedDiklat(null);
        setIsModalOpen(true);
    };

    const handleEditDiklat = (diklat: CardDiklatData) => {
        setSelectedDiklat(diklat);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            if (selectedDiklat) {
                await diklatService.updateDiklat(selectedDiklat.id, formData);
                showPopup("checklist", "Berhasil", "Data diklat berhasil diupdate.");
            } else {
                await diklatService.createDiklat(formData);
                showPopup("checklist", "Berhasil", "Data diklat berhasil ditambahkan.");
            }
            setIsModalOpen(false);
            setSelectedDiklat(null);
            if (onRefresh) {
                await onRefresh();
            }
        } catch (err: unknown) {
            const errorObj = err as { message?: string };
            showPopup("error", "Gagal", errorObj?.message || "Gagal menyimpan data diklat.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isAdmin && (
                <div className={styles.buttonContainer}>
                    <Button
                        variant="primary"
                        icon={<Plus size={20} />}
                        label="Tambah Data Diklat"
                        onClick={handleTambahDiklat}
                    />
                </div>
            )}

            {diklatList.length === 0 ? (
                <Card>
                    <p className={styles.emptyText}>Belum ada data diklat untuk pegawai ini.</p>
                </Card>
            ) : (
                <div className={styles.recordList}>
                    {diklatList.map((diklat) => (
                        <CardDiklat
                            key={diklat.id}
                            data={diklat}
                            onEdit={isAdmin ? () => handleEditDiklat(diklat) : undefined}
                        />
                    ))}
                </div>
            )}

            {isModalOpen && (
                <Modal
                    title={selectedDiklat ? "Edit Diklat" : "Tambah Diklat"}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <FormLaporanDiklat
                        initialData={selectedDiklat || undefined}
                        isEdit={!!selectedDiklat}
                        onCancel={() => setIsModalOpen(false)}
                        onSubmit={handleFormSubmit}
                        isLoading={isSubmitting}
                        isMaster={true}
                    />
                </Modal>
            )}

            <Popup
                isOpen={popup.isOpen}
                onClose={closePopup}
                variant={popup.variant}
                title={popup.title}
                message={popup.message}
                confirmLabel="Ok"
            />
        </>
    );
};

export default TabDiklat;
