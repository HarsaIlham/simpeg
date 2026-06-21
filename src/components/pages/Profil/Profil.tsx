import { useState, useEffect, useRef } from "react";
import Topbar from "../../ui/organisms/Topbar/Topbar";
import MainHeaderSection from "../../ui/molecules/MainHeaderSection/MainHeaderSection";
import CardProfile from "./components/CardProfile";
import FormProfile from "./components/FormProfile";
import Icon from "../../ui/atoms/Icon";
import ChangeRequestCard from "./components/ChangeRequestCard";
import type { ChangeRequestData } from "./components/ChangeRequestCard/ChangeRequestCard";
import { User } from "lucide-react";

import styles from "./Profil.module.css";
import type { propsType } from "./components/FormProfile/FormProfile";
import Popup from "../../ui/molecules/Popup";
import Modal from "../../ui/organisms/Modal";
import Button from "../../ui/atoms/Button";
import Textarea from "../../ui/atoms/Textarea";
import PhotoPreview from "../../ui/molecules/PhotoPreview";
import { profileService } from "../../../services/profileService";
import type { ProfileData, UpdateProfileRequest } from "../../../types/api";
import { useMasterData } from "../../../hooks/useMasterData";

const mapProfileToFormData = (profile: ProfileData): propsType => ({
    namaLengkap: profile.nama,
    nip: profile.nip,
    nik: profile.nik,
    email: profile.email,
    noTelepon: profile.no_telp,
    tanggalLahir: profile.tanggal_lahir,
    jenisKelamin: profile.jk === "L" ? "Laki-laki" : "Perempuan",
    agama: profile.agama,
    statusPernikahan: mapStatusKawin(profile.status_kawin),
    pendidikanTerakhir: profile.pendidikan_terakhir,
    jabatan: profile.jabatan_sekarang,
    pangkat: profile.pangkat,
    profesi: profile.profesi,
    unitKerja: profile.unit_kerja,
    golonganRuang: profile.golongan_ruang,
    jenisPegawai: profile.jenis_pegawai,
    alamat: profile.alamat,
    tanggalMasuk: profile.tgl_masuk,
    tmtCpns: profile.tmt_cpns,
    tmtPns: profile.tmt_pns,
    tmtPangkatTerakhir: profile.tmt_pangkat,
    ktp: profile.ktp_file_path || null,
    bukuNikah: null,
    kartuKeluarga: profile.link_kk || null,
});

const mapStatusKawin = (status: string | null | undefined): string => {
    if (!status) return "";
    const statusMap: Record<string, string> = {
        kawin: "Menikah",
        "belum kawin": "Belum Menikah",
        "cerai hidup": "Cerai Hidup",
        "cerai mati": "Cerai Mati",
    };
    return statusMap[status.toLowerCase()] || status;
};

const unmapStatusKawin = (status: string | null | undefined): string => {
    if (!status) return "";
    const statusMap: Record<string, string> = {
        "Menikah": "kawin",
        "Belum Menikah": "belum kawin",
        "Cerai Hidup": "cerai hidup",
        "Cerai Mati": "cerai mati",
    };
    return statusMap[status] || status.toLowerCase();
};

const translateIdToName = (idVal: string, itemsList: any[]) => {
    if (!idVal) return "";
    if (!/^\d+$/.test(idVal)) return idVal; // already a label
    const found = itemsList.find(item => String(item.id) === idVal);
    return found ? found.nama : idVal;
};

const unmapFormDataToProfile = (
    formData: propsType,
    jenisPegawaiList: any[],
    profesiList: any[],
    golonganRuangList: any[],
    unitKerjaList: any[]
): Partial<ProfileData> => ({
    nama: formData.namaLengkap,
    nip: formData.nip,
    nik: formData.nik,
    email: formData.email,
    no_telp: formData.noTelepon,
    tanggal_lahir: formData.tanggalLahir,
    jk: formData.jenisKelamin === "Laki-laki" ? "L" : formData.jenisKelamin === "Perempuan" ? "P" : "",
    agama: formData.agama,
    status_kawin: unmapStatusKawin(formData.statusPernikahan),
    pendidikan_terakhir: formData.pendidikanTerakhir,
    jabatan_sekarang: formData.jabatan,
    pangkat: formData.pangkat,
    profesi: translateIdToName(formData.profesi, profesiList),
    unit_kerja: translateIdToName(formData.unitKerja, unitKerjaList),
    golongan_ruang: translateIdToName(formData.golonganRuang, golonganRuangList),
    jenis_pegawai: translateIdToName(formData.jenisPegawai, jenisPegawaiList),
    alamat: formData.alamat,
    tgl_masuk: formData.tanggalMasuk,
    tmt_cpns: formData.tmtCpns,
    tmt_pns: formData.tmtPns,
    tmt_pangkat: formData.tmtPangkatTerakhir,
    ktp_file_path: formData.ktp || undefined,
    link_kk: formData.kartuKeluarga || undefined,
});

const getChangedFields = (
    initial: propsType,
    current: propsType,
    jenisPegawaiList: any[],
    profesiList: any[],
    golonganRuangList: any[],
    unitKerjaList: any[]
): Partial<ProfileData> => {
    const changes: Partial<ProfileData> = {};
    const unmappedCurrent = unmapFormDataToProfile(current, jenisPegawaiList, profesiList, golonganRuangList, unitKerjaList);
    const unmappedInitial = unmapFormDataToProfile(initial, jenisPegawaiList, profesiList, golonganRuangList, unitKerjaList);

    (Object.keys(unmappedCurrent) as Array<keyof typeof unmappedCurrent>).forEach((key) => {
        if (unmappedCurrent[key] !== unmappedInitial[key]) {
            // @ts-ignore
            changes[key] = unmappedCurrent[key];
        }
    });

    return changes;
};

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const Profil = () => {
    const { items: golonganRuangItems } = useMasterData("golonganRuang", undefined, [], true);
    const { items: jenisPegawaiItems } = useMasterData("jenisPegawai", undefined, [], true);
    const { items: profesiItems } = useMasterData("profesi", undefined, [], true);
    const { items: unitKerjaItems } = useMasterData("unitKerja", undefined, [], true);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupConfig, setPopupConfig] = useState({
        variant: "success" as "success" | "error" | "warning",
        title: "",
        message: "",
    });
    const [profileData, setProfileData] = useState<propsType | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [statusPegawai, setStatusPegawai] = useState<string>("Aktif");
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [pendingChanges, setPendingChanges] = useState<Partial<ProfileData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [myChangeRequests, setMyChangeRequests] = useState<ChangeRequestData[]>([]);

    const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
    const [isDocUploading, setIsDocUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileService.getProfile();

            if (response.success && response.data) {
                const { profile } = response.data;
                setProfileData(mapProfileToFormData(profile));
                setPhotoUrl(profile.link_photo_profile);
                setStatusPegawai(profile.status_pegawai);

                if (profile.status_perubahan && profile.status_perubahan.status) {
                    const statusStr = profile.status_perubahan.status;
                    setMyChangeRequests([{
                        id: `req-${profile.status_perubahan.last_update}`,
                        title: `Pengajuan ${profile.status_perubahan.fitur}`,
                        date: profile.status_perubahan.last_update,
                        statusLabel: statusStr.charAt(0).toUpperCase() + statusStr.slice(1),
                        statusVariant: statusStr === "pending" ? "warning" : statusStr === "approved" ? "success" : "danger",
                    }]);
                } else {
                    setMyChangeRequests([]);
                }
            }
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || "Gagal memuat data profil.");
            console.error("Error fetching profile:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handlePhotoClick = () => {
        setIsPhotoViewerOpen(true);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        e.target.value = "";

        if (!ALLOWED_TYPES.includes(file.type)) {
            setPopupConfig({
                variant: "error",
                title: "Format File Tidak Didukung",
                message: "Gunakan format JPG, JPEG, PNG, atau WebP.",
            });
            setIsPopupOpen(true);
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setPopupConfig({
                variant: "error",
                title: "Ukuran File Terlalu Besar",
                message: "Ukuran file maksimal 2MB.",
            });
            setIsPopupOpen(true);
            return;
        }

        try {
            setIsUploading(true);
            const response = await profileService.uploadProfilePhoto(file);

            if (response.success && response.data) {
                setPhotoUrl(response.data.link_photo_profile);
                setPopupConfig({
                    variant: "success",
                    title: "Foto Berhasil Diperbarui",
                    message: "Foto profil Anda telah berhasil diperbarui.",
                });
                setIsPopupOpen(true);
            }
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setPopupConfig({
                variant: "error",
                title: "Gagal Upload Foto",
                message: apiError.message || "Terjadi kesalahan saat mengupload foto.",
            });
            setIsPopupOpen(true);
            console.error("Error uploading photo:", err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmitChange = (newData: propsType) => {
        if (!profileData) return;

        const changedFields = getChangedFields(
            profileData,
            newData,
            jenisPegawaiItems,
            profesiItems,
            golonganRuangItems,
            unitKerjaItems
        );

        if (Object.keys(changedFields).length === 0) {
            setPopupConfig({
                variant: "error",
                title: "Tidak Ada Perubahan",
                message: "Anda tidak melakukan perubahan data apa pun.",
            });
            setIsPopupOpen(true);
            return;
        }

        setPendingChanges(changedFields);
        setNoteText("");
        setIsNoteModalOpen(true);
    };

    const handleDocumentUpload = async (fieldName: string, file: File): Promise<boolean> => {
        if (file.type !== "application/pdf") {
            setPopupConfig({
                variant: "error",
                title: "Format File Tidak Didukung",
                message: "Gunakan format PDF untuk dokumen.",
            });
            setIsPopupOpen(true);
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            setPopupConfig({
                variant: "error",
                title: "Ukuran File Terlalu Besar",
                message: "Ukuran file maksimal 2MB.",
            });
            setIsPopupOpen(true);
            return false;
        }

        try {
            setIsDocUploading(true);

            if (fieldName === "ktp") {
                const response = await profileService.uploadKtp(file);
                if (response.success && response.data) {
                    setPopupConfig({
                        variant: "success",
                        title: "KTP Berhasil Diupload",
                        message: "File KTP Anda telah berhasil diperbarui.",
                    });
                    setIsPopupOpen(true);
                    await fetchProfile();
                    return true;
                }
            } else if (fieldName === "kartuKeluarga") {
                const response = await profileService.uploadKk(file);
                if (response.success && response.data) {
                    setPopupConfig({
                        variant: "success",
                        title: "KK Berhasil Diupload",
                        message: "File Kartu Keluarga Anda telah berhasil diperbarui.",
                    });
                    setIsPopupOpen(true);
                    await fetchProfile();
                    return true;
                }
            } else {
                setPopupConfig({
                    variant: "warning",
                    title: "Fitur Belum Tersedia",
                    message: `Upload ${fieldName === "bukuNikah" ? "Buku Nikah" : fieldName} belum tersedia saat ini.`,
                });
                setIsPopupOpen(true);
                return false;
            }
            return false;
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setPopupConfig({
                variant: "error",
                title: "Gagal Upload Dokumen",
                message: apiError.message || "Terjadi kesalahan saat mengupload dokumen.",
            });
            setIsPopupOpen(true);
            console.error("Error uploading document:", err);
            return false;
        } finally {
            setIsDocUploading(false);
        }
    };

    const submitChangeRequest = async () => {
        if (!noteText.trim()) return;

        try {
            setIsSubmitting(true);
            const payload: UpdateProfileRequest = {
                ...pendingChanges,
                note: noteText,
            };

            const response = await profileService.updateProfile(payload);

            if (response.success) {
                setIsNoteModalOpen(false);
                setPopupConfig({
                    variant: "success",
                    title: "Perubahan Berhasil Diajukan",
                    message: "Pengajuan perubahan data anda telah dikirim dan sedang menunggu persetujuan Admin/HRD.",
                });
                setIsPopupOpen(true);
                fetchProfile();
            }
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setPopupConfig({
                variant: "error",
                title: "Gagal Mengajukan Perubahan",
                message: apiError.message || "Terjadi kesalahan saat mengajukan perubahan.",
            });
            setIsPopupOpen(true);
            console.error("Error submitting profile change:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <>
                <Topbar title="Profil Pegawai" />
                <MainHeaderSection title="Profil Saya" subtitle="Kelola Informasi Profil dan Data Diri Anda" />
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner} />
                    <p className={styles.loadingText}>Memuat data profil...</p>
                </div>
            </>
        );
    }

    if (error || !profileData) {
        return (
            <>
                <Topbar title="Profil Pegawai" />
                <MainHeaderSection title="Profil Saya" subtitle="Kelola Informasi Profil dan Data Diri Anda" />
                <div className={styles.errorContainer}>
                    <p className={styles.errorText}>{error || "Data profil tidak tersedia."}</p>
                </div>
            </>
        );
    }

    const statusVariantMap: Record<string, "success" | "warning" | "danger" | "neutral"> = {
        aktif: "success",
        nonaktif: "danger",
        cuti: "warning",
    };

    return (
        <>
            <Topbar title="Profil Pegawai" />

            <MainHeaderSection title="Profil Saya" subtitle="Kelola Informasi Profil dan Data Diri Anda" />

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            <div className={styles.profilLayout}>
                <div className={styles.profilContentLeft}>
                    <CardProfile
                        icon={
                            photoUrl
                                ? undefined
                                : <Icon icon={User} variant="primary" rounded="full" sizeBox="xl" sizeIcon="xl" />
                        }
                        img={
                            photoUrl
                                ? <img src={photoUrl} alt={profileData.namaLengkap} className={styles.profilePhoto} />
                                : undefined
                        }
                        nama={profileData.namaLengkap}
                        nip={profileData.nip}
                        profesi={profileData.jabatan}
                        email={profileData.email}
                        phone={profileData.noTelepon}
                        location={profileData.unitKerja}
                        statusPegawai={statusPegawai ? (statusPegawai.charAt(0).toUpperCase() + statusPegawai.slice(1)) : "Aktif"}
                        statusVariant={statusVariantMap[(statusPegawai || "aktif").toLowerCase()] || "neutral"}
                        onPhotoClick={handlePhotoClick}
                    />

                    <ChangeRequestCard requests={myChangeRequests} />
                </div>


                <FormProfile
                    initialData={profileData}
                    onSubmit={handleSubmitChange}
                    onDocumentUpload={handleDocumentUpload}
                    isDocUploading={isDocUploading}
                />
            </div>

            {isUploading && (
                <div className={styles.uploadOverlay}>
                    <div className={styles.spinner} />
                    <p className={styles.loadingText}>Mengupload foto...</p>
                </div>
            )}

            <Modal
                isOpen={isPhotoViewerOpen}
                onClose={() => setIsPhotoViewerOpen(false)}
                title="Foto Profil"
            >
                <PhotoPreview
                    imgSrc={photoUrl}
                    fallbackIcon={<Icon icon={User} variant="primary" rounded="full" sizeBox="xl" sizeIcon="xl" />}
                    onUploadClick={handleUploadClick}
                    isUploading={isUploading}
                />
            </Modal>

            <Modal
                isOpen={isNoteModalOpen}
                onClose={() => setIsNoteModalOpen(false)}
                title="Catatan Pengajuan Perubahan"
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                        Silakan berikan catatan atau alasan untuk perubahan data profil ini.
                        Catatan ini akan dibaca oleh Admin/HRD.
                    </p>
                    <Textarea
                        id="noteText"
                        name="noteText"
                        label="Catatan"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={4}
                        placeholder="Masukkan alasan atau referensi dokumen terkait perubahan..."
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
                        <Button
                            label="Batal"
                            variant="light"
                            onClick={() => setIsNoteModalOpen(false)}
                            disabled={isSubmitting}
                        />
                        <Button
                            label={isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
                            variant="primary"
                            onClick={submitChangeRequest}
                            disabled={isSubmitting || !noteText.trim()}
                        />
                    </div>
                </div>
            </Modal>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                variant={popupConfig.variant}
                title={popupConfig.title}
                message={popupConfig.message}
            />
        </>
    )
}

export default Profil