import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../../../../ui/atoms/Input';
import Checkbox from '../../../../ui/atoms/Checkbox';
import Button from '../../../../ui/atoms/Button';
import styles from './LoginForm.module.css';
import { useAuth } from '../../../../../contexts/AuthContext';
import { authService } from '../../../../../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ nik?: string; password?: string; global?: string }>({});
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.login({ nik, password });
      login(response.data.user, response.data.access_token);
      navigate("/");
    } catch (err: any) {
      if (err.errors) {
        setErrors({
          nik: err.errors.nik ? err.errors.nik[0] : undefined,
          password: err.errors.password ? err.errors.password[0] : undefined,
        });
      } else if (err.message) {
        setErrors({ global: err.message });
      } else {
        setErrors({ global: "Gagal terhubung ke server. Pastikan sedang online." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleLogin}>
      {errors.global && (
        <div style={{ padding: "10px", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "8px", fontSize: "14px", marginBottom: "16px" }}>
          {errors.global}
        </div>
      )}

      <Input
        id="nik"
        name="nik"
        label="NIK (Nomor Induk Kependudukan)"
        placeholder="Masukkan NIK"
        required
        value={nik}
        onChange={(e) => setNik(e.target.value)}
        error={errors.nik}
        disabled={isLoading}
      />

      <Input
        id="password"
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
          <button type="button" onClick={togglePassword} className={styles.eyeBtn}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />

      <div className={styles.options}>
        <Checkbox id="remember" name="remember" label="Ingat Saya" />
        <Link to="/forgot-password" className={styles.forgotLink}>Lupa Password?</Link>
      </div>
      <div className={styles.submitWrapper}>
        <Button
          variant="primary"
          type="submit"
          label={isLoading ? "Memproses..." : "Masuk"}
          fullWidth
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default LoginForm;
