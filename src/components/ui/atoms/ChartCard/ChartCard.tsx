import type { ReactNode } from "react";
import Card from "../Card";
import styles from "./ChartCard.module.css";

interface ChartCardProps {
    title: string;
    children: ReactNode;
    className?: string;
}

const ChartCard = ({ title, children, className }: ChartCardProps) => {
    return (
        <Card padding="md" className={`${styles.chartCard} ${className || ""}`}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.chartContent}>
                {children}
            </div>
        </Card>
    );
};

export default ChartCard;
