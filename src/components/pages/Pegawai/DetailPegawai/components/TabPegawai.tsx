import { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import CardProfile from "../../../Profil/components/CardProfile";
import FormProfile from "../../../Profil/components/FormProfile";
import type { propsType } from "../../../Profil/components/FormProfile/FormProfile";
import Icon from "../../../../ui/atoms/Icon";
import Modal from "../../../../ui/organisms/Modal";
import PhotoPreview from "../../../../ui/molecules/PhotoPreview";
import Popup from "../../../../ui/molecules/Popup";
import { hrdPegawaiService } from "../../../../../services/hrdPegawaiService";
import { masterDataService } from "../../../../../services/masterDataService";
import styles from "../DetailPegawai.module.css";

interface TabPegawaiProps {
    profileData: propsType;
    photoUrl: string | null;
    statusPegawai: string;
    pegawaiMeta: {
        nama: string;
        nip: string;
        jabatan: string;
        email: string;
        noTelp: string;
        unitKerja: string;
    };
    isAdmin: boolean;
    pegawaiId: number;
    onRefresh?: () => void;
}

const statusVariantMap: Record<string, "success" | "warning" | "danger" | "neutral"> = {
    aktif: "success",
    nonaktif: "danger",
    cuti: "warning",
};

const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5MB

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

const TabPegawai = ({
    profileData,
    photoUrl,
    statusPegawai,
    pegawaiMeta,
    isAdmin,
    pegawaiId,
    onRefresh,
}: TabPegawaiProps) => {
    const queryClient = useQueryClient();
    const [jenisPegawaiList, setJenisPegawaiList] = useState<{ id: number; nama: string }[]>([]);
    const [profesiList, setProfesiList] = useState<{ id: number; nama: string }[]>([]);
    const [golonganRuangList, setGolonganRuangList] = useState<{ id: number; nama: string }[]>([]);

    const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [isDocUploading, setIsDocUploading] = useState(false);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupConfig, setPopupConfig] = useState({
        variant: "success" as "success" | "error" | "warning",
        title: "",
        message: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchMaster = async () => {
            try {
                const jp = await masterDataService.getJenisPegawai();
                const pr = await masterDataService.getProfesi();
                const gr = await masterDataService.getGolonganRuang();
                if (Array.isArray(jp)) setJenisPegawaiList(jp);
                if (Array.isArray(pr)) setProfesiList(pr);
                if (Array.isArray(gr)) setGolonganRuangList(gr);
            } catch (err) {
                console.error("Gagal memuat data master untuk mapping:", err);
            }
        };
        fetchMaster();
    }, []);

    const getJenisPegawaiId = (name: string) => {
        const found = jenisPegawaiList.find(
            (item) => item.nama.toLowerCase() === name.toLowerCase()
        );
        return found ? found.id : null;
    };

    const getProfesiId = (name: string) => {
        const found = profesiList.find(
            (item) => item.nama.toLowerCase() === name.toLowerCase()
        );
        return found ? found.id : null;
    };

    const getGolonganRuangId = (name: string) => {
        const found = golonganRuangList.find(
            (item) => item.nama.toLowerCase() === name.toLowerCase()
        );
        return found ? found.id : null;
    };

    const handlePhotoClick = () => {
        if (isAdmin) {
            setIsPhotoViewerOpen(true);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = "";

        if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
            setPopupConfig({
                variant: "error",
                title: "Format File Tidak Didukung",
                message: "Gunakan format JPG, JPEG, PNG, atau WebP.",
            });
            setIsPopupOpen(true);
            return;
        }

        if (file.size > MAX_PHOTO_SIZE) {
            setPopupConfig({
                variant: "error",
                title: "Ukuran File Terlalu Besar",
                message: "Ukuran file maksimal 2MB.",
            });
            setIsPopupOpen(true);
            return;
        }

        try {
            setIsUploadingPhoto(true);
            const formData = new FormData();
            formData.append("foto_profil", file);

            const response = await hrdPegawaiService.updatePribadi(pegawaiId, formData);
            if (response.success) {
                setIsPhotoViewerOpen(false);
                setPopupConfig({
                    variant: "success",
                    title: "Foto Berhasil Diperbarui",
                    message: "Foto profil pegawai berhasil diperbarui.",
                });
                setIsPopupOpen(true);
                queryClient.invalidateQueries({ queryKey: ["pegawai"] });
                queryClient.invalidateQueries({ queryKey: ["pegawaiAdmin"] });
                onRefresh?.();
            }
        } catch (err: any) {
            setPopupConfig({
                variant: "error",
                title: "Gagal Mengunggah Foto",
                message: err?.message || "Terjadi kesalahan saat mengunggah foto profil.",
            });
            setIsPopupOpen(true);
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleSubmitProfile = async (newData: propsType) => {
        const initialJenisPegawaiId = String(getJenisPegawaiId(profileData.jenisPegawai) || "");
        const initialProfesiId = String(getProfesiId(profileData.profesi) || "");
        const initialGolonganRuangId = String(getGolonganRuangId(profileData.golonganRuang) || "");

        const isCoreChanged =
            profileData.namaLengkap !== newData.namaLengkap ||
            profileData.nik !== newData.nik ||
            profileData.nip !== newData.nip ||
            initialJenisPegawaiId !== String(newData.jenisPegawai || "") ||
            initialProfesiId !== String(newData.profesi || "") ||
            initialGolonganRuangId !== String(newData.golonganRuang || "") ||
            profileData.tanggalMasuk !== newData.tanggalMasuk ||
            profileData.tmtCpns !== newData.tmtCpns ||
            profileData.tmtPns !== newData.tmtPns;

        const isPribadiChanged =
            profileData.jenisKelamin !== newData.jenisKelamin ||
            profileData.tanggalLahir !== newData.tanggalLahir ||
            profileData.agama !== newData.agama ||
            profileData.statusPernikahan !== newData.statusPernikahan ||
            profileData.alamat !== newData.alamat ||
            profileData.noTelepon !== newData.noTelepon ||
            profileData.pendidikanTerakhir !== newData.pendidikanTerakhir;

        if (!isCoreChanged && !isPribadiChanged) {
            setPopupConfig({
                variant: "warning",
                title: "Tidak Ada Perubahan",
                message: "Anda tidak melakukan perubahan data apa pun.",
            });
            setIsPopupOpen(true);
            return;
        }

        try {
            let successCore = true;
            let successPribadi = true;

            // 1. Update Core Data (Data Inti)
            if (isCoreChanged) {
                const corePayload: any = {};
                if (profileData.namaLengkap !== newData.namaLengkap) corePayload.nama = newData.namaLengkap;
                if (profileData.nik !== newData.nik) corePayload.nik = newData.nik;
                if (profileData.nip !== newData.nip) corePayload.nip = newData.nip || null;
                if (initialJenisPegawaiId !== String(newData.jenisPegawai || "")) {
                    corePayload.jenis_pegawai_id = newData.jenisPegawai ? Number(newData.jenisPegawai) : null;
                }
                if (initialProfesiId !== String(newData.profesi || "")) {
                    corePayload.profesi_id = newData.profesi ? Number(newData.profesi) : null;
                }
                if (initialGolonganRuangId !== String(newData.golonganRuang || "")) {
                    corePayload.golongan_ruang_id = newData.golonganRuang ? Number(newData.golonganRuang) : null;
                }
                if (profileData.tanggalMasuk !== newData.tanggalMasuk) corePayload.tgl_masuk = newData.tanggalMasuk || null;
                if (profileData.tmtCpns !== newData.tmtCpns) corePayload.tmt_cpns = newData.tmtCpns || null;
                if (profileData.tmtPns !== newData.tmtPns) corePayload.tmt_pns = newData.tmtPns || null;

                const resCore = await hrdPegawaiService.updateInti(pegawaiId, corePayload);
                successCore = resCore.success;
            }

            // 2. Update Personal Data (Data Pribadi)
            if (isPribadiChanged) {
                const formData = new FormData();
                if (profileData.jenisKelamin !== newData.jenisKelamin) {
                    formData.append("jenis_kelamin", newData.jenisKelamin === "Laki-laki" ? "L" : "P");
                }
                if (profileData.tanggalLahir !== newData.tanggalLahir) {
                    formData.append("tanggal_lahir", newData.tanggalLahir || "");
                }
                if (profileData.agama !== newData.agama) {
                    formData.append("agama", newData.agama || "");
                }
                if (profileData.statusPernikahan !== newData.statusPernikahan) {
                    formData.append("status_perkawinan", unmapStatusKawin(newData.statusPernikahan));
                }
                if (profileData.alamat !== newData.alamat) {
                    formData.append("alamat", newData.alamat || "");
                }
                if (profileData.noTelepon !== newData.noTelepon) {
                    formData.append("no_telp", newData.noTelepon || "");
                }
                if (profileData.pendidikanTerakhir !== newData.pendidikanTerakhir) {
                    formData.append("pendidikan_terakhir", newData.pendidikanTerakhir || "");
                }

                const resPribadi = await hrdPegawaiService.updatePribadi(pegawaiId, formData);
                successPribadi = resPribadi.success;
            }

            if (successCore && successPribadi) {
                setPopupConfig({
                    variant: "success",
                    title: "Berhasil Memperbarui Data",
                    message: "Data profil pegawai berhasil disimpan.",
                });
                setIsPopupOpen(true);
                queryClient.invalidateQueries({ queryKey: ["pegawai"] });
                queryClient.invalidateQueries({ queryKey: ["pegawaiAdmin"] });
                onRefresh?.();
            }
        } catch (error: any) {
            setPopupConfig({
                variant: "error",
                title: "Gagal Memperbarui Profil",
                message: error?.message || "Terjadi kesalahan saat memperbarui data pegawai.",
            });
            setIsPopupOpen(true);
            throw error;
        }
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

        if (file.size > MAX_DOC_SIZE) {
            setPopupConfig({
                variant: "error",
                title: "Ukuran File Terlalu Besar",
                message: "Ukuran file maksimal 5MB.",
            });
            setIsPopupOpen(true);
            return false;
        }

        try {
            setIsDocUploading(true);
            const formData = new FormData();

            if (fieldName === "ktp") {
                formData.append("ktp_file", file);
            } else if (fieldName === "kartuKeluarga") {
                formData.append("kk_file", file);
            } else {
                setPopupConfig({
                    variant: "warning",
                    title: "Fitur Belum Didukung",
                    message: `Dokumen ${fieldName} belum didukung oleh API HRD saat ini.`,
                });
                setIsPopupOpen(true);
                return false;
            }

            const response = await hrdPegawaiService.updatePribadi(pegawaiId, formData);
            if (response.success) {
                setPopupConfig({
                    variant: "success",
                    title: "Dokumen Berhasil Diupload",
                    message: `Berkas ${fieldName === "ktp" ? "KTP" : "Kartu Keluarga"} pegawai berhasil diperbarui.`,
                });
                setIsPopupOpen(true);
                queryClient.invalidateQueries({ queryKey: ["pegawai"] });
                queryClient.invalidateQueries({ queryKey: ["pegawaiAdmin"] });
                onRefresh?.();
                return true;
            }
            return false;
        } catch (err: any) {
            setPopupConfig({
                variant: "error",
                title: "Gagal Mengunggah Dokumen",
                message: err?.message || "Terjadi kesalahan saat mengunggah berkas.",
            });
            setIsPopupOpen(true);
            return false;
        } finally {
            setIsDocUploading(false);
        }
    };

    return (
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
                            ? <img src={photoUrl} alt={pegawaiMeta.nama} className={styles.profilePhoto} />
                            : undefined
                    }
                    nama={pegawaiMeta.nama}
                    nip={pegawaiMeta.nip}
                    profesi={pegawaiMeta.jabatan}
                    email={pegawaiMeta.email}
                    phone={pegawaiMeta.noTelp}
                    location={pegawaiMeta.unitKerja}
                    statusPegawai={statusPegawai.charAt(0).toUpperCase() + statusPegawai.slice(1)}
                    statusVariant={statusVariantMap[statusPegawai.toLowerCase()] || "neutral"}
                    onPhotoClick={handlePhotoClick}
                />
            </div>

            <FormProfile
                initialData={profileData}
                readOnly={!isAdmin}
                isAdd={isAdmin}
                onSubmit={handleSubmitProfile}
                onDocumentUpload={handleDocumentUpload}
                isDocUploading={isDocUploading}
            />

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={handlePhotoFileChange}
            />

            <Modal
                isOpen={isPhotoViewerOpen}
                onClose={() => setIsPhotoViewerOpen(false)}
                title="Foto Profil Pegawai"
            >
                <PhotoPreview
                    imgSrc={photoUrl}
                    fallbackIcon={<Icon icon={User} variant="primary" rounded="full" sizeBox="xl" sizeIcon="xl" />}
                    onUploadClick={handleUploadClick}
                    isUploading={isUploadingPhoto}
                />
            </Modal>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                variant={popupConfig.variant}
                title={popupConfig.title}
                message={popupConfig.message}
            />
        </div>
    );
};

export default TabPegawai;
