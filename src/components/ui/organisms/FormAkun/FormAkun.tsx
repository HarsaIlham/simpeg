import { useState, useEffect } from "react";
import { Send, X, Edit, Key } from "lucide-react";
import styles from "./FormAkun.module.css";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import CardHeader from "../../molecules/CardHeader";
import Card from "../../atoms/Card";

export interface FormAkunData {
    username: string;
}

interface FormAkunProps {
    initialData: FormAkunData;
    onSubmit?: (data: FormAkunData) => void;
    onUbahPasswordClick?: () => void;
    readOnly?: boolean;
}

const FormAkun = ({ initialData, onSubmit, onUbahPasswordClick, readOnly = false }: FormAkunProps) => {
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
        <Card padding="md" className={styles.card}>
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
                                label="Edit Akun"
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
                {!isEditing && (
                    <div className={styles.passwordActionWrapper}>
                        <Button
                            className={styles.passwordButton}
                            label="Ubah Password"                            
                            variant="transparant"
                            onClick={onUbahPasswordClick}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default FormAkun;
