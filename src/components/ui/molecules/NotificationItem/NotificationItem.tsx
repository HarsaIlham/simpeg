import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import styles from "./NotificationItem.module.css";
import Text from "../../atoms/Text";

export type NotifVariant = "info" | "success" | "warning" | "error";

export interface NotificationItemProps {
  id: string;
  title: string;
  desc: string;
  time: string;
  variant: NotifVariant;
  isUnread?: boolean;
}

const getIcon = (variant: NotifVariant) => {
  switch (variant) {
    case "success": return <CheckCircle2 size={16} className={styles.iconSuccess} />;
    case "error": return <XCircle size={16} className={styles.iconError} />;
    case "warning": return <Clock size={16} className={styles.iconWarning} />;
    case "info":
    default: return <AlertCircle size={16} className={styles.iconInfo} />;
  }
};

const NotificationItem = ({ title, desc, time, variant, isUnread }: NotificationItemProps) => {
  return (
    <div className={`${styles.item} ${isUnread ? styles.unread : ""}`}>
      <div className={`${styles.iconBox} ${styles[`box-${variant}`]}`}>
        {getIcon(variant)}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <Text text={title} variant="caption" weight="bold" color="default" />
          {isUnread && <span className={styles.dot} />}
        </div>
        <span className={styles.desc}>{desc}</span>
        <span className={styles.time}>{time}</span>
      </div>
    </div>
  );
};

export default NotificationItem;
