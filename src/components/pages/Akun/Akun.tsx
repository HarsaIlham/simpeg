import { useState } from "react";
import Topbar from "../../ui/organisms/Topbar/Topbar";
import MainHeaderSection from "../../ui/molecules/MainHeaderSection/MainHeaderSection";
import CardAkun from "../../ui/organisms/CardAkun/CardAkun";
import type { CardAkunData } from "../../ui/organisms/CardAkun/CardAkun";
import FormGantiPassword from "../../ui/organisms/FormGantiPassword/FormGantiPassword";
import Modal from "../../ui/organisms/Modal";
import Popup from "../../ui/molecules/Popup";
import styles from "./Akun.module.css";

const Akun = () => {
    const [username, setUsername] = useState("Username");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupConfig, setPopupConfig] = useState({
        variant: "success" as "success" | "error" | "warning",
        title: "",
        message: "",
    });

    const handleFormSubmit = (data: CardAkunData) => {
        setUsername(data.username);
        setPopupConfig({
            variant: "success",
            title: "Data Akun Diperbarui",
            message: "Username berhasil diperbarui secara lokal.",
        });
        setIsPopupOpen(true);
    };

    const handleUbahPasswordClick = () => {
        setIsPasswordModalOpen(true);
    };

    const handlePasswordSubmit = (oldPw: string, newPw: string, confirmPw: string) => {
        setIsPasswordModalOpen(false);
        setPopupConfig({
            variant: "success",
            title: "Kata Sandi Diperbarui",
            message: "Kata sandi Anda berhasil diperbarui secara lokal.",
        });
        setIsPopupOpen(true);
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
