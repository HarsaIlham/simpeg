import styles from "./Topbar.module.css";
import Text from "../../atoms/Text";
import { Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import NotificationItem from "../../molecules/NotificationItem";
import type { NotificationItemProps } from "../../molecules/NotificationItem/NotificationItem";

interface propsType {
  title: string;
}

const Topbar = ({ title }: propsType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setNotifications([
        {
          id: "n1",
          title: "Pengajuan Perubahan Data",
          desc: "Perubahan Profil Anda sedang Menunggu Persetujuan HRD",
          time: "25 Maret 2026 pukul 07:00",
          variant: "warning",
          isUnread: true
        },
        {
          id: "n2",
          title: "Perubahan Data Diklat Disetujui",
          desc: "Perubahan Profil Anda telah disetujui oleh HRD dan data telah diperbarui",
          time: "4 jam yang lalu",
          variant: "success",
          isUnread: true
        },
        {
          id: "n3",
          title: "Perubahan Data Keluarga Ditolak",
          desc: "Perubahan Data Keluarga Anda ditolak. Mohon sertakan dokumen pendukung perubahan data",
          time: "25 Maret 2026 pukul 07:00",
          variant: "error",
          isUnread: false
        },
        {
          id: "n4",
          title: "Pengingat Update STR",
          desc: "Surat Tanda Registrasi (STR) Anda akan habis dalam 30 hari. Segera lakukan perpanjangan.",
          time: "15 Maret 2026 pukul 07:00",
          variant: "info",
          isUnread: false
        }
      ]);
    };
    fetchNotifs();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.isUnread).length;

  return (
    <div className={styles.topBar}>
      <Text text={title} variant="subtitle" weight="bold" color="default" />
      
      <div className={styles.notifContainer} ref={dropdownRef}>
        <button 
          className={styles.notifBtn} 
          aria-label="Notifications"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell size={20} />
          {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount}</span>}
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <Text text="Notifications" variant="body" weight="bold" color="default" />
            </div>
            <div className={styles.dropdownList}>
              {notifications.map(notif => (
                <NotificationItem key={notif.id} {...notif} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Topbar;