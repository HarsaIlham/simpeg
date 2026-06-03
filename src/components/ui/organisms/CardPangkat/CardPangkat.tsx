
import { Award } from "lucide-react";
import RecordCard from "../../molecules/RecordCard"
import Icon from "../../atoms/Icon";
import styles from "./CardPangkat.module.css";
import Text from "../../atoms/Text";
import DataField from "../../molecules/DataField";
import Badge from "../../atoms/Badge";
import Button from "../../atoms/Button";
import { getProxiedFileUrl } from "../../../../utils/api";


export interface CardPangkatData {
    id: number;
    namaPangkat: string;
    isCurrent: boolean;
    pejabatPenetap: string | null;
    tmtSk: string | null;
    startedAt: string | null;
    endedAt: string | null;
    linkSk: string | null;
    note: string | null;
}

interface CardPangkatProps {
    data: CardPangkatData;
    onEdit?: () => void;
    onDelete?: () => void;
    onViewDocument?: (url: string) => void;
}

const CardPangkat = ({ data, onEdit, onDelete, onViewDocument }: CardPangkatProps) => {

    return (
        <RecordCard onDelete={onDelete} onEdit={onEdit} enableDelete={false}
            icon={<Icon icon={Award} variant="soft" color="#218838" bgColor="#e6f4ea" rounded="md" sizeBox="lg" sizeIcon="sm" />}>
            <div className={styles.header}>
                <Text text={data.namaPangkat} weight="bold" color="default" fontSize="18px" />
            </div>
            <div className={styles.grid}>
                <DataField label="TMT SK" value={data.tmtSk || "-"} isDate={true} />
                <DataField label="Mulai" value={data.startedAt || "-"} isDate={true} />
                <DataField label="Selesai" value={data.endedAt || "-"} isDate={true} />
                <DataField label="Pejabat Penetap" value={data.pejabatPenetap || "-"} />
            </div>
            <div className={styles.actionsBox}>
                <Badge variant={data.isCurrent ? "success" : "danger"}>
                    {data.isCurrent ? "Aktif" : "Tidak Aktif"}
                </Badge>
                {data.linkSk && onViewDocument && (
                    <Button label="Lihat Dokumen" variant="primary" onClick={() => onViewDocument(getProxiedFileUrl(data.linkSk))} />
                )}
            </div>
        </RecordCard>
    )
}

export default CardPangkat