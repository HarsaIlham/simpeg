import { useState } from "react";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import styles from "../FormStrsip.module.css";
import type { CardSipData } from "../../CardSip/CardSip";

interface FormSipProps {
    onCancel: () => void;
    onSubmit: (formData: FormData) => void;
    initialData?: CardSipData | null;
    isEdit?: boolean;
    isSubmitting?: boolean;
    isPegawai?: boolean;
    serverErrors?: Record<string, string[]>;
}

const FormSip = ({ onCancel, onSubmit, initialData, isSubmitting = false, serverErrors, isPegawai = true }: FormSipProps) => {
    const [nomorSip, setNomorSip] = useState(initialData?.nomorSip ?? "");
    const [tanggalTerbit, setTanggalTerbit] = useState(initialData?.tanggalTerbit ?? "");
    const [tanggalKadaluarsa, setTanggalKadaluarsa] = useState(initialData?.tanggalKadaluarsa ?? "");
    const [linkSk, _setLinkSk] = useState(initialData?.linkSk ?? "");
    const [skFile, setSkFile] = useState<File | null>(null);

    const getFieldError = (field: string): string | undefined => {
        return serverErrors?.[field]?.[0];
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append("nomor_sip", nomorSip);
        submitData.append("tanggal_terbit", tanggalTerbit);

        if (tanggalKadaluarsa) submitData.append("tanggal_kadaluarsa", tanggalKadaluarsa);
        if (skFile) submitData.append("sk_sip", skFile);

        onSubmit(submitData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <Input
                id="no-sip"
                name="nomor_sip"
                label="Nomor SIP"
                value={nomorSip}
                onChange={(e) => setNomorSip(e.target.value)}
                error={getFieldError("nomor_sip")}
                required
            />

            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="sip-terbit"
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
                        id="sip-kadaluarsa"
                        name="tanggal_kadaluarsa"
                        label="Tanggal Akhir"
                        type="date"
                        value={tanggalKadaluarsa}
                        onChange={(e) => setTanggalKadaluarsa(e.target.value)}
                        error={getFieldError("tanggal_kadaluarsa")}
                    />
                </div>
            </div>

            <Input
                id="sip-dokumen"
                name="sk_sip"
                type="file"
                label="Upload Dokumen SIP"
                onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setSkFile(file);
                }}
                error={getFieldError("sk_sip")}
                required={isPegawai && !linkSk && !skFile}
            />
            {linkSk && !skFile && (
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

export default FormSip;