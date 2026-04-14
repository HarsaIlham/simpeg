import React from "react";
import styles from "./icon.module.css";

interface Props {
    icon: React.ElementType | string;
    color?: string;
    sizeBox?: "xs"|"sm" | "md" | "lg" | "xl";
    sizeIcon?: "xs"|"sm" | "md" | "lg" | "xl";
    rounded?: "md" | "lg" | "full";
    variant?: "primary" | "soft" | "dark" | "white" | "transparant";
    bgColor?: string;
    className?: string;
}

const Icon = ({ icon: IconComponent, className, color, sizeBox = "md", sizeIcon = "md", rounded = "md", variant = "primary", bgColor }: Props) => {
    const sizeClass = {
        xs: styles.xs,
        sm: styles.sm,
        md: styles.md,
        lg: styles.lg,
        xl: styles.xl,
    };
    const roundedClass = {
        md: styles.md,
        lg: styles.lg,
        full: styles.full,
    };
    const variantClass = {
        primary: styles.primary,
        soft: styles.soft,
        dark: styles.dark,
        white: styles.white,
        transparant: styles.transparant
    };
  return (
    <div className={`${styles.iconBox} ${sizeClass[sizeBox]} ${roundedClass[rounded]} ${variantClass[variant]}`} style={{ backgroundColor: bgColor }}>
        <IconComponent color={color} className={`${sizeClass[sizeIcon]} ${className}`}/>
    </div>
  )
}

export default Icon