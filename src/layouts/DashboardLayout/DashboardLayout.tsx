import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import styles from "./DashboardLayout.module.css";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";
import PageLoader from "../../components/ui/atoms/PageLoader";

const DashboardContent = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={styles.layout}>
      <Sidebar />

      <div
        className={`${styles.main} ${isCollapsed ? styles.mainCollapsed : ""}`}
      >
        <div className={styles.content}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
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
