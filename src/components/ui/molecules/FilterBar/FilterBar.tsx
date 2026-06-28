import React from "react";
import SearchInput from "../SearchInput";
import Select from "../../atoms/Select";
import styles from "./FilterBar.module.css";

interface FilterItem {
    name: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    icon?: React.ReactNode;
}

interface FilterBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters: FilterItem[];
    customWidth?: string;
    children?: React.ReactNode;
}

const FilterBar = ({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Cari...",
    filters,
    customWidth,
    children,
}: FilterBarProps) => {
    return (
        <div className={styles.filterBar}>
            <SearchInput
                className={styles.searchContainer}
                style={customWidth ? { maxWidth: customWidth } : undefined}
                value={searchValue}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                id="filter-search"
            />
            <div className={styles.dropdowns}>
                {filters.map((filter) => (
                    <Select
                        key={filter.name}
                        id={`filter-${filter.name}`}
                        name={filter.name}
                        options={filter.options}
                        value={filter.value}
                        onChange={filter.onChange}
                        placeholder={filter.placeholder}
                        bgColor="#ffffff"
                        icon={filter.icon}
                    />
                ))}
                {children}
            </div>
        </div>
    );
};

export default FilterBar;
