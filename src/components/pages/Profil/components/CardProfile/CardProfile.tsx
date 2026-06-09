import styles from "./CardProfile.module.css";
import Text from "../../../../ui/atoms/Text";
import Icon from "../../../../ui/atoms/Icon";
import { Mail, Phone, MapPin, Maximize2 } from "lucide-react";
import type { ReactNode } from "react";

type StatusVariant = "success" | "warning" | "danger" | "neutral";

interface propsType {
    nama?: string;
    nip?: string;
    icon?: ReactNode;
    img?: ReactNode;
    profesi?: string;
    email?: string;
    phone?: string;
    location?: string;
    statusPegawai?: string;
    statusVariant?: StatusVariant;
    onPhotoClick?: () => void;
}

const CardProfile = ({ nama, nip, icon, profesi, img, email, phone, location, statusPegawai, statusVariant = "success", onPhotoClick }: propsType) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardHeaderContent}>
                    <button
                        type="button"
                        className={styles.avatarButton}
                        onClick={onPhotoClick}
                        title="Lihat foto profil"
                    >
                        <div className={styles.avatarWrapper}>
                            {img ?? icon}
                            <div className={styles.avatarOverlay}>
                                <Maximize2 size={24} />
                            </div>
                        </div>
                    </button>
                    <Text text={nama || ""} variant="body" weight="bold" color="default" />
                    <Text text={nip || ""} variant="body" weight="normal" color="green" />
                    <Text text={profesi || ""} variant="body" weight="normal" color="green" />
                    {statusPegawai && (
                        <span className={`${styles.statusBadge} ${styles[`status_${statusVariant}`]}`}>
                            <span className={styles.statusDot} />
                            {statusPegawai}
                        </span>
                    )}
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