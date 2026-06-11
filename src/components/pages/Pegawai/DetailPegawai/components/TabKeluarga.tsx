import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../ui/atoms/Button";
import Card from "../../../../ui/atoms/Card";
import Modal from "../../../../ui/organisms/Modal";
import FormDataKeluarga from "../../../../ui/organisms/FormDataKeluarga/FormDataKeluarga";
import type { FormKeluargaSubmitPayload } from "../../../../ui/organisms/FormDataKeluarga/FormDataKeluarga";
import type { PasanganFormPayload } from "../../../../ui/organisms/FormDataKeluarga/FormPasangan/FormPasangan";
import type { AnakFormPayload } from "../../../../ui/organisms/FormDataKeluarga/FormAnak/FormAnak";
import Popup from "../../../../ui/molecules/Popup";
import PdfViewerModal from "../../../../ui/molecules/PdfViewerModal";
import { keluargaService } from "../../../../../services/keluargaService";
import type { FamilyMemberData } from "../../../../ui/organisms/FamilyMemberCard/FamilyMemberCard";
import FamilyMemberCard from "../../../../ui/organisms/FamilyMemberCard/FamilyMemberCard";
import styles from "../DetailPegawai.module.css";

interface TabKeluargaProps {
    keluargaList: FamilyMemberData[];
    isAdmin: boolean;
    onRefresh?: () => void;
}

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

const TabKeluarga = ({ keluargaList, isAdmin, onRefresh }: TabKeluargaProps) => {
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
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

    const handleEdit = (member: any) => {
        console.log(member);
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
                        />
                    ))
                )}
            </div>

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