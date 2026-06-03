import React, { useEffect, useRef } from "react";
import { X, Send, CircleAlert, CircleX, Info,  Check } from "lucide-react";
import Icon from "../../atoms/Icon";
import Button from "../../atoms/Button";
import styles from "./Popup.module.css";

type PopupVariant = "success" | "error" | "warning" | "info" | "checklist";

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    variant?: PopupVariant;
    icon?: React.ElementType;
    title: string;
    message: string;
    confirmLabel?: string;
    dangerLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onDanger?: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

const defaultIcons: Record<PopupVariant, React.ElementType> = {
    success: Send,
    error: CircleX,
    warning: CircleAlert,
    info: Info,
    checklist: Check,
};

const iconBgColors: Record<PopupVariant, string> = {
    success: "#E6F4EE",
    error: "#FEE2E2",
    warning: "#FEF3C7",
    info: "#DBEAFE",
    checklist: "#E6F4EE",
};

const iconColors: Record<PopupVariant, string> = {
    success: "#115e3f",
    error: "#DC2626",
    warning: "#D97706",
    info: "#2563EB",
    checklist: "#115e3f",
};

const Popup = ({
    isOpen,
    onClose,
    variant = "success",
    icon,
    title,
    message,
    confirmLabel = "Ok",
    dangerLabel,
    cancelLabel,
    onConfirm,
    onDanger,
    onCancel,
    isLoading,
}: PopupProps) => {
    const popupRef = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
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
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const IconComponent = icon || defaultIcons[variant];

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    const handleDanger = () => {
        if (onDanger) onDanger();
        onClose();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={handleOutsideClick}>
            <div className={styles.popup} ref={popupRef} role="dialog" aria-modal="true">
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Tutup popup"
                    type="button"
                >
                    <X size={20} />
                </button>

                <div className={styles.iconWrapper}>
                    <Icon
                        icon={IconComponent}
                        sizeBox="xl"
                        sizeIcon="md"
                        rounded="full"
                        variant="transparant"
                        bgColor={iconBgColors[variant]}
                        color={iconColors[variant]}
                    />
                </div>

                <h3 className={styles.title}>{title}</h3>
                <p className={styles.message}>{message}</p>

                <div className={styles.actions}>
                    <Button className={styles.buttonConfirm}
                        label={isLoading ? "Memproses..." : confirmLabel}
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    />
                    {dangerLabel && (
                        <Button
                            label={isLoading ? "Memproses..." : dangerLabel}
                            variant="danger"
                            onClick={handleDanger}
                            disabled={isLoading}
                        />
                    )}
                    {cancelLabel && (
                        <Button
                            label={cancelLabel}
                            variant="secondary"
                            onClick={handleCancel}
                            disabled={isLoading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Popup;
