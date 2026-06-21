import { useCallback, useEffect, useState } from "react";
import Topbar from "../../ui/organisms/Topbar/Topbar";
import StatCard from "../../ui/molecules/StatCard";
import styles from "./DataKeluarga.module.css";
import { UsersRound, Heart, UserRound, Phone, Plus } from "lucide-react";
import MainHeaderSection from "../../ui/molecules/MainHeaderSection";
import Button from "../../ui/atoms/Button";
import FamilyMemberCard from "../../ui/organisms/FamilyMemberCard";
import type { FamilyMemberData } from "../../ui/organisms/FamilyMemberCard/FamilyMemberCard";
import Modal from "../../ui/organisms/Modal";
import FormDataKeluarga from "../../ui/organisms/FormDataKeluarga/FormDataKeluarga";
import type { FormKeluargaSubmitPayload } from "../../ui/organisms/FormDataKeluarga/FormDataKeluarga";
import FormPasangan from "../../ui/organisms/FormDataKeluarga/FormPasangan";
import type { PasanganFormPayload } from "../../ui/organisms/FormDataKeluarga/FormPasangan/FormPasangan";
import FormAnak from "../../ui/organisms/FormDataKeluarga/FormAnak";
import type { AnakFormPayload } from "../../ui/organisms/FormDataKeluarga/FormAnak/FormAnak";
import FormOrangTua from "../../ui/organisms/FormDataKeluarga/FormOrangTua";
import type { OrangTuaFormPayload } from "../../ui/organisms/FormDataKeluarga/FormOrangTua/FormOrangTua";
import FormKontakDarurat from "../../ui/organisms/FormDataKeluarga/FormKontakDarurat";
import type { KontakDaruratFormPayload } from "../../ui/organisms/FormDataKeluarga/FormKontakDarurat/FormKontakDarurat";
import FormTanggunganLain from "../../ui/organisms/FormDataKeluarga/FormTanggunganLain";
import type { TanggunganLainFormPayload } from "../../ui/organisms/FormDataKeluarga/FormTanggunganLain/FormTanggunganLain";
import Popup from "../../ui/molecules/Popup";
// import ConfirmDeleteModal from "../../ui/organisms/ConfirmDeleteModal";
import { keluargaService } from "../../../services/keluargaService";
import PdfViewerModal from "../../ui/molecules/PdfViewerModal";
import type {
    KeluargaRingkasanResponse,
    PasanganItem,
    AnakItem,
    OrangTuaItem,
    KontakDaruratItem,
    TanggunganLainItem,
} from "../../../types/api";

const transformPasangan = (item: PasanganItem): FamilyMemberData => ({
    id: item.id,
    nama: item.nama_lengkap,
    status: "Istri",
    tanggungan: !!item.status_tanggungan,
    nik: item.nik || undefined,
    tempatLahir: item.tempat_lahir || undefined,
    tanggalLahir: item.tanggal_lahir || undefined,
    pekerjaan: item.pekerjaan || undefined,
    instansi: item.instansi || undefined,
    statusPernikahan: item.status_pernikahan || undefined,
    tanggalPernikahan: item.tanggal_pernikahan || undefined,
    nomorBukuNikah: item.nomor_buku_nikah || undefined,
    npwpPasangan: item.npwp_pasangan || undefined,
    bukuNikahFilePath: item.buku_nikah_file_path || undefined,
});

const transformAnak = (item: AnakItem): FamilyMemberData => ({
    id: item.id,
    nama: item.nama_lengkap,
    status: "Anak",
    tanggungan: !!item.status_tanggungan,
    nik: item.nik || undefined,
    tempatLahir: item.tempat_lahir || undefined,
    tanggalLahir: item.tanggal_lahir || undefined,
    jenisKelamin: item.jenis_kelamin || undefined,
    statusAnak: item.status_anak || undefined,
    pendidikanTerakhir: item.pendidikan_terakhir || undefined,
    usia: item.usia ? `${item.usia} tahun` : undefined,
    keteranganDisabilitas: item.keterangan_disabilitas || undefined,
    aktaKelahiranFilePath: item.akta_kelahiran_file_path || undefined,
});

const transformOrangTua = (item: OrangTuaItem): FamilyMemberData => ({
    id: item.id,
    nama: "Data Orang Tua",
    status: "Orang Tua",
    tanggungan: false,
    namaAyah: item.nama_ayah || undefined,
    namaIbu: item.nama_ibu || undefined,
    statusHidup: item.status_hidup || undefined,
    alamat: item.alamat || undefined,
});

const transformKontakDarurat = (item: KontakDaruratItem): FamilyMemberData => ({
    id: item.id,
    nama: item.nama_kontak,
    status: "Kontak Darurat",
    tanggungan: false,
    hubunganKeluarga: item.hubungan_keluarga,
    nomorHp: item.nomor_hp,
    alamat: item.alamat || undefined,
});

const transformTanggunganLain = (item: TanggunganLainItem): FamilyMemberData => ({
    id: item.id,
    nama: item.nama,
    status: "Tanggungan Lain",
    tanggungan: !!item.status_tanggungan,
    hubunganKeluarga: item.hubungan_keluarga,
});

const buildPasanganFormData = (payload: PasanganFormPayload): FormData => {
    const fd = new FormData();
    if (payload.nama_lengkap) fd.append("nama_lengkap", payload.nama_lengkap);
    if (payload.nik) fd.append("nik", payload.nik);
    if (payload.tempat_lahir) fd.append("tempat_lahir", payload.tempat_lahir);
    if (payload.tanggal_lahir) fd.append("tanggal_lahir", payload.tanggal_lahir);
    if (payload.pekerjaan) fd.append("pekerjaan", payload.pekerjaan);
    if (payload.instansi) fd.append("instansi", payload.instansi);
    if (payload.status_pernikahan) fd.append("status_pernikahan", payload.status_pernikahan);
    if (payload.tanggal_pernikahan) fd.append("tanggal_pernikahan", payload.tanggal_pernikahan);
    if (payload.nomor_buku_nikah) fd.append("nomor_buku_nikah", payload.nomor_buku_nikah);
    if (payload.status_tanggungan) fd.append("status_tanggungan", payload.status_tanggungan);
    if (payload.npwp_pasangan) fd.append("npwp_pasangan", payload.npwp_pasangan);
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
    if (payload.pendidikan_terakhir) fd.append("pendidikan_terakhir", payload.pendidikan_terakhir);
    if (payload.status_tanggungan) fd.append("status_tanggungan", payload.status_tanggungan);
    if (payload.keterangan_disabilitas) fd.append("keterangan_disabilitas", payload.keterangan_disabilitas);
    if (payload.akta_kelahiran_file) fd.append("akta_kelahiran_file", payload.akta_kelahiran_file);
    return fd;
};

interface PopupState {
    isOpen: boolean;
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
}

// interface DeleteTarget {
//     id: number;
//     status: FamilyMemberData["status"];
//     nama: string;
// }

const DataKeluarga = () => {
    const [keluargaData, setKeluargaData] = useState<KeluargaRingkasanResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<FamilyMemberData | null>(null);
    const [previewFile, setPreviewFile] = useState<{ url: string; title: string } | null>(null);

    const [popup, setPopup] = useState<PopupState>({
        isOpen: false,
        variant: "success",
        title: "",
        message: "",
    });

    // const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await keluargaService.getRingkasan();
            if (res.success && res.data) {
                setKeluargaData(res.data);
            }
        } catch (err: unknown) {
            const error = err as { message?: string };
            showPopup("error", "Gagal Memuat Data", error?.message || "Terjadi kesalahan saat memuat data keluarga.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const showPopup = (variant: PopupState["variant"], title: string, message: string) => {
        setPopup({ isOpen: true, variant, title, message });
    };

    const closePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }));
    };

    const rincian = keluargaData?.rincian;

    const familyData: FamilyMemberData[] = rincian
        ? [
            ...(rincian.pasangan ?? []).map(transformPasangan),
            ...(rincian.anak ?? []).map(transformAnak),
            ...(rincian.orang_tua ?? []).map(transformOrangTua),
            ...(rincian.kontak_darurat ?? []).map(transformKontakDarurat),
            ...(rincian.tanggungan_lain ?? []).map(transformTanggunganLain),
        ]
        : [];

    const statsData = {
        keluarga: String(keluargaData?.total_keluarga ?? 0),
        pasangan: String(rincian?.pasangan?.length ?? 0),
        anak: String(rincian?.anak?.length ?? 0),
        kontakDarurat: String(rincian?.kontak_darurat?.length ?? 0),
    };

    const handleCreate = async (payload: FormKeluargaSubmitPayload) => {
        setIsMutating(true);
        try {
            switch (payload.type) {
                case "pasangan": {
                    const fd = buildPasanganFormData(payload.data);
                    await keluargaService.createPasangan(fd);
                    break;
                }
                case "anak": {
                    const fd = buildAnakFormData(payload.data);
                    await keluargaService.createAnak(fd);
                    break;
                }
                case "orang_tua": {
                    const { nama_ayah, nama_ibu, status_hidup, alamat } = payload.data;
                    const jsonPayload: Record<string, string> = {};
                    if (nama_ayah) jsonPayload.nama_ayah = nama_ayah;
                    if (nama_ibu) jsonPayload.nama_ibu = nama_ibu;
                    if (status_hidup) jsonPayload.status_hidup = status_hidup;
                    if (alamat) jsonPayload.alamat = alamat;
                    await keluargaService.createOrangTua(jsonPayload);
                    break;
                }
                case "kontak_darurat": {
                    const { nama_kontak, hubungan_keluarga, nomor_hp, alamat } = payload.data;
                    const jsonPayload: Record<string, string> = {};
                    if (nama_kontak) jsonPayload.nama_kontak = nama_kontak;
                    if (hubungan_keluarga) jsonPayload.hubungan_keluarga = hubungan_keluarga;
                    if (nomor_hp) jsonPayload.nomor_hp = nomor_hp;
                    if (alamat) jsonPayload.alamat = alamat;
                    await keluargaService.createKontakDarurat(jsonPayload);
                    break;
                }
                case "tanggungan_lain": {
                    const { nama, hubungan_keluarga, status_tanggungan } = payload.data;
                    await keluargaService.createTanggunganLain({
                        nama,
                        hubungan_keluarga,
                        status_tanggungan,
                    });
                    break;
                }
            }
            setIsModalAddOpen(false);
            showPopup("success", "Berhasil", "Data keluarga berhasil ditambahkan.");
            await fetchData();
        } catch (err: unknown) {
            const error = err as { message?: string };
            showPopup("error", "Gagal Menyimpan", error?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsMutating(false);
        }
    };

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
            await keluargaService.updatePasangan(editingMember.id, fd);
            setEditingMember(null);
            showPopup("success", "Berhasil", "Data pasangan berhasil diperbarui.");
            await fetchData();
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
            await keluargaService.updateAnak(editingMember.id, fd);
            setEditingMember(null);
            showPopup("success", "Berhasil", "Data anak berhasil diperbarui.");
            await fetchData();
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
            await keluargaService.updateOrangTua(editingMember.id, jsonPayload);
            setEditingMember(null);
            showPopup("success", "Berhasil", "Data orang tua berhasil diperbarui.");
            await fetchData();
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
            await keluargaService.updateKontakDarurat(editingMember.id, jsonPayload);
            setEditingMember(null);
            showPopup("success", "Berhasil", "Data kontak darurat berhasil diperbarui.");
            await fetchData();
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
            await keluargaService.updateTanggunganLain(editingMember.id, {
                nama: payload.nama,
                hubungan_keluarga: payload.hubungan_keluarga,
                status_tanggungan: payload.status_tanggungan,
            });
            setEditingMember(null);
            showPopup("success", "Berhasil", "Data tanggungan lain berhasil diperbarui.");
            await fetchData();
        } catch (err: unknown) {
            const error = err as { message?: string };
            showPopup("error", "Gagal Memperbarui", error?.message || "Terjadi kesalahan saat memperbarui data.");
        } finally {
            setIsMutating(false);
        }
    };

    // const handleDeleteRequest = (member: FamilyMemberData) => {
    //     setDeleteTarget({ id: member.id, status: member.status, nama: member.nama });
    // };

    // const handleDeleteConfirm = async () => {
    //     if (!deleteTarget) return;
    //     setIsMutating(true);
    //     try {
    //         switch (deleteTarget.status) {
    //             case "Istri":
    //             case "Suami":
    //                 await keluargaService.deletePasangan(deleteTarget.id);
    //                 break;
    //             case "Anak":
    //                 await keluargaService.deleteAnak(deleteTarget.id);
    //                 break;
    //             case "Orang Tua":
    //                 await keluargaService.deleteOrangTua(deleteTarget.id);
    //                 break;
    //             case "Kontak Darurat":
    //                 await keluargaService.deleteKontakDarurat(deleteTarget.id);
    //                 break;
    //         }
    //         setDeleteTarget(null);
    //         showPopup("success", "Berhasil", "Data keluarga berhasil dihapus.");
    //         await fetchData();
    //     } catch (err: unknown) {
    //         const error = err as { message?: string };
    //         setDeleteTarget(null);
    //         showPopup("error", "Gagal Menghapus", error?.message || "Terjadi kesalahan saat menghapus data.");
    //     } finally {
    //         setIsMutating(false);
    //     }
    // };

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
            <Topbar title="Data Keluarga" />
            <MainHeaderSection title="Data Keluarga" subtitle="Kelola informasi anggota keluarga Anda" />
            <div className={styles.statsRow}>
                <StatCard
                    icon={<UsersRound size={24} />}
                    value={isLoading ? "-" : statsData.keluarga}
                    label="Total Data Keluarga"
                    variant="green"
                />
                <StatCard
                    icon={<Heart size={24} />}
                    value={isLoading ? "-" : statsData.pasangan}
                    label="Pasangan"
                    variant="red"
                />
                <StatCard
                    icon={<UserRound size={24} />}
                    value={isLoading ? "-" : statsData.anak}
                    label="Anak"
                    variant="blue"
                />
                <StatCard
                    icon={<Phone size={24} />}
                    value={isLoading ? "-" : statsData.kontakDarurat}
                    label="Kontak Darurat"
                    variant="amber"
                />
            </div>
            <Button
                variant="primary"
                icon={<Plus size={24} />}
                label="Tambah Data Keluarga"
                onClick={() => setIsModalAddOpen(true)}
            />
            <div className={styles.recordList}>
                {isLoading ? (
                    <div className={styles.loadingState}>Memuat data keluarga...</div>
                ) : familyData.length === 0 ? (
                    <div className={styles.emptyState}>Belum ada data keluarga. Klik tombol "Tambah Data Keluarga" untuk menambahkan.</div>
                ) : (
                    familyData.map(member => (
                        <FamilyMemberCard
                            key={`${member.status}-${member.id}`}
                            data={member}
                            onEdit={() => handleEdit(member)}
                            // onDelete={() => handleDeleteRequest(member)}
                            onViewDocument={(url, label) => setPreviewFile({ url, title: label })}
                        />
                    ))
                )}

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

                
                {editingMember && (
                    <Modal
                        isOpen={!!editingMember}
                        onClose={handleCloseEdit}
                        title={`Edit Data ${editingMember.status}`}
                    >
                        {renderEditForm()}
                    </Modal>
                )}



                {/* <ConfirmDeleteModal
                    isOpen={!!deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    title="Konfirmasi Hapus"
                    message={`Apakah Anda yakin ingin menghapus data "${deleteTarget?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                    confirmLabel={isMutating ? "Menghapus..." : "Hapus"}
                    cancelLabel="Batal"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    isLoading={isMutating}
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
                    title={previewFile?.title || "Dokumen"}
                    fileName={previewFile?.title || "Dokumen"}
                />
            </div>
        </>
    )
}

export default DataKeluarga