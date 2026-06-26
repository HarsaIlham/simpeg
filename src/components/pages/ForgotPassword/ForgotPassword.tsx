import AuthLayout from "../../../layouts/AuthLayout";
import ForgotPasswordCard from "./molecules/ForgotPasswordCard";
import HelpMessageCard from "../Login/molecules/HelpMessageCard";
import styles from "./ForgotPassword.module.css";
import bgLogin from "../../../assets/images/BeautyPlus-IMAGE-ENHANCER-1773644408104 2.png";

const ForgotPassword = () => {
    return (
        <AuthLayout backgroundImage={bgLogin}>
            <div className={styles.forgotPage}>
                <ForgotPasswordCard />
                <HelpMessageCard title="TIPS" subtitle="Gunakan NIK yang Terdaftar" />
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
