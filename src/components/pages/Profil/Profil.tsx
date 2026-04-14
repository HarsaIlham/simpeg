import Topbar from "../../ui/organisms/Topbar/Topbar"
import MainHeaderSection from "../../ui/molecules/MainHeaderSection/MainHeaderSection"
import CardProfile from "../../ui/organisms/CardProfile"
import FormProfile from "../../ui/organisms/FormProfile"
import Icon from "../../ui/atoms/Icon"
import ChangeRequestCard from "../../ui/organisms/ChangeRequestCard"
import type { ChangeRequestData } from "../../ui/organisms/ChangeRequestCard/ChangeRequestCard"
import { User } from "lucide-react"

import styles from "./Profil.module.css"
import type { propsType } from "../../ui/organisms/FormProfile/FormProfile"

const dummyProfileData: propsType = {
    namaLengkap: "Dr. Ahmad Wijaya",
    nip: "198501152010011001",
    nik: "350912123456789",
    email: "ahmad.wijaya@rskalisat.id",
    noTelepon: "081234567899",
    tanggalLahir: "15 Januari 1985",
    jenisKelamin: "Laki-laki",
    agama: "Islam",
    statusPernikahan: "Menikah",
    pendidikanTerakhir: "S2",
    jabatan: "Dokter Spesialis Penyakit Dalam",
    unitKerja: "Poliklinik Penyakit Dalam",
    alamat: "Jl. Melati No. 45, Kalisat, Jember, Jawa Timur",
};

const dummyRequests: ChangeRequestData[] = [
    {
        id: "req-2",
        title: "Update Data Keluarga",
        date: "Diminta pada: 05 Jan 2026",
        statusLabel: "Pending",
        statusVariant: "warning",
    },
    {
        id: "req-3",
        title: "Koreksi NIK",
        date: "Diminta pada: 10 Nov 2025",
        statusLabel: "Ditolak",
        statusVariant: "danger",
    }
];

const Profil = () => {
    const handleSubmitChange = (data: propsType) => {
        console.log("Data perubahan diajukan:", data);
    };

    return (
        <>
            <Topbar title="Profil Pegawai" />

            <MainHeaderSection title="Profil Saya" subtitle="Kelola Informasi Profil dan Data Diri Anda" />

            <div className={styles.profilLayout}>
                <div className={styles.profilContentLeft}>
                    <CardProfile
                        icon={<Icon icon={User} variant="primary" rounded="full" sizeBox="xl" sizeIcon="xl" />}
                        nama="Dr. Ahmad Wijaya" nip="NIP: 198501152010011001" profesi="Dokter Spesialis Penyakit Dalam"
                        email="ahmad.wijaya@rskalisat.id"
                        phone="081234567899"
                        location="Poliklinik Penyakit Dalam"
                    />
                    
                    <ChangeRequestCard requests={dummyRequests} />
                </div>


                <FormProfile
                    initialData={dummyProfileData}
                    onSubmit={handleSubmitChange}
                />
            </div>
        </>
    )
}

export default Profil