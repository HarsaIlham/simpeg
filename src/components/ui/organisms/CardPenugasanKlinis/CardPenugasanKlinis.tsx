import { FileText } from "lucide-react";
import Icon from "../../atoms/Icon";
import RecordCard from "../../molecules/RecordCard";
import styles from "./CardPenugasanKlinis.module.css";
import Text from "../../atoms/Text";
import DataField from "../../molecules/DataField";
import Button from "../../atoms/Button";

export interface CardPenugasanKlinisData {
    id: string;
    noSurat: string;
    tanggalMulai: string;
    tanggalBerakhir?: string;
}

interface CardPenugasanKlinisProps {
    data: CardPenugasanKlinisData;
    onEdit: () => void;
    onDelete: () => void;
}

const CardPenugasanKlinis = ({ data, onEdit, onDelete }: CardPenugasanKlinisProps) => {
    return (
        <RecordCard
            icon={<Icon icon={FileText} variant="soft" rounded="md" sizeBox="lg" sizeIcon="sm" />}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            <div className={styles.header}>
                <Text text="Penugasan Klinis" fontSize="18px" weight="bold" color="default" />
                <Text text={`No: ${data.noSurat}`} color="green" variant="body" />
            </div>

            <div className={styles.grid}>
                <DataField label="Tanggal Mulai" value={data.tanggalMulai} />
                <DataField label="Tanggal Berakhir" value={`${data.tanggalBerakhir}`} />
            </div>
            <div className={styles.actionsBox}>
                <Button label="Lihat Dokumen" variant="primary" />
            </div>
        </RecordCard>
    )
}

export default CardPenugasanKlinis