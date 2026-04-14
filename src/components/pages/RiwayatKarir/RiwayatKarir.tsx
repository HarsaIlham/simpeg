import Topbar from "../../ui/organisms/Topbar/Topbar";
import { Plus, TrendingUp, GraduationCap, Briefcase, Award, FileText, ClipboardList } from "lucide-react";
import MainHeaderSection from "../../ui/molecules/MainHeaderSection";
import Icon from "../../ui/atoms/Icon";
import CardPendidikan from "../../ui/organisms/CardPendidikan";
import type { CardPendidikanData } from "../../ui/organisms/CardPendidikan/CardPendidikan";
import CardJabatan from "../../ui/organisms/CardJabatan";
import type { CardJabatanData } from "../../ui/organisms/CardJabatan/CardJabatan";
import Tabs from "../../ui/molecules/Tabs";
import Card from "../../ui/atoms/Card";
import styles from "./RiwayatKarir.module.css";
import Button from "../../ui/atoms/Button";
import { useState } from "react";
import Modal from "../../ui/organisms/Modal";
import FormJabatan from "../../ui/organisms/FormJabatan";
import CardPangkat from "../../ui/organisms/CardPangkat";
import type { CardPangkatData } from "../../ui/organisms/CardPangkat/CardPangkat";
import CardStr from "../../ui/organisms/CardStr";
import type { CardStrData } from "../../ui/organisms/CardStr/CardStr";
import type { CardPenugasanKlinisData } from "../../ui/organisms/CardPenugasanKlinis/CardPenugasanKlinis";
import CardPenugasanKlinis from "../../ui/organisms/CardPenugasanKlinis";
import FormPendidikan from "../../ui/organisms/FormPendidikan";
import FormPangkat from "../../ui/organisms/FormPangkat";
import FormStrsip from "../../ui/organisms/FormStrsip";


const RiwayatKarir = () => {
  const dataPendidikan: CardPendidikanData[] = [
    {
      jenjangPendidikan: "S1",
      jurusan: "Teknik Informatika",
      institusi: "Universitas Gadjah Mada",
      tahunMasuk: "2018",
      tahunLulus: "2022",
      ipk: "3.85",
    },
    {
      jenjangPendidikan: "S2",
      jurusan: "Teknik Informatika",
      institusi: "Universitas Gadjah Mada",
      tahunMasuk: "2022",
      tahunLulus: "2024",
      ipk: "3.90",
    },
  ];

  const dataJabatan: CardJabatanData[] = [
    {
      id: "jab-1",
      namaJabatan: "Dokter Spesialis Penyakit Dalam",
      unitKerja: "Poliklinik Penyakit Dalam",
      tmt: "1 Januari 2015",
      noSk: "SK/123/2015",
    },
    {
      id: "jab-2",
      namaJabatan: "Dokter Umum",
      unitKerja: "IGD",
      tmt: "1 Juli 2010",
      noSk: "SK/045/2010",
    },
  ];

  const dataPangkat: CardPangkatData[] = [
    {
      pangkat: "Penata Tk. I",
      golonganRuang: "III/d",
      tmt: "1 Januari 2015",
      noSk: "SK/123/2015",
    },
    {
      pangkat: "Dokter Umum",
      golonganRuang: "Dokter Umum",
      tmt: "1 Juli 2010",
      noSk: "SK/045/2010",
    },
  ];

  const dataStrSip: CardStrData[] = [
    {
      id: "str-1",
      type: "STR",
      noSurat: "STR/12345/2024",
      terbit: "1 Januari 2024",
      berlaku: "31 Desember 2028",
      status: "Aktif",
    },
    {
      id: "sip-1",
      type: "SIP",
      noSurat: "SIP/567/RS/2024",
      tempat: "RS Kalisat",
      terbit: "15 Januari 2024",
      berlaku: "14 Januari 2025",
      status: "Aktif",
    },
  ];

  const dataPenugasanKlinis: CardPenugasanKlinisData[] = [
    {
      id: "penugasan-1",
      noSurat: "445/PKL-RSD/IV/2026",
      tanggalMulai: "1 Januari 2024",
      tanggalBerakhir: "31 Desember 2028",
    },
    {
      id: "penugasan-2",
      noSurat: "425/PKL-RSD/V/2023",
      tanggalMulai: "15 Januari 2024",
      tanggalBerakhir: "14 Januari 2025",
    },
  ];

  const tabItems = [
    { id: "pendidikan", label: "Pendidikan", icon: <GraduationCap size={16} /> },
    { id: "jabatan", label: "Jabatan", icon: <Briefcase size={16} /> },
    { id: "pangkat", label: "Pangkat", icon: <Award size={16} /> },
    { id: "str-sip", label: "STR/SIP", icon: <FileText size={16} /> },
    { id: "penugasan", label: "Penugasan Klinis", icon: <ClipboardList size={16} /> },
  ];

  const [activeTab, setActiveTab] = useState("pendidikan");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [strsipType, setStrsipType] = useState<"" | "STR" | "SIP">("");

  const getActiveTabLabel = () => {
    const tab = tabItems.find(t => t.id === activeTab);
    return tab ? tab.label : "";
  };

  return (
    <>
      <Topbar title="Riwayat Karir" />
      <MainHeaderSection
        children={<Icon icon={TrendingUp} variant="transparant" sizeIcon="sm" />}
        title="Riwayat Karir"
        subtitle="Kelola informasi pendidikan, jabatan, pangkat, STR dan SIP"
      />

      <div className={styles.tabsWrapper}>
        <Card>
          <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />
        </Card>
      </div>

      <Button
        variant="primary"
        icon={<Plus size={24} />}
        label={`Tambah Data ${getActiveTabLabel()}`}
        onClick={() => setIsModalOpen(true)}
      />

      <div className={styles.recordList}>
        {activeTab === "pendidikan" && dataPendidikan.map((pendidikan, index) => (
          <CardPendidikan
            key={index}
            data={pendidikan}
            onEdit={() => console.log("Edit Pendidikan", index)}
            onDelete={() => console.log("Delete Pendidikan", index)}
          />
        ))}

        {activeTab === "jabatan" && dataJabatan.map((jabatan) => (
          <CardJabatan
            key={jabatan.id}
            data={jabatan}
            onEdit={() => console.log("Edit Jabatan", jabatan.id)}
            onDelete={() => console.log("Delete Jabatan", jabatan.id)}
          />
        ))}

        {activeTab === "pangkat" && dataPangkat.map((pangkat, index) => (
          <CardPangkat
            key={index}
            data={pangkat}
            onEdit={() => console.log("Edit Pangkat")}
            onDelete={() => console.log("Delete Pangkat")}
          />
        ))}

        {activeTab === "str-sip" && dataStrSip.map((surat) => (
          <CardStr
            key={surat.id}
            data={surat}
            onEdit={() => console.log("Edit STR/SIP", surat.id)}
            onDelete={() => console.log("Delete STR/SIP", surat.id)}
          />
        ))}

        {activeTab === "penugasan" && dataPenugasanKlinis.map((penugasan) => (
          <CardPenugasanKlinis
            key={penugasan.id}
            data={penugasan}
            onEdit={() => console.log("Edit Penugasan Klinis", penugasan.id)}
            onDelete={() => console.log("Delete Penugasan Klinis", penugasan.id)}
          />
        ))}

        {activeTab !== "pendidikan" && activeTab !== "jabatan" && activeTab !== "pangkat" && activeTab !== "str-sip" && activeTab !== "penugasan" && (
          <p style={{ color: "var(--color-muted)", padding: "20px 0" }}>Belum ada data untuk {getActiveTabLabel()}</p>
        )}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            activeTab === "str-sip" && strsipType !== ""
              ? `Tambah Data ${strsipType}`
              : `Tambah Data ${getActiveTabLabel()}`
          }
        >
          {activeTab === "jabatan" && (
            <FormJabatan
              onCancel={() => setIsModalOpen(false)}
              onSubmit={() => {
                setIsModalOpen(false);
              }}
            />
          )}

          {activeTab === "pendidikan" && (
            <FormPendidikan
              onCancel={() => setIsModalOpen(false)}
              onSubmit={() => {
                setIsModalOpen(false);
              }}
            />
          )}

          {activeTab === "pangkat" && (
            <FormPangkat
              onCancel={() => setIsModalOpen(false)}
              onSubmit={() => {
                setIsModalOpen(false);
              }}
            />
          )}

          {activeTab === "str-sip" && (
            <FormStrsip
              onCancel={() => setIsModalOpen(false)}
              onSubmit={() => {
                setIsModalOpen(false);
              }}
              onTypeChange={(type) => setStrsipType(type)}
            />
          )}
        </Modal>
      )}
    </>
  )
}

export default RiwayatKarir