import styles from "./CardProfile.module.css";
import Text from "../../atoms/Text";
import Icon from "../../atoms/Icon";
import { Mail, Phone, MapPin } from "lucide-react";
import type { ReactNode } from "react";

interface propsType {
    nama?: string;
    nip?: string;
    icon?: ReactNode;
    img?: ReactNode;
    profesi?: string;
    email?: string;
    phone?: string;
    location?: string;
}

const CardProfile = ({nama, nip, icon, profesi, img, email, phone, location}: propsType) => {
  return (
    <div className={styles.card}>
        <div className={styles.cardHeader}>
            <div className={styles.cardHeaderContent}>
                {img ?? icon}
                <Text text={nama || ""} variant="body" weight="bold" color="default" />
                <Text text={nip || ""} variant="body" weight="normal" color="green" />
                <Text text={profesi || ""} variant="body" weight="normal" color="green" />
            </div>
        </div>
        <hr className={styles.divider} />
        <div className={styles.cardBody}>
            {email && (
                <div className={styles.contactItem}>
                    <Icon icon={Mail} variant="transparant" rounded="full" sizeBox="xs" sizeIcon="xs" />
                    <Text text={email} variant="caption" weight="normal" color="default" />
                </div>
            )}
            {phone && (
                <div className={styles.contactItem}>
                    <Icon icon={Phone} variant="transparant" rounded="full" sizeBox="xs" sizeIcon="xs" />
                    <Text text={phone} variant="caption" weight="normal" color="default" />
                </div>
            )}
            {location && (
                <div className={styles.contactItem}>
                    <Icon icon={MapPin} variant="transparant" rounded="full" sizeBox="xs" sizeIcon="xs" />
                    <Text text={location} variant="caption" weight="normal" color="default" />
                </div>
            )}
        </div>
    </div>
  )
}

export default CardProfile