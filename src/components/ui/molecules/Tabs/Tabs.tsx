import type { ReactNode } from "react";
import styles from "./Tabs.module.css";

export interface TabItem {
    id: string;
    label: string;
    icon?: ReactNode;
}

interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => {
    return (
        <div className={styles.tabsContainer}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        className={`${styles.tabButton} ${isActive ? styles.active : ""}`}
                        onClick={() => onChange(tab.id)}
                        type="button"
                    >
                        {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
                        <span className={styles.label}>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;
