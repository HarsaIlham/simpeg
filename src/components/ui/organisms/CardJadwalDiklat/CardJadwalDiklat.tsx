import { GraduationCap, Calendar, MapPin, Clock, Users } from "lucide-react"
import RecordCard from "../../molecules/RecordCard"
import Icon from "../../atoms/Icon"
import Text from "../../atoms/Text"
import Badge from "../../atoms/Badge"
import styles from "./CardJadwalDiklat.module.css"

export interface CardJadwalDiklatData {
    id: string;
    namaDiklat: string;
    kategoriPegawai: string;
    jenisDiklat: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    tempat: string;
    jam: string;
    peserta: string;
    penyelenggara: string;
    pencatat?: string;
    status: string;
}

interface CardJadwalDiklatProps {
    data: CardJadwalDiklatData;
}

const CardJadwalDiklat = ({ data }: CardJadwalDiklatProps) => {
    return (
        <RecordCard
            icon={<Icon icon={GraduationCap} variant="soft" color="#218838" bgColor="#e6f4ea" rounded="md" sizeBox="lg" sizeIcon="sm" />}
        >
            <div className={styles.header}>
                <Text text={data.namaDiklat} weight="bold" color="default" fontSize="18px" />
                <div className={styles.badgeGroup}>
                    <Badge variant="success">{data.kategoriPegawai}</Badge>
                    <Badge variant="info">{data.jenisDiklat}</Badge>
                </div>
            </div>

            <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                    <span className={styles.detailIcon}><Calendar size={14} /></span>
                    <span>{data.tanggalMulai} - {data.tanggalSelesai}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailIcon}><Clock size={14} /></span>
                    <span>{data.jam}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailIcon}><MapPin size={14} /></span>
                    <span>{data.tempat}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailIcon}><Users size={14} /></span>
                    <span>{data.peserta}</span>
                </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.footer}>
                <span className={styles.footerLabel}>
                    Penyelenggara: <span className={styles.footerLabelBold}>{data.penyelenggara}</span>
                </span>
                {data.pencatat && (
                    <span className={styles.footerLabel}>by: {data.pencatat}</span>
                )}
            </div>
        </RecordCard>
    )
}

export default CardJadwalDiklat
