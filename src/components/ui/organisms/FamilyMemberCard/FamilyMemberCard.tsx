import { Heart, Phone, UserRound, Users, UsersRound } from "lucide-react";
import RecordCard from "../../molecules/RecordCard";
import DataField from "../../molecules/DataField";
import Badge from "../../atoms/Badge";
import Icon from "../../atoms/Icon";
import Text from "../../atoms/Text";
import styles from "./FamilyMemberCard.module.css";

export interface FamilyMemberData {
    id: string;
    nama: string;
    status: "Istri" | "Suami" | "Anak" | "Orang Tua" | "Kontak Darurat";
    tanggungan: boolean;
    nik?: string;
    tempatTanggalLahir?: string;
    pekerjaan?: string;
    instansi?: string;
    statusPernikahan?: string;
    tanggalMenikah?: string;
    nomorBukuNikah?: string;
    npwp?: string;
    usia?: string;
    jenisKelamin?: string;
    statusAnak?: string;
    pendidikanTerakhir?: string;
    namaAyah?: string;
    namaIbu?: string;
    statusHidup?: string;
    alamat?: string;
    hubunganKeluarga?: string;
    nomorHp?: string;
}

interface FamilyMemberCardProps {
    data: FamilyMemberData;
    onEdit?: () => void;
    onDelete?: () => void;
}

const getIconConfig = (status: string) => {
    switch (status) {
        case "Istri":
        case "Suami":
            return { icon: Heart, bgColor: "#fce4e4", color: "#e53e3e", badgeVariant: "danger" as const };
        case "Anak":
            return { icon: UserRound, bgColor: "#e3f2fd", color: "#3182ce", badgeVariant: "info" as const };
        case "Orang Tua":
            return { icon: UsersRound, bgColor: "#e0d8f1", color: "#805ad5", badgeVariant: "parent" as const };
        case "Kontak Darurat":
            return { icon: Phone, bgColor: "#fff3e0", color: "#F97316", badgeVariant: "warning" as const };
        default:
            return { icon: Users, bgColor: "#dc3545", color: "#dc3545", badgeVariant: "danger" as const };
    }
};

const FamilyMemberCard = ({ data, onEdit, onDelete }: FamilyMemberCardProps) => {
    const config = getIconConfig(data.status);

    return (
        <RecordCard
            icon={<Icon icon={config.icon} color={config.color} rounded="full" sizeBox="lg" sizeIcon="sm" bgColor={config.bgColor} />}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            <div className={styles.header}>
                <Text text={data.nama} variant="body" weight="bold" color="default" />
                <Badge variant={config.badgeVariant}>{data.status}</Badge>
                {data.tanggungan && <Badge variant="success">Tanggungan</Badge>}
            </div>

            <div className={styles.grid}>
                {data.nik && <DataField label="NIK" value={data.nik} />}
                {data.tempatTanggalLahir && <DataField label="Tempat, Tanggal Lahir" value={data.tempatTanggalLahir} />}
                {data.pekerjaan && <DataField label="Pekerjaan" value={data.pekerjaan} />}
                {data.instansi && <DataField label="Instansi" value={data.instansi} />}
                {data.statusPernikahan && <DataField label="Status Pernikahan" value={data.statusPernikahan} />}
                {data.tanggalMenikah && <DataField label="Tanggal Menikah" value={data.tanggalMenikah} />}
                {data.nomorBukuNikah && <DataField label="Nomor Buku Nikah" value={data.nomorBukuNikah} />}
                {data.npwp && <DataField label="NPWP" value={data.npwp} />}
                
                {data.usia && <DataField label="Usia" value={data.usia} />}
                {data.jenisKelamin && <DataField label="Jenis Kelamin" value={data.jenisKelamin} />}
                {data.statusAnak && <DataField label="Status Anak" value={data.statusAnak} />}
                {data.pendidikanTerakhir && <DataField label="Pendidikan Terakhir" value={data.pendidikanTerakhir} />}
                
                {data.namaAyah && <DataField label="Nama Ayah" value={data.namaAyah} />}
                {data.namaIbu && <DataField label="Nama Ibu" value={data.namaIbu} />}
                {data.statusHidup && <DataField label="Status" value={data.statusHidup} />}
                {data.alamat && <DataField label="Alamat" value={data.alamat} />}
                
                {data.hubunganKeluarga && <DataField label="Hubungan Keluarga" value={data.hubunganKeluarga} />}
                {data.nomorHp && <DataField label="Nomor HP" value={data.nomorHp} />}
            </div>
        </RecordCard>
    );
};

export default FamilyMemberCard;
