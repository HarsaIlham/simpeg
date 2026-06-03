import React, { useState } from "react";
import styles from "./Input.module.css";
import { formatLongDate } from "../../../../utils/dateUtils";

interface propsType {
    label?: string;
    name: string;
    id: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    rightNode?: React.ReactNode;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    bgColor?: string;
    error?: string;
    onlyNumbers?: boolean;
    isDesimal?: boolean;
}

const Input = ({label,type, name, id, placeholder, required, className, rightNode, value, onChange, disabled, bgColor, error, onlyNumbers, isDesimal}: propsType) => {

    const [isFocused, setIsFocused] = useState(false);

    const isDateField = type === 'date';
    const currentType = isDateField ? (isFocused ? 'date' : 'text') : type;
    const displayValue = (isDateField && !isFocused && value) ? formatLongDate(value) : value;

    return (
        <label htmlFor={id} className={styles.label}>
            {label && <span className={styles.labelText}>{label} {required && <span className={styles.required}>*</span>}</span>}
            <div className={styles.inputWrapper}>
                <input
                    type={currentType}
                    id={id}
                    name={name}
                    placeholder={isDateField && !isFocused && !value ? "DD MMMM YYYY" : placeholder}
                    required={required}
                    className={`${styles.input} ${rightNode ? styles.hasRightNode : ""} ${className || ""}`}
                    style={bgColor ? { backgroundColor: bgColor } : { backgroundColor: "#F9FAFC" }}
                    {...(type !== 'file' ? { value: displayValue || "" } : {})}
                    inputMode={onlyNumbers && type === 'text' ? "numeric" : undefined}
                    onChange={(e) => {
                        if (onlyNumbers && type === 'text') {
                            e.target.value = e.target.value.replace(/\D/g, "");
                        }
                        if (isDesimal && type === 'text') {
                            e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                        }
                        if (onChange) onChange(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={disabled}
                />
                {rightNode && (
                    <div className={styles.rightNode}>
                        {rightNode}
                    </div>
                )}
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </label>
    )
}

export default Input