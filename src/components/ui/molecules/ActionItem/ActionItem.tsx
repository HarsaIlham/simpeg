import { AlertCircle } from "lucide-react";
import styles from "./ActionItem.module.css";

interface ActionItemProps {
    title: string;
    desc: string;
}

const ActionItem = ({ title, desc }: ActionItemProps) => {
    return (
        <div className={styles.item}>
            <div className={styles.iconBox}>
                <AlertCircle size={16} />
            </div>
            <div className={styles.textContainer}>
                <span className={styles.title}>{title}</span>
                <span className={styles.desc}>{desc}</span>
            </div>
        </div>
    );
};

export default ActionItem;
