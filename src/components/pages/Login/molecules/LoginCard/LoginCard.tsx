import { useState } from 'react';
import { ClipboardPlus } from 'lucide-react';
import LoginForm from '../LoginForm/LoginForm';
import Icon from '../../../../ui/atoms/Icon';
import styles from './LoginCard.module.css';
import Text from '../../../../ui/atoms/Text';
import logoImage from "../../../../../assets/images/logo_rsd_kalisat__1___1_-removebg-preview 3.png";

const LoginCard = () => {
  const [imageError, setImageError] = useState(false);

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
        ) : (
          <Icon
            icon={ClipboardPlus}
            rounded="full"
            sizeBox="lg"
            sizeIcon="sm"
            variant="primary"
          />
        )}
        <Text text="SIMPEG" variant="title" weight="bold" />
        <Text text="Sistem Informasi Manajemen Pegawai RSD Kalisat" variant="body" weight="normal" />
      </div>
      <div className={styles.body}>
        <LoginForm />
      </div>

      <div className={styles.footer}>
        <hr className={styles.divider} />
        <a href="#admin" className={styles.adminLink}>
          Butuh bantuan? Hubungi Admin
        </a>
      </div>
    </div>
  );
};

export default LoginCard;
