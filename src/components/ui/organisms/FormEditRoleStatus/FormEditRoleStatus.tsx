import { useState } from "react";
import Select from "../../atoms/Select";
import Button from "../../atoms/Button";
import styles from "./FormEditRoleStatus.module.css";
import type { PegawaiItem } from "../../../pages/Pegawai/templates/PegawaiAdmin";

interface FormEditRoleStatusProps {
    pegawai: PegawaiItem;
    initialRole: string;
    initialStatus: string;
    onSubmit: (role: string, status: string) => Promise<void> | void;
    onCancel: () => void;
    isSaving?: boolean;
}

const ROLE_OPTIONS = [
    { value: "pegawai", label: "Pegawai" },
    { value: "hrd", label: "HRD" },
    { value: "direktur", label: "Direktur" },
    { value: "admin", label: "Admin" },
];

const STATUS_OPTIONS = [
    { value: "aktif", label: "Aktif" },
    { value: "tidak aktif", label: "Tidak Aktif" },
];

const FormEditRoleStatus = ({
    pegawai,
    initialRole,
    initialStatus,
    onSubmit,
    onCancel,
    isSaving = false,
}: FormEditRoleStatusProps) => {
    const [role, setRole] = useState(initialRole);
    const [status, setStatus] = useState(initialStatus);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(role, status);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.editForm}>
            <p className={styles.formInstructions}>
                Nama Pegawai: <strong>{pegawai.nama}</strong>
                <br />
                NIK: <strong>{pegawai.nik}</strong>
            </p>

            <div className={styles.formGroup}>
                <label htmlFor="edit-role" className={styles.label}>Role / Hak Akses</label>
                <Select
                    id="edit-role"
                    name="role"
                    options={ROLE_OPTIONS}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="edit-status" className={styles.label}>Status Pegawai</label>
                <Select
                    id="edit-status"
                    name="status"
                    options={STATUS_OPTIONS}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
            </div>

            <div className={styles.buttonGroup}>
                <Button
                    type="submit"
                    label={isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    variant="primary"
                    disabled={isSaving}
                />
                <Button
                    type="button"
                    label="Batal"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSaving}
                />
            </div>
        </form>
    );
};

export default FormEditRoleStatus;
