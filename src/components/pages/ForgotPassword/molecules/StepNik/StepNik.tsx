import { useState } from 'react';
import Input from '../../../../ui/atoms/Input';
import Button from '../../../../ui/atoms/Button';
import styles from './StepNik.module.css';
import { authService } from '../../../../../services/authService';

interface StepNikProps {
    onSuccess: (nik: string) => void;
}

const StepNik = ({ onSuccess }: StepNikProps) => {
    const [nik, setNik] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!nik.trim()) {
            setError('NIK wajib diisi.');
            return;
        }

        setIsLoading(true);

        try {
            await authService.requestOtp(nik);
            onSuccess(nik);
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Gagal mengirim OTP. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
                <div className={styles.errorBox}>
                    {error}
                </div>
            )}

            <Input
                id="forgot-nik"
                name="nik"
                label="NIK (Nomor Induk Kependudukan)"
                placeholder="Masukkan NIK"
                required
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                disabled={isLoading}
                onlyNumbers
            />

            <div className={styles.submitWrapper}>
                <Button
                    variant="primary"
                    type="submit"
                    label={isLoading ? 'Mengirim...' : 'Kirim'}
                    fullWidth
                    disabled={isLoading}
                />
            </div>
        </form>
    );
};

export default StepNik;
