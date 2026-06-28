import { useState, useEffect } from "react";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import styles from "./FormPasangan.module.css";
import kota from "../../../../../data/kota.json";

export interface PasanganFormPayload {
    nama_lengkap: string;
    nik: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    pekerjaan: string;
    instansi: string;
    status_pernikahan: string;
    tanggal_pernikahan: string;
    nomor_buku_nikah: string;
    status_tanggungan: string;
    npwp_pasangan: string;
    buku_nikah_file: File | null;
    buku_nikah_file_path?: string;
}

interface FormPasanganProps {
    onCancel: () => void;
    onSubmit?: (payload: PasanganFormPayload) => void;
    initialData?: Partial<PasanganFormPayload>;
    isLoading?: boolean;
}

const kotaOptions = kota.map((kota) => ({
    value: kota,
    label: kota,
}));

const statusPernikahanOptions = [
    { value: "", label: "Pilih Status Pernikahan" },
    { value: "Sah", label: "Sah" },
    { value: "Cerai Hidup", label: "Cerai Hidup" },
    { value: "Cerai Mati", label: "Cerai Mati" },
];

const statusTanggunganOptions = [
    { value: "", label: "Pilih Status Tanggungan" },
    { value: "1", label: "Ya" },
    { value: "0", label: "Tidak" },
];

const FormPasangan = ({ onCancel, onSubmit, initialData, isLoading }: FormPasanganProps) => {
    const [formData, setFormData] = useState<Omit<PasanganFormPayload, 'buku_nikah_file'>>({
        nama_lengkap: "",
        nik: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        pekerjaan: "",
        instansi: "",
        status_pernikahan: "",
        tanggal_pernikahan: "",
        nomor_buku_nikah: "",
        status_tanggungan: "",
        npwp_pasangan: "",
    });
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                nama_lengkap: initialData.nama_lengkap || "",
                nik: initialData.nik || "",
                tempat_lahir: initialData.tempat_lahir || "",
                tanggal_lahir: initialData.tanggal_lahir || "",
                pekerjaan: initialData.pekerjaan || "",
                instansi: initialData.instansi || "",
                status_pernikahan: initialData.status_pernikahan || "",
                tanggal_pernikahan: initialData.tanggal_pernikahan || "",
                nomor_buku_nikah: initialData.nomor_buku_nikah || "",
                status_tanggungan: initialData.status_tanggungan || "",
                npwp_pasangan: initialData.npwp_pasangan || "",
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({
                ...formData,
                buku_nikah_file: file,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="pasangan-nama"
                        name="nama_lengkap"
                        label="Nama Lengkap"
                        placeholder="Masukkan nama lengkap"
                        value={formData.nama_lengkap}
                        onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="pasangan-nik"
                        name="nik"
                        label="NIK"
                        placeholder="Masukkan NIK"
                        type="text"
                        onlyNumbers={true}
                        value={formData.nik}
                        onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Select
                        id="pasangan-tempat-lahir"
                        name="tempat_lahir"
                        label="Tempat Lahir"
                        options={kotaOptions}
                        placeholder="Pilih Kota"
                        value={formData.tempat_lahir}
                        onChange={(e) => setFormData({ ...formData, tempat_lahir: e.target.value })}
                        searchable
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="pasangan-tanggal-lahir"
                        name="tanggal_lahir"
                        label="Tanggal Lahir"
                        type="date"
                        value={formData.tanggal_lahir}
                        onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="pasangan-pekerjaan"
                        name="pekerjaan"
                        label="Pekerjaan"
                        placeholder="Masukkan pekerjaan"
                        value={formData.pekerjaan}
                        onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="pasangan-instansi"
                        name="instansi"
                        label="Instansi"
                        placeholder="Tempat bekerja"
                        value={formData.instansi}
                        onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Select
                        id="pasangan-status-pernikahan"
                        name="status_pernikahan"
                        label="Status Pernikahan"
                        options={statusPernikahanOptions}
                        value={formData.status_pernikahan}
                        onChange={(e) => setFormData({ ...formData, status_pernikahan: e.target.value })}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="pasangan-tanggal-pernikahan"
                        name="tanggal_pernikahan"
                        label="Tanggal Pernikahan"
                        type="date"
                        value={formData.tanggal_pernikahan}
                        onChange={(e) => setFormData({ ...formData, tanggal_pernikahan: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="pasangan-nomor-buku-nikah"
                        name="nomor_buku_nikah"
                        label="Nomor Buku Nikah"
                        placeholder="Masukkan nomor buku nikah"
                        value={formData.nomor_buku_nikah}
                        onChange={(e) => setFormData({ ...formData, nomor_buku_nikah: e.target.value })}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Select
                        id="pasangan-status-tanggungan"
                        name="status_tanggungan"
                        label="Status Tanggungan"
                        options={statusTanggunganOptions}
                        value={formData.status_tanggungan}
                        onChange={(e) => setFormData({ ...formData, status_tanggungan: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="pasangan-npwp"
                        name="npwp_pasangan"
                        label="NPWP Pasangan"
                        placeholder="Masukkan NPWP"
                        value={formData.npwp_pasangan}
                        onChange={(e) => setFormData({ ...formData, npwp_pasangan: e.target.value })}
                    />
                </div>
            </div>
            <Input
                id="pasangan-buku-nikah-file"
                name="buku_nikah_file"
                label="File Buku Nikah"
                placeholder="Upload file buku nikah"
                type="file"
                onChange={(e) => {
                    const selected = e.target.files?.[0] ?? null;
                    setFile(selected);
                }}
                required={!initialData?.buku_nikah_file_path}
            />
            {initialData?.buku_nikah_file_path && !file && (
                <span className={styles.fileHint}>
                    File buku nikah sudah ada. Upload baru hanya jika ingin mengganti.
                </span>
            )}
            <div className={styles.actions}>
                <Button type="submit" label={isLoading ? "Menyimpan..." : "Simpan"} variant="primary" disabled={isLoading} />
                <Button type="button" label="Batal" variant="secondary" onClick={onCancel} disabled={isLoading} />
            </div>
        </form>
    )
}

export default FormPasangan