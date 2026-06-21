import { useState, useEffect } from "react";
import Topbar from "../../ui/organisms/Topbar/Topbar";
import MainHeaderSection from "../../ui/molecules/MainHeaderSection/MainHeaderSection";
import CardAkun from "./components/CardAkun/CardAkun";
import type { CardAkunData } from "./components/CardAkun/CardAkun";
import FormGantiPassword from "../../ui/organisms/FormGantiPassword/FormGantiPassword";
import Modal from "../../ui/organisms/Modal";
import Popup from "../../ui/molecules/Popup";
import styles from "./Akun.module.css";
import { getGlobalUser } from "../../../contexts/AuthContext";
import { authService } from "../../../services/authService";
import { useAuthStore } from "../../../stores/useAuthStore";

const Akun = () => {
    const user = getGlobalUser();
    const [username, setUsername] = useState(user?.nik || "");

    useEffect(() => {
        if (user?.nik) {
            setUsername(user.nik);
        }
    }, [user?.nik]);

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupConfig, setPopupConfig] = useState({
        variant: "success" as "success" | "error" | "warning",
        title: "",
        message: "",
    });

    const handleFormSubmit = async (data: CardAkunData) => {
        if (data.username === (user?.nik || "")) {
            return;
        }

        try {
            await authService.changeNik(data.username);
            useAuthStore.getState().updateUser({ nik: data.username });
            setUsername(data.username);
            setPopupConfig({
                variant: "success",
                title: "Data Akun Diperbarui",
                message: "Username (NIK) berhasil diperbarui.",
            });
            setIsPopupOpen(true);
        } catch (error: any) {
            setPopupConfig({
                variant: "error",
                title: "Gagal Memperbarui Akun",
                message: error?.message || "Terjadi kesalahan saat memperbarui username.",
            });
            setIsPopupOpen(true);
            // Re-throw so CardAkun can keep the editing state open for the user to correct it
            throw error;
        }
    };

    const handleUbahPasswordClick = () => {
        setIsPasswordModalOpen(true);
    };

    const handlePasswordSubmit = async (oldPw: string, newPw: string, confirmPw: string) => {
        try {
            await authService.changePassword(oldPw, newPw, confirmPw);
            setIsPasswordModalOpen(false);
            setPopupConfig({
                variant: "success",
                title: "Kata Sandi Diperbarui",
                message: "Kata sandi Anda berhasil diperbarui.",
            });
            setIsPopupOpen(true);
        } catch (error: any) {
            throw error;
        }
    };

    return (
        <>
            <Topbar title="Data Akun" />

            <MainHeaderSection
                title="Data Akun Admin"
                subtitle="Kelola data akun dan informasi akun admin"
            />

            <div className={styles.akunLayout}>
                <CardAkun
                    initialData={{ username }}
                    onSubmit={handleFormSubmit}
                    onUbahPasswordClick={handleUbahPasswordClick}
                />
            </div>

            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Ubah Password"
            >
                <FormGantiPassword
                    onSubmit={handlePasswordSubmit}
                    onCancel={() => setIsPasswordModalOpen(false)}
                />
            </Modal>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                variant={popupConfig.variant}
                title={popupConfig.title}
                message={popupConfig.message}
            />
        </>
    );
};

export default Akun;
