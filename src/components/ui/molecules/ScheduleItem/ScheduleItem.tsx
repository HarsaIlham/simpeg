import styles from "./ScheduleItem.module.css";

interface ScheduleItemProps {
    title: string;
    date: string;
}

const ScheduleItem = ({ title, date }: ScheduleItemProps) => {
    return (
        <div className={styles.item}>
            <span className={styles.title}>{title}</span>
            <span className={styles.date}>&nbsp;{date}</span>
        </div>
    );
};

export default ScheduleItem;
