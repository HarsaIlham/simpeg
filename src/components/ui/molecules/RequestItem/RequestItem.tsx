import styles from "./RequestItem.module.css";
import Badge from "../../atoms/Badge";

type StatusVariant = "info" | "success" | "warning" | "danger" | "default";

interface RequestItemProps {
    title: string;
    date: string;
    statusLabel: string;
    statusVariant?: StatusVariant;
}

const RequestItem = ({ title, date, statusLabel, statusVariant = "default" }: RequestItemProps) => {
    return (
        <div className={styles.item}>
            <div className={styles.info}>
                <span className={styles.title}>{title}</span>
                <span className={styles.date}>{date}</span>
            </div>
            <div className={styles.statusBox}>
                <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
        </div>
    );
};

export default RequestItem;
