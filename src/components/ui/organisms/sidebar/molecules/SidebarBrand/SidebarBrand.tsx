import { Hospital } from "lucide-react";
import Icon from "../../../../atoms/Icon";
import styles from "./SidebarBrand.module.css";
import { useSidebarStore } from "../../../../../../stores/useSidebarStore";
import { useState } from "react";
import logoImage from "../../../../../../assets/images/logo_rsd_kalisat__1___1_-removebg-preview 3.png";

const SidebarBrand = () => {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const [imageError, setImageError] = useState(false);

  return (
    <div className={styles.brand}>
      <div>
        {!imageError ? (
          <img
            src={logoImage}
            alt="Logo RSD Kalisat"
            className={styles.logo}
            onError={() => setImageError(true)}
          />
        ) : (
          <Icon
            icon={Hospital}
            sizeBox="lg"
            sizeIcon="sm"
            variant="primary"
            rounded="md"
          />
        )}
      </div>
      {!isCollapsed && (
        <div className={styles.brandText}>
          <span className={styles.title}>SIMPEG</span>
          <span className={styles.subtitle}>RSD Kalisat</span>
        </div>
      )}
    </div>
  );
};

export default SidebarBrand;
