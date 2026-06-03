import { useState } from "react";
import styles from "./FormTanggunganLain.module.css";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";

export interface TanggunganLainData {
    nama: string;
    hubunganKeluarga: string;
    hubunganLainnya: string;
    nik: string;
    statusTanggungan: string;
}

interface FormTanggunganLainProps {
    onCancel: () => void;
    onSubmit?: (e: React.FormEvent) => void;
    initialData?: TanggunganLainData;
}

const HUBUNGAN_OPTIONS = [
    { value: "", label: "Pilih Hubungan" },
    { value: "mertua", label: "Mertua" },
    { value: "keponakan", label: "Keponakan" },
    { value: "kakek/nenek", label: "Kakek/Nenek" },
    { value: "paman/bibi", label: "Paman/Bibi" },
    { value: "saudara kandung", label: "Saudara Kandung" },
    { value: "lainnya", label: "Lainnya" },
];

const STATUS_OPTIONS = [
    { value: "", label: "Pilih Status" },
    { value: "iya", label: "Iya" },
    { value: "tidak", label: "Tidak" },
];

const FormTanggunganLain = ({ onCancel, onSubmit, initialData }: FormTanggunganLainProps) => {
    const [nama, setNama] = useState(initialData?.nama || "");
    const [hubungan, setHubungan] = useState(initialData?.hubunganKeluarga || "");
    const [hubunganLainnya, setHubunganLainnya] = useState(initialData?.hubunganLainnya || "");
    const [nik, setNik] = useState(initialData?.nik || "");
    const [statusTanggungan, setStatusTanggungan] = useState(initialData?.statusTanggungan || "");

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
                        id="nama"
                        name="nama"
                        label="Nama Lengkap"
                        placeholder="Nama lengkap tanggungan lain"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Select
                        name="hubungan-keluarga"
                        id="hubungan-keluarga"
                        label="Hubungan Keluarga"
                        options={HUBUNGAN_OPTIONS}
                        placeholder="Pilih hubungan"
                        value={hubungan}
                        onChange={(e) => setHubungan(e.target.value)}
                        required
                    />
                </div>
            </div>
            {hubungan === "lainnya" && (
                <Input
                    id="hubungan-lainnya"
                    name="hubungan-lainnya"
                    label="Sebutkan Hubungan Spesifik"
                    placeholder="Contoh: Sepupu dari pihak istri"
                    value={hubunganLainnya}
                    onChange={(e) => setHubunganLainnya(e.target.value)}
                    required
                />
            )}
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="nik"
                        name="nik"
                        label="NIK"
                        placeholder="Nomor Induk Kependudukan"
                        type="text"
                        onlyNumbers={true}
                        value={nik}
                        onChange={(e) => setNik(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Select
                        id="status-tanggungan"
                        name="status-tanggungan"
                        label="Status Tanggungan"
                        placeholder="Status tanggungan lain"
                        options={STATUS_OPTIONS}
                        value={statusTanggungan}
                        onChange={(e) => setStatusTanggungan(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className={styles.actions}>
                <Button type="submit" label="Simpan" variant="primary" />
                <Button type="button" label="Batal" variant="secondary" onClick={onCancel} />
            </div>

        </form>
    )
}

export default FormTanggunganLain