import { useState } from "react";
import Topbar from "../../ui/organisms/Topbar/Topbar";
import MainHeaderSection from "../../ui/molecules/MainHeaderSection/MainHeaderSection";
import FormAkun from "../../ui/organisms/FormAkun/FormAkun";
import type { FormAkunData } from "../../ui/organisms/FormAkun/FormAkun";
import Modal from "../../ui/organisms/Modal";
import Input from "../../ui/atoms/Input";
import Button from "../../ui/atoms/Button";
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

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleFormSubmit = (data: FormAkunData) => {
        setUsername(data.username);
        setPopupConfig({
            variant: "success",
            title: "Data Akun Diperbarui",
            message: "Username berhasil diperbarui secara lokal.",
        });
        setIsPopupOpen(true);
    };

    const handleUbahPasswordClick = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setIsPasswordModalOpen(true);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordError("Semua field kata sandi harus diisi.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Kata sandi baru minimal 6 karakter.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Konfirmasi kata sandi baru tidak cocok.");
            return;
        }

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
                <FormAkun
                    initialData={{ username }}
                    onSubmit={handleFormSubmit}
                    onUbahPasswordClick={handleUbahPasswordClick}
                />
            </div>

            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Ubah Kata Sandi"
            >
                <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
                    <p className={styles.modalInstructions}>
                        Silakan masukkan kata sandi lama Anda beserta kata sandi baru untuk memperbarui akun.
                    </p>

                    {passwordError && (
                        <div className={styles.errorAlert}>
                            {passwordError}
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <Input
                            bgColor="#F9FAFC"
                            label="Kata Sandi Lama"
                            name="oldPassword"
                            id="oldPassword"
                            type="password"
                            placeholder="Masukkan kata sandi lama"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <Input
                            bgColor="#F9FAFC"
                            label="Kata Sandi Baru"
                            name="newPassword"
                            id="newPassword"
                            type="password"
                            placeholder="Minimal 6 karakter"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <Input
                            bgColor="#F9FAFC"
                            label="Konfirmasi Kata Sandi Baru"
                            name="confirmPassword"
                            id="confirmPassword"
                            type="password"
                            placeholder="Ulangi kata sandi baru"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        <Button
                            type="submit"
                            label="Simpan Sandi"
                            variant="primary"
                        />
                        <Button
                            type="button"
                            label="Batal"
                            variant="light"
                            onClick={() => setIsPasswordModalOpen(false)}
                        />
                    </div>
                </form>
            </Modal>

            {/* Popup Alert */}
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
