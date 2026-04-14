import React from "react";
import styles from "./Input.module.css";

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
}

const Input = (props: propsType) => {
    const { label, name, id, type = 'text', placeholder, required = false, className, rightNode, value, onChange, disabled, bgColor, error } = props;
  return (
    <label htmlFor={id} className={styles.label}>
        {label && <span className={styles.labelText}>{label}</span>}
        <div className={styles.inputWrapper}>
            <input 
                type={type} 
                id={id} 
                name={name} 
                placeholder={placeholder} 
                required={required} 
                className={`${styles.input} ${rightNode ? styles.hasRightNode : ""} ${className || ""}`}
                style={bgColor ? { backgroundColor: bgColor } : undefined}
                value={value}
                onChange={onChange}
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