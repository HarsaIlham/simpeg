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
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            await diklatService.createDiklat(formData);
            showPopup("checklist", "Berhasil", "Data diklat berhasil ditambahkan.");
            setIsModalOpen(false);
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
                        <CardDiklat key={diklat.id} data={diklat} />
                    ))}
                </div>
            )}

            {isModalOpen && (
                <Modal
                    title="Tambah Diklat"
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <FormLaporanDiklat
                        initialData={null}
                        isEdit={true}
                        onCancel={() => setIsModalOpen(false)}
                        onSubmit={handleFormSubmit}
                        isLoading={isSubmitting}
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
