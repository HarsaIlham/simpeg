import React from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
    children: React.ReactNode;
    backgroundImage?: string;
}

const AuthLayout = ({ children, backgroundImage }: AuthLayoutProps) => {
    return (
        <div className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
