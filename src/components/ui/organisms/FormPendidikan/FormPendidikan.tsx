import { useState } from "react";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import styles from "./FormPendidikan.module.css";
import type { CardPendidikanData } from "../CardPendidikan/CardPendidikan";

interface FormPendidikanProps {
    initialData?: CardPendidikanData | null;
    isEdit?: boolean;
    isSubmitting?: boolean;
    serverErrors?: Record<string, string[]>;
    onCancel: () => void;
    onSubmit: (formData: FormData) => void;
    isPegawai?: boolean;
}

const jenjangOptions = [
    { value: "", label: "Pilih Jenjang Pendidikan" },
    { value: "SD", label: "SD" },
    { value: "SMP", label: "SMP" },
    { value: "SMA", label: "SMA" },
    { value: "SMK", label: "SMK" },
    { value: "D3", label: "D3" },
    { value: "D4", label: "D4" },
    { value: "S1", label: "S1" },
    { value: "S2", label: "S2" },
    { value: "S3", label: "S3" },
];

const FormPendidikan = ({
    initialData,
    isSubmitting = false,
    serverErrors,
    onCancel,
    onSubmit,
    isPegawai = true,
}: FormPendidikanProps) => {
    const [jenjang, setJenjang] = useState(initialData?.jenjang ?? "");
    const [jurusan, setJurusan] = useState(initialData?.jurusan ?? "");
    const [institusi, setInstitusi] = useState(initialData?.institusi ?? "");
    const [tahunLulus, setTahunLulus] = useState(
        initialData?.tahun_lulus ? String(initialData.tahun_lulus) : ""
    );
    const [nomorIjazah, setNomorIjazah] = useState(initialData?.nomor_ijazah ?? "");
    const [ijazahFile, setIjazahFile] = useState<File | null>(null);
    const jurusanEnabled = jenjang !== "SD" && jenjang !== "SMP" && jenjang !== "SMA";

    const getFieldError = (field: string): string | undefined => {
        return serverErrors?.[field]?.[0];
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("jenjang", jenjang);
        formData.append("institusi", institusi);
        formData.append("jurusan", jurusanEnabled ? jurusan : "-");
        formData.append("tahun_lulus", tahunLulus);

        if (nomorIjazah) {
            formData.append("nomor_ijazah", nomorIjazah);
        }

        if (ijazahFile) {
            formData.append("ijazah", ijazahFile);
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Select
                        id="jenjang-pendidikan"
                        name="jenjang"
                        label="Jenjang Pendidikan"
                        options={jenjangOptions}
                        value={jenjang}
                        onChange={(e) => {
                            const val = e.target.value;
                            setJenjang(val);
                            if (val === "SD" || val === "SMP" || val === "SMA") {
                                setJurusan("-");
                            } else if (jurusan === "-") {
                                setJurusan("");
                            }
                        }}
                        required
                    />
                    {getFieldError("jenjang") && (
                        <span className={styles.errorText}>{getFieldError("jenjang")}</span>
                    )}
                </div>
                {jurusanEnabled && (
                    <div className={styles.col}>
                        <Input
                            id="jurusan"
                            name="jurusan"
                            label="Jurusan"
                            value={jurusan}
                            onChange={(e) => setJurusan(e.target.value)}
                            error={getFieldError("jurusan")}
                            required={jurusanEnabled}
                        />
                    </div>
                )}
            </div>

            <Input
                id="institusi"
                name="institusi"
                label="Institusi"
                value={institusi}
                onChange={(e) => setInstitusi(e.target.value)}
                error={getFieldError("institusi")}
                required
            />

            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="tahun-lulus"
                        name="tahun_lulus"
                        label="Tahun Lulus"
                        type="text"
                        onlyNumbers
                        value={tahunLulus}
                        onChange={(e) => setTahunLulus(e.target.value)}
                        error={getFieldError("tahun_lulus")}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="nomor-ijazah"
                        name="nomor_ijazah"
                        label="No Ijazah"
                        value={nomorIjazah}
                        onChange={(e) => setNomorIjazah(e.target.value)}
                        error={getFieldError("nomor_ijazah")}
                        required
                    />
                </div>
            </div>

            <Input
                id="ijazah-file"
                name="ijazah"
                type="file"
                label="Upload Ijazah"
                onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setIjazahFile(file);
                }}
                error={getFieldError("ijazah")}
                required={isPegawai && !initialData?.link_ijazah}
            />
            {initialData?.link_ijazah && !ijazahFile && (
                <span className={styles.fileHint}>
                    File ijazah sudah ada, Upload baru hanya jika ingin mengganti.
                </span>
            )}

            <div className={styles.actions}>
                <Button
                    type="submit"
                    label={isSubmitting ? "Menyimpan..." : "Simpan"}
                    variant="primary"
                    disabled={isSubmitting}
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

export default FormPendidikan;