import { useState, useEffect, useCallback } from "react";
import { Plus, GraduationCap, Briefcase, Award, FileText, ClipboardList } from "lucide-react";
import Card from "../../../ui/atoms/Card";
import styles from "./RiwayatKarirContainer.module.css";
import Button from "../../../ui/atoms/Button";
import Modal from "../../../ui/organisms/Modal";
import Tabs from "../../../ui/molecules/Tabs";
import Popup from "../../../ui/molecules/Popup";
import ConfirmDeleteModal from "../../../ui/organisms/ConfirmDeleteModal";
import PdfViewerModal from "../../../ui/molecules/PdfViewerModal";

import CardPendidikan from "../../../ui/organisms/CardPendidikan";
import type { CardPendidikanData } from "../../../ui/organisms/CardPendidikan/CardPendidikan";
import CardJabatan from "../../../ui/organisms/CardJabatan";
import type { CardJabatanData } from "../../../ui/organisms/CardJabatan/CardJabatan";
import CardPangkat from "../../../ui/organisms/CardPangkat";
import type { CardPangkatData } from "../../../ui/organisms/CardPangkat/CardPangkat";
import CardStr from "../../../ui/organisms/CardStr";
import type { CardStrData } from "../../../ui/organisms/CardStr/CardStr";
import CardSip from "../../../ui/organisms/CardSip";
import type { CardSipData } from "../../../ui/organisms/CardSip/CardSip";
import CardPenugasanKlinis from "../../../ui/organisms/CardPenugasanKlinis";
import type { CardPenugasanKlinisData } from "../../../ui/organisms/CardPenugasanKlinis/CardPenugasanKlinis";

import FormPendidikan from "../../../ui/organisms/FormPendidikan";
import FormJabatan from "../../../ui/organisms/FormJabatan";
import FormPangkat from "../../../ui/organisms/FormPangkat";
import FormStrsip from "../../../ui/organisms/FormStrsip";
import FormPenugasanKlinis from "../../../ui/organisms/FormPenugasanKlinis";

import { pendidikanService } from "../../../../services/pendidikanService";
import { jabatanService } from "../../../../services/jabatanService";
import { pangkatService } from "../../../../services/pangkatService";
import { strService } from "../../../../services/strService";
import { sipService } from "../../../../services/sipService";
import { penugasanKlinisService } from "../../../../services/penugasanKlinisService";
import { hrdPegawaiService } from "../../../../services/hrdPegawaiService";

import type {
  RiwayatPendidikanItem,
  RiwayatJabatanItem,
  RiwayatPangkatItem,
  RiwayatStrItem,
  RiwayatSipItem,
  RiwayatPenugasanKlinisItem,
} from "../../../../types/api";

const mapToCardPendidikan = (item: RiwayatPendidikanItem): CardPendidikanData => ({
  id: item.id,
  jenjang: item.jenjang,
  institusi: item.institusi,
  jurusan: item.jurusan,
  tahun_lulus: item.tahun_lulus,
  nomor_ijazah: item.nomor_ijazah,
  link_ijazah: item.link_ijazah,
});

const mapToCardJabatan = (item: RiwayatJabatanItem): CardJabatanData => ({
  id: item.id,
  unit_kerja_id: item.unit_kerja_id,
  unit_kerja_nama: item.unit_kerja_nama,
  namaJabatan: item.nama_jabatan,
  isCurrent: item.is_current,
  tmt_mulai: item.tmt_mulai,
  tmt_selesai: item.tmt_selesai,
  link_sk: item.link_sk,
  note: item.note,
});

const mapToCardPangkat = (item: RiwayatPangkatItem): CardPangkatData => ({
  id: item.id,
  namaPangkat: item.nama_pangkat,
  isCurrent: item.is_current,
  pejabatPenetap: item.pejabat_penetap,
  tmtSk: item.tmt_sk,
  startedAt: item.started_at,
  endedAt: item.ended_at,
  linkSk: item.link_sk,
  note: item.note,
});

const mapToCardStr = (item: RiwayatStrItem): CardStrData => ({
  id: item.id,
  nomorStr: item.nomor_str,
  tanggalTerbit: item.tanggal_terbit,
  tanggalKadaluarsa: item.tanggal_kadaluarsa,
  isCurrent: item.is_current,
  linkSk: item.link_sk,
});

const mapToCardSip = (item: RiwayatSipItem): CardSipData => ({
  id: item.id,
  jenisSipId: item.jenis_sip_id,
  jenisSipNama: item.jenis_sip_nama,
  nomorSip: item.nomor_sip,
  tanggalTerbit: item.tanggal_terbit,
  tanggalKadaluarsa: item.tanggal_kadaluarsa,
  isCurrent: item.is_current,
  linkSk: item.link_sk,
});

const mapToCardPenugasan = (item: RiwayatPenugasanKlinisItem): CardPenugasanKlinisData => ({
  id: item.id,
  nomorSurat: item.nomor_surat,
  tglMulai: item.tgl_mulai,
  tglKadaluarsa: item.tgl_kadaluarsa,
  isCurrent: item.is_current,
  linkDokumen: item.link_dokumen,
});

interface RiwayatKarirContainerProps {
  pegawaiId?: number;
  isAdmin?: boolean;
  pendidikanListProp?: CardPendidikanData[];
  jabatanListProp?: CardJabatanData[];
  pangkatListProp?: CardPangkatData[];
  strListProp?: CardStrData[];
  sipListProp?: CardSipData[];
  penugasanListProp?: CardPenugasanKlinisData[];
  onRefresh?: () => void;
  isLoadingProps?: {
    pendidikan?: boolean;
    jabatan?: boolean;
    pangkat?: boolean;
    str?: boolean;
    sip?: boolean;
    penugasan?: boolean;
  };
  errorProps?: {
    pendidikan?: string | null;
    jabatan?: string | null;
    pangkat?: string | null;
    str?: string | null;
    sip?: string | null;
    penugasan?: string | null;
  };
}

const tabItems = [
  { id: "pendidikan", label: "Pendidikan", icon: <GraduationCap size={16} /> },
  { id: "jabatan", label: "Jabatan", icon: <Briefcase size={16} /> },
  { id: "pangkat", label: "Pangkat", icon: <Award size={16} /> },
  { id: "str-sip", label: "STR/SIP", icon: <FileText size={16} /> },
  { id: "penugasan", label: "Penugasan Klinis", icon: <ClipboardList size={16} /> },
];

export const RiwayatKarirContainer = ({
  pegawaiId,
  isAdmin = true,
  pendidikanListProp,
  jabatanListProp,
  pangkatListProp,
  strListProp,
  sipListProp,
  penugasanListProp,
  onRefresh,
  isLoadingProps,
  errorProps,
}: RiwayatKarirContainerProps) => {
  const [activeTab, setActiveTab] = useState("pendidikan");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [strsipType, setStrsipType] = useState<"" | "STR" | "SIP">("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]> | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; type: string; label: string } | null>(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackPopup, setFeedbackPopup] = useState<{
    isOpen: boolean; variant: "success" | "error"; title: string; message: string;
  }>({ isOpen: false, variant: "success", title: "", message: "" });

  const showFeedback = (variant: "success" | "error", title: string, message: string) => {
    setFeedbackPopup({ isOpen: true, variant, title, message });
  };

  const [previewFile, setPreviewFile] = useState<{ url: string; title: string } | null>(null);

  const handleViewDocument = (url: string, title?: string) => {
    setPreviewFile({ url, title: title || "Dokumen" });
  };

  const [pendidikanList, setPendidikanList] = useState<CardPendidikanData[]>([]);
  const [isLoadingPendidikan, setIsLoadingPendidikan] = useState(false);
  const [errorPendidikan, setErrorPendidikan] = useState<string | null>(null);
  const [selectedPendidikan, setSelectedPendidikan] = useState<CardPendidikanData | null>(null);

  const [jabatanList, setJabatanList] = useState<CardJabatanData[]>([]);
  const [isLoadingJabatan, setIsLoadingJabatan] = useState(false);
  const [errorJabatan, setErrorJabatan] = useState<string | null>(null);
  const [selectedJabatan, setSelectedJabatan] = useState<CardJabatanData | null>(null);

  const [pangkatList, setPangkatList] = useState<CardPangkatData[]>([]);
  const [isLoadingPangkat, setIsLoadingPangkat] = useState(false);
  const [errorPangkat, setErrorPangkat] = useState<string | null>(null);
  const [selectedPangkat, setSelectedPangkat] = useState<CardPangkatData | null>(null);

  const [strList, setStrList] = useState<CardStrData[]>([]);
  const [isLoadingStr, setIsLoadingStr] = useState(false);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const [selectedStr, setSelectedStr] = useState<CardStrData | null>(null);

  const [sipList, setSipList] = useState<CardSipData[]>([]);
  const [isLoadingSip, setIsLoadingSip] = useState(false);
  const [errorSip, setErrorSip] = useState<string | null>(null);
  const [selectedSip, setSelectedSip] = useState<CardSipData | null>(null);

  const [penugasanList, setPenugasanList] = useState<CardPenugasanKlinisData[]>([]);
  const [isLoadingPenugasan, setIsLoadingPenugasan] = useState(false);
  const [errorPenugasan, setErrorPenugasan] = useState<string | null>(null);
  const [selectedPenugasan, setSelectedPenugasan] = useState<CardPenugasanKlinisData | null>(null);

  useEffect(() => {
    if (pendidikanListProp !== undefined) setPendidikanList(pendidikanListProp);
    if (jabatanListProp !== undefined) setJabatanList(jabatanListProp);
    if (pangkatListProp !== undefined) setPangkatList(pangkatListProp);
    if (strListProp !== undefined) setStrList(strListProp);
    if (sipListProp !== undefined) setSipList(sipListProp);
    if (penugasanListProp !== undefined) setPenugasanList(penugasanListProp);
  }, [pendidikanListProp, jabatanListProp, pangkatListProp, strListProp, sipListProp, penugasanListProp]);

  const activeLoadingPendidikan = isLoadingProps?.pendidikan ?? isLoadingPendidikan;
  const activeLoadingJabatan = isLoadingProps?.jabatan ?? isLoadingJabatan;
  const activeLoadingPangkat = isLoadingProps?.pangkat ?? isLoadingPangkat;
  const activeLoadingStr = isLoadingProps?.str ?? isLoadingStr;
  const activeLoadingSip = isLoadingProps?.sip ?? isLoadingSip;
  const activeLoadingPenugasan = isLoadingProps?.penugasan ?? isLoadingPenugasan;

  const activeErrorPendidikan = errorProps?.pendidikan ?? errorPendidikan;
  const activeErrorJabatan = errorProps?.jabatan ?? errorJabatan;
  const activeErrorPangkat = errorProps?.pangkat ?? errorPangkat;
  const activeErrorStr = errorProps?.str ?? errorStr;
  const activeErrorSip = errorProps?.sip ?? errorSip;
  const activeErrorPenugasan = errorProps?.penugasan ?? errorPenugasan;

  const getPendidikanService = () => {
    if (pegawaiId) {
      return {
        create: (fd: FormData) => hrdPegawaiService.createPendidikan(pegawaiId, fd),
        update: (id: number, fd: FormData) => hrdPegawaiService.updatePendidikan(pegawaiId, id, fd),
        delete: (id: number) => hrdPegawaiService.deletePendidikan(pegawaiId, id),
      };
    }
    return pendidikanService;
  };

  const getJabatanService = () => {
    if (pegawaiId) {
      return {
        create: (fd: FormData) => hrdPegawaiService.createJabatan(pegawaiId, fd),
        update: (id: number, fd: FormData) => hrdPegawaiService.updateJabatan(pegawaiId, id, fd),
        delete: (id: number) => hrdPegawaiService.deleteJabatan(pegawaiId, id),
      };
    }
    return jabatanService;
  };

  const getPangkatService = () => {
    if (pegawaiId) {
      return {
        create: (fd: FormData) => hrdPegawaiService.createPangkat(pegawaiId, fd),
        update: (id: number, fd: FormData) => hrdPegawaiService.updatePangkat(pegawaiId, id, fd),
        delete: (id: number) => hrdPegawaiService.deletePangkat(pegawaiId, id),
      };
    }
    return pangkatService;
  };

  const getStrService = () => {
    if (pegawaiId) {
      return {
        create: (fd: FormData) => hrdPegawaiService.createStr(pegawaiId, fd),
        update: (id: number, fd: FormData) => hrdPegawaiService.updateStr(pegawaiId, id, fd),
        delete: (id: number) => hrdPegawaiService.deleteStr(pegawaiId, id),
      };
    }
    return strService;
  };

  const getSipService = () => {
    if (pegawaiId) {
      return {
        create: (fd: FormData) => hrdPegawaiService.createSip(pegawaiId, fd),
        update: (id: number, fd: FormData) => hrdPegawaiService.updateSip(pegawaiId, id, fd),
        delete: (id: number) => hrdPegawaiService.deleteSip(pegawaiId, id),
      };
    }
    return sipService;
  };

  const getPenugasanService = () => {
    if (pegawaiId) {
      return {
        create: (fd: FormData) => hrdPegawaiService.createPenugasanKlinis(pegawaiId, fd),
        update: (id: number, fd: FormData) => hrdPegawaiService.updatePenugasanKlinis(pegawaiId, id, fd),
        delete: (id: number) => hrdPegawaiService.deletePenugasanKlinis(pegawaiId, id),
      };
    }
    return penugasanKlinisService;
  };

  // Self-service Lazy Loading
  const [fetchedTabs, setFetchedTabs] = useState<Record<string, boolean>>({});

  const fetchTab = useCallback(async (tab: string) => {
    if (pegawaiId) return; // In HRD mode, data is supplied via props

    if (tab === "pendidikan") {
      setIsLoadingPendidikan(true);
      setErrorPendidikan(null);
      try {
        const response = await pendidikanService.getAll();
        if (response.success && response.data) {
          const items = response.data.summary.items || [];
          setPendidikanList(items.map(mapToCardPendidikan));
        } else {
          setErrorPendidikan(response.message || "Gagal mengambil data pendidikan.");
        }
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        setErrorPendidikan(errorObj?.message || "Terjadi kesalahan saat mengambil data pendidikan.");
      } finally {
        setIsLoadingPendidikan(false);
      }
    } else if (tab === "jabatan") {
      setIsLoadingJabatan(true);
      setErrorJabatan(null);
      try {
        const response = await jabatanService.getAll();
        if (response.success && response.data) {
          setJabatanList((response.data.items || []).map(mapToCardJabatan));
        } else {
          setErrorJabatan(response.message || "Gagal mengambil data jabatan.");
        }
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        setErrorJabatan(errorObj?.message || "Terjadi kesalahan saat mengambil data jabatan.");
      } finally {
        setIsLoadingJabatan(false);
      }
    } else if (tab === "pangkat") {
      setIsLoadingPangkat(true);
      setErrorPangkat(null);
      try {
        const response = await pangkatService.getAll();
        if (response.success && response.data) {
          setPangkatList((response.data.items || []).map(mapToCardPangkat));
        } else {
          setErrorPangkat(response.message || "Gagal mengambil data pangkat.");
        }
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        setErrorPangkat(errorObj?.message || "Terjadi kesalahan saat mengambil data pangkat.");
      } finally {
        setIsLoadingPangkat(false);
      }
    } else if (tab === "str-sip") {
      setIsLoadingStr(true);
      setIsLoadingSip(true);
      setErrorStr(null);
      setErrorSip(null);
      try {
        const [resStr, resSip] = await Promise.all([strService.getAll(), sipService.getAll()]);
        if (resStr.success && resStr.data) {
          setStrList((resStr.data.items || []).map(mapToCardStr));
        } else {
          setErrorStr(resStr.message || "Gagal mengambil data STR.");
        }
        if (resSip.success && resSip.data) {
          setSipList((resSip.data.items || []).map(mapToCardSip));
        } else {
          setErrorSip(resSip.message || "Gagal mengambil data SIP.");
        }
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        setErrorStr(errorObj?.message || "Terjadi kesalahan saat mengambil data STR/SIP.");
        setErrorSip(errorObj?.message || "Terjadi kesalahan saat mengambil data STR/SIP.");
      } finally {
        setIsLoadingStr(false);
        setIsLoadingSip(false);
      }
    } else if (tab === "penugasan") {
      setIsLoadingPenugasan(true);
      setErrorPenugasan(null);
      try {
        const response = await penugasanKlinisService.getAll();
        if (response.success && response.data) {
          setPenugasanList((response.data.items || []).map(mapToCardPenugasan));
        } else {
          setErrorPenugasan(response.message || "Gagal mengambil data penugasan klinis.");
        }
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        setErrorPenugasan(errorObj?.message || "Terjadi kesalahan saat mengambil data penugasan klinis.");
      } finally {
        setIsLoadingPenugasan(false);
      }
    }
  }, [pegawaiId]);

  useEffect(() => {
    if (pegawaiId) return; // In HRD mode, data is supplied via props
    if (fetchedTabs[activeTab]) return;

    fetchTab(activeTab).then(() => {
      setFetchedTabs((prev) => ({ ...prev, [activeTab]: true }));
    });
  }, [activeTab, fetchedTabs, fetchTab, pegawaiId]);

  const handleSubmit = async (type: string, formData: FormData, selectedItem: any) => {
    setIsSubmitting(true);
    setServerErrors(undefined);
    try {
      let service;
      let label = "";
      if (type === "pendidikan") {
        service = getPendidikanService();
        label = "pendidikan";
      } else if (type === "jabatan") {
        service = getJabatanService();
        label = "jabatan";
      } else if (type === "pangkat") {
        service = getPangkatService();
        label = "pangkat";
      } else if (type === "str") {
        service = getStrService();
        label = "STR";
      } else if (type === "sip") {
        service = getSipService();
        label = "SIP";
      } else if (type === "penugasan") {
        service = getPenugasanService();
        label = "penugasan klinis";
      }

      if (!service) return;

      if (selectedItem) {
        await service.update(selectedItem.id, formData);
        showFeedback("success", "Berhasil", `Riwayat ${label} berhasil diupdate.`);
      } else {
        await service.create(formData);
        showFeedback("success", "Berhasil", `Riwayat ${label} berhasil ditambahkan.`);
      }

      handleCloseModal();
      if (pegawaiId) {
        onRefresh?.();
      } else {
        await fetchTab(activeTab);
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string; errors?: Record<string, string[]> };
      if (errorObj?.errors) setServerErrors(errorObj.errors);
      else showFeedback("error", "Gagal", errorObj?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      let service;
      if (deleteTarget.type === "pendidikan") service = getPendidikanService();
      else if (deleteTarget.type === "jabatan") service = getJabatanService();
      else if (deleteTarget.type === "pangkat") service = getPangkatService();
      else if (deleteTarget.type === "str") service = getStrService();
      else if (deleteTarget.type === "sip") service = getSipService();
      else if (deleteTarget.type === "penugasan") service = getPenugasanService();

      if (service) {
        await service.delete(deleteTarget.id);
        showFeedback("success", "Berhasil", `Data ${deleteTarget.type} berhasil dihapus.`);
        setIsDeletePopupOpen(false);
        setDeleteTarget(null);
        if (pegawaiId) {
          onRefresh?.();
        } else {
          await fetchTab(activeTab);
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      showFeedback("error", "Gagal", errorObj?.message || "Terjadi kesalahan saat menghapus data.");
      setIsDeletePopupOpen(false);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getActiveTabLabel = () => {
    const tab = tabItems.find(t => t.id === activeTab);
    return tab ? tab.label : "";
  };

  const getModalTitle = () => {
    if (activeTab === "pendidikan") return selectedPendidikan ? "Edit Data Pendidikan" : "Tambah Data Pendidikan";
    if (activeTab === "jabatan") return selectedJabatan ? "Edit Data Jabatan" : "Tambah Data Jabatan";
    if (activeTab === "pangkat") return selectedPangkat ? "Edit Data Pangkat" : "Tambah Data Pangkat";
    if (activeTab === "str-sip") {
      if (selectedStr) return "Edit Data STR";
      if (selectedSip) return "Edit Data SIP";
      return `Tambah Data ${strsipType || "STR/SIP"}`;
    }
    if (activeTab === "penugasan") return selectedPenugasan ? "Edit Data Penugasan Klinis" : "Tambah Data Penugasan Klinis";
    return `Tambah Data ${getActiveTabLabel()}`;
  };

  const clearSelections = () => {
    setSelectedPendidikan(null);
    setSelectedJabatan(null);
    setSelectedPangkat(null);
    setSelectedStr(null);
    setSelectedSip(null);
    setSelectedPenugasan(null);
  };

  const handleOpenModal = () => {
    setServerErrors(undefined);
    clearSelections();
    setStrsipType("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    clearSelections();
    setServerErrors(undefined);
  };

  const renderLoadingOrError = (isLoading: boolean, error: string | null, emptyMsg: string, listLen: number) => {
    if (isLoading) return (
      <Card><p className={styles.emptyText}>Memuat data...</p></Card>
    );
    if (error) return (
      <Card><p style={{ color: "var(--color-danger, #DC2626)" }} className={styles.emptyText}>{error}</p></Card>
    );
    if (listLen === 0) {
      if (!emptyMsg) return null;
      return (
        <Card><p className={styles.emptyText}>{emptyMsg}</p></Card>
      );
    }
    return null;
  };

  return (
    <>
      <div className={styles.tabsWrapper}>
        <Card>
          <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />
        </Card>
      </div>

      {isAdmin && (
        <div className={styles.buttonContainer}>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            label={`Tambah Data ${getActiveTabLabel()}`}
            onClick={handleOpenModal}
          />
        </div>
      )}

      <div className={styles.recordList}>
        {activeTab === "pendidikan" && (
          renderLoadingOrError(activeLoadingPendidikan, activeErrorPendidikan, 'Belum ada data pendidikan.', pendidikanList.length) || (
            <div className={styles.riwayatSection}>
              {pendidikanList.map((item) => (
                <CardPendidikan key={item.id} data={item}
                  onEdit={isAdmin ? () => { setServerErrors(undefined); clearSelections(); setSelectedPendidikan(item); setIsModalOpen(true); } : undefined}
                  onDelete={() => void {}} // delete button not displayed due to enableDelete={false} inside card
                  onViewDocument={(url) => handleViewDocument(url, `Ijazah - ${item.jenjang}`)}
                />
              ))}
            </div>
          )
        )}

        {activeTab === "jabatan" && (
          renderLoadingOrError(activeLoadingJabatan, activeErrorJabatan, 'Belum ada data jabatan.', jabatanList.length) || (
            <div className={styles.riwayatSection}>
              {jabatanList.map((item) => (
                <CardJabatan key={item.id} data={item}
                  onEdit={isAdmin ? () => { setServerErrors(undefined); clearSelections(); setSelectedJabatan(item); setIsModalOpen(true); } : undefined}
                  onDelete={() => void {}}
                  onViewDocument={(url) => handleViewDocument(url, `SK Jabatan - ${item.namaJabatan}`)}
                />
              ))}
            </div>
          )
        )}

        {activeTab === "pangkat" && (
          renderLoadingOrError(activeLoadingPangkat, activeErrorPangkat, 'Belum ada data pangkat.', pangkatList.length) || (
            <div className={styles.riwayatSection}>
              {pangkatList.map((item) => (
                <CardPangkat key={item.id} data={item}
                  onEdit={isAdmin ? () => { setServerErrors(undefined); clearSelections(); setSelectedPangkat(item); setIsModalOpen(true); } : undefined}
                  onDelete={() => void {}}
                  onViewDocument={(url) => handleViewDocument(url, `SK Pangkat - ${item.namaPangkat}`)}
                />
              ))}
            </div>
          )
        )}

        {activeTab === "str-sip" && (
          <>
            {activeLoadingStr || activeLoadingSip ? (
              <Card><p className={styles.emptyText}>Memuat data...</p></Card>
            ) : activeErrorStr || activeErrorSip ? (
              <Card><p style={{ color: "var(--color-danger, #DC2626)" }} className={styles.emptyText}>{activeErrorStr || activeErrorSip}</p></Card>
            ) : strList.length === 0 && sipList.length === 0 ? (
              <Card><p className={styles.emptyText}>Belum ada data STR/SIP.</p></Card>
            ) : (
              <>
                {strList.length > 0 && (
                  <div className={styles.riwayatSection}>
                    {strList.map((item) => (
                      <CardStr key={`str-${item.id}`} data={item}
                        onEdit={isAdmin ? () => { setServerErrors(undefined); clearSelections(); setSelectedStr(item); setStrsipType("STR"); setIsModalOpen(true); } : undefined}
                        onViewDocument={(url) => handleViewDocument(url, `STR - ${item.nomorStr}`)}
                      />
                    ))}
                  </div>
                )}
                {sipList.length > 0 && (
                  <div className={styles.riwayatSection} style={{ marginTop: strList.length > 0 ? "12px" : 0 }}>
                    {sipList.map((item) => (
                      <CardSip key={`sip-${item.id}`} data={item}
                        onEdit={isAdmin ? () => { setServerErrors(undefined); clearSelections(); setSelectedSip(item); setStrsipType("SIP"); setIsModalOpen(true); } : undefined}
                        onViewDocument={(url) => handleViewDocument(url, `SIP - ${item.nomorSip}`)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === "penugasan" && (
          renderLoadingOrError(activeLoadingPenugasan, activeErrorPenugasan, 'Belum ada data penugasan klinis.', penugasanList.length) || (
            <div className={styles.riwayatSection}>
              {penugasanList.map((item) => (
                <CardPenugasanKlinis key={item.id} data={item}
                  onEdit={isAdmin ? () => { setServerErrors(undefined); clearSelections(); setSelectedPenugasan(item); setIsModalOpen(true); } : undefined}
                  onViewDocument={(url) => handleViewDocument(url, `Penugasan Klinis - ${item.nomorSurat}`)}
                />
              ))}
            </div>
          )
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={getModalTitle()}>
          {activeTab === "pendidikan" && (
            <FormPendidikan initialData={selectedPendidikan} isEdit={!!selectedPendidikan}
              isSubmitting={isSubmitting} serverErrors={serverErrors}
              onCancel={handleCloseModal} onSubmit={(fd) => handleSubmit("pendidikan", fd, selectedPendidikan)}
              isPegawai={false}
            />
          )}

          {activeTab === "jabatan" && (
            <FormJabatan initialData={selectedJabatan}
              onCancel={handleCloseModal} onSubmit={(fd) => handleSubmit("jabatan", fd, selectedJabatan)}
              isPegawai={false}
            />
          )}

          {activeTab === "pangkat" && (
            <FormPangkat initialData={selectedPangkat} isEdit={!!selectedPangkat}
              isSubmitting={isSubmitting} serverErrors={serverErrors}
              onCancel={handleCloseModal} onSubmit={(fd) => handleSubmit("pangkat", fd, selectedPangkat)}
              isPegawai={false}
            />
          )}

          {activeTab === "str-sip" && (
            <FormStrsip
              initialStrData={selectedStr}
              initialSipData={selectedSip}
              isEdit={!!selectedStr || !!selectedSip}
              isSubmitting={isSubmitting}
              serverErrors={serverErrors}
              forceType={selectedStr ? "STR" : selectedSip ? "SIP" : undefined}
              onCancel={handleCloseModal}
              onSubmit={(fd) => handleSubmit(strsipType === "STR" || !!selectedStr ? "str" : "sip", fd, selectedStr || selectedSip)}
              onTypeChange={(type) => setStrsipType(type)}
              isPegawai={false}
            />
          )}

          {activeTab === "penugasan" && (
            <FormPenugasanKlinis initialData={selectedPenugasan}
              isSubmitting={isSubmitting} serverErrors={serverErrors}
              onCancel={handleCloseModal} onSubmit={(fd) => handleSubmit("penugasan", fd, selectedPenugasan)}
              isPegawai={false}
            />
          )}
        </Modal>
      )}

      <ConfirmDeleteModal
        isOpen={isDeletePopupOpen}
        onClose={() => { setIsDeletePopupOpen(false); setDeleteTarget(null); }}
        title="Konfirmasi Hapus"
        message={`Yakin anda akan menghapus data "${deleteTarget?.label}"? Data yang sudah di hapus tidak dapat dikembalikan`}
        confirmLabel={isDeleting ? "Menghapus..." : "Ya, Hapus"}
        cancelLabel="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setIsDeletePopupOpen(false); setDeleteTarget(null); }}
        isLoading={isDeleting}
      />

      <Popup
        isOpen={feedbackPopup.isOpen}
        onClose={() => setFeedbackPopup(prev => ({ ...prev, isOpen: false }))}
        variant={feedbackPopup.variant}
        title={feedbackPopup.title}
        message={feedbackPopup.message}
        confirmLabel="OK"
      />

      <PdfViewerModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileUrl={previewFile?.url || null}
        title={`Lihat ${previewFile?.title || "Dokumen"}`}
        fileName={previewFile?.title || "Dokumen"}
      />
    </>
  );
};

export default RiwayatKarirContainer;

