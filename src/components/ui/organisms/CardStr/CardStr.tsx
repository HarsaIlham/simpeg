import { memo } from "react"
import RecordCard from "../../molecules/RecordCard"
import Icon from "../../atoms/Icon"
import Text from "../../atoms/Text"
import Badge from "../../atoms/Badge"
import Button from "../../atoms/Button"
import { FileText } from "lucide-react"
import styles from "./CardStr.module.css"
import DataField from "../../molecules/DataField"
import { getProxiedFileUrl } from "../../../../utils/api"

export interface CardStrData {
    id: number;
    nomorStr: string;
    tanggalTerbit: string;
    tanggalKadaluarsa: string | null;
    isCurrent: boolean;
    linkSk: string | null;
}

interface CardStrProps {
    data: CardStrData;
    onEdit?: () => void;
    onDelete?: () => void;
    onViewDocument?: (url: string) => void;
}

const CardStr = memo(({ data, onEdit, onDelete, onViewDocument }: CardStrProps) => {

    return (
        <RecordCard
            icon={<Icon icon={FileText} variant="soft" color="#218838" bgColor="#e6f4ea" rounded="md" sizeBox="lg" sizeIcon="sm" />}
            onEdit={onEdit} onDelete={onDelete} enableDelete={false}
        >
            <div className={styles.header}>
                <Text text="Surat Tanda Registrasi (STR)" weight="bold" color="default" fontSize="18px" />
                <Text text={`No: ${data.nomorStr}`} variant="body" color="green" />
                <Badge className={styles.badge} variant={data.isCurrent ? "success" : "danger"}>
                    {data.isCurrent ? "Aktif" : "Tidak Aktif"}
                </Badge>
            </div>
            <div className={styles.dates}>
                <DataField label="Tanggal Terbit" value={data.tanggalTerbit} isDate={true} />
                <DataField label="Tanggal Akhir" value={data.tanggalKadaluarsa || "-"} isDate={true} />
            </div>
            <div className={styles.actionsBox}>
                {data.linkSk && onViewDocument && (
                    <Button label="Lihat Dokumen" variant="primary" onClick={() => onViewDocument(getProxiedFileUrl(data.linkSk))} />
                )}
            </div>
        </RecordCard>
    )
});

export default CardStr