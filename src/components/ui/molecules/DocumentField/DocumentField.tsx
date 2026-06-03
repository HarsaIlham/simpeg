import { Eye, ChevronRight, FileX } from "lucide-react";
import styles from "./DocumentField.module.css";

interface DocumentFieldProps {
    label: string;
    name: string;
    id: string;
    fileUrl?: string | null;
    onViewClick?: () => void;
    bgColor?: string;
}

const DocumentField = ({
    label,
    name: _name,
    id: _id,
    fileUrl,
    onViewClick,
    bgColor,
}: DocumentFieldProps) => {
    const hasDocument = !!fileUrl;
    return (
        <div className={styles.fieldWrapper}>
            <span className={styles.labelText}>{label}</span>
            {hasDocument ? (
                <button
                    type="button"
                    className={styles.viewButton}
                    onClick={onViewClick}
                    style={bgColor ? { backgroundColor: bgColor } : undefined}
                >
                    <span className={styles.viewButtonIcon}>
                        <Eye size={16} />
                    </span>
                    <span className={styles.viewButtonLabel}>
                        Lihat {label}
                    </span>
                    <span className={styles.viewButtonArrow}>
                        <ChevronRight size={16} />
                    </span>
                </button>
            ) : (
                <button
                    type="button"
                    className={styles.viewButtonEmpty}
                    onClick={onViewClick}
                    style={bgColor ? { backgroundColor: bgColor } : undefined}
                >
                    <span className={styles.viewButtonIcon}>
                        <FileX size={16} />
                    </span>
                    <span className={styles.viewButtonLabel}>
                        Upload {label}
                    </span>
                    <span className={styles.viewButtonArrow}>
                        <ChevronRight size={16} />
                    </span>
                </button>
            )}
        </div>
    );
};

export default DocumentField;
