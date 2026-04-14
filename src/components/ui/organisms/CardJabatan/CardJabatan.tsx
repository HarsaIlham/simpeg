import { Briefcase } from "lucide-react"
import RecordCard from "../../molecules/RecordCard"
import Icon from "../../atoms/Icon"
import styles from "./CardJabatan.module.css"
import Text from "../../atoms/Text"
import DataField from "../../molecules/DataField"

export interface CardJabatanData {
    id: string;
    namaJabatan: string;
    unitKerja: string;
    tmt: string;
    noSk: string;
}

interface CardJabatanProps {
    data: CardJabatanData;
    onEdit?: () => void;
    onDelete?: () => void;
}

const CardJabatan = ({ data, onEdit, onDelete }: CardJabatanProps) => {
    return (
        <RecordCard
            icon={<Icon icon={Briefcase} variant="soft" color="#218838" bgColor="#e6f4ea" rounded="md" sizeBox="lg" sizeIcon="sm" />}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            <div className={styles.header}>
                <Text text={data.namaJabatan} weight="bold" color="default" fontSize="18px" />
                <Text text={data.unitKerja} variant="body" color="green" />
            </div>
            <div className={styles.grid}>
                <DataField label="Terhitung Mulai Tanggal" value={data.tmt} />
                <DataField label="Nomor SK" value={data.noSk} />
            </div>
        </RecordCard>
    )
}

export default CardJabatan
