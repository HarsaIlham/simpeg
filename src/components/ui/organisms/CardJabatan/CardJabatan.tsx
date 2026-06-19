
import { Briefcase } from "lucide-react"
import Badge from "../../atoms/Badge"
import RecordCard from "../../molecules/RecordCard"
import Icon from "../../atoms/Icon"
import styles from "./CardJabatan.module.css"
import Text from "../../atoms/Text"
import DataField from "../../molecules/DataField"
import Button from "../../atoms/Button"
import { getProxiedFileUrl } from "../../../../utils/api"

export interface CardJabatanData {
    id: number;
    unit_kerja_id: number;
    unit_kerja_nama: string;
    namaJabatan: string;
    isCurrent: boolean;
    tmt_mulai: string;
    tmt_selesai?: string;
    link_sk?: string | null;
    note?: string;
}

interface CardJabatanProps {
    data: CardJabatanData;
    onEdit?: () => void;
    onDelete?: () => void;
    onViewDocument?: (url: string) => void;
}

const CardJabatan = ({ data, onEdit, onDelete, onViewDocument }: CardJabatanProps) => {

    return (
        <RecordCard
            icon={<Icon icon={Briefcase} variant="soft" color="#218838" bgColor="#e6f4ea" rounded="md" sizeBox="lg" sizeIcon="sm" />}
            onEdit={onEdit} onDelete={onDelete} enableDelete={false}
        >
            <div className={styles.header}>
                <Text text={data.namaJabatan} weight="bold" color="default" fontSize="18px" />
                <Badge variant={data.isCurrent ? "success" : "danger"}>
                    {data.isCurrent ? "Aktif" : "Tidak Aktif"}
                </Badge>
            </div>
            <div className={styles.grid}>
                <DataField label="Terhitung Mulai Tanggal" value={data.tmt_mulai} isDate={true} />
                <DataField label="Tanggal Selesai" value={data.tmt_selesai || "-"} isDate={true} />
            </div>
            <div className={styles.actionsBox}>
                {data.link_sk && onViewDocument && (
                    <Button label="Lihat Dokumen" variant="primary" onClick={() => onViewDocument(getProxiedFileUrl(data.link_sk))} />
                )}
            </div>
        </RecordCard>
    )
}

export default CardJabatan
