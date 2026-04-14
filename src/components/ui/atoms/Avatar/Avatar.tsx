import { User } from "lucide-react";
import styles from "./Avatar.module.css";

interface AvatarProps {
    src?: string;
    size?: "small" | "medium" | "large";
}

const Avatar = (props: AvatarProps) => {
    const sizeClass = {
        small: styles.small,
        medium: styles.medium,
        large: styles.large,
    };
  return (
    <div className={`${styles.avatarBox} ${sizeClass[props.size || "small"]}`}>
        {props.src ? (
            <img src={props.src} alt="User avatar" className={styles.avatar}/>
        ) : (
            <User/>
        )}
    </div>
  )
}

export default Avatar