import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import styles from "./Modal.module.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest(".react-select__menu-portal")) {
            return;
        }
        if (modalRef.current && !modalRef.current.contains(target)) {
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

    return (
        <div className={styles.overlay} onClick={handleOutsideClick}>
            <div className={`${styles.modal} ${className || ""}`} ref={modalRef} role="dialog" aria-modal="true">
                <div className={styles.header}>
                    <h2 className={styles.headerTitle}>{title}</h2>
                    <button 
                        className={styles.closeButton} 
                        onClick={onClose} 
                        aria-label="Tutup form"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
