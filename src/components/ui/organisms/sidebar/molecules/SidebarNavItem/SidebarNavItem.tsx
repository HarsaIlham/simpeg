import { memo } from "react";
import { NavLink } from "react-router-dom";
import type { SidebarMenuItem } from "../../../../../../types/sidebar";
import styles from "./SidebarNavItem.module.css";
import { useSidebarStore } from "../../../../../../stores/useSidebarStore";

interface SidebarNavItemProps {
  item: SidebarMenuItem;
}

const SidebarNavItem = memo(({ item }: SidebarNavItemProps) => {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
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
});

export default SidebarNavItem;
