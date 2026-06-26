import styles from "./SidebarUserCard.module.css";
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
        {role.toLowerCase() === "admin" ? (
          <div className={styles.initials}>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
        ) : avatarSrc ? (
          <img src={avatarSrc} alt={name} className={styles.avatarImg} />
        ) : (
          <div className={styles.initials}>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
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
