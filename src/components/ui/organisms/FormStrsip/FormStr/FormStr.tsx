import { useState } from "react";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import styles from "../FormStrsip.module.css";
import type { CardStrData } from "../../CardStr/CardStr";

interface FormStrProps {
    onCancel: () => void;
    onSubmit: (formData: FormData) => void;
    initialData?: CardStrData | null;
    isEdit?: boolean;
    isSubmitting?: boolean;
    isPegawai?: boolean;
    serverErrors?: Record<string, string[]>;
}

const FormStr = ({ onCancel, onSubmit, initialData, isSubmitting = false, serverErrors, isPegawai = true }: FormStrProps) => {
    const [nomorStr, setNomorStr] = useState(initialData?.nomorStr ?? "");
    const [tanggalTerbit, setTanggalTerbit] = useState(initialData?.tanggalTerbit ?? "");
    const [tanggalKadaluarsa, setTanggalKadaluarsa] = useState(initialData?.tanggalKadaluarsa ?? "");
    const [isCurrent, setIsCurrent] = useState(initialData?.isCurrent ?? true);
    const [skFile, setSkFile] = useState<File | null>(null);

    const getFieldError = (field: string): string | undefined => {
        return serverErrors?.[field]?.[0];
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append("nomor_str", nomorStr);
        submitData.append("tanggal_terbit", tanggalTerbit);
        submitData.append("is_current", isCurrent ? "1" : "0");

        if (tanggalKadaluarsa) submitData.append("tanggal_kadaluarsa", tanggalKadaluarsa);
        if (skFile) submitData.append("sk_str", skFile);

        onSubmit(submitData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <Input
                id="no-str"
                name="nomor_str"
                label="Nomor STR"
                value={nomorStr}
                onChange={(e) => setNomorStr(e.target.value)}
                error={getFieldError("nomor_str")}
                required
            />
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="str-terbit"
                        name="tanggal_terbit"
                        label="Tanggal Terbit"
                        type="date"
                        value={tanggalTerbit}
                        onChange={(e) => setTanggalTerbit(e.target.value)}
                        error={getFieldError("tanggal_terbit")}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="str-kadaluarsa"
                        name="tanggal_kadaluarsa"
                        label="Tanggal Akhir"
                        type="date"
                        value={tanggalKadaluarsa}
                        onChange={(e) => setTanggalKadaluarsa(e.target.value)}
                        error={getFieldError("tanggal_kadaluarsa")}
                    />
                </div>
            </div>

            <Select
                id="str-status"
                name="is_current"
                label="Status"
                options={[
                    { value: "aktif", label: "Aktif" },
                    { value: "tidak-aktif", label: "Tidak Aktif" },
                ]}
                value={isCurrent ? "aktif" : "tidak-aktif"}
                onChange={(e) => setIsCurrent(e.target.value === "aktif")}
                required
            />

            <Input
                id="str-dokumen"
                name="sk_str"
                type="file"
                label="Upload Dokumen STR"
                onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setSkFile(file);
                }}
                error={getFieldError("sk_str")}
                required={isPegawai && !initialData?.linkSk}
            />
            {initialData?.linkSk && !skFile && (
                <span style={{ color: 'var(--color-muted, #6B7280)', fontSize: '12px', fontStyle: 'italic', marginTop: '-12px', display: 'block' }}>
                    File sudah ada. Upload baru hanya jika ingin mengganti.
                </span>
            )}

            <div className={styles.actions}>
                <Button type="submit" label={isSubmitting ? "Menyimpan..." : "Simpan"} variant="primary" disabled={isSubmitting} />
                <Button type="button" label="Batal" variant="secondary" onClick={onCancel} disabled={isSubmitting} />
            </div>
        </form>
    );
};

export default FormStr;