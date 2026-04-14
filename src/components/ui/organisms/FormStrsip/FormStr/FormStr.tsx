import React from "react";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import styles from "../FormStrsip.module.css";

interface FormStrProps {
    onCancel: () => void;
    onSubmit?: (e: React.FormEvent) => void;
}

const statusOptions = [
    { value: "Aktif", label: "Aktif" },
    { value: "Tidak Aktif", label: "Tidak Aktif" },
];

const FormStr = ({ onCancel, onSubmit }: FormStrProps) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
        console.log("Form STR Tersubmit!");
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <Input id="no-str" name="no-str" label="Nomor STR *" required />
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input id="str-terbit" name="str-terbit" label="Terbit" type="date" />
                </div>
                <div className={styles.col}>
                    <Input id="str-berlaku" name="str-berlaku" label="Berlaku" type="date" />
                </div>
            </div>
            <Select id="str-status" name="str-status" label="Status *" options={statusOptions} required />
            <Input id="str-dokumen" name="str-dokumen" type="file" label="Upload Dokumen" />

            <div className={styles.actions}>
                <Button type="submit" label="Simpan" variant="primary" />
                <Button type="button" label="Batal" variant="secondary" onClick={onCancel} />
            </div>
        </form>
    );
};

export default FormStr;