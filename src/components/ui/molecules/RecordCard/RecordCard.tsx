import type { ReactNode } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import styles from "./RecordCard.module.css";
import Card from "../../atoms/Card";
import Button from "../../atoms/Button";

interface RecordCardProps {
    icon: ReactNode;
    onEdit?: () => void;
    onDelete?: () => void;
    enableDelete?: boolean ;
    children: ReactNode;
}

const RecordCard = ({ icon, onEdit, onDelete, enableDelete = true, children }: RecordCardProps) => {
    return (
        <Card hover>
            <div className={styles.container}>
                <div className={styles.iconSection}>
                    {icon}
                </div>
                <div className={styles.contentSection}>
                    {children}
                </div>
                {(onEdit || onDelete) && (
                    <div className={styles.actionSection}>
                        {onEdit && (
                            <Button 
                                icon={<SquarePen size={16} />} 
                                onClick={onEdit} 
                                variant="secondary" 
                                iconOnly 
                            />
                        )}
                        {onDelete && enableDelete && (
                            <Button 
                                icon={<Trash2 size={16} />} 
                                onClick={onDelete} 
                                variant="dangerSoft" 
                                iconOnly 
                            />
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default RecordCard;
