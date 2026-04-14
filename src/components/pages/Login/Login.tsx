import AuthLayout from "../../../layouts/AuthLayout";
import LoginCard from "./molecules/LoginCard";
import HelpMessageCard from "./molecules/HelpMessageCard";
import styles from "./Login.module.css";
import bgLogin from "../../../assets/images/BeautyPlus-IMAGE-ENHANCER-1773644408104 2.png";

const Login = () => {
    return (
        <AuthLayout backgroundImage={bgLogin}>
            <div className={styles.loginPage}>
                <LoginCard />
                <HelpMessageCard />
            </div>
        </AuthLayout>
    )
}

export default Login