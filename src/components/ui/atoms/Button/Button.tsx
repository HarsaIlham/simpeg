import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "danger" | "warning" | "success" | "info" | "light" | "dark" | "dangerSoft";

interface ButtonProps {
    label?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    variant?: ButtonVariant;
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
    iconOnly?: boolean;
    rounded?: "default" | "full";
    disabled?: boolean;
}

const Button = ({
    label,
    icon,
    onClick,
    variant = "primary",
    fullWidth = false,
    type = "button",
    iconOnly = false,
    rounded = "default",
    disabled = false,
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={`
                ${styles.button} 
                ${styles[variant]} 
                ${fullWidth ? styles.fullWidth : ""}
                ${iconOnly ? styles.iconOnly : ""}
                ${rounded === "full" ? styles.roundedFull : ""}
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