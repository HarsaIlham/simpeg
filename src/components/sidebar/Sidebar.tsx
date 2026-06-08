import { useState, useEffect } from "react";
import { ChevronLeft, LogOut, PanelLeftOpen} from "lucide-react";
import { sidebarMenuItems } from "../../data/sidebarMenu";
import SidebarBrand from "./molecules/SidebarBrand";
import SidebarUserCard from "./molecules/SidebarUserCard";
import SidebarNavItem from "./molecules/SidebarNavItem";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { useSidebar } from "../../contexts/SidebarContext";
import { profileService } from "../../services/profileService";
import { getProxiedFileUrl } from "../../utils/api";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (!user) return;
    const fetchAvatar = async () => {
      try {
        const response = await profileService.getProfile();
        if (response.success && response.data?.profile?.link_photo_profile) {
          setAvatarUrl(getProxiedFileUrl(response.data.profile.link_photo_profile));
        }
      } catch (err) {
        console.error("Gagal mengambil foto profil di sidebar:", err);
      }
    };
    fetchAvatar();
  }, [user]);

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
            avatarSrc={avatarUrl}
          />
        </div>
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
          <button className={styles.footerBtn} onClick={() => {
            if (window.innerWidth <= 768) {
              closeMobile();
            } else {
              toggleCollapse();
            }
          }}>
            {isCollapsed ? <PanelLeftOpen size={18} /> : <ChevronLeft size={18} />}
            {!isCollapsed && <span>Sembunyikan</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
