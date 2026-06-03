import { useState } from "react";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import styles from "./FormTambahJenisDiklat.module.css";

interface FormTambahJenisDiklatProps {
    isSubmitting?: boolean;
    serverErrors?: Record<string, string[]>;
    onCancel: () => void;
    onSubmit: (jenisBaru: string) => void;
}

const FormTambahJenisDiklat = ({
    isSubmitting = false,
    serverErrors,
    onCancel,
    onSubmit,
}: FormTambahJenisDiklatProps) => {
    const [jenisBaru, setJenisBaru] = useState("");

    const getFieldError = (field: string): string | undefined => {
        return serverErrors?.[field]?.[0];
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!jenisBaru.trim()) return;
        onSubmit(jenisBaru.trim());
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <Input
                id="jenis-baru"
                name="jenis_baru"
                label="Jenis Baru"
                value={jenisBaru}
                onChange={(e) => setJenisBaru(e.target.value)}
                error={getFieldError("jenis_baru")}
                required
            />

            <div className={styles.actions}>
                <Button
                    type="submit"
                    label={isSubmitting ? "Menyimpan..." : "Tambah"}
                    variant="primary"
                    disabled={isSubmitting || !jenisBaru.trim()}
                />
                <Button
                    type="button"
                    label="Batal"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                />
            </div>
        </form>
    );
};

export default FormTambahJenisDiklat;