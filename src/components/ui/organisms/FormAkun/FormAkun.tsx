import { useState, useEffect } from "react";
import { Send, X, Edit } from "lucide-react";
import styles from "./FormAkun.module.css";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import CardHeader from "../../molecules/CardHeader";

export interface FormAkunData {
    username: string;
    password: string;
}

interface FormAkunProps {
    initialData: FormAkunData;
    onSubmit?: (data: FormAkunData) => void;
    readOnly?: boolean;
}

const FormAkun = ({ initialData, onSubmit, readOnly = false }: FormAkunProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<FormAkunData>(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData(initialData);
        setIsEditing(false);
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(formData);
        }
        setIsEditing(false);
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <CardHeader title="Data Akun" />
                {!readOnly && (
                    <div className={styles.cardActions}>
                        {isEditing ? (
                            <>
                                <Button
                                    label="Simpan"
                                    icon={<Send size={16} />}
                                    variant="primary"
                                    onClick={handleSubmit}
                                />
                                <Button
                                    label="Batal"
                                    icon={<X size={16} />}
                                    variant="light"
                                    onClick={handleCancel}
                                />
                            </>
                        ) : (
                            <Button
                                label="Edit Profil"
                                icon={<Edit size={16} />}
                                variant="primary"
                                onClick={handleEdit}
                            />
                        )}
                    </div>
                )}
            </div>

            <div className={styles.formGrid}>
                <Input
                    bgColor="#E6F4EE"
                    label="Username"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
                <Input
                    bgColor="#E6F4EE"
                    label="Password"
                    name="password"
                    id="password"
                    type={isEditing ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>
        </div>
    );
};

export default FormAkun;
