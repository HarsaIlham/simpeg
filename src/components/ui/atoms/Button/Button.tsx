import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "danger" | "warning" | "success" | "info" | "light" | "dark" | "dangerSoft" | "transparant";

interface ButtonProps {
    label?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    variant?: ButtonVariant;
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
    iconOnly?: boolean;
    rounded?: "default" | "full";
    disabled?: boolean;
    className?: string;
}

const Button = ({
    label,
    icon,
    onClick,
    variant = "primary",
    size = "md",
    fullWidth = false,
    type = "button",
    iconOnly = false,
    rounded = "default",
    disabled = false,
    className,
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={`
                ${styles.button} 
                ${styles[variant]} 
                ${styles[size]}
                ${fullWidth ? styles.fullWidth : ""}
                ${iconOnly ? styles.iconOnly : ""}
                ${rounded === "full" ? styles.roundedFull : ""}
                ${className}
            `.trim()}
            onClick={onClick}
            disabled={disabled}
            >
            {icon && <span className={styles.icon}>{icon}</span>}
            {!iconOnly && label && <span>{label}</span>}
        </button>
    );
};

export default Button