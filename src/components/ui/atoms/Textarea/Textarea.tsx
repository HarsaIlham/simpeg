import React from "react";
import styles from "./Textarea.module.css";

interface propsType {
    label?: string;
    name: string;
    id: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    bgColor?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    rows?: number;
}

const Textarea = ({ label, name, id, placeholder, required = false, className, value, onChange, disabled, rows = 3, bgColor }: propsType) => {
    return (
        <label htmlFor={id} className={styles.label}>
            {label && <span className={styles.labelText}>{label}
                {required && <span className={styles.required}>*</span>}
            </span>}
            <textarea
                id={id}
                name={name}
                placeholder={placeholder}
                required={required}
                className={`${styles.textarea} ${className || ""}`}
                value={value}
                onChange={onChange}
                disabled={disabled}
                rows={rows}
                style={bgColor ? { backgroundColor: bgColor } : { backgroundColor: "#F9FAFC" }}
            />
        </label>
    );
};

export default Textarea;
