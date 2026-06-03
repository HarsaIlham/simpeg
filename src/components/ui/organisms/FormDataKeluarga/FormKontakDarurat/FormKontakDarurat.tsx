import { useState, useEffect } from "react";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import Textarea from "../../../atoms/Textarea";
import styles from "./FormKontakDarurat.module.css";

export interface KontakDaruratFormPayload {
    nama_kontak: string;
    hubungan_keluarga: string;
    nomor_hp: string;
    alamat: string;
}

interface FormKontakDaruratProps {
    onCancel: () => void;
    onSubmit?: (payload: KontakDaruratFormPayload) => void;
    initialData?: Partial<KontakDaruratFormPayload>;
    isLoading?: boolean;
}

const HUBUNGAN_OPTIONS = [
    { value: "", label: "Pilih Hubungan" },
    { value: "Suami", label: "Suami" },
    { value: "Istri", label: "Istri" },
    { value: "Anak", label: "Anak" },
    { value: "Orang Tua", label: "Orang Tua" },
    { value: "Saudara Kandung", label: "Saudara Kandung" },
    { value: "Paman", label: "Paman" },
    { value: "Bibi", label: "Bibi" },
    { value: "Lainnya", label: "Lainnya" },
];

const FormKontakDarurat = ({ onCancel, onSubmit, initialData, isLoading }: FormKontakDaruratProps) => {
    const [formData, setFormData] = useState<KontakDaruratFormPayload>({
        nama_kontak: "",
        hubungan_keluarga: "",
        nomor_hp: "",
        alamat: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nama_kontak: initialData.nama_kontak || "",
                hubungan_keluarga: initialData.hubungan_keluarga || "",
                nomor_hp: initialData.nomor_hp || "",
                alamat: initialData.alamat || "",
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) onSubmit(formData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="kontak-nama"
                        name="nama_kontak"
                        label="Nama Kontak Darurat"
                        placeholder="Nama lengkap kontak darurat"
                        value={formData.nama_kontak}
                        onChange={(e) => setFormData({ ...formData, nama_kontak: e.target.value })}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Select
                        name="hubungan_keluarga"
                        id="kontak-hubungan-keluarga"
                        label="Hubungan Keluarga"
                        options={HUBUNGAN_OPTIONS}
                        placeholder="Pilih hubungan"
                        value={formData.hubungan_keluarga}
                        onChange={(e) => setFormData({ ...formData, hubungan_keluarga: e.target.value })}
                        required
                    />
                </div>
            </div>
            <Input
                id="kontak-nomor-hp"
                name="nomor_hp"
                label="Nomor HP"
                placeholder="08xxxxxxxxxxxx"
                type="text"
                onlyNumbers={true}
                value={formData.nomor_hp}
                onChange={(e) => setFormData({ ...formData, nomor_hp: e.target.value })}
                required
            />
            <Textarea
                id="kontak-alamat"
                name="alamat"
                label="Alamat"
                placeholder="Alamat lengkap kontak darurat"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                required
            />

            <div className={styles.actions}>
                <Button type="submit" label={isLoading ? "Menyimpan..." : "Simpan"} variant="primary" disabled={isLoading} />
                <Button type="button" label="Batal" variant="secondary" onClick={onCancel} disabled={isLoading} />
            </div>

        </form>
    )
}

export default FormKontakDarurat