import { Award } from "lucide-react";
import RecordCard from "../../molecules/RecordCard"
import Icon from "../../atoms/Icon";
import styles from "./CardPangkat.module.css";
import Text from "../../atoms/Text";
import DataField from "../../molecules/DataField";

export interface CardPangkatData {
    pangkat: string;
    golonganRuang: string;
    tmt: string;
    noSk: string;
}

interface CardPangkatProps {
    data: CardPangkatData;
    onEdit?: () => void;
    onDelete?: () => void;
}

const CardPangkat = ({ data, onEdit, onDelete }: CardPangkatProps) => {
    return (
        <RecordCard onDelete={onDelete} onEdit={onEdit}
            icon={<Icon icon={Award} variant="soft" color="#218838" bgColor="#e6f4ea" rounded="md" sizeBox="lg" sizeIcon="sm" />}>
            <>
                <div className={styles.header}>
                    <Text text={`${data.pangkat} (${data.golonganRuang})`} weight="bold" color="default" fontSize="18px" />
                </div>

                <div className={styles.grid}>
                    <DataField label="Terhitung Mulai Tanggal" value={data.tmt} />
                    <DataField label="Nomor SK" value={data.noSk} />
                </div>
            </>
        </RecordCard>
    )
}

export default CardPangkat