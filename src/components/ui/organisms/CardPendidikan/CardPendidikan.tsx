
import { GraduationCap } from "lucide-react"
import RecordCard from "../../molecules/RecordCard"
import Icon from "../../atoms/Icon"
import styles from "./CardPendidikan.module.css"
import Text from "../../atoms/Text"
import DataField from "../../molecules/DataField"
import Button from "../../atoms/Button"
import { getProxiedFileUrl } from "../../../../utils/api"


export interface CardPendidikanData {
    id: number;
    jenjang: string;
    institusi: string;
    jurusan: string;
    tahun_lulus: number;
    nomor_ijazah: string | null;
    link_ijazah: string | null;
}

interface CardPendidikanProps {
    data: CardPendidikanData;
    onEdit?: () => void;
    onDelete?: () => void;
    onViewDocument?: (url: string) => void;
}

const CardPendidikan = ({ data, onEdit, onDelete, onViewDocument }: CardPendidikanProps) => {

    return (
        <RecordCard
            icon={<Icon icon={GraduationCap} variant="soft" rounded="md" sizeBox="lg" sizeIcon="sm" />}
            onEdit={onEdit} onDelete={onDelete} enableDelete={false}
        >
            <div className={styles.header}>
                <Text text={`${data.jenjang} - ${data.jurusan}`} weight="bold" color="default" fontSize="18px" />
            </div>
            <DataField label="Institusi" value={data.institusi} />
            <div className={styles.grid}>
                <DataField label="Tahun Lulus" value={String(data.tahun_lulus)} />
                <DataField label="No Ijazah" value={data.nomor_ijazah || "-"} />
            </div>
            {data.link_ijazah && onViewDocument && (
                <div className={styles.actionsBox}>
                    <Button label="Lihat Dokumen" variant="primary" onClick={() => onViewDocument(getProxiedFileUrl(data.link_ijazah))} />
                </div>
            )}
            
        </RecordCard>
    )
}

export default CardPendidikan