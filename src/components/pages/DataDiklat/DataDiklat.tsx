import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import styles from "./DataDiklat.module.css"
import Topbar from "../../ui/organisms/Topbar/Topbar"
import MainHeaderSection from "../../ui/molecules/MainHeaderSection"
import Card from "../../ui/atoms/Card"
import SearchInput from "../../ui/molecules/SearchInput"
import Button from "../../ui/atoms/Button"
import Input from "../../ui/atoms/Input"
import Select from "../../ui/atoms/Select"
import CardDiklat from "../../ui/organisms/CardDiklat"
import type { CardDiklatData } from "../../ui/organisms/CardDiklat/CardDiklat"
import Modal from "../../ui/organisms/Modal"
import ConfirmDeleteModal from "../../ui/organisms/ConfirmDeleteModal"
import FormLaporanDiklat from "../../ui/organisms/FormLaporanDiklat"
import { diklatService } from "../../../services/diklatService"
import { cvService } from "../../../services/cvService"
import { generateCvPdf } from "../../../utils/generateCvPdf"
import type { RiwayatDiklatItem, DiklatRingkasan } from "../../../types/api"
import Popup from "../../ui/molecules/Popup"
import { useMasterData } from "../../../hooks/useMasterData"
import PdfViewerModal from "../../ui/molecules/PdfViewerModal"
import { getProxiedFileUrl } from "../../../utils/api"

const formatTanggal = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const formatRupiah = (amount: number): string => {
  return amount.toLocaleString("id-ID")
}

interface popupState {
  isOpen: boolean
  variant: "success" | "error" | "warning" | "checklist"
  title: string
  message: string
}

const mapRiwayatToCardDiklat = (item: RiwayatDiklatItem): CardDiklatData => ({
  id: item.id,
  namaDiklat: item.nama,
  kategori: item.kategori,
  jenisDiklat: item.jenis,
  tanggalMulai: formatTanggal(item.tanggal_mulai),
  tanggalSelesai: formatTanggal(item.tanggal_selesai),
  tempat: item.tempat,
  waktu: item.waktu,
  jamPelajaran: item.jp != null ? String(item.jp) : "-",
  jenisBiaya: item.jenis_biaya ?? "Tidak Tersedia",
  totalBiaya: item.total_biaya ? formatRupiah(item.total_biaya) : "Tidak Tersedia",
  penyelenggara: item.pelaksana,
  jenisPelaksana: item.jenis_pelaksana,
  pencatat: item.created_by,
  catatan: item.catatan,
  status: item.status,
  hasLaporan: !!item.sertif_file_path,
  sertifikat: item.sertif_file_path || "",
  statusValidasi: item.status_validasi || "",
})

const JENIS_OPTIONS = [
  { value: "", label: "Semua Jenis" },
  { value: "Tenaga Kesehatan", label: "Tenaga Kesehatan" },
  { value: "ASN", label: "ASN" },
]

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "selesai", label: "Selesai" },
  { value: "berlangsung", label: "Berlangsung" },
  { value: "mendatang", label: "Mendatang" },
]



const DataDiklat = () => {
  const { options: filterJenisOptions } = useMasterData("tipeDiklat", "Semua Jenis", JENIS_OPTIONS);
  const [searchParams] = useSearchParams()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<string>("")
  const [selectedDiklat, setSelectedDiklat] = useState<CardDiklatData | null>(null)
  const [search, setSearch] = useState("")
  const [filterJenis, setFilterJenis] = useState("")
  const [filterStatus, setFilterStatus] = useState(searchParams.get("status") ?? "")

  const [diklatList, setDiklatList] = useState<CardDiklatData[]>([])
  const [_ringkasan, setRingkasan] = useState<DiklatRingkasan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [popup, setPopup] = useState<popupState>({
    isOpen: false,
    variant: "checklist",
    title: "",
    message: "",
  })
  const [previewFile, setPreviewFile] = useState<{ url: string; namaDiklat: string } | null>(null)

  const showPopup = (variant: popupState["variant"], title: string, message: string) => {
    setPopup({
      isOpen: true,
      variant,
      title,
      message,
    })
    console.log(popup.variant)
  }

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }))
  }

  const handleViewDocument = (url: string, namaDiklat: string) => {
    const proxied = getProxiedFileUrl(url)
    setPreviewFile({ url: proxied, namaDiklat })
  }

  const fetchDiklat = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await diklatService.getDiklat()

      if (response.success && response.data) {
        const { diklat } = response.data

        const rawRiwayat = (diklat.riwayat_diklat as any)?.data || diklat.riwayat_diklat || []
        const mappedDiklat = rawRiwayat.map(mapRiwayatToCardDiklat)
        setDiklatList(mappedDiklat)

        setRingkasan(diklat.ringkasan)
      } else {
        setError(response.message || "Gagal mengambil data diklat.")
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      setError(errorObj?.message || "Terjadi kesalahan saat mengambil data diklat.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDiklat()
  }, [fetchDiklat])

  const filteredLaporanData = diklatList.filter((item) => {
    const matchSearch =
      item.namaDiklat.toLowerCase().includes(search.toLowerCase()) ||
      item.jenisDiklat.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase()) ||
      item.penyelenggara.toLowerCase().includes(search.toLowerCase())
    const matchJenis = !filterJenis || item.jenisDiklat === filterJenis
    const matchStatus = !filterStatus || item.status === filterStatus
    return matchSearch && matchJenis && matchStatus
  })


  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<CardDiklatData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (diklat: CardDiklatData) => {
    if (diklat.jenisPelaksana === "internal") {
      showPopup("warning", "Peringatan", "Tidak bisa mengedit diklat internal")
      return
    }
    setSelectedDiklat(diklat)
    setModalMode("Edit Diklat")
    setIsModalOpen(true)
  }

  const handleDelete = (diklat: CardDiklatData) => {
    setDeleteTarget(diklat)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      await diklatService.deleteDiklat(deleteTarget.id)
      setDeleteTarget(null)
      await fetchDiklat()
      showPopup("checklist", "Berhasil", "Data diklat berhasil dihapus.")
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      showPopup("error", "Gagal", errorObj?.message || "Gagal menghapus data diklat.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      if (modalMode === "Edit Diklat" && selectedDiklat) {
        await diklatService.updateDiklat(selectedDiklat.id, formData)
        showPopup("checklist", "Berhasil", "Data diklat berhasil diperbarui.")
      } else {
        await diklatService.createDiklat(formData)
        showPopup("checklist", "Berhasil", "Data diklat berhasil ditambahkan.")
      }
      setIsModalOpen(false)
      setSelectedDiklat(null)
      await fetchDiklat()
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      showPopup("error", "Gagal", errorObj?.message || "Gagal menyimpan data diklat.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadNoSertif, setUploadNoSertif] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadLaporan = (diklat: CardDiklatData) => {
    setSelectedDiklat(diklat)
    setUploadFile(null)
    setUploadNoSertif("")
    setModalMode("Upload Laporan Diklat")
    setIsModalOpen(true)
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDiklat || !uploadFile) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("upload_sertif", uploadFile)
      if (uploadNoSertif.trim()) {
        formData.append("no_sertif", uploadNoSertif.trim())
      }

      await diklatService.updateDiklat(selectedDiklat.id, formData)

      setIsModalOpen(false)
      setSelectedDiklat(null)
      await fetchDiklat()
      showPopup("checklist", "Berhasil", "Laporan sertifikat berhasil diupload.")
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      showPopup("error", "Gagal", errorObj?.message || "Gagal mengupload laporan.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleTambahDiklat = () => {
    setSelectedDiklat(null)
    setModalMode("Tambah Diklat")
    setIsModalOpen(true)
  }

  const [isCetakLoading, setIsCetakLoading] = useState(false)

  const handleCetakCv = async () => {
    setIsCetakLoading(true)
    try {
      const cvData = await cvService.getCvData()
      await generateCvPdf(cvData)
      showPopup("checklist", "Cetak CV", "CV berhasil diunduh.")
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      showPopup("error", "Gagal", errorObj?.message || "Gagal mengambil data untuk CV.")
    } finally {
      setIsCetakLoading(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Topbar title="Data Diklat" />
        <MainHeaderSection title="Data Laporan Diklat" subtitle="Kelola riwayat pelatihan dan pendidikan lanjutan" />
        <Card className={styles.emptyState}>
          <p className={styles.emptyText}>Memuat data diklat...</p>
        </Card>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Topbar title="Data Diklat" />
        <MainHeaderSection title="Data Laporan Diklat" subtitle="Kelola riwayat pelatihan dan pendidikan lanjutan" />
        <Card className={styles.emptyState}>
          <p className={styles.emptyText}>{error}</p>
        </Card>
      </>
    )
  }

  return (
    <>
      <Topbar title="Data Diklat" />
      <MainHeaderSection title="Data Laporan Diklat" subtitle="Kelola riwayat pelatihan dan pendidikan lanjutan" />

      <Card className={styles.cardSearch}>
        <div className={styles.cardHeader}>
          <div className={styles.searchWrapper}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari diklat..."
            />
          </div>
          <Select
            name="jenis"
            id="filter-jenis"
            options={filterJenisOptions}
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
          />
          <Select
            name="status"
            id="filter-status"
            options={STATUS_OPTIONS}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
          <div className={styles.buttonGroup}>
            <Button
              label={isCetakLoading ? "Memuat..." : "Cetak CV"}
              variant="primary"
              size="md"
              onClick={handleCetakCv}
              disabled={isCetakLoading}
            />
            <Button
              label="Tambah Diklat"
              variant="primary"
              size="md"
              onClick={handleTambahDiklat}
            />
          </div>
        </div>
      </Card>

      <div className={styles.cardList}>
        {filteredLaporanData.length > 0 ? (
          filteredLaporanData.map((diklat) => (
            <CardDiklat
              key={diklat.id}
              data={diklat}
              onEdit={() => handleEdit(diklat)}
              onDelete={() => handleDelete(diklat)}
              onUploadLaporan={() => handleUploadLaporan(diklat)}
              onViewDocument={(url) => handleViewDocument(url, diklat.namaDiklat)}
            />
          ))
        ) : (
          <Card className={styles.emptyState}>
            <p className={styles.emptyText}>
              Tidak ada data diklat yang ditemukan.
            </p>
          </Card>
        )}
      </div>

      {isModalOpen && modalMode !== "Upload Laporan Diklat" && (
        <Modal
          title={modalMode}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedDiklat(null); }}
        >
          <FormLaporanDiklat
            initialData={selectedDiklat}
            isEdit={modalMode === "Tambah Diklat" || modalMode === "Edit Diklat"}
            onCancel={() => { setIsModalOpen(false); setSelectedDiklat(null); }}
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {isModalOpen && modalMode === "Upload Laporan Diklat" && (
        <Modal
          title="Upload Laporan Diklat"
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedDiklat(null); }}
        >
          <form onSubmit={handleUploadSubmit} className={styles.uploadForm}>
            <p className={styles.uploadInfo}>
              Upload sertifikat untuk: <strong>{selectedDiklat?.namaDiklat}</strong>
            </p>
            <Input
              id="no-sertif"
              name="no-sertif"
              label="Nomor Sertifikat"
              value={uploadNoSertif}
              onChange={(e) => setUploadNoSertif(e.target.value)}
              placeholder="Contoh: SERTIF/SDM/2026/001"
            />
            <Input
              id="upload-sertif"
              name="upload-sertif"
              type="file"
              label="File Sertifikat"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              required
            />
            <div className={styles.buttonGroup}>
              <Button
                type="submit"
                label={isUploading ? "Mengupload..." : "Upload"}
                variant="primary"
                disabled={isUploading || !uploadFile}
              />
              <Button
                type="button"
                label="Batal"
                variant="secondary"
                onClick={() => { setIsModalOpen(false); setSelectedDiklat(null); }}
              />
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Diklat"
        message={`Yakin ingin menghapus diklat "${deleteTarget?.namaDiklat}"? Data yang sudah dihapus tidak dapat dikembalikan.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />

      <Popup
        isOpen={popup.isOpen}
        onClose={closePopup}
        variant={popup.variant}
        title={popup.title}
        message={popup.message}
        confirmLabel="Ok"
      />

      <PdfViewerModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileUrl={previewFile?.url || null}
        title={`Sertifikat - ${previewFile?.namaDiklat || ""}`}
        fileName={`Sertifikat_${previewFile?.namaDiklat || "Dokumen"}`}
      />
    </>
  )
}

export default DataDiklat