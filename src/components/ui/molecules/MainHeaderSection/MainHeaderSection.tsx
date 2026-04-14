import Text from "../../atoms/Text";
import styles from "./MainHeaderSection.module.css";


interface propsType {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

const MainHeaderSection = ({title, subtitle, children}: propsType) => {
  return (
    <div className={styles.header}>
        <div className={styles.headerTitle}>
            {children}
            <Text text={title} variant="subtitle" weight="bold" color="default" />
        </div>
        <Text text={subtitle} variant="body" weight="normal" color="default" />
    </div>
  )
}

export default MainHeaderSection