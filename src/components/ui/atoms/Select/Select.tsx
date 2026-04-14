import React from "react";
import styles from "./Select.module.css";

interface OptionType {
    value: string;
    label: string;
}

interface propsType {
    label?: string;
    name: string;
    id: string;
    options: OptionType[];
    placeholder?: string;
    required?: boolean;
    className?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    bgColor?: string;
}

const Select = (props: propsType) => {
    const { label, name, id, options, placeholder, required = false, className, value, onChange, disabled, bgColor } = props;
    return (
        <label htmlFor={id} className={styles.label}>
            {label && <span className={styles.labelText}>{label}</span>}
            <div className={styles.selectWrapper}>
                <select
                    id={id}
                    name={name}
                    required={required}
                    className={`${styles.select} ${className || ""}`}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    style={bgColor ? { backgroundColor: bgColor } : undefined}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className={styles.chevron}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </label>
    );
};

export default Select;