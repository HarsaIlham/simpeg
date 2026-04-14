import Topbar from "../../ui/organisms/Topbar/Topbar"
import StatCard from "../../ui/molecules/StatCard"
import styles from "./DataKeluarga.module.css"
import { UsersRound, Heart, UserRound, Phone, Plus } from "lucide-react"
import MainHeaderSection from "../../ui/molecules/MainHeaderSection"
import Button from "../../ui/atoms/Button"
import FamilyMemberCard from "../../ui/organisms/FamilyMemberCard"
import type { FamilyMemberData } from "../../ui/organisms/FamilyMemberCard/FamilyMemberCard"

const DataKeluarga = () => {
  const statsData = {
    keluarga: "3",
    pasangan: "1",
    anak: "1",
    kontakDarurat: "1"
  };

  const familyData: FamilyMemberData[] = [
    {
      id: "fam-1",
      nama: "Siti Nurhaliza",
      status: "Istri",
      tanggungan: true,
      nik: "3509015501850001",
      tempatTanggalLahir: "Jember, 15 Mei 1985",
      pekerjaan: "Guru",
      instansi: "SDN 1 Kalisat",
      statusPernikahan: "Sah",
      tanggalMenikah: "15 Juni 2009",
      nomorBukuNikah: "NK/123/VI/2009",
      npwp: "12.345.678.9-012.000"
    },
    {
      id: "fam-2",
      nama: "Ahmad Faiz Wijaya",
      status: "Anak",
      tanggungan: true,
      nik: "3509011010201000",
      tempatTanggalLahir: "Jember, 10 Oktober 2010",
      usia: "15 tahun",
      jenisKelamin: "Laki-laki",
      statusAnak: "Kandung",
      pendidikanTerakhir: "SMP"
    },
    {
      id: "fam-3",
      nama: "Data Orang Tua",
      status: "Orang Tua",
      tanggungan: false,
      namaAyah: "Slamet Gunardi",
      namaIbu: "Siti Aminah",
      statusHidup: "Hidup",
      alamat: "Jl. Merdeka No. 45, Kalisat, Jember",
    }
  ];
  return (
    <>
      <Topbar title="Data Keluarga" />
      <MainHeaderSection title="Data Keluarga" subtitle="Kelola informasi anggota keluarga Anda" />
      <div className={styles.statsRow}>
        <StatCard
          icon={<UsersRound size={24} />}
          value={statsData.keluarga}
          label="Total Data Keluarga"
          variant="green"
        />
        <StatCard
          icon={<Heart size={24} />}
          value={statsData.pasangan}
          label="Pasangan"
          variant="red"
        />
        <StatCard
          icon={<UserRound size={24} />}
          value={statsData.anak}
          label="Anak"
          variant="blue"
        />
        <StatCard
          icon={<Phone size={24} />}
          value={statsData.kontakDarurat}
          label="Kontak Darurat"
          variant="amber"
        />
      </div>
      <Button variant="primary" icon={<Plus size={24} />} label="Tambah Data Keluarga" />
      <div className={styles.recordList}>
          {familyData.map(member => (
            <FamilyMemberCard 
              key={member.id} 
              data={member} 
              onEdit={() => console.log("Edit", member.id)}
              onDelete={() => console.log("Delete", member.id)}
            />
          ))}
        </div>
    </>
  )
}

export default DataKeluarga