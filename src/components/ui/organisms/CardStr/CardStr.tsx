import RecordCard from "../../molecules/RecordCard"
import Icon from "../../atoms/Icon"
import Text from "../../atoms/Text"
import Badge from "../../atoms/Badge"
import Button from "../../atoms/Button"
import { FileText } from "lucide-react"
import styles from "./CardStr.module.css"
import DataField from "../../molecules/DataField"

export interface CardStrData {
    id: string;
    type: "STR" | "SIP"; 
    noSurat: string;
    terbit: string;
    berlaku: string;
    tempat?: string; 
    status: "Aktif" | "Tidak Aktif";
}

interface CardStrProps {
    data: CardStrData;
    onEdit?: () => void;
    onDelete?: () => void;
}

const CardStr = ({ data, onEdit, onDelete }: CardStrProps) => {
    const isStr = data.type === "STR";
    const headerTitle = isStr ? "Surat Tanda Registrasi (STR)" : "Surat Izin Praktik (SIP)";

    return (
        <RecordCard
            icon={<Icon icon={FileText} variant="soft" color="#218838" bgColor="#e6f4ea" rounded="md" sizeBox="lg" sizeIcon="sm" />}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            <div className={styles.header}>
                <Text text={headerTitle} weight="bold" color="default" fontSize="18px" />
                <Text text={`No: ${data.noSurat}`} variant="body" color="green" />
            </div>

            <div className={styles.contentGrid}>
                {data.tempat && (
                    <Text text={`Tempat: ${data.tempat}`} variant="body" color="default" />
                )}

                <div className={styles.dates}>
                    <DataField label="Terbit" value={data.terbit} />
                    <DataField label="Berlaku" value={data.berlaku} />
                </div>
            </div>

            <div className={styles.actionsBox}>
                <Badge variant={data.status === "Aktif" ? "success" : "danger"}>
                    {data.status}
                </Badge>
                <Button 
                    label="Lihat Dokumen" 
                    variant="primary" 
                />
            </div>
        </RecordCard>
    )
}

export default CardStr