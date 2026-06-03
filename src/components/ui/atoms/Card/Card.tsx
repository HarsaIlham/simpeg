
import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: "none" | "xs" | "sm" | "md" | "lg";
    hover?: boolean;
    onClick?: () => void;
}

const Card = ({ children, className, padding = "md", hover = false, onClick }: CardProps) => {
    return (
        <div
            className={`
                ${styles.card} 
                ${styles[`padding-${padding}`]} 
                ${hover || onClick ? styles.hover : ""} 
                ${className || ""}
            `.trim()}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => { if (e.key === "Enter") onClick(); } : undefined}
        >
            {children}
        </div>
    );
};

export default Card;
