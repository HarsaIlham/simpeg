import { useState, useRef, useEffect, useCallback } from 'react';
import Button from '../../../../ui/atoms/Button';
import styles from './StepOtp.module.css';
import { authService } from '../../../../../services/authService';

interface StepOtpProps {
    nik: string;
    onSuccess: (otp: string) => void;
}

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = 60;

const StepOtp = ({ nik, onSuccess }: StepOtpProps) => {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const isLoading = false;
    const [error, setError] = useState('');
    const [expiryTimer, setExpiryTimer] = useState(OTP_EXPIRY_SECONDS);
    const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN_SECONDS);
    const [resendLoading, setResendLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (expiryTimer <= 0) return;
        const interval = setInterval(() => {
            setExpiryTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [expiryTimer]);

    useEffect(() => {
        if (resendTimer <= 0) return;
        const interval = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        const fullOtp = newOtp.join('');
        if (fullOtp.length === OTP_LENGTH && newOtp.every((d) => d !== '')) {
            onSuccess(fullOtp);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);

        if (pastedData.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < OTP_LENGTH; i++) {
                newOtp[i] = pastedData[i] || '';
            }
            setOtp(newOtp);
            setError('');

            if (pastedData.length === OTP_LENGTH) {
                onSuccess(pastedData);
            } else {
                inputRefs.current[pastedData.length]?.focus();
            }
        }
    }, [otp, onSuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullOtp = otp.join('');

        if (fullOtp.length !== OTP_LENGTH) {
            setError('Masukkan 6 digit kode OTP.');
            return;
        }

        onSuccess(fullOtp);
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        setError('');

        try {
            await authService.requestOtp(nik);
            setResendTimer(RESEND_COOLDOWN_SECONDS);
            setExpiryTimer(OTP_EXPIRY_SECONDS);
            setOtp(Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Gagal mengirim ulang OTP.');
            }
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
                <div className={styles.errorBox}>
                    {error}
                </div>
            )}

            <div className={styles.otpInfo}>
                <span>Kode OTP telah dikirim ke WhatsApp Anda</span>
            </div>

            <div className={styles.otpContainer} onPaste={handlePaste}>
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`${styles.otpBox} ${otp[index] ? styles.otpBoxFilled : ''}`}
                        disabled={isLoading || expiryTimer <= 0}
                        autoComplete="one-time-code"
                    />
                ))}
            </div>

            <div className={styles.timerSection}>
                {expiryTimer > 0 ? (
                    <span className={styles.expiryText}>
                        Kode berlaku selama <strong>{formatTime(expiryTimer)}</strong>
                    </span>
                ) : (
                    <span className={styles.expiredText}>
                        Kode OTP sudah kadaluarsa
                    </span>
                )}
            </div>

            <div className={styles.submitWrapper}>
                <Button
                    variant="primary"
                    type="submit"
                    label={isLoading ? 'Memproses...' : 'Kirim'}
                    fullWidth
                    disabled={isLoading || expiryTimer <= 0}
                />
            </div>

            <div className={styles.resendSection}>
                {resendTimer > 0 ? (
                    <span className={styles.resendWait}>
                        Kirim ulang dalam {resendTimer} detik
                    </span>
                ) : (
                    <button
                        type="button"
                        className={styles.resendButton}
                        onClick={handleResendOtp}
                        disabled={resendLoading}
                    >
                        {resendLoading ? 'Mengirim...' : 'Kirim Ulang OTP'}
                    </button>
                )}
            </div>
        </form>
    );
};

export default StepOtp;
