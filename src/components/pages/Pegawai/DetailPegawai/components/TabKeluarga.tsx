import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../ui/atoms/Button";
import Card from "../../../../ui/atoms/Card";
import Modal from "../../../../ui/organisms/Modal";
import FormDataKeluarga from "../../../../ui/organisms/FormDataKeluarga/FormDataKeluarga";
import type { FormKeluargaSubmitPayload } from "../../../../ui/organisms/FormDataKeluarga/FormDataKeluarga";
import FormPasangan from "../../../../ui/organisms/FormDataKeluarga/FormPasangan";
import type { PasanganFormPayload } from "../../../../ui/organisms/FormDataKeluarga/FormPasangan/FormPasangan";
import FormAnak from "../../../../ui/organisms/FormDataKeluarga/FormAnak";
import type { AnakFormPayload } from "../../../../ui/organisms/FormDataKeluarga/FormAnak/FormAnak";
import FormOrangTua from "../../../../ui/organisms/FormDataKeluarga/FormOrangTua";
import type { OrangTuaFormPayload } from "../../../../ui/organisms/FormDataKeluarga/FormOrangTua/FormOrangTua";
import FormKontakDarurat from "../../../../ui/organisms/FormDataKeluarga/FormKontakDarurat";
import type { KontakDaruratFormPayload } from "../../../../ui/organisms/FormDataKeluarga/FormKontakDarurat/FormKontakDarurat";
import FormTanggunganLain from "../../../../ui/organisms/FormDataKeluarga/FormTanggunganLain";
import type { TanggunganLainFormPayload } from "../../../../ui/organisms/FormDataKeluarga/FormTanggunganLain/FormTanggunganLain";
import Popup from "../../../../ui/molecules/Popup";
import PdfViewerModal from "../../../../ui/molecules/PdfViewerModal";
import { hrdPegawaiService } from "../../../../../services/hrdPegawaiService";
import type { FamilyMemberData } from "../../../../ui/organisms/FamilyMemberCard/FamilyMemberCard";
import FamilyMemberCard from "../../../../ui/organisms/FamilyMemberCard/FamilyMemberCard";
import styles from "../DetailPegawai.module.css";

interface TabKeluargaProps {
    keluargaList: FamilyMemberData[];
    isAdmin: boolean;
    pegawaiId: number;
    onRefresh?: () => void;
}

const buildPasanganFormData = (payload: PasanganFormPayload): FormData => {
    const fd = new FormData();
    if (payload.nama_lengkap) fd.append("nama_lengkap", payload.nama_lengkap);
    if (payload.nik) fd.append("nik", payload.nik);
    if (payload.tempat_lahir) fd.append("tempat_lahir", payload.tempat_lahir);
    if (payload.tanggal_lahir) fd.append("tanggal_lahir", payload.tanggal_lahir);
    fd.append("pekerjaan", payload.pekerjaan || "");
    fd.append("instansi", payload.instansi || "");
    if (payload.status_pernikahan) fd.append("status_pernikahan", payload.status_pernikahan);
    if (payload.tanggal_pernikahan) fd.append("tanggal_pernikahan", payload.tanggal_pernikahan);
    fd.append("nomor_buku_nikah", payload.nomor_buku_nikah || "");
    if (payload.status_tanggungan) fd.append("status_tanggungan", payload.status_tanggungan);
    fd.append("npwp_pasangan", payload.npwp_pasangan || "");
    if (payload.buku_nikah_file) fd.append("buku_nikah_file", payload.buku_nikah_file);
    return fd;
};

const buildAnakFormData = (payload: AnakFormPayload): FormData => {
    const fd = new FormData();
    if (payload.nama_lengkap) fd.append("nama_lengkap", payload.nama_lengkap);
    if (payload.nik) fd.append("nik", payload.nik);
    if (payload.tempat_lahir) fd.append("tempat_lahir", payload.tempat_lahir);
    if (payload.tanggal_lahir) fd.append("tanggal_lahir", payload.tanggal_lahir);
    if (payload.jenis_kelamin) fd.append("jenis_kelamin", payload.jenis_kelamin);
    if (payload.status_anak) fd.append("status_anak", payload.status_anak);
    fd.append("pendidikan_terakhir", payload.pendidikan_terakhir || "");
    if (payload.status_tanggungan) fd.append("status_tanggungan", payload.status_tanggungan);
    fd.append("keterangan_disabilitas", payload.keterangan_disabilitas || "");
    if (payload.akta_kelahiran_file_path) fd.append("akta_kelahiran_file_path", payload.akta_kelahiran_file_path);
    return fd;
};

const TabKeluarga = ({ keluargaList, isAdmin, pegawaiId, onRefresh }: TabKeluargaProps) => {
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<FamilyMemberData | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<FamilyMemberData | null>(null);
    const [isMutating, setIsMutating] = useState(false);
    const [previewFile, setPreviewFile] = useState<{ url: string; title: string } | null>(null);
    const [popup, setPopup] = useState<{
        isOpen: boolean;
        variant: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
    }>({
        isOpen: false,
        variant: "success",
        title: "",
        message: "",
    });

    const isLoading = false;

    const showPopup = (variant: "success" | "error" | "warning" | "info", title: string, message: string) => {
        setPopup({ isOpen: true, variant, title, message });
    };

    const closePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }));
    };

    const handleAddFamily = () => {
        setIsModalAddOpen(true);
    };

    // ============================
    // CREATE handlers (HRD endpoint)
    // ============================
    const handleCreate = async (payload: FormKeluargaSubmitPayload) => {
        setIsMutating(true);
        try {
            switch (payload.type) {
                case "pasangan": {
                    const fd = buildPasanganFormData(payload.data);
                    await hrdPegawaiService.createPasangan(pegawaiId, fd);
                    break;
                }
                case "anak": {
                    const fd = buildAnakFormData(payload.data);
                    await hrdPegawaiService.createAnak(pegawaiId, fd);
                    break;
                }
                case "orang_tua": {
                    const { nama_ayah, nama_ibu, status_hidup, alamat } = payload.data;
                    const jsonPayload: Record<string, string> = {};
                    if (nama_ayah) jsonPayload.nama_ayah = nama_ayah;
                    if (nama_ibu) jsonPayload.nama_ibu = nama_ibu;
                    if (status_hidup) jsonPayload.status_hidup = status_hidup;
                    if (alamat) jsonPayload.alamat = alamat;
                    await hrdPegawaiService.createOrangTua(pegawaiId, jsonPayload);
                    break;
                }
                case "kontak_darurat": {
                    const { nama_kontak, hubungan_keluarga, nomor_hp, alamat } = payload.data;
                    const jsonPayload: Record<string, string> = {};
                    if (nama_kontak) jsonPayload.nama_kontak = nama_kontak;
                    if (hubungan_keluarga) jsonPayload.hubungan_keluarga = hubungan_keluarga;
                    if (nomor_hp) jsonPayload.nomor_hp = nomor_hp;
                    if (alamat) jsonPayload.alamat = alamat;
                    await hrdPegawaiService.createKontakDarurat(pegawaiId, jsonPayload);
                    break;
                }
                case "tanggungan_lain": {
                    const { nama, hubungan_keluarga, status_tanggungan } = payload.data;
                    await hrdPegawaiService.createTanggunganLain(pegawaiId, {
                        nama,
                        hubungan_keluarga,
                        status_tanggungan,
                    });
                    break;
                }
            }
            setIsModalAddOpen(false);
            showPopup("success", "Berhasil", "Data keluarga berhasil ditambahkan.");
            if (onRefresh) {
                await onRefresh();
            }
        } catch (err: unknown) {
            const error = err as { message?: string };
            showPopup("error", "Gagal Menyimpan", error?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsMutating(false);
        }
    };

    // ============================
    // EDIT handlers (HRD endpoint)
    // ============================
    const handleEdit = (member: FamilyMemberData) => {
        setEditingMember(member);
    };

    const handleCloseEdit = () => {
        setEditingMember(null);
    };

    const handleEditPasangan = async (payload: PasanganFormPayload) => {
        if (!editingMember) return;
        setIsMutating(true);
        try {
            const fd = buildPasanganFormData(payload);
            await hrdPegawaiService.updatePasangan(pegawaiId, editingMember.id, fd);
            setEditingMember(null);
            showPopup("success", "Berhasil", "Data pasangan berhasil diperbarui.");
            if (onRefresh) await onRefresh();
        } catch (err: unknown) {
            const error = err as { message?: string };
            showPopup("error", "Gagal Memperbarui", error?.message || "Terjadi kesalahan saat memperbarui data.");
        } finally {
            setIsMutating(false);
        }
    };

    const handleEditAnak = async (payload: AnakFormPayload) => {
        if (!editingMember) return;
        setIsMutating(true);
        try {
            const fd = buildAnakFormData(payload);
            await hrdPegawaiService.updateAnak(pegawaiId, editingMember.id, fd);
            setEditingMember(null);
            showPopup("success", "Berhasil", "Data anak berhasil diperbarui.");
            if (onRefresh) await onRefresh();
        } catch (err: unknown) {
            const error = err as { message?: string };
            showPopup("error", "Gagal Memperbarui", error?.message || "Terjadi kesalahan saat memperbarui data.");
        } finally {
            setIsMutating(false);
        }
    };

    const handleEditOrangTua = async (payload: OrangTuaFormPayload) => {
        if (!editingMember) return;
        setIsMutating(true);
        try {
            const jsonPayload: Record<string, string> = {};
            if (payload.nama_ayah) jsonPayload.nama_ayah = payload.nama_ayah;
            if (payload.nama_ibu) jsonPayload.nama_ibu = payload.nama_ibu;
            if (payload.status_hidup) jsonPayload.status_hidup = payload.status_hidup;
            if (payload.alamat) jsonPayload.alamat = payload.alamat;
            await hrdPegawaiService.updateOrangTua(pegawaiId, editingMember.id, jsonPayload);
            setEditingMember(null);
            showPopup("success", "Berhasil", "Data orang tua berhasil diperbarui.");
            if (onRefresh) await onRefresh();
        } catch (err: unknown) {
            const error = err as { message?: string };
            showPopup("error", "Gagal Memperbarui", error?.message || "Terjadi kesalahan saat memperbarui data.");
        } finally {
            setIsMutating(false);
        }
    };

    const handleEditKontakDarurat = async (payload: KontakDaruratFormPayload) => {
        if (!editingMember) return;
        setIsMutating(true);
        try {
            const jsonPayload: Record<string, string> = {};
            if (payload.nama_kontak) jsonPayload.nama_kontak = payload.nama_kontak;
            if (payload.hubungan_keluarga) jsonPayload.hubungan_keluarga = payload.hubungan_keluarga;
            if (payload.nomor_hp) jsonPayload.nomor_hp = payload.nomor_hp;
            if (payload.alamat) jsonPayload.alamat = payload.alamat;
            await hrdPegawaiService.updateKontakDarurat(pegawaiId, editingMember.id, jsonPayload);
            setEditingMember(null);
            showPopup("success", "Berhasil", "Data kontak darurat berhasil diperbarui.");
            if (onRefresh) await onRefresh();
        } catch (err: unknown) {
            const error = err as { message?: string };
            showPopup("error", "Gagal Memperbarui", error?.message || "Terjadi kesalahan saat memperbarui data.");
        } finally {
            setIsMutating(false);
        }
    };

    const handleEditTanggunganLain = async (payload: TanggunganLainFormPayload) => {
        if (!editingMember) return;
        setIsMutating(true);
        try {
            await hrdPegawaiService.updateTanggunganLain(pegawaiId, editingMember.id, {
                nama: payload.nama,
                hubungan_keluarga: payload.hubungan_keluarga,
                status_tanggungan: payload.status_tanggungan,
            });
            setEditingMember(null);
            showPopup("success", "Berhasil", "Data tanggungan lain berhasil diperbarui.");
            if (onRefresh) await onRefresh();
        } catch (err: unknown) {
            const error = err as { message?: string };
            showPopup("error", "Gagal Memperbarui", error?.message || "Terjadi kesalahan saat memperbarui data.");
        } finally {
            setIsMutating(false);
        }
    };

    // ============================
    // DELETE handler (HRD endpoint)
    // ============================
    const handleDeleteRequest = (member: FamilyMemberData) => {
        setDeleteTarget(member);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setIsMutating(true);
        try {
            switch (deleteTarget.status) {
                case "Istri":
                case "Suami":
                    await hrdPegawaiService.deletePasangan(pegawaiId, deleteTarget.id);
                    break;
                case "Anak":
                    await hrdPegawaiService.deleteAnak(pegawaiId, deleteTarget.id);
                    break;
                case "Orang Tua":
                    await hrdPegawaiService.deleteOrangTua(pegawaiId, deleteTarget.id);
                    break;
                case "Kontak Darurat":
                    await hrdPegawaiService.deleteKontakDarurat(pegawaiId, deleteTarget.id);
                    break;
                case "Tanggungan Lain":
                    await hrdPegawaiService.deleteTanggunganLain(pegawaiId, deleteTarget.id);
                    break;
            }
            setDeleteTarget(null);
            showPopup("success", "Berhasil", "Data keluarga berhasil dihapus.");
            if (onRefresh) await onRefresh();
        } catch (err: unknown) {
            const error = err as { message?: string };
            setDeleteTarget(null);
            showPopup("error", "Gagal Menghapus", error?.message || "Terjadi kesalahan saat menghapus data.");
        } finally {
            setIsMutating(false);
        }
    };

    // ============================
    // Render edit form per type
    // ============================
    const renderEditForm = () => {
        if (!editingMember) return null;

        switch (editingMember.status) {
            case "Istri":
            case "Suami":
                return (
                    <FormPasangan
                        initialData={{
                            nama_lengkap: editingMember.nama,
                            nik: editingMember.nik || "",
                            tempat_lahir: editingMember.tempatLahir || "",
                            tanggal_lahir: editingMember.tanggalLahir || "",
                            pekerjaan: editingMember.pekerjaan || "",
                            instansi: editingMember.instansi || "",
                            status_pernikahan: editingMember.statusPernikahan || "",
                            tanggal_pernikahan: editingMember.tanggalPernikahan || "",
                            nomor_buku_nikah: editingMember.nomorBukuNikah || "",
                            status_tanggungan: editingMember.tanggungan ? "1" : "0",
                            npwp_pasangan: editingMember.npwpPasangan || "",
                            buku_nikah_file_path: editingMember.bukuNikahFilePath || "",
                        }}
                        onCancel={handleCloseEdit}
                        onSubmit={handleEditPasangan}
                        isLoading={isMutating}
                    />
                );

            case "Anak":
                return (
                    <FormAnak
                        initialData={{
                            nama_lengkap: editingMember.nama,
                            nik: editingMember.nik || "",
                            tempat_lahir: editingMember.tempatLahir || "",
                            tanggal_lahir: editingMember.tanggalLahir || "",
                            jenis_kelamin: editingMember.jenisKelamin || "",
                            status_anak: editingMember.statusAnak || "",
                            pendidikan_terakhir: editingMember.pendidikanTerakhir || "",
                            status_tanggungan: editingMember.tanggungan ? "1" : "0",
                            keterangan_disabilitas: editingMember.keteranganDisabilitas || "",
                            akta_kelahiran_file_path: editingMember.aktaKelahiranFilePath || "",
                        }}
                        onCancel={handleCloseEdit}
                        onSubmit={handleEditAnak}
                        isLoading={isMutating}
                    />
                );

            case "Orang Tua":
                return (
                    <FormOrangTua
                        initialData={{
                            nama_ayah: editingMember.namaAyah || "",
                            nama_ibu: editingMember.namaIbu || "",
                            status_hidup: editingMember.statusHidup || "",
                            alamat: editingMember.alamat || "",
                        }}
                        onCancel={handleCloseEdit}
                        onSubmit={handleEditOrangTua}
                        isLoading={isMutating}
                    />
                );

            case "Kontak Darurat":
                return (
                    <FormKontakDarurat
                        initialData={{
                            nama_kontak: editingMember.nama,
                            hubungan_keluarga: editingMember.hubunganKeluarga || "",
                            nomor_hp: editingMember.nomorHp || "",
                            alamat: editingMember.alamat || "",
                        }}
                        onCancel={handleCloseEdit}
                        onSubmit={handleEditKontakDarurat}
                        isLoading={isMutating}
                    />
                );

            case "Tanggungan Lain":
                return (
                    <FormTanggunganLain
                        initialData={{
                            nama: editingMember.nama,
                            hubungan_keluarga: editingMember.hubunganKeluarga || "",
                            status_tanggungan: editingMember.tanggungan,
                        }}
                        onCancel={handleCloseEdit}
                        onSubmit={handleEditTanggunganLain}
                        isLoading={isMutating}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <>
            {isAdmin && (
                <div className={styles.buttonContainer}>
                    <Button
                        variant="primary"
                        icon={<Plus size={20} />}
                        label="Tambah Data Keluarga"
                        onClick={handleAddFamily}
                    />
                </div>
            )}
            <div className={styles.recordList}>
                {isLoading ? (
                    <Card>
                        <p className={styles.loadingState}>Memuat data keluarga...</p>
                    </Card>
                ) : keluargaList.length === 0 ? (
                    <Card>
                        <p className={styles.emptyText}>Belum ada data keluarga.</p>
                    </Card>
                ) : (
                    keluargaList.map(member => (
                        <FamilyMemberCard
                            key={`${member.status}-${member.id}`}
                            data={member}
                            onViewDocument={(url, label) => setPreviewFile({ url, title: label })}
                            onEdit={isAdmin ? () => handleEdit(member) : undefined}
                            onDelete={isAdmin ? () => handleDeleteRequest(member) : undefined}
                        />
                    ))
                )}
            </div>

            {/* Modal Tambah Data Keluarga */}
            {isModalAddOpen && (
                <Modal
                    isOpen={isModalAddOpen}
                    onClose={() => setIsModalAddOpen(false)}
                    title="Tambah Data Keluarga"
                >
                    <FormDataKeluarga
                        onCancel={() => setIsModalAddOpen(false)}
                        onSubmit={handleCreate}
                        isLoading={isMutating}
                    />
                </Modal>
            )}

            {/* Modal Edit Data Keluarga */}
            {editingMember && (
                <Modal
                    isOpen={!!editingMember}
                    onClose={handleCloseEdit}
                    title={`Edit Data ${editingMember.status}`}
                >
                    {renderEditForm()}
                </Modal>
            )}

            {/* Modal Konfirmasi Hapus */}
            {deleteTarget && (
                <Modal
                    isOpen={!!deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    title="Konfirmasi Hapus"
                >
                    <div style={{ padding: "1rem" }}>
                        <p style={{ marginBottom: "1.5rem", fontSize: "0.95rem", color: "#374151" }}>
                            Apakah Anda yakin ingin menghapus data <strong>"{deleteTarget.nama}"</strong> ({deleteTarget.status})?
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                            <Button
                                label="Batal"
                                variant="secondary"
                                onClick={() => setDeleteTarget(null)}
                                disabled={isMutating}
                            />
                            <Button
                                label={isMutating ? "Menghapus..." : "Hapus"}
                                variant="danger"
                                onClick={handleDeleteConfirm}
                                disabled={isMutating}
                            />
                        </div>
                    </div>
                </Modal>
            )}

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
                title={previewFile?.title || "Dokumen"}
                fileName={previewFile?.title || "Dokumen"}
            />
        </>
    );
};

export default TabKeluarga;