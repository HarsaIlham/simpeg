import { NavLink } from "react-router-dom";
import type { SidebarMenuItem } from "../../../../types/sidebar";
import styles from "./SidebarNavItem.module.css";
import { useSidebar } from "../../../../contexts/SidebarContext";

interface SidebarNavItemProps {
  item: SidebarMenuItem;
}

const SidebarNavItem = ({ item }: SidebarNavItemProps) => {
  const { isCollapsed } = useSidebar();
  const IconComponent = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.active : ""} ${isCollapsed ? styles.collapsed : ""}`
      }
      title={isCollapsed ? item.label : undefined}
    >
      <span className={styles.icon}>
        <IconComponent size={20} />
      </span>
      {!isCollapsed && (
        <span className={styles.label}>{item.label}</span>
      )}
      {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
        <span className={styles.badge}>{item.badge}</span>
      )}
    </NavLink>
  );
};

export default SidebarNavItem;
