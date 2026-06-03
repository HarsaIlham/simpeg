import React, { useEffect, useRef } from "react";
import { X, AlertTriangle } from "lucide-react";
import Icon from "../../atoms/Icon";
import styles from "./ConfirmDeleteModal.module.css";
import Button from "../../atoms/Button";
import Text from "../../atoms/Text";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    title = "Konfirmasi Hapus",
    message = "Yakin anda akan menghapus data ini? Data yang sudah di hapus tidak dapat dikembalikan",
    confirmLabel = "Ya, Hapus",
    cancelLabel = "Batal",
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmDeleteModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            if (!isLoading) onClose();
        }
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isLoading) onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "auto";
        };
    }, [isOpen, onClose, isLoading]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        else onClose();
    };

    return (
        <div className={styles.overlay} onClick={handleOutsideClick}>
            <div className={styles.modal} ref={modalRef} role="dialog" aria-modal="true">
                <div className={styles.header}>
                    <h2 className={styles.headerTitle}>{title}</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Tutup modal"
                        type="button"
                        disabled={isLoading}
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className={styles.body}>
                    <Icon icon={AlertTriangle} bgColor="#F8BBD0" color="red" rounded="full" sizeBox="xl" sizeIcon="md" />
                    {/* <p className={styles.message}>{message}</p> */}
                    <Text text={message}  fontSize="16px" />
                </div>

                <div className={styles.footer}>
                    <Button
                        className={styles.btnCancel}
                        fullWidth
                        onClick={handleCancel}
                        type="button"
                        disabled={isLoading}
                        label={cancelLabel}
                        variant="secondary"
                    />
                    <Button
                        className={styles.btnConfirm}
                        fullWidth
                        onClick={handleConfirm}
                        type="button"
                        disabled={isLoading}
                        label={confirmLabel}
                        variant="danger"
                    />
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
