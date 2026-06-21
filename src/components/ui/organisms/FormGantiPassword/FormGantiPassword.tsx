import { useState } from "react";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import styles from "./FormGantiPassword.module.css";
import { Eye, EyeOff } from "lucide-react";

interface FormGantiPasswordProps {
    onSubmit: (oldPw: string, newPw: string, confirmPw: string) => Promise<void> | void;
    onCancel: () => void;
}

const FormGantiPassword = ({ onSubmit, onCancel }: FormGantiPasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordError("Semua field kata sandi harus diisi.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("Kata sandi baru minimal 8 karakter.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Konfirmasi kata sandi baru tidak cocok.");
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(oldPassword, newPassword, confirmPassword);
        } catch (err: any) {
            setPasswordError(err?.message || "Gagal mengubah kata sandi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.passwordForm}>
            <p className={styles.modalInstructions}>
                Silakan masukkan kata sandi lama Anda beserta kata sandi baru untuk memperbarui akun.
            </p>

            {passwordError && (
                <div className={styles.errorAlert}>
                    {passwordError}
                </div>
            )}

            <div className={styles.col}>
                <Input
                    bgColor="#F9FAFC"
                    label="Kata Sandi Lama"
                    name="oldPassword"
                    id="oldPassword"
                    type="password"
                    placeholder="Masukkan kata sandi lama"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                />
            </div>

            <div className={styles.col}>
                <Input
                    bgColor="#F9FAFC"
                    label="Kata Sandi Baru"
                    name="newPassword"
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    rightNode={
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeBtn}>
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    }

                />
            </div>

            <div className={styles.col}>
                <Input
                    bgColor="#F9FAFC"
                    label="Konfirmasi Kata Sandi Baru"
                    name="confirmPassword"
                    id="confirmPassword"
                    type={showPassword2 ? 'text' : 'password'}
                    placeholder="Ulangi kata sandi baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    rightNode={
                        <button type="button" onClick={() => setShowPassword2(!showPassword2)} className={styles.eyeBtn}>
                            {showPassword2 ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    }
                />
            </div>

            <div className={styles.buttonGroup}>
                <Button
                    type="submit"
                    label={isSubmitting ? "Menyimpan..." : "Simpan Sandi"}
                    variant="primary"
                    disabled={isSubmitting}
                />
                <Button
                    type="button"
                    label="Batal"
                    variant="light"
                    onClick={onCancel}
                    disabled={isSubmitting}
                />
            </div>
        </form>
    );
};

export default FormGantiPassword;
