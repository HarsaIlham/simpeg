import type { ReactNode } from "react";
import styles from "./StatCard.module.css";
import Card from "../../atoms/Card";

type StatVariant = "green" | "teal" | "amber" | "red" | "blue";

interface StatCardProps {
    icon: ReactNode;
    value?: string | number;
    label: string;
    variant?: StatVariant;
    isLoading?: boolean;
    onClick?: () => void;
}

const StatCard = ({ icon, value, label, variant = "green", isLoading = false, onClick }: StatCardProps) => {
    return (
        <Card hover={!!onClick} onClick={onClick}>
            <div className={styles.statContent}>
                <div className={`${styles.iconBox} ${styles[variant]}`}>
                    {icon}
                </div>
                <div className={styles.info}>
                    {isLoading ? (
                        <div className={styles.skeletonValue} />
                    ) : (
                        <span className={styles.value}>{value}</span>
                    )}
                    <span className={styles.label}>{label}</span>
                </div>
            </div>
        </Card>
    );
};

export default StatCard;
