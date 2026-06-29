import { memo } from "react";
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

const CardPangkat = memo(({ data, onEdit, onDelete, onViewDocument }: CardPangkatProps) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = data.endedAt ? new Date(data.endedAt) : null;
    const isPast = end && !isNaN(end.getTime()) && end < today;
    const isActive = !isPast;

    return (
        <RecordCard onDelete={onDelete} onEdit={onEdit} enableDelete={false}
            icon={<Icon icon={Award} variant="soft" color="#218838" bgColor="#e6f4ea" rounded="md" sizeBox="lg" sizeIcon="sm" />}>
            <div className={styles.header}>
                <Text text={data.namaPangkat} weight="bold" color="default" fontSize="18px" />
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Badge variant={isActive ? "success" : "danger"}>
                        {isActive ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                    <Badge variant={data.isCurrent ? "info" : "default"}>
                        {data.isCurrent ? "Digunakan" : "Tidak Digunakan"}
                    </Badge>
                </div>
            </div>
            <div className={styles.grid}>
                {data.tmtSk && <DataField key="tmt-sk" label="TMT SK" value={data.tmtSk || "-"} isDate={true} />}
                <DataField key="startedAt" label="Mulai" value={data.startedAt || "-"} isDate={true} />
                <DataField key="endedAt" label="Selesai" value={data.endedAt || "-"} isDate={true} />
                <DataField key="pejabatPenetap" label="Pejabat Penetap" value={data.pejabatPenetap || "-"} />
            </div>
            <div className={styles.actionsBox}>
                {data.linkSk && onViewDocument && (
                    <Button label="Lihat Dokumen" variant="primary" onClick={() => onViewDocument(getProxiedFileUrl(data.linkSk))} />
                )}
            </div>
        </RecordCard>
    )
});

export default CardPangkat