import { useState } from "react";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import styles from "./FormTambahPegawai.module.css";

interface FormTambahPegawaiProps {
    onSubmit: (payload: { nik: string; nama: string; password?: string }) => Promise<void> | void;
    onCancel: () => void;
    isSaving?: boolean;
}

const FormTambahPegawai = ({ onSubmit, onCancel, isSaving = false }: FormTambahPegawaiProps) => {
    const [nama, setNama] = useState("");
    const [nik, setNik] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!nama.trim()) {
            setError("Nama pegawai wajib diisi.");
            return;
        }

        if (nik.length > 16) {
            setError("NIK harus berupa 16 digit angka.");
            return;
        }

        if (password.length < 6) {
            setError("Kata sandi minimal 6 karakter.");
            return;
        }

        try {
            await onSubmit({
                nama: nama.trim(),
                nik,
                password,
            });
        } catch (err: any) {
            setError(err?.message || "Gagal menambahkan pegawai.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.pegawaiForm}>
            <p className={styles.instructions}>
                Masukkan informasi dasar berikut untuk mendaftarkan pegawai baru. Akun pengguna akan terbuat secara otomatis.
            </p>

            {error && (
                <div className={styles.errorAlert}>
                    {error}
                </div>
            )}

            <div className={styles.fieldRow}>
                <Input
                    bgColor="#F9FAFC"
                    label="Nama Pegawai"
                    name="nama"
                    id="nama"
                    type="text"
                    placeholder="Masukkan nama lengkap pegawai"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    disabled={isSaving}
                />
            </div>

            <div className={styles.fieldRow}>
                <Input
                    bgColor="#F9FAFC"
                    label="NIK (Nomor Induk Kependudukan)"
                    name="nik"
                    id="nik"
                    type="text"
                    placeholder="Contoh: 350919xxxxxxxxxx"
                    value={nik}
                    onChange={(e) => {
                        const val = e.target.value.slice(0, 16);
                        setNik(val);
                    }}
                    onlyNumbers
                    required
                    disabled={isSaving}
                />
                <span className={styles.charCount}>{nik.length}/16 digit</span>
            </div>

            <div className={styles.fieldRow}>
                <Input
                    bgColor="#F9FAFC"
                    label="Kata Sandi Akun"
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSaving}
                />
            </div>

            <div className={styles.buttonGroup}>
                <Button
                    type="submit"
                    label={isSaving ? "Menambahkan..." : "Tambah Pegawai"}
                    variant="primary"
                    disabled={isSaving}
                />
                <Button
                    type="button"
                    label="Batal"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSaving}
                />
            </div>
        </form>
    );
};

export default FormTambahPegawai;