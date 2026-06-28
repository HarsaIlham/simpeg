import React from "react";
import styles from "./Select.module.css";
import ReactSelect from "react-select";
import type { SingleValue } from "react-select";

interface OptionType {
    value: string;
    label: string;
}

interface PropsType {
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
    searchable?: boolean;
    icon?: React.ReactNode;
}

const Select = (props: PropsType) => {
    const {
        label,
        name,
        id,
        options,
        placeholder,
        required = false,
        className,
        value,
        onChange,
        disabled,
        bgColor,
        searchable = false,
        icon,
    } = props;

    const handleReactSelectChange = (selected: SingleValue<OptionType>) => {
        if (!onChange) return;
        const syntheticEvent = {
            target: {
                name,
                value: selected?.value ?? "",
            },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
    };

    const selectedOption = options.find((opt) => opt.value === value) || null;
    const reactSelectOptions = options.filter((opt) => opt.value !== "");

    return (
        <label htmlFor={id} className={`${styles.label} ${className || ""}`}>
            {label && (
                <span className={styles.labelText}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </span>
            )}

            {searchable ? (
                <div className={styles.selectWrapper}>
                    <ReactSelect<OptionType, false>
                        inputId={id}
                        name={name}
                        options={reactSelectOptions}
                        value={selectedOption}
                        onChange={handleReactSelectChange}
                        placeholder={placeholder || "Pilih..."}
                        isDisabled={disabled}
                        isSearchable
                        required={required}
                        noOptionsMessage={() => "Tidak ada hasil"}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        menuPlacement="auto"
                        menuPortalTarget={document.body}
                        maxMenuHeight={250}
                        components={icon ? { IndicatorSeparator: () => null } : undefined}
                        styles={{
                            control: (base) => ({
                                ...base,
                                paddingLeft: icon ? 36 : 12,
                                display: "flex",
                                alignItems: "center",
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                padding: 0,
                            }),
                        }}
                    />
                    {icon && <span className={styles.icon}>{icon}</span>}
                </div>
            ) : (
                <div className={styles.selectWrapper} style={{ backgroundColor: bgColor }}>
                    <select
                        name={name}
                        id={id}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        className={styles.select}
                        style={icon ? { paddingLeft: "38px" } : undefined}
                        required={required}
                    >
                        {placeholder && <option value="">{placeholder}</option>}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {icon && <span className={styles.icon}>{icon}</span>}
                </div>
            )}
        </label>
    );
};

export default Select;