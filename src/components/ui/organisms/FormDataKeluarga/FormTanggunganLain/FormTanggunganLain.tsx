import { useState, useEffect } from "react";
import styles from "./FormTanggunganLain.module.css";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";

export interface TanggunganLainFormPayload {
    nama: string;
    hubungan_keluarga: string;
    status_tanggungan: boolean;
}

interface FormTanggunganLainProps {
    onCancel: () => void;
    onSubmit?: (payload: TanggunganLainFormPayload) => void;
    initialData?: Partial<TanggunganLainFormPayload>;
    isLoading?: boolean;
}

const HUBUNGAN_OPTIONS = [
    { value: "", label: "Pilih Hubungan" },
    { value: "Mertua", label: "Mertua" },
    { value: "Keponakan", label: "Keponakan" },
    { value: "Kakek/Nenek", label: "Kakek/Nenek" },
    { value: "Paman/Bibi", label: "Paman/Bibi" },
    { value: "Saudara Kandung", label: "Saudara Kandung" },
    { value: "Lainnya", label: "Lainnya" },
];

const STATUS_OPTIONS = [
    { value: "", label: "Pilih Status" },
    { value: "1", label: "Iya" },
    { value: "0", label: "Tidak" },
];

const FormTanggunganLain = ({ onCancel, onSubmit, initialData, isLoading }: FormTanggunganLainProps) => {
    const [nama, setNama] = useState("");
    const [hubungan, setHubungan] = useState("");
    const [hubunganLainnya, setHubunganLainnya] = useState("");
    const [statusTanggungan, setStatusTanggungan] = useState("");

    useEffect(() => {
        if (initialData) {
            setNama(initialData.nama || "");
            
            const isStandardHubungan = HUBUNGAN_OPTIONS.some(
                (opt) => opt.value.toLowerCase() === (initialData.hubungan_keluarga || "").toLowerCase() && opt.value !== ""
            );
            
            if (initialData.hubungan_keluarga) {
                if (isStandardHubungan) {
                    setHubungan(initialData.hubungan_keluarga);
                    setHubunganLainnya("");
                } else {
                    setHubungan("Lainnya");
                    setHubunganLainnya(initialData.hubungan_keluarga);
                }
            } else {
                setHubungan("");
                setHubunganLainnya("");
            }

            if (initialData.status_tanggungan !== undefined) {
                setStatusTanggungan(initialData.status_tanggungan ? "1" : "0");
            } else {
                setStatusTanggungan("");
            }
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            const finalHubungan = hubungan === "Lainnya" ? hubunganLainnya : hubungan;
            onSubmit({
                nama,
                hubungan_keluarga: finalHubungan,
                status_tanggungan: statusTanggungan === "1",
            });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="tanggungan-nama"
                        name="nama"
                        label="Nama Lengkap"
                        placeholder="Nama lengkap tanggungan lain"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className={styles.col}>
                    <Select
                        name="hubungan-keluarga"
                        id="tanggungan-hubungan-keluarga"
                        label="Hubungan Keluarga"
                        options={HUBUNGAN_OPTIONS}
                        placeholder="Pilih hubungan"
                        value={hubungan}
                        onChange={(e) => setHubungan(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>
            {hubungan === "Lainnya" && (
                <Input
                    id="tanggungan-hubungan-lainnya"
                    name="hubungan-lainnya"
                    label="Sebutkan Hubungan Spesifik"
                    placeholder="Contoh: Sepupu dari pihak istri"
                    value={hubunganLainnya}
                    onChange={(e) => setHubunganLainnya(e.target.value)}
                    required
                    disabled={isLoading}
                />
            )}
            <div className={styles.row}>
                <div className={styles.col}>
                    <Select
                        id="tanggungan-status"
                        name="status-tanggungan"
                        label="Apakah Menjadi Tanggungan Anda?"
                        placeholder="Pilih status tanggungan"
                        options={STATUS_OPTIONS}
                        value={statusTanggungan}
                        onChange={(e) => setStatusTanggungan(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className={styles.actions}>
                <Button type="submit" label={isLoading ? "Menyimpan..." : "Simpan"} variant="primary" disabled={isLoading} />
                <Button type="button" label="Batal" variant="secondary" onClick={onCancel} disabled={isLoading} />
            </div>
        </form>
    );
};

export default FormTanggunganLain;