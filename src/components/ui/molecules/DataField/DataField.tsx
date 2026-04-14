import styles from "./DataField.module.css";

interface DataFieldProps {
    label: string;
    value: string;
}

const DataField = ({ label, value }: DataFieldProps) => {
    return (
        <div className={styles.field}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
        </div>
    );
};

export default DataField;
