import styles from "./Badge.module.css";
import type { ReactNode } from "react";

type BadgeVariant = "info" | "success" | "warning" | "danger" | "default" | "parent";

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const Badge = ({ children, variant = "default", className }: BadgeProps) => {
    return (
        <span className={`${styles.badge} ${styles[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
