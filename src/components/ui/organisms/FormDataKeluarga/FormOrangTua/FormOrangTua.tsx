import { useState, useEffect } from "react";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import Textarea from "../../../atoms/Textarea";
import styles from "./FormOrangTua.module.css";

export interface OrangTuaFormPayload {
    nama_ayah: string;
    nama_ibu: string;
    status_hidup: string;
    alamat: string;
}

interface FormOrangTuaProps {
    onCancel: () => void;
    onSubmit?: (payload: OrangTuaFormPayload) => void;
    initialData?: Partial<OrangTuaFormPayload>;
    isLoading?: boolean;
}

const statusOptions = [
    { value: "Hidup", label: "Masih Hidup" },
    { value: "Meninggal", label: "Meninggal" },
];

const FormOrangTua = ({ onCancel, onSubmit, initialData, isLoading }: FormOrangTuaProps) => {
    const [formData, setFormData] = useState<OrangTuaFormPayload>({
        nama_ayah: "",
        nama_ibu: "",
        status_hidup: "",
        alamat: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nama_ayah: initialData.nama_ayah || "",
                nama_ibu: initialData.nama_ibu || "",
                status_hidup: initialData.status_hidup || "",
                alamat: initialData.alamat || "",
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="orangtua-nama-ayah"
                        name="nama_ayah"
                        label="Nama Ayah"
                        placeholder="Masukkan nama ayah"
                        value={formData.nama_ayah}
                        onChange={(e) => setFormData({ ...formData, nama_ayah: e.target.value })}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="orangtua-nama-ibu"
                        name="nama_ibu"
                        label="Nama Ibu"
                        placeholder="Masukkan nama ibu"
                        value={formData.nama_ibu}
                        onChange={(e) => setFormData({ ...formData, nama_ibu: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Select
                        id="orangtua-status-hidup"
                        name="status_hidup"
                        label="Status"
                        options={statusOptions}
                        placeholder="Pilih status"
                        value={formData.status_hidup}
                        onChange={(e) => setFormData({ ...formData, status_hidup: e.target.value })}
                        required
                    />
                </div>
            </div>
            <Textarea
                id="orangtua-alamat"
                name="alamat"
                label="Alamat"
                placeholder="Alamat lengkap orang tua"
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

export default FormOrangTua