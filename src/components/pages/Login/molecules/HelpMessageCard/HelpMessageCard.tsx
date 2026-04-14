import styles from './HelpMessageCard.module.css';
import Text from '../../../../ui/atoms/Text';

const HelpMessageCard = () => {
    return (
        <div className={styles.card}>
            <p className={styles.text}>
                <Text text="TIPS" variant="body" weight="bold" color="#F97316"/> 
                <Text text="Gunakan NIP dan Password yang Telah Terdaftar" variant="body" weight="normal" />
            </p>
        </div>
    );
};

export default HelpMessageCard;
