import { FileText } from "lucide-react";
import styles from "./DataChangeCard.module.css";

interface DataChangeField {
    label: string;
    value: string;
}

interface DataChangeCardProps {
    variant: "old" | "new";
    title: string;
    fields: DataChangeField[];
}

const DataChangeCard = ({ variant, title, fields }: DataChangeCardProps) => {
    return (
        <div className={`${styles.card} ${styles[variant]}`}>
            <div className={styles.header}>
                <FileText size={18} className={styles.headerIcon} />
                <span className={styles.headerTitle}>{title}</span>
            </div>
            <div className={styles.fieldList}>
                {fields.map((field, index) => (
                    <div key={index} className={styles.fieldItem}>
                        <span className={styles.fieldLabel}>{field.label}</span>
                        <span className={styles.fieldValue}>{field.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataChangeCard;
export type { DataChangeField, DataChangeCardProps };
