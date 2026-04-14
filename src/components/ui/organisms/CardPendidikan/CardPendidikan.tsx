import { GraduationCap } from "lucide-react"
import RecordCard from "../../molecules/RecordCard"
import Icon from "../../atoms/Icon"
import styles from "./CardPendidikan.module.css"
import Text from "../../atoms/Text"
import DataField from "../../molecules/DataField"

export interface CardPendidikanData {
    jenjangPendidikan: string;
    jurusan: string;
    institusi: string;
    tahunMasuk: string;
    tahunLulus: string;
    ipk: string;
}

interface CardPendidikanProps {
    data: CardPendidikanData;
    onEdit?: () => void;
    onDelete?: () => void;
}

const CardPendidikan = ({data, onEdit, onDelete}: CardPendidikanProps) => {
  return (
        <RecordCard
            icon={<Icon icon={GraduationCap} variant="soft" rounded="md" sizeBox="lg" sizeIcon="sm" />}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            <div className={styles.header}>
                <Text text={`${data.jenjangPendidikan} - ${data.jurusan}`} weight="bold" color="default" fontSize="18px" />
            </div>

            <DataField label="Institusi" value={data.institusi} />
            <div className={styles.grid}>
                <DataField label="Masa Studi" value={`${data.tahunMasuk} - ${data.tahunLulus}`} />
                <DataField label="IPK" value={data.ipk} />
            </div>
        </RecordCard>
  )
}

export default CardPendidikan