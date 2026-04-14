import React from "react";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import styles from "./FormJabatan.module.css";

interface FormJabatanProps {
    onCancel: () => void;
    onSubmit?: (e: React.FormEvent) => void;
}

const FormJabatan = ({ onCancel, onSubmit }: FormJabatanProps) => {
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
        console.log("Form Tersubmit!");
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input 
                        id="nama-jabatan" 
                        name="nama-jabatan" 
                        label="Nama Jabatan" 
                        required 
                    />
                </div>
                <div className={styles.col}>
                    <Input 
                        id="unit-kerja" 
                        name="unit-kerja" 
                        label="Unit/Tempat Kerja" 
                        required 
                    />
                </div>
            </div>

            <Input 
                id="tmt" 
                name="tmt" 
                type="date" 
                label="TMT (Terhitung Mulai Tanggal)" 
                required 
            />

            <Input 
                id="no-sk" 
                name="no-sk" 
                label="No SK" 
                required 
            />

            <Input 
                id="dokumen" 
                name="dokumen" 
                type="file" 
                label="Upload Dokumen" 
            />

            <div className={styles.actions}>
                <Button 
                    type="submit" 
                    label="Simpan" 
                    variant="primary" 
                />
                <Button 
                    type="button" 
                    label="Batal" 
                    variant="secondary" 
                    onClick={onCancel} 
                />
            </div>
        </form>
    );
};

export default FormJabatan;
