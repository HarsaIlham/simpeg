import { useState, useEffect, useCallback } from "react";
import Topbar from "../../ui/organisms/Topbar/Topbar";
import { Plus, TrendingUp, GraduationCap, Briefcase, Award, FileText, ClipboardList } from "lucide-react";
import MainHeaderSection from "../../ui/molecules/MainHeaderSection";
import Icon from "../../ui/atoms/Icon";
import Card from "../../ui/atoms/Card";
import styles from "./RiwayatKarir.module.css";
import Button from "../../ui/atoms/Button";
import Modal from "../../ui/organisms/Modal";
import Tabs from "../../ui/molecules/Tabs";
import Popup from "../../ui/molecules/Popup";
import ConfirmDeleteModal from "../../ui/organisms/ConfirmDeleteModal";
import PdfViewerModal from "../../ui/molecules/PdfViewerModal";

import CardPendidikan from "../../ui/organisms/CardPendidikan";
import type { CardPendidikanData } from "../../ui/organisms/CardPendidikan/CardPendidikan";
import CardJabatan from "../../ui/organisms/CardJabatan";
import type { CardJabatanData } from "../../ui/organisms/CardJabatan/CardJabatan";
import CardPangkat from "../../ui/organisms/CardPangkat";
import type { CardPangkatData } from "../../ui/organisms/CardPangkat/CardPangkat";
import CardStr from "../../ui/organisms/CardStr";
import type { CardStrData } from "../../ui/organisms/CardStr/CardStr";
import CardSip from "../../ui/organisms/CardSip";
import type { CardSipData } from "../../ui/organisms/CardSip/CardSip";
import CardPenugasanKlinis from "../../ui/organisms/CardPenugasanKlinis";
import type { CardPenugasanKlinisData } from "../../ui/organisms/CardPenugasanKlinis/CardPenugasanKlinis";

import FormPendidikan from "../../ui/organisms/FormPendidikan";
import FormJabatan from "../../ui/organisms/FormJabatan";
import FormPangkat from "../../ui/organisms/FormPangkat";
import FormStrsip from "../../ui/organisms/FormStrsip";
import FormPenugasanKlinis from "../../ui/organisms/FormPenugasanKlinis";

import { pendidikanService } from "../../../services/pendidikanService";
import { jabatanService } from "../../../services/jabatanService";
import { pangkatService } from "../../../services/pangkatService";
import { strService } from "../../../services/strService";
import { sipService } from "../../../services/sipService";
import { penugasanKlinisService } from "../../../services/penugasanKlinisService";

import type {
  RiwayatPendidikanItem,
  RiwayatJabatanItem,
  RiwayatPangkatItem,
  RiwayatStrItem,
  RiwayatSipItem,
  RiwayatPenugasanKlinisItem,
} from "../../../types/api";

const mapToCardPendidikan = (item: RiwayatPendidikanItem): CardPendidikanData => ({
  id: item.id, jenjang: item.jenjang, institusi: item.institusi,
  jurusan: item.jurusan, tahun_lulus: item.tahun_lulus,
  nomor_ijazah: item.nomor_ijazah, link_ijazah: item.link_ijazah,
});

const mapToCardJabatan = (item: RiwayatJabatanItem): CardJabatanData => ({
  id: item.id, unit_kerja_id: item.unit_kerja_id, unit_kerja_nama: item.unit_kerja_nama, namaJabatan: item.nama_jabatan, isCurrent: item.is_current,
  tmt_mulai: item.tmt_mulai, tmt_selesai: item.tmt_selesai,
  link_sk: item.link_sk, note: item.note,
});

const mapToCardPangkat = (item: RiwayatPangkatItem): CardPangkatData => ({
  id: item.id, namaPangkat: item.nama_pangkat, isCurrent: item.is_current,
  pejabatPenetap: item.pejabat_penetap, tmtSk: item.tmt_sk,
  startedAt: item.started_at, endedAt: item.ended_at,
  linkSk: item.link_sk, note: item.note,
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


const RiwayatKarir = () => {

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
  const [isLoadingPendidikan, setIsLoadingPendidikan] = useState(true);
  const [errorPendidikan, setErrorPendidikan] = useState<string | null>(null);
  const [selectedPendidikan, setSelectedPendidikan] = useState<CardPendidikanData | null>(null);

  const fetchPendidikan = useCallback(async () => {
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
  }, []);

  useEffect(() => { fetchPendidikan(); }, [fetchPendidikan]);

  const handleSubmitPendidikan = async (formData: FormData) => {
    setIsSubmitting(true); setServerErrors(undefined);
    try {
      if (selectedPendidikan) {
        await pendidikanService.update(selectedPendidikan.id, formData);
        showFeedback("success", "Berhasil", "Riwayat pendidikan berhasil diupdate.");
      } else {
        await pendidikanService.create(formData);
        showFeedback("success", "Berhasil", "Riwayat pendidikan berhasil ditambahkan.");
      }
      setIsModalOpen(false); setSelectedPendidikan(null); await fetchPendidikan();
    } catch (err: unknown) {
      const errorObj = err as { message?: string; errors?: Record<string, string[]> };
      if (errorObj?.errors) setServerErrors(errorObj.errors);
      else showFeedback("error", "Gagal", errorObj?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally { setIsSubmitting(false); }
  };

  const [jabatanList, setJabatanList] = useState<CardJabatanData[]>([]);
  const [isLoadingJabatan, setIsLoadingJabatan] = useState(true);
  const [errorJabatan, setErrorJabatan] = useState<string | null>(null);
  const [selectedJabatan, setSelectedJabatan] = useState<CardJabatanData | null>(null);

  const fetchJabatan = useCallback(async () => {
    setIsLoadingJabatan(true); setErrorJabatan(null);
    try {
      const response = await jabatanService.getAll();
      if (response.success && response.data) {
        setJabatanList((response.data.items || []).map(mapToCardJabatan));
      } else { setErrorJabatan(response.message || "Gagal mengambil data jabatan."); }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorJabatan(errorObj?.message || "Terjadi kesalahan saat mengambil data jabatan.");
    } finally { setIsLoadingJabatan(false); }
  }, []);

  useEffect(() => { fetchJabatan(); }, [fetchJabatan]);

  const handleSubmitJabatan = async (formData: FormData) => {
    setIsSubmitting(true); setServerErrors(undefined);
    try {
      if (selectedJabatan) {
        await jabatanService.update(selectedJabatan.id, formData);
        showFeedback("success", "Berhasil", "Riwayat jabatan berhasil diupdate.");
      } else {
        await jabatanService.create(formData);
        showFeedback("success", "Berhasil", "Riwayat jabatan berhasil ditambahkan.");
      }
      setIsModalOpen(false); setSelectedJabatan(null); await fetchJabatan();
    } catch (err: unknown) {
      const errorObj = err as { message?: string; errors?: Record<string, string[]> };
      if (errorObj?.errors) setServerErrors(errorObj.errors);
      else showFeedback("error", "Gagal", errorObj?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally { setIsSubmitting(false); }
  };


  const [pangkatList, setPangkatList] = useState<CardPangkatData[]>([]);
  const [isLoadingPangkat, setIsLoadingPangkat] = useState(true);
  const [errorPangkat, setErrorPangkat] = useState<string | null>(null);
  const [selectedPangkat, setSelectedPangkat] = useState<CardPangkatData | null>(null);

  const fetchPangkat = useCallback(async () => {
    setIsLoadingPangkat(true); setErrorPangkat(null);
    try {
      const response = await pangkatService.getAll();
      if (response.success && response.data) {
        setPangkatList((response.data.items || []).map(mapToCardPangkat));
      } else { setErrorPangkat(response.message || "Gagal mengambil data pangkat."); }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorPangkat(errorObj?.message || "Terjadi kesalahan saat mengambil data pangkat.");
    } finally { setIsLoadingPangkat(false); }
  }, []);

  useEffect(() => { fetchPangkat(); }, [fetchPangkat]);

  const handleSubmitPangkat = async (formData: FormData) => {
    setIsSubmitting(true); setServerErrors(undefined);
    try {
      if (selectedPangkat) {
        await pangkatService.update(selectedPangkat.id, formData);
        showFeedback("success", "Berhasil", "Riwayat pangkat berhasil diupdate.");
      } else {
        await pangkatService.create(formData);
        showFeedback("success", "Berhasil", "Riwayat pangkat berhasil ditambahkan.");
      }
      setIsModalOpen(false); setSelectedPangkat(null); await fetchPangkat();
    } catch (err: unknown) {
      const errorObj = err as { message?: string; errors?: Record<string, string[]> };
      if (errorObj?.errors) setServerErrors(errorObj.errors);
      else showFeedback("error", "Gagal", errorObj?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally { setIsSubmitting(false); }
  };

  //STR

  const [strList, setStrList] = useState<CardStrData[]>([]);
  const [isLoadingStr, setIsLoadingStr] = useState(true);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const [selectedStr, setSelectedStr] = useState<CardStrData | null>(null);

  const fetchStr = useCallback(async () => {
    setIsLoadingStr(true); setErrorStr(null);
    try {
      const response = await strService.getAll();
      if (response.success && response.data) {
        setStrList((response.data.items || []).map(mapToCardStr));
      } else { setErrorStr(response.message || "Gagal mengambil data STR."); }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorStr(errorObj?.message || "Terjadi kesalahan saat mengambil data STR.");
    } finally { setIsLoadingStr(false); }
  }, []);

  //SIP

  const [sipList, setSipList] = useState<CardSipData[]>([]);
  const [isLoadingSip, setIsLoadingSip] = useState(true);
  const [errorSip, setErrorSip] = useState<string | null>(null);
  const [selectedSip, setSelectedSip] = useState<CardSipData | null>(null);

  const fetchSip = useCallback(async () => {
    setIsLoadingSip(true); setErrorSip(null);
    try {
      const response = await sipService.getAll();
      if (response.success && response.data) {
        setSipList((response.data.items || []).map(mapToCardSip));
      } else { setErrorSip(response.message || "Gagal mengambil data SIP."); }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorSip(errorObj?.message || "Terjadi kesalahan saat mengambil data SIP.");
    } finally { setIsLoadingSip(false); }
  }, []);

  useEffect(() => { fetchStr(); fetchSip(); }, [fetchStr, fetchSip]);

  const handleSubmitStrSip = async (formData: FormData) => {
    setIsSubmitting(true); setServerErrors(undefined);
    const isStr = strsipType === "STR" || !!selectedStr;
    try {
      if (isStr) {
        if (selectedStr) {
          await strService.update(selectedStr.id, formData);
          showFeedback("success", "Berhasil", "Riwayat STR berhasil diupdate.");
        } else {
          await strService.create(formData);
          showFeedback("success", "Berhasil", "Riwayat STR berhasil ditambahkan.");
        }
        setSelectedStr(null); await fetchStr();
      } else {
        if (selectedSip) {
          await sipService.update(selectedSip.id, formData);
          showFeedback("success", "Berhasil", "Riwayat SIP berhasil diupdate.");
        } else {
          await sipService.create(formData);
          showFeedback("success", "Berhasil", "Riwayat SIP berhasil ditambahkan.");
        }
        setSelectedSip(null); await fetchSip();
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const errorObj = err as { message?: string; errors?: Record<string, string[]> };
      if (errorObj?.errors) setServerErrors(errorObj.errors);
      else showFeedback("error", "Gagal", errorObj?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally { setIsSubmitting(false); }
  };

  const [penugasanList, setPenugasanList] = useState<CardPenugasanKlinisData[]>([]);
  const [isLoadingPenugasan, setIsLoadingPenugasan] = useState(true);
  const [errorPenugasan, setErrorPenugasan] = useState<string | null>(null);
  const [selectedPenugasan, setSelectedPenugasan] = useState<CardPenugasanKlinisData | null>(null);

  const fetchPenugasan = useCallback(async () => {
    setIsLoadingPenugasan(true); setErrorPenugasan(null);
    try {
      const response = await penugasanKlinisService.getAll();
      if (response.success && response.data) {
        setPenugasanList((response.data.items || []).map(mapToCardPenugasan));
      } else { setErrorPenugasan(response.message || "Gagal mengambil data penugasan klinis."); }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorPenugasan(errorObj?.message || "Terjadi kesalahan saat mengambil data penugasan klinis.");
    } finally { setIsLoadingPenugasan(false); }
  }, []);

  useEffect(() => { fetchPenugasan(); }, [fetchPenugasan]);

  const handleSubmitPenugasan = async (formData: FormData) => {
    setIsSubmitting(true); setServerErrors(undefined);
    try {
      if (selectedPenugasan) {
        await penugasanKlinisService.update(selectedPenugasan.id, formData);
        showFeedback("success", "Berhasil", "Riwayat penugasan klinis berhasil diupdate.");
      } else {
        await penugasanKlinisService.create(formData);
        showFeedback("success", "Berhasil", "Riwayat penugasan klinis berhasil ditambahkan.");
      }
      setIsModalOpen(false); setSelectedPenugasan(null); await fetchPenugasan();
    } catch (err: unknown) {
      const errorObj = err as { message?: string; errors?: Record<string, string[]> };
      if (errorObj?.errors) setServerErrors(errorObj.errors);
      else showFeedback("error", "Gagal", errorObj?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally { setIsSubmitting(false); }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "pendidikan") {
        await pendidikanService.delete(deleteTarget.id); await fetchPendidikan();
      } else if (deleteTarget.type === "jabatan") {
        await jabatanService.delete(deleteTarget.id); await fetchJabatan();
      } else if (deleteTarget.type === "pangkat") {
        await pangkatService.delete(deleteTarget.id); await fetchPangkat();
      } else if (deleteTarget.type === "str") {
        await strService.delete(deleteTarget.id); await fetchStr();
      } else if (deleteTarget.type === "sip") {
        await sipService.delete(deleteTarget.id); await fetchSip();
      } else if (deleteTarget.type === "penugasan klinis") {
        await penugasanKlinisService.delete(deleteTarget.id); await fetchPenugasan();
      }
      showFeedback("success", "Berhasil", `Data ${deleteTarget.type} berhasil dihapus.`);
      setIsDeletePopupOpen(false); setDeleteTarget(null);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      showFeedback("error", "Gagal", errorObj?.message || "Terjadi kesalahan saat menghapus data.");
      setIsDeletePopupOpen(false); setDeleteTarget(null);
    } finally { setIsDeleting(false); }
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

  const handleOpenModal = () => {
    setServerErrors(undefined);
    setSelectedPendidikan(null); setSelectedJabatan(null); setSelectedPangkat(null);
    setSelectedStr(null); setSelectedSip(null); setSelectedPenugasan(null);
    setStrsipType("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPendidikan(null); setSelectedJabatan(null); setSelectedPangkat(null);
    setSelectedStr(null); setSelectedSip(null); setSelectedPenugasan(null);
    setServerErrors(undefined);
  };


  const renderLoadingOrError = (isLoading: boolean, error: string | null, emptyMsg: string, listLen: number) => {
    if (isLoading) return (
      <Card><p style={{ color: "var(--color-muted)", padding: "20px 0", textAlign: "center" }}>Memuat data...</p></Card>
    );
    if (error) return (
      <Card><p style={{ color: "var(--color-danger, #DC2626)", padding: "20px 0", textAlign: "center" }}>{error}</p></Card>
    );
    if (listLen === 0) {
      if (!emptyMsg) return null;
      return (
        <Card><p style={{ color: "var(--color-muted)", padding: "20px 0", textAlign: "center" }}>{emptyMsg}</p></Card>
      );
    }
    return null;
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
        onClick={handleOpenModal}
      />

      <div className={styles.recordList}>
        {activeTab === "pendidikan" && (
          renderLoadingOrError(isLoadingPendidikan, errorPendidikan, 'Belum ada data pendidikan. Klik "Tambah Data" untuk menambahkan.', pendidikanList.length) ||
          pendidikanList.map((item) => (
            <CardPendidikan key={item.id} data={item}
              onEdit={() => { setServerErrors(undefined); setSelectedPendidikan(item); setIsModalOpen(true); }}
              onDelete={() => { setDeleteTarget({ id: item.id, type: "pendidikan", label: `${item.jenjang} - ${item.jurusan}` }); setIsDeletePopupOpen(true); }}
              onViewDocument={(url) => handleViewDocument(url, `Ijazah - ${item.jenjang}`)}
            />
          ))
        )}

        {activeTab === "jabatan" && (
          renderLoadingOrError(isLoadingJabatan, errorJabatan, 'Belum ada data jabatan. Klik "Tambah Data" untuk menambahkan.', jabatanList.length) ||
          jabatanList.map((item) => (
            <CardJabatan key={item.id} data={item}
              onEdit={() => { setServerErrors(undefined); setSelectedJabatan(item); setIsModalOpen(true); }}
              onDelete={() => { setDeleteTarget({ id: item.id, type: "jabatan", label: item.namaJabatan }); setIsDeletePopupOpen(true); }}
              onViewDocument={(url) => handleViewDocument(url, `SK Jabatan - ${item.namaJabatan}`)}
            />
          ))
        )}

        {activeTab === "pangkat" && (
          renderLoadingOrError(isLoadingPangkat, errorPangkat, 'Belum ada data pangkat. Klik "Tambah Data" untuk menambahkan.', pangkatList.length) ||
          pangkatList.map((item) => (
            <CardPangkat key={item.id} data={item}
              onEdit={() => { setServerErrors(undefined); setSelectedPangkat(item); setIsModalOpen(true); }}
              onDelete={() => { setDeleteTarget({ id: item.id, type: "pangkat", label: item.namaPangkat }); setIsDeletePopupOpen(true); }}
              onViewDocument={(url) => handleViewDocument(url, `SK Pangkat - ${item.namaPangkat}`)}
            />
          ))
        )}

        {activeTab === "str-sip" && (
          <>
            {renderLoadingOrError(isLoadingStr, errorStr, "", strList.length) ||
              strList.map((item) => (
                <CardStr key={`str-${item.id}`} data={item}
                  onEdit={() => { setServerErrors(undefined); setSelectedStr(item); setSelectedSip(null); setStrsipType("STR"); setIsModalOpen(true); }}
                  onDelete={() => { setDeleteTarget({ id: item.id, type: "str", label: `STR ${item.nomorStr}` }); setIsDeletePopupOpen(true); }}
                  onViewDocument={(url) => handleViewDocument(url, `STR - ${item.nomorStr}`)}
                />
              ))
            }
            {renderLoadingOrError(isLoadingSip, errorSip, "", sipList.length) ||
              sipList.map((item) => (
                <CardSip key={`sip-${item.id}`} data={item}
                  onEdit={() => { setServerErrors(undefined); setSelectedSip(item); setSelectedStr(null); setStrsipType("SIP"); setIsModalOpen(true); }}
                  onDelete={() => { setDeleteTarget({ id: item.id, type: "sip", label: `SIP ${item.nomorSip}` }); setIsDeletePopupOpen(true); }}
                  onViewDocument={(url) => handleViewDocument(url, `SIP - ${item.nomorSip}`)}
                />
              ))
            }
            {!isLoadingStr && !isLoadingSip && !errorStr && !errorSip && strList.length === 0 && sipList.length === 0 && (
              <Card><p style={{ color: "var(--color-muted)", padding: "20px 0", textAlign: "center" }}>Belum ada data STR/SIP. Klik "Tambah Data" untuk menambahkan.</p></Card>
            )}
          </>
        )}

        {activeTab === "penugasan" && (
          renderLoadingOrError(isLoadingPenugasan, errorPenugasan, 'Belum ada data penugasan klinis. Klik "Tambah Data" untuk menambahkan.', penugasanList.length) ||
          penugasanList.map((item) => (
            <CardPenugasanKlinis key={item.id} data={item}
              onEdit={() => { setServerErrors(undefined); setSelectedPenugasan(item); setIsModalOpen(true); }}
              onDelete={() => { setDeleteTarget({ id: item.id, type: "penugasan klinis", label: `PK ${item.nomorSurat}` }); setIsDeletePopupOpen(true); }}
              onViewDocument={(url) => handleViewDocument(url, `Penugasan Klinis - ${item.nomorSurat}`)}
            />
          ))
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={getModalTitle()}>
          {activeTab === "pendidikan" && (
            <FormPendidikan initialData={selectedPendidikan} isEdit={!!selectedPendidikan}
              isSubmitting={isSubmitting} serverErrors={serverErrors}
              onCancel={handleCloseModal} onSubmit={handleSubmitPendidikan} />
          )}

          {activeTab === "jabatan" && (
            <FormJabatan initialData={selectedJabatan}
              onCancel={handleCloseModal} onSubmit={handleSubmitJabatan} />
          )}

          {activeTab === "pangkat" && (
            <FormPangkat initialData={selectedPangkat} isEdit={!!selectedPangkat}
              isSubmitting={isSubmitting} serverErrors={serverErrors}
              onCancel={handleCloseModal} onSubmit={handleSubmitPangkat} />
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
              onSubmit={handleSubmitStrSip}
              onTypeChange={(type) => setStrsipType(type)}
            />
          )}

          {activeTab === "penugasan" && (
            <FormPenugasanKlinis initialData={selectedPenugasan}
              isSubmitting={isSubmitting} serverErrors={serverErrors}
              onCancel={handleCloseModal} onSubmit={handleSubmitPenugasan} />
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
        title={previewFile?.title || "Dokumen"}
        fileName={previewFile?.title || "Dokumen"}
      />
    </>
  )
}

export default RiwayatKarir