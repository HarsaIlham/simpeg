import React, { useRef } from "react";
import { Search, X } from "lucide-react";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    id?: string;
    className?: string;
    autoFocus?: boolean;
    ariaLabel?: string;
}

const SearchInput = ({
    value,
    onChange,
    placeholder = "Cari...",
    size = "md",
    fullWidth = false,
    id = "search-input",
    className = "",
    autoFocus = false,
    ariaLabel = "Cari",
}: SearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleClear = () => {
        onChange("");
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            handleClear();
        }
    };

    const sizeClass = size !== "md" ? styles[size] : "";

    return (
        <div
            className={`
                ${styles.searchWrapper} 
                ${sizeClass} 
                ${fullWidth ? styles.fullWidth : ""} 
                ${className}
            `.trim()}
        >
            <span className={styles.searchIcon}>
                <Search size={16} />
            </span>

            <input
                ref={inputRef}
                id={id}
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={styles.searchInput}
                autoFocus={autoFocus}
                aria-label={ariaLabel}
                autoComplete="off"
            />

            {value && (
                <button
                    type="button"
                    className={styles.clearButton}
                    onClick={handleClear}
                    aria-label="Hapus pencarian"
                    tabIndex={-1}
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
};

export default SearchInput;
