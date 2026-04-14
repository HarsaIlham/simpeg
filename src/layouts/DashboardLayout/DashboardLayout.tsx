import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import styles from "./DashboardLayout.module.css";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";

const DashboardContent = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={styles.layout}>
      <Sidebar />

      <div
        className={`${styles.main} ${isCollapsed ? styles.mainCollapsed : ""}`}
      >
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default DashboardLayout;
