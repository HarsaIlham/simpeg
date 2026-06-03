import styles from "./DataField.module.css";
import { formatLongDate } from "../../../../utils/dateUtils";

interface DataFieldProps {
    label: string;
    value: string;
    isDate?: boolean;
}

const DataField = ({ label, value, isDate }: DataFieldProps) => {
    const displayValue = (isDate && value) ? formatLongDate(value) : (value || "-");
    
    return (
        <div className={styles.field}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{displayValue}</span>
        </div>
    );
};

export default DataField;
