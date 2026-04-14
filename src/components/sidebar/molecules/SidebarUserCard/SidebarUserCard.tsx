import { User } from "lucide-react";
import styles from "./SidebarUserCard.module.css";
import Icon from "../../../ui/atoms/Icon";
import { useSidebar } from "../../../../contexts/SidebarContext";

interface SidebarUserCardProps {
  name: string;
  role: string;
  avatarSrc?: string;
}

const SidebarUserCard = ({ name, role, avatarSrc }: SidebarUserCardProps) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={styles.userCard}>
      <div className={styles.avatarBox}>
        {avatarSrc ? (
          <img src={avatarSrc} alt={name} className={styles.avatarImg} />
        ) : (
          <Icon icon={User} sizeBox="lg" sizeIcon="xs" variant="primary" rounded="full" />
        )}
      </div>
      {!isCollapsed && (
        <div className={styles.userInfo}>
          <span className={styles.userName}>{name}</span>
          <span className={styles.userRole}>{role}</span>
        </div>
      )}
    </div>
  );
};

export default SidebarUserCard;
