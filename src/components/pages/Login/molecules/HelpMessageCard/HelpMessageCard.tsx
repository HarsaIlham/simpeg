import styles from './HelpMessageCard.module.css';
import Text from '../../../../ui/atoms/Text';

interface HelpMessageCardProps {
    title: string;
    subtitle: string;
}

const HelpMessageCard = ({ title, subtitle }: HelpMessageCardProps) => {
    return (
        <div className={styles.card}>
            <p className={styles.text}>
                <Text text={title} variant="body" weight="bold" color="#F97316"/> 
                <Text text={subtitle} variant="body" weight="normal" />
            </p>
        </div>
    );
};

export default HelpMessageCard;
