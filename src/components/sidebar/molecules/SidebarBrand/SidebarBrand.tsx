import { Hospital } from "lucide-react";
import Icon from "../../../ui/atoms/Icon";
import styles from "./SidebarBrand.module.css";
import { useSidebar } from "../../../../contexts/SidebarContext";

const SidebarBrand = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={styles.brand}>
      <div>
        <Icon icon={Hospital} sizeBox="lg" sizeIcon="sm" variant="primary" rounded="md" />
      </div>
      {!isCollapsed && (
        <div className={styles.brandText}>
          <span className={styles.title}>SIMPEG</span>
          <span className={styles.subtitle}>RS Kalisat</span>
        </div>
      )}
    </div>
  );
};

export default SidebarBrand;
