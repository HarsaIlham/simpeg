import { Menu } from "lucide-react";
import styles from "./BurgerButton.module.css";

interface BurgerButtonProps {
  onClick: () => void;
}

const BurgerButton = ({ onClick }: BurgerButtonProps) => {
  return (
    <button
      className={styles.burgerBtn}
      onClick={onClick}
      aria-label="Buka menu"
    >
      <Menu size={22} />
    </button>
  );
};

export default BurgerButton;
