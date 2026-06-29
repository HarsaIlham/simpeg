import styles from "./Topbar.module.css";
import Text from "../../atoms/Text";
import BurgerButton from "../../atoms/BurgerButton";
import { Bell, CheckCheck } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import NotificationItem from "../../molecules/NotificationItem";
import type { NotifVariant } from "../../molecules/NotificationItem/NotificationItem";
import { notificationService } from "../../../../services/notificationService";
import { useSidebarStore } from "../../../../stores/useSidebarStore";
import type { Notifikasi } from "../../../../types/api";
import { getGlobalUser } from "../../../../contexts/AuthContext";

interface propsType {
  title: string;
  notifications?: Notifikasi[];
}


const mapVariant = (title: string): NotifVariant => {
  const lower = title.toLowerCase();
  if (lower.includes("ditolak") || lower.includes("gagal")) return "error";
  if (lower.includes("disetujui") || lower.includes("berhasil") || lower.includes("selesai")) return "success";
  if (lower.includes("menunggu") || lower.includes("jadwal") || lower.includes("mendatang") || lower.includes("pengingat")) return "warning";
  return "info";
};

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Topbar = ({ title, notifications: externalNotifications }: propsType) => {
  const user = getGlobalUser();
  const isAdmin = user?.role.toLowerCase() === "admin";
  const openMobile = useSidebarStore((state) => state.openMobile);
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifs, setLocalNotifs] = useState<Notifikasi[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalNotifications) {
      setLocalNotifs(externalNotifications);
    }
  }, [externalNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = localNotifs.filter(n => !n.is_read).length;

  const handleMarkOneRead = useCallback(async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setLocalNotifs(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Gagal menandai notifikasi dibaca:", err);
    }
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setLocalNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Gagal menandai semua notifikasi dibaca:", err);
    }
  }, []);

  return (
    <div className={styles.topBar}>
      <div className={styles.leftSection}>
        <BurgerButton onClick={openMobile} />
        <Text text={title} variant="subtitle" weight="bold" color="default" />
      </div>

      <div className={styles.notifContainer} ref={dropdownRef}>
        {!isAdmin && (
          <button
            className={styles.notifBtn}
            aria-label="Notifications"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount}</span>}
          </button>
        )}

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <Text text="Notifikasi" variant="body" weight="bold" color="default" />
              {unreadCount > 0 && (
                <button
                  className={styles.markAllBtn}
                  onClick={handleMarkAllRead}
                  title="Tandai semua sudah dibaca"
                >
                  <CheckCheck size={16} />
                  <span>Tandai semua</span>
                </button>
              )}
            </div>
            <div className={styles.dropdownList}>
              {localNotifs.length === 0 ? (
                <div className={styles.emptyState}>
                  Tidak ada notifikasi
                </div>
              ) : (
                localNotifs.map(notif => (
                  <NotificationItem
                    key={notif.id}
                    id={String(notif.id)}
                    title={notif.title}
                    desc={notif.message}
                    time={formatRelativeTime(notif.created_at)}
                    variant={mapVariant(notif.title)}
                    isUnread={!notif.is_read}
                    onClick={!notif.is_read ? () => handleMarkOneRead(notif.id) : undefined}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;