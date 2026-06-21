import { useState, useEffect } from "react";
import { Send, X, Edit } from "lucide-react";
import styles from "./CardAkun.module.css";
import Input from "../../../../ui/atoms/Input";
import Button from "../../../../ui/atoms/Button";
import CardHeader from "../../../../ui/molecules/CardHeader";
import Card from "../../../../ui/atoms/Card";

export interface CardAkunData {
    username: string;
}

interface CardAkunProps {
    initialData: CardAkunData;
    onSubmit?: (data: CardAkunData) => Promise<void> | void;
    onUbahPasswordClick?: () => void;
    readOnly?: boolean;
}

const CardAkun = ({ initialData, onSubmit, onUbahPasswordClick, readOnly = false }: CardAkunProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<CardAkunData>(initialData);

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

    const handleSubmit = async () => {
        if (onSubmit) {
            try {
                await onSubmit(formData);
                setIsEditing(false);
            } catch (error) {
                // Keep editing so user can fix the input
            }
        } else {
            setIsEditing(false);
        }
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

export default CardAkun;
