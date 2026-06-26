import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../../../../ui/atoms/Input';
import Button from '../../../../ui/atoms/Button';
import styles from './StepNewPassword.module.css';
import { authService } from '../../../../../services/authService';

interface StepNewPasswordProps {
    nik: string;
    otp: string;
    onSuccess: () => void;
    onOtpError: () => void;
}

const StepNewPassword = ({ nik, otp, onSuccess, onOtpError }: StepNewPasswordProps) => {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirmation?: string; global?: string }>({});

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!password) {
            newErrors.password = 'Password wajib diisi.';
        } else if (password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter.';
        }

        if (!passwordConfirmation) {
            newErrors.confirmation = 'Konfirmasi password wajib diisi.';
        } else if (password !== passwordConfirmation) {
            newErrors.confirmation = 'Password dan konfirmasi tidak cocok.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!validate()) return;

        setIsLoading(true);

        try {
            await authService.resetPassword(nik, otp, password, passwordConfirmation);
            onSuccess();
        } catch (err: any) {
            if (err.message) {
                if (err.message.toLowerCase().includes('otp')) {
                    setErrors({ global: err.message + ' Silakan masukkan ulang kode OTP.' });
                    setTimeout(() => onOtpError(), 2000);
                } else {
                    setErrors({ global: err.message });
                }
            } else {
                setErrors({ global: 'Gagal mengubah password. Silakan coba lagi.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {errors.global && (
                <div className={styles.errorBox}>
                    {errors.global}
                </div>
            )}

            <Input
                id="new-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Masukkan Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                disabled={isLoading}
                rightNode={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeBtn}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                }
            />

            <Input
                id="confirm-password"
                name="password_confirmation"
                type={showConfirmation ? 'text' : 'password'}
                label="Verifikasi Password"
                placeholder="Verifikasi Password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                error={errors.confirmation}
                disabled={isLoading}
                rightNode={
                    <button type="button" onClick={() => setShowConfirmation(!showConfirmation)} className={styles.eyeBtn}>
                        {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                }
            />

            <div className={styles.passwordHint}>
                <span>Minimal 6 karakter</span>
            </div>

            <div className={styles.submitWrapper}>
                <Button
                    variant="primary"
                    type="submit"
                    label={isLoading ? 'Menyimpan...' : 'Simpan'}
                    fullWidth
                    disabled={isLoading}
                />
            </div>
        </form>
    );
};

export default StepNewPassword;
