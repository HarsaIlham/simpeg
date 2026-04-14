import { ChevronLeft, LogOut, PanelLeftOpen, RefreshCw } from "lucide-react";
import { sidebarMenuItems } from "../../data/sidebarMenu";
import SidebarBrand from "./molecules/SidebarBrand";
import SidebarUserCard from "./molecules/SidebarUserCard";
import SidebarNavItem from "./molecules/SidebarNavItem";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { useSidebar } from "../../contexts/SidebarContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar();
  
  if (!user) return null;

  const currentRole = user.role; 
  
  const accessibleMenus = sidebarMenuItems.filter(item => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(currentRole);
  });

  return (
    <>
      {isMobileOpen && (
        <div className={styles.overlay} onClick={closeMobile} />
      )}

      <aside
        className={`
          ${styles.sidebar}
          ${isCollapsed ? styles.collapsed : ""}
          ${isMobileOpen ? styles.mobileOpen : ""}
        `.trim()}
      >
        <div className={styles.brand}>
          <SidebarBrand />
        </div>
        <div>
          <SidebarUserCard
            name={user.nama}
            role={user.role.toUpperCase()}
          />
        </div>
        {!isCollapsed && (
          <div className={styles.section}>
            <button className={styles.switchBtn} onClick={() => console.log("Switch account")}>
              <RefreshCw size={16} />
              <span>Ganti Akun</span>
            </button>
          </div>
        )}
        <nav className={styles.nav}>
          {accessibleMenus.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
            />
          ))}
        </nav>
        <div className={styles.footer}>
          <button className={styles.footerBtn} onClick={logout}>
            <LogOut size={18} />
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
        <div className={styles.footer}>
          <button className={styles.footerBtn} onClick={toggleCollapse}>
            {isCollapsed ? <PanelLeftOpen size={18} /> : <ChevronLeft size={18} />}
            {!isCollapsed && <span>Sembunyikan</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
