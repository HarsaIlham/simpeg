import { useState, useEffect } from "react";
import { ChevronLeft, LogOut, PanelLeftOpen } from "lucide-react";
import { sidebarMenuItems } from "../../../../data/sidebarMenu";
import SidebarBrand from "./molecules/SidebarBrand";
import SidebarUserCard from "./molecules/SidebarUserCard";
import SidebarNavItem from "./molecules/SidebarNavItem";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../../../contexts/AuthContext";
import { useSidebarStore } from "../../../../stores/useSidebarStore";
import { profileService } from "../../../../services/profileService";
import { getProxiedFileUrl } from "../../../../utils/api";
import Popup from "../../molecules/Popup";

let isFetchingProfileGlobal = false;

const Sidebar = () => {
  const { user, logout, profile, updateUser } = useAuth();
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebarStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const avatarUrl = profile?.link_photo_profile
    ? getProxiedFileUrl(profile.link_photo_profile)
    : user?.avatarUrl
      ? getProxiedFileUrl(user.avatarUrl)
      : undefined;

  useEffect(() => {
    if (!user || user.avatarUrl !== undefined || isFetchingProfileGlobal) return;

    isFetchingProfileGlobal = true;

    const fetchAvatar = async () => {
      try {
        const response = await profileService.getMe();
        if (response.success && response.data) {
          updateUser({
            avatarUrl: response.data.foto_profil,
            nama: response.data.nama || user.nama,
          });
        }
      } catch (err) {
        console.error("Gagal mengambil foto profil di sidebar:", err);
      } finally {
        isFetchingProfileGlobal = false;
      }
    };
    fetchAvatar();
  }, [user, updateUser]);

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
          <button className={styles.footerBtn} onClick={() => setShowLogoutConfirm(true)}>
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

      <Popup
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        variant="warning"
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari aplikasi SIMPEG?"
        confirmLabel="Keluar"
        cancelLabel="Batal"
        onConfirm={logout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};

export default Sidebar;
