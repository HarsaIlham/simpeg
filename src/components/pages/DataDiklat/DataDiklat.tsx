import { useState, useEffect, useCallback, useMemo } from "react"
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
import FormLaporanDiklat from "../../ui/organisms/FormLaporanDiklat"
import Pagination from "../../ui/molecules/Pagination"
import { diklatService } from "../../../services/diklatService"
import { cvService } from "../../../services/cvService"
import { generateCvPdf } from "../../../utils/generateCvPdf"
import type { RiwayatDiklatItem } from "../../../types/api"
import Popup from "../../ui/molecules/Popup"
import { useMasterData } from "../../../hooks/useMasterData"
import PdfViewerModal from "../../ui/molecules/PdfViewerModal"
import { getProxiedFileUrl } from "../../../utils/api"
import { getGlobalUser } from "../../../contexts/AuthContext"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

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
  noSertifikat: item.no_sertif || "",
  uploadLaporan: item.uploadlaporan,
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

const ITEMS_PER_PAGE = 7

const DataDiklat = () => {
  const user = getGlobalUser()
  const { options: filterJenisOptions } = useMasterData("tipeDiklat", "Semua Jenis", JENIS_OPTIONS)
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<string>("")
  const [selectedDiklat, setSelectedDiklat] = useState<CardDiklatData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [filterJenis, setFilterJenis] = useState("")
  const [filterStatus, setFilterStatus] = useState(searchParams.get("status") ?? "")

  const [currentPage, setCurrentPage] = useState(1)

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
  }

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }))
  }

  const handleViewDocument = (url: string, namaDiklat: string) => {
    const proxied = getProxiedFileUrl(url)
    setPreviewFile({ url: proxied, namaDiklat })
  }

  const { data: response, isLoading: queryIsLoading, error: queryError } = useQuery({
    queryKey: ["diklat", currentPage, debouncedSearch, filterJenis, filterStatus],
    queryFn: () => diklatService.getDiklat({
      page: currentPage,
      per_page: ITEMS_PER_PAGE,
      search: debouncedSearch || undefined,
      jenis: filterJenis || undefined,
      status: filterStatus || undefined,
    }),
  });

  const isLoading = queryIsLoading;
  const error = queryError ? (queryError as any).message || "Gagal mengambil data diklat." : null;

  const diklatList = useMemo(() => {
    if (!response?.success || !response?.data) return [];
    const riwayatPaginated = response.data.diklat.riwayat_diklat as any;
    const rawRiwayat = riwayatPaginated?.data || riwayatPaginated || [];
    return rawRiwayat.map(mapRiwayatToCardDiklat);
  }, [response]);

  const riwayatPaginated = response?.data?.diklat?.riwayat_diklat as any;
  const totalPages = riwayatPaginated?.last_page || 1;
  const totalItems = riwayatPaginated?.total || 0;
  const perPage = riwayatPaginated?.per_page || ITEMS_PER_PAGE;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleEdit = (diklat: CardDiklatData) => {
    if (diklat.jenisPelaksana === "internal" && diklat.pencatat !== user?.nama) {
      showPopup("warning", "Peringatan", "Anda hanya dapat mengedit diklat internal yang Anda buat sendiri.")
      return
    }
    setSelectedDiklat(diklat)
    setModalMode("Edit Diklat")
    setIsModalOpen(true)
  }

  const saveDiklatMutation = useMutation({
    mutationFn: ({ id, formData }: { id?: number; formData: FormData }) => {
      if (id !== undefined) {
        return diklatService.updateDiklat(id, formData);
      } else {
        return diklatService.createDiklat(formData);
      }
    },
    onSuccess: (res, variables) => {
      if (res.success) {
        showPopup("checklist", "Berhasil", `Data diklat berhasil ${variables.id !== undefined ? "diperbarui" : "ditambahkan"}.`);
        setIsModalOpen(false);
        setSelectedDiklat(null);
        queryClient.invalidateQueries({ queryKey: ["diklat"] });
      }
    },
    onError: (err: any) => {
      showPopup("error", "Gagal", err?.message || "Gagal menyimpan data diklat.");
    }
  });

  const isSubmitting = saveDiklatMutation.isPending;

  const handleFormSubmit = async (formData: FormData) => {
    saveDiklatMutation.mutate({
      id: modalMode === "Edit Diklat" && selectedDiklat ? selectedDiklat.id : undefined,
      formData
    });
  }

  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadNoSertif, setUploadNoSertif] = useState("")

  const uploadLaporanMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      diklatService.uploadLaporan(id, formData),
    onSuccess: () => {
      setIsModalOpen(false);
      setSelectedDiklat(null);
      queryClient.invalidateQueries({ queryKey: ["diklat"] });
      showPopup("checklist", "Berhasil", "Laporan sertifikat berhasil diupload.");
    },
    onError: (err: any) => {
      showPopup("error", "Gagal", err?.message || "Gagal mengupload laporan.");
    }
  });

  const isUploading = uploadLaporanMutation.isPending;

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

    const formData = new FormData()
    formData.append("upload_laporan", uploadFile)
    if (uploadNoSertif.trim()) {
      formData.append("no_sertif", uploadNoSertif.trim())
    }
    uploadLaporanMutation.mutate({ id: selectedDiklat.id, formData });
  }

  const handleTambahDiklat = () => {
    setSelectedDiklat(null)
    setModalMode("Tambah Diklat")
    setIsModalOpen(true)
  }

  const cetakCvMutation = useMutation({
    mutationFn: () => cvService.getCvData(),
    onSuccess: async (cvData) => {
      await generateCvPdf(cvData);
      showPopup("checklist", "Cetak CV", "CV berhasil diunduh.");
    },
    onError: (err: any) => {
      showPopup("error", "Gagal", err?.message || "Gagal mengambil data untuk CV.");
    }
  });

  const isCetakLoading = cetakCvMutation.isPending;

  const handleCetakCv = async () => {
    cetakCvMutation.mutate();
  }

  return (
    <>
      <Topbar title="Data Diklat" />
      <MainHeaderSection title="Data Laporan Diklat" subtitle="Kelola riwayat pelatihan dan pendidikan lanjutan" />

      <Card className={styles.cardSearch}>
        <div className={styles.cardHeader}>
          <div className={styles.searchWrapper}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
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
        {isLoading ? (
          <Card className={styles.emptyState}>
            <p className={styles.emptyText}>Memuat data diklat...</p>
          </Card>
        )
          : error ? (
            <Card className={styles.emptyState}>
              <p className={styles.emptyText}>{error}</p>
            </Card>
          )
            : diklatList.length > 0 ? (
              diklatList.map((diklat: any) => {
                const canEdit = diklat.jenisPelaksana !== "internal" || diklat.pencatat === user?.nama;
                return (
                  <CardDiklat
                    key={diklat.id}
                    data={diklat}
                    onEdit={canEdit ? () => handleEdit(diklat) : undefined}
                    // onDelete={() => handleDelete(diklat)}
                    onUploadLaporan={() => handleUploadLaporan(diklat)}
                    onViewDocument={(url) => handleViewDocument(url, diklat.namaDiklat)}
                  />
                )
              })
            ) : (
              <Card className={styles.emptyState}>
                <p className={styles.emptyText}>
                  Tidak ada data diklat yang ditemukan.
                </p>
              </Card>
            )}
      </div>

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={perPage}
          onPageChange={handlePageChange}
          itemName="diklat"
        />
      )}

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
              value={uploadNoSertif || selectedDiklat?.noSertifikat}
              onChange={(e) => setUploadNoSertif(e.target.value)}
              placeholder="Contoh: SERTIF/SDM/2026/001"
              required
            />
            <Input
              id="upload-sertif"
              name="upload-sertif"
              type="file"
              label="File Sertifikat"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              required
            />
            {selectedDiklat?.sertifikat && !uploadFile && (
              <span style={{ color: 'var(--color-muted, #6B7280)', fontSize: '12px', fontStyle: 'italic', marginTop: '-12px', display: 'block' }}>
                File Sertifikat sudah ada. Upload baru hanya jika ingin mengganti.
              </span>
            )}

            {/* <FileUploader name="file" onChange={setUploadFile} /> */}
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

      {/* <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Diklat"
        message={`Yakin ingin menghapus diklat "${deleteTarget?.namaDiklat}"? Data yang sudah dihapus tidak dapat dikembalikan.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      /> */}

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