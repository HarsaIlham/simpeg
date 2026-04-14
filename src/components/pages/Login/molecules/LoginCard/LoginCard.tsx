import { ClipboardPlus } from 'lucide-react';
import LoginForm from '../LoginForm/LoginForm';
import Icon from '../../../../ui/atoms/Icon';
import styles from './LoginCard.module.css';
import Text from '../../../../ui/atoms/Text';

const LoginCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Icon
          icon={ClipboardPlus}
          rounded="full"
          sizeBox="lg"
          sizeIcon="sm"
          variant="primary"
        />
        <Text text="SIMPEG" variant="title" weight="bold" />
        <Text text="Sistem Informasi Manajemen Pegawai RS Kalisat" variant="body" weight="normal" />
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
