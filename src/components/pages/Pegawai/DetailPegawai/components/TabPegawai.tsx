import { User } from "lucide-react";
import CardProfile from "../../../Profil/components/CardProfile";
import FormProfile from "../../../Profil/components/FormProfile";
import type { propsType } from "../../../Profil/components/FormProfile/FormProfile";
import Icon from "../../../../ui/atoms/Icon";
import styles from "../DetailPegawai.module.css";

interface TabPegawaiProps {
    profileData: propsType;
    photoUrl: string | null;
    statusPegawai: string;
    pegawaiMeta: {
        nama: string;
        nip: string;
        jabatan: string;
        email: string;
        noTelp: string;
        unitKerja: string;
    };
    isAdmin: boolean;
}

const statusVariantMap: Record<string, "success" | "warning" | "danger" | "neutral"> = {
    aktif: "success",
    nonaktif: "danger",
    cuti: "warning",
};

const TabPegawai = ({ profileData, photoUrl, statusPegawai, pegawaiMeta, isAdmin }: TabPegawaiProps) => {
    return (
        <div className={styles.profilLayout}>
            <div className={styles.profilContentLeft}>
                <CardProfile
                    icon={
                        photoUrl
                            ? undefined
                            : <Icon icon={User} variant="primary" rounded="full" sizeBox="xl" sizeIcon="xl" />
                    }
                    img={
                        photoUrl
                            ? <img src={photoUrl} alt={pegawaiMeta.nama} className={styles.profilePhoto} />
                            : undefined
                    }
                    nama={pegawaiMeta.nama}
                    nip={pegawaiMeta.nip}
                    profesi={pegawaiMeta.jabatan}
                    email={pegawaiMeta.email}
                    phone={pegawaiMeta.noTelp}
                    location={pegawaiMeta.unitKerja}
                    statusPegawai={statusPegawai.charAt(0).toUpperCase() + statusPegawai.slice(1)}
                    statusVariant={statusVariantMap[statusPegawai.toLowerCase()] || "neutral"}
                />
            </div>

            <FormProfile
                initialData={profileData}
                readOnly={!isAdmin}
                isAdd={isAdmin}
            />
        </div>
    );
};

export default TabPegawai;
