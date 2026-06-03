
import { FileText } from "lucide-react";
import Icon from "../../atoms/Icon";
import RecordCard from "../../molecules/RecordCard";
import styles from "./CardPenugasanKlinis.module.css";
import Text from "../../atoms/Text";
import DataField from "../../molecules/DataField";
import Button from "../../atoms/Button";
import Badge from "../../atoms/Badge";
import { getProxiedFileUrl } from "../../../../utils/api";

export interface CardPenugasanKlinisData {
    id: number;
    nomorSurat: string;
    tglMulai: string;
    tglKadaluarsa: string | null;
    isCurrent: boolean;
    linkDokumen: string | null;
}

interface CardPenugasanKlinisProps {
    data: CardPenugasanKlinisData;
    onEdit?: () => void;
    onDelete?: () => void;
    onViewDocument?: (url: string) => void;
}

const CardPenugasanKlinis = ({ data, onEdit, onDelete, onViewDocument }: CardPenugasanKlinisProps) => {

    return (
        <RecordCard
            icon={<Icon icon={FileText} variant="soft" rounded="md" sizeBox="lg" sizeIcon="sm" />}
            onEdit={onEdit} onDelete={onDelete} enableDelete={false}
        >
            <div className={styles.header}>
                <Text text="Penugasan Klinis" fontSize="18px" weight="bold" color="default" />
                <Text text={`No: ${data.nomorSurat}`} color="green" variant="body" />
            </div>
            <div className={styles.grid}>
                <DataField label="Tanggal Mulai" value={data.tglMulai} isDate={true} />
                <DataField label="Tanggal Kadaluarsa" value={data.tglKadaluarsa || "-"} isDate={true} />
            </div>
            <div className={styles.actionsBox}>
                <Badge variant={data.isCurrent ? "success" : "danger"}>
                    {data.isCurrent ? "Aktif" : "Tidak Aktif"}
                </Badge>
                {data.linkDokumen && onViewDocument && (
                    <Button label="Lihat Dokumen" variant="primary" onClick={() => onViewDocument(getProxiedFileUrl(data.linkDokumen))} />
                )}
            </div>
        </RecordCard>
    )
}

export default CardPenugasanKlinis