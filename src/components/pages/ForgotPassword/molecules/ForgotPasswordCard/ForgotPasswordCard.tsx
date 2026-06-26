import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Text from '../../../../ui/atoms/Text';
import StepNik from '../StepNik';
import StepOtp from '../StepOtp';
import StepNewPassword from '../StepNewPassword';
import logoImage from "../../../../../assets/images/logo_rsd_kalisat__1___1_-removebg-preview 3.png";
import styles from './ForgotPasswordCard.module.css';

type Step = 'nik' | 'otp' | 'password' | 'success';

const STEP_CONFIG: Record<Step, { title: string; subtitle: string }> = {
    nik: {
        title: 'Lupa Password?',
        subtitle: 'Masukkan NIK anda untuk reset password',
    },
    otp: {
        title: 'Kode OTP',
        subtitle: 'Kode OTP yang Anda Dapatkan',
    },
    password: {
        title: 'Password Baru',
        subtitle: 'Masukkan Password Baru Anda',
    },
    success: {
        title: 'Berhasil!',
        subtitle: 'Password Anda telah diubah',
    },
};

const STEPS: Step[] = ['nik', 'otp', 'password'];

const ForgotPasswordCard = () => {
    const [step, setStep] = useState<Step>('nik');
    const [nik, setNik] = useState('');
    const [otp, setOtp] = useState('');
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    const config = STEP_CONFIG[step];
    const currentStepIndex = STEPS.indexOf(step as Step);

    const handleNikSuccess = (nikValue: string) => {
        setNik(nikValue);
        setStep('otp');
    };

    const handleOtpSuccess = (otpValue: string) => {
        setOtp(otpValue);
        setStep('password');
    };

    const handlePasswordSuccess = () => {
        setStep('success');
        setTimeout(() => {
            navigate('/login');
        }, 3000);
    };

    const handleOtpError = () => {
        setStep('otp');
        setOtp('');
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                {!imageError ? (
                    <img
                        src={logoImage}
                        alt="Logo RSD Kalisat"
                        className={styles.logo}
                        onError={() => setImageError(true)}
                    />
                ) : null}
                <Text text={config.title} variant="title" weight="bold" />
                <Text text={config.subtitle} variant="body" weight="normal" />
            </div>

            {step !== 'success' && (
                <div className={styles.stepIndicator}>
                    {STEPS.map((s, index) => (
                        <div
                            key={s}
                            className={`${styles.stepDot} ${index <= currentStepIndex ? styles.stepDotActive : ''} ${index === currentStepIndex ? styles.stepDotCurrent : ''}`}
                        />
                    ))}
                </div>
            )}

            <hr className={styles.divider} />

            <div className={styles.body}>
                {step === 'nik' && (
                    <StepNik onSuccess={handleNikSuccess} />
                )}
                {step === 'otp' && (
                    <StepOtp nik={nik} onSuccess={handleOtpSuccess} />
                )}
                {step === 'password' && (
                    <StepNewPassword
                        nik={nik}
                        otp={otp}
                        onSuccess={handlePasswordSuccess}
                        onOtpError={handleOtpError}
                    />
                )}
                {step === 'success' && (
                    <div className={styles.successContainer}>
                        <div className={styles.successIcon}>
                            <CheckCircle size={64} strokeWidth={1.5} />
                        </div>
                        <p className={styles.successMessage}>
                            Password berhasil diubah. Anda akan dialihkan ke halaman login...
                        </p>
                        <Link to="/login" className={styles.loginLink}>
                            Ke Halaman Login
                        </Link>
                    </div>
                )}
            </div>

            <div className={styles.footer}>
                <Link to="/login" className={styles.backLink}>
                    Masuk
                </Link>
                <hr className={styles.divider} />
                <a href="#admin" className={styles.adminLink}>
                    Butuh bantuan? Hubungi Admin
                </a>
            </div>
        </div>
    );
};

export default ForgotPasswordCard;
