import type { ReactNode } from "react";
import styles from "./CardHeader.module.css";

interface CardHeaderProps {
    icon?: ReactNode;
    title: string;
    className?: string;
}

const CardHeader = ({ icon, title, className }: CardHeaderProps) => {
    return (
        <div className={`${styles.cardHeader} ${className || ""}`}>
            {icon && <span className={styles.icon}>{icon}</span>}
            <span className={styles.title}>{title}</span>
        </div>
    );
};

export default CardHeader;
