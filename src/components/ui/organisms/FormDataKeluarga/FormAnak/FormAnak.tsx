import { useState, useEffect } from "react";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import Textarea from "../../../atoms/Textarea";
import styles from "./FormAnak.module.css";
import { calculateAge } from "../../../../../utils/dateUtils";
import kotas  from "../../../../../data/kota.json";

export interface AnakFormPayload {
    nama_lengkap: string;
    nik: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    status_anak: string;
    pendidikan_terakhir: string;
    status_tanggungan: string;
    keterangan_disabilitas: string;
    akta_kelahiran_file: File | null;
}

interface FormAnakProps {
    onCancel: () => void;
    onSubmit?: (payload: AnakFormPayload) => void;
    initialData?: Partial<AnakFormPayload>;
    isLoading?: boolean;
}

const statusTanggunganOptions = [
    { value: "", label: "Pilih Status" },
    { value: "1", label: "Ya" },
    { value: "0", label: "Tidak" },
];

const jenisKelaminOptions = [
    { value: "", label: "Pilih Jenis Kelamin" },
    { value: "L", label: "Laki-laki" },
    { value: "P", label: "Perempuan" },
];

const kotaOptions = kotas.map((kota) => ({
    value: kota,
    label: kota,
}));

const statusAnakOptions = [
    { value: "", label: "Pilih Status" },
    { value: "Kandung", label: "Kandung" },
    { value: "Tiri", label: "Tiri" },
    { value: "Angkat", label: "Angkat" },
];

const pendidikanOptions = [
    { value: "", label: "Pilih Pendidikan" },
    { value: "Belum Sekolah", label: "Belum Sekolah" },
    { value: "TK", label: "TK" },
    { value: "SD", label: "SD" },
    { value: "SMP", label: "SMP" },
    { value: "SMA", label: "SMA" },
    { value: "D3", label: "D3" },
    { value: "S1", label: "S1" },
    { value: "S2", label: "S2" },
    { value: "S3", label: "S3" },
];

const FormAnak = ({ onCancel, onSubmit, initialData, isLoading }: FormAnakProps) => {
    const [formData, setFormData] = useState<Omit<AnakFormPayload, 'akta_kelahiran_file'>>({
        nama_lengkap: "",
        nik: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        jenis_kelamin: "",
        status_anak: "",
        pendidikan_terakhir: "",
        status_tanggungan: "",
        keterangan_disabilitas: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [usia, setUsia] = useState<string>("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                nama_lengkap: initialData.nama_lengkap || "",
                nik: initialData.nik || "",
                tempat_lahir: initialData.tempat_lahir || "",
                tanggal_lahir: initialData.tanggal_lahir || "",
                jenis_kelamin: initialData.jenis_kelamin || "",
                status_anak: initialData.status_anak || "",
                pendidikan_terakhir: initialData.pendidikan_terakhir || "",
                status_tanggungan: initialData.status_tanggungan || "",
                keterangan_disabilitas: initialData.keterangan_disabilitas || "",
            });
            if (initialData.tanggal_lahir) {
                setUsia(calculateAge(initialData.tanggal_lahir));
            }
        }
    }, [initialData]);

    const handleTanggalLahirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        setFormData({ ...formData, tanggal_lahir: selectedDate });
        setUsia(calculateAge(selectedDate));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({
                ...formData,
                akta_kelahiran_file: file,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="anak-nama"
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
                        id="anak-nik"
                        name="nik"
                        label="NIK"
                        placeholder="Nomor Induk Kependudukan"
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
                        id="anak-tempat-lahir"
                        name="tempat_lahir"
                        label="Tempat Lahir"
                        placeholder="Pilih Kota/Kabupaten"
                        options={kotaOptions}
                        value={formData.tempat_lahir}
                        onChange={(e) => setFormData({ ...formData, tempat_lahir: e.target.value })}
                        searchable
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="anak-tanggal-lahir"
                        name="tanggal_lahir"
                        label="Tanggal Lahir"
                        placeholder="DD/MM/YYYY"
                        type="date"
                        value={formData.tanggal_lahir}
                        onChange={handleTanggalLahirChange}
                        required
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="anak-usia"
                        name="usia"
                        label="Usia"
                        placeholder="Otomatis dari tanggal lahir"
                        type="text"
                        value={usia}
                        disabled
                    />
                </div>
                <div className={styles.col}>
                    <Select
                        id="anak-jenis-kelamin"
                        name="jenis_kelamin"
                        label="Jenis Kelamin"
                        options={jenisKelaminOptions}
                        value={formData.jenis_kelamin}
                        onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Select
                        id="anak-status-anak"
                        name="status_anak"
                        label="Status Anak"
                        options={statusAnakOptions}
                        value={formData.status_anak}
                        onChange={(e) => setFormData({ ...formData, status_anak: e.target.value })}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Select
                        id="anak-pendidikan-terakhir"
                        name="pendidikan_terakhir"
                        label="Pendidikan Terakhir"
                        options={pendidikanOptions}
                        value={formData.pendidikan_terakhir}
                        onChange={(e) => setFormData({ ...formData, pendidikan_terakhir: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Select
                        id="anak-status-tanggungan"
                        name="status_tanggungan"
                        label="Status Tanggungan"
                        options={statusTanggunganOptions}
                        value={formData.status_tanggungan}
                        onChange={(e) => setFormData({ ...formData, status_tanggungan: e.target.value })}
                        required
                    />
                </div>
            </div>
            <Textarea
                id="anak-keterangan-disabilitas"
                name="keterangan_disabilitas"
                label="Keterangan Disabilitas"
                placeholder="Jika ada, sebutkan jenis disabilitas"
                value={formData.keterangan_disabilitas}
                onChange={(e) => setFormData({ ...formData, keterangan_disabilitas: e.target.value })}                
            />
            <Input
                id="anak-akta-kelahiran-file"
                name="akta_kelahiran_file"
                label="File Akta Kelahiran"
                placeholder="Upload file akta kelahiran"
                type="file"
                onChange={(e) => {
                    const selected = e.target.files?.[0] ?? null;
                    setFile(selected);
                }}
                required
            />
            <div className={styles.actions}>
                <Button type="submit" label={isLoading ? "Menyimpan..." : "Simpan"} variant="primary" disabled={isLoading} />
                <Button type="button" label="Batal" variant="secondary" onClick={onCancel} disabled={isLoading} />
            </div>
        </form>
    )
}

export default FormAnak