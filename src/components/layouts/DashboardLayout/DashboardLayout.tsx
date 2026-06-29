import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../ui/organisms/sidebar";
import styles from "./DashboardLayout.module.css";
import { useSidebarStore } from "../../../stores/useSidebarStore";
import PageLoader from "../../ui/atoms/PageLoader";

const DashboardContent = () => {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

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
  return <DashboardContent />;
};

export default DashboardLayout;
