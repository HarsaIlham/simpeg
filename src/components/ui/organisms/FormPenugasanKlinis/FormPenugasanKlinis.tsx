import { useState } from "react";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import styles from "./FormPenugasanKlinis.module.css";
import type { CardPenugasanKlinisData } from "../CardPenugasanKlinis/CardPenugasanKlinis";

interface FormPenugasanKlinisProps {
    initialData?: CardPenugasanKlinisData | null;
    isSubmitting?: boolean;
    serverErrors?: Record<string, string[]>;
    onCancel: () => void;
    onSubmit: (formData: FormData) => void;
}

const FormPenugasanKlinis = ({ initialData, isSubmitting = false, serverErrors, onCancel, onSubmit }: FormPenugasanKlinisProps) => {
    const [nomorSurat, setNomorSurat] = useState(initialData?.nomorSurat ?? "");
    const [tglMulai, setTglMulai] = useState(initialData?.tglMulai ?? "");
    const [tglKadaluarsa, setTglKadaluarsa] = useState(initialData?.tglKadaluarsa ?? "");
    const [isCurrent, setIsCurrent] = useState(initialData?.isCurrent ?? true);
    const [dokumenFile, setDokumenFile] = useState<File | null>(null);

    const getFieldError = (field: string): string | undefined => {
        return serverErrors?.[field]?.[0];
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append("nomor_surat", nomorSurat);
        submitData.append("tgl_mulai", tglMulai);
        submitData.append("is_current", isCurrent ? "1" : "0");

        if (tglKadaluarsa) submitData.append("tgl_kadaluarsa", tglKadaluarsa);
        if (dokumenFile) submitData.append("dokumen_file", dokumenFile);

        onSubmit(submitData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <Input
                id="no-surat"
                name="nomor_surat"
                label="Nomor Surat"
                value={nomorSurat}
                onChange={(e) => setNomorSurat(e.target.value)}
                error={getFieldError("nomor_surat")}
                required
            />

            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="tgl-mulai"
                        name="tgl_mulai"
                        label="Tanggal Mulai"
                        type="date"
                        value={tglMulai}
                        onChange={(e) => setTglMulai(e.target.value)}
                        error={getFieldError("tgl_mulai")}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="tgl-kadaluarsa"
                        name="tgl_kadaluarsa"
                        label="Tanggal Kadaluarsa"
                        type="date"
                        value={tglKadaluarsa}
                        onChange={(e) => setTglKadaluarsa(e.target.value)}
                        error={getFieldError("tgl_kadaluarsa")}
                    />
                </div>
            </div>

            <Select
                id="pk-status"
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
                id="pk-dokumen"
                name="dokumen_file"
                type="file"
                label="Upload Dokumen"
                onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setDokumenFile(file);
                }}
                error={getFieldError("dokumen_file")}
                required
            />
            {initialData?.linkDokumen && !dokumenFile && (
                <span style={{ color: 'var(--color-muted, #6B7280)', fontSize: '12px', fontStyle: 'italic', marginTop: '-12px', display: 'block' }}>
                    File sudah ada. Upload baru hanya jika ingin mengganti.
                </span>
            )}

            <div className={styles.actions}>
                <Button type="submit" label={isSubmitting ? "Menyimpan..." : "Simpan"} variant="primary" disabled={isSubmitting} />
                <Button type="button" label="Batal" variant="secondary" onClick={onCancel} disabled={isSubmitting} />
            </div>
        </form>
    )
}

export default FormPenugasanKlinis