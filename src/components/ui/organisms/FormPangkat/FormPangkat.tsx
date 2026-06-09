import { useState } from "react";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import styles from "./FormPangkat.module.css";
import type { CardPangkatData } from "../CardPangkat/CardPangkat";

interface FormPangkatProps {
    initialData?: CardPangkatData | null;
    isEdit?: boolean;
    isSubmitting?: boolean;
    isPegawai?: boolean;
    serverErrors?: Record<string, string[]>;
    onCancel: () => void;
    onSubmit: (formData: FormData) => void;
}

const FormPangkat = ({ initialData, isSubmitting = false, serverErrors, onCancel, onSubmit, isPegawai = true }: FormPangkatProps) => {
    const [namaPangkat, setNamaPangkat] = useState(initialData?.namaPangkat ?? "");
    const [isCurrent, setIsCurrent] = useState(initialData?.isCurrent ?? false);
    const [pejabatPenetap, setPejabatPenetap] = useState(initialData?.pejabatPenetap ?? "");
    const [tmtSk, setTmtSk] = useState(initialData?.tmtSk ?? "");
    const [startedAt, setStartedAt] = useState(initialData?.startedAt ?? "");
    const [endedAt, setEndedAt] = useState(initialData?.endedAt ?? "");
    const [note, setNote] = useState(initialData?.note ?? "");
    const [skFile, setSkFile] = useState<File | null>(null);

    const getFieldError = (field: string): string | undefined => {
        return serverErrors?.[field]?.[0];
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append("nama_pangkat", namaPangkat);
        submitData.append("is_current", isCurrent ? "1" : "0");

        if (pejabatPenetap) submitData.append("pejabat_penetap", pejabatPenetap);
        if (tmtSk) submitData.append("tmt_sk", tmtSk);
        if (startedAt) submitData.append("started_at", startedAt);
        if (endedAt) submitData.append("ended_at", endedAt);
        if (note) submitData.append("note", note);
        if (skFile) submitData.append("sk_pangkat", skFile);

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <Input
                id="nama-pangkat"
                name="nama_pangkat"
                label="Nama Pangkat"
                value={namaPangkat}
                onChange={(e) => setNamaPangkat(e.target.value)}
                error={getFieldError("nama_pangkat")}
                required
            />

            <div className={styles.row}>
                <div className={styles.col}>
                    <Select
                        id="status-pangkat"
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
                </div>
                <div className={styles.col}>
                    <Input
                        id="pejabat-penetap"
                        name="pejabat_penetap"
                        label="Pejabat Penetap"
                        value={pejabatPenetap}
                        onChange={(e) => setPejabatPenetap(e.target.value)}
                        error={getFieldError("pejabat_penetap")}
                        required
                    />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="tmt-sk"
                        name="tmt_sk"
                        type="date"
                        label="TMT SK"
                        value={tmtSk}
                        onChange={(e) => setTmtSk(e.target.value)}
                        error={getFieldError("tmt_sk")}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="started-at"
                        name="started_at"
                        type="date"
                        label="Tanggal Mulai"
                        value={startedAt}
                        onChange={(e) => setStartedAt(e.target.value)}
                        error={getFieldError("started_at")}
                        required
                    />
                </div>
            </div>

            <Input
                id="ended-at"
                name="ended_at"
                type="date"
                label="Tanggal Selesai"
                value={endedAt}
                onChange={(e) => setEndedAt(e.target.value)}
                error={getFieldError("ended_at")}

            />

            <Input
                id="note-pangkat"
                name="note"
                label="Catatan"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                error={getFieldError("note")}
            />

            <Input
                id="sk-pangkat-file"
                name="sk_pangkat"
                type="file"
                label="Upload SK Pangkat"
                onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setSkFile(file);
                }}
                error={getFieldError("sk_pangkat")}
                required={isPegawai}
            />
            {initialData?.linkSk && !skFile && (
                <span style={{ color: 'var(--color-muted, #6B7280)', fontSize: '12px', fontStyle: 'italic', marginTop: '-12px', display: 'block' }}>
                    File SK sudah ada. Upload baru hanya jika ingin mengganti.
                </span>
            )}

            <div className={styles.actions}>
                <Button type="submit" label={isSubmitting ? "Menyimpan..." : "Simpan"} variant="primary" disabled={isSubmitting} />
                <Button type="button" label="Batal" variant="secondary" onClick={onCancel} disabled={isSubmitting} />
            </div>
        </form>
    )
}

export default FormPangkat