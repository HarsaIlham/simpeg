import React from "react";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import styles from "../FormStrsip.module.css";

interface FormSipProps {
    onCancel: () => void;
    onSubmit?: (e: React.FormEvent) => void;
}

const statusOptions = [
    { value: "Aktif", label: "Aktif" },
    { value: "Tidak Aktif", label: "Tidak Aktif" },
];

const FormSip = ({ onCancel, onSubmit }: FormSipProps) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
        console.log("Form SIP Tersubmit!");
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input id="no-sip" name="no-sip" label="Nomor SIP *" required />
                </div>
                <div className={styles.col}>
                    <Input id="sip-tempat" name="sip-tempat" label="Tempat *" required />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input id="sip-terbit" name="sip-terbit" label="Terbit" type="date" />
                </div>
                <div className={styles.col}>
                    <Input id="sip-berlaku" name="sip-berlaku" label="Berlaku" type="date" />
                </div>
            </div>
            <Select id="sip-status" name="sip-status" label="Status *" options={statusOptions} required />
            <Input id="sip-dokumen" name="sip-dokumen" type="file" label="Upload Dokumen" />

            <div className={styles.actions}>
                <Button type="submit" label="Simpan" variant="primary" />
                <Button type="button" label="Batal" variant="secondary" onClick={onCancel} />
            </div>
        </form>
    );
};

export default FormSip;