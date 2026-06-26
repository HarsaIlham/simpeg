import { useState, useMemo, useRef, useEffect } from "react";
import { Send, X, Edit, UserRound, Briefcase } from "lucide-react";
import styles from "./FormProfile.module.css";
import Input from "../../../../ui/atoms/Input";
import Select from "../../../../ui/atoms/Select";
import Textarea from "../../../../ui/atoms/Textarea";
import Button from "../../../../ui/atoms/Button";
import CardHeader from "../../../../ui/molecules/CardHeader";
import DocumentField from "../../../../ui/molecules/DocumentField";
import PdfViewerModal from "../../../../ui/molecules/PdfViewerModal";
import { hitungMasaKerja } from "../../../../../utils/dateUtils";
import { useMasterData } from "../../../../../hooks/useMasterData";
import { getProxiedFileUrl } from "../../../../../utils/api";

export interface propsType {
    namaLengkap: string;
    nip: string;
    nik: string;
    email: string;
    noTelepon: string;
    tanggalLahir: string;
    jenisKelamin: string;
    agama: string;
    statusPernikahan: string;
    pendidikanTerakhir: string;
    ktp: string | null;
    bukuNikah: string | null;
    kartuKeluarga: string | null;
    jabatan: string;
    pangkat: string;
    profesi: string;
    unitKerja: string;
    golonganRuang: string;
    jenisPegawai: string;
    alamat: string;
    tanggalMasuk: string;
    tmtCpns: string;
    tmtPns: string;
    tmtPangkatTerakhir: string;
}

interface FormProfileProps {
    initialData: propsType;
    onSubmit?: (data: propsType) => void;
    onDocumentUpload?: (fieldName: string, file: File) => Promise<boolean>;
    isDocUploading?: boolean;
    readOnly?: boolean;
    isAdd?: boolean;
}



const jenisKelaminOptions = [
    { value: "Laki-laki", label: "Laki-laki" },
    { value: "Perempuan", label: "Perempuan" },
];

const agamaOptions = [
    { value: "Islam", label: "Islam" },
    { value: "Kristen", label: "Kristen" },
    { value: "Katolik", label: "Katolik" },
    { value: "Hindu", label: "Hindu" },
    { value: "Buddha", label: "Buddha" },
    { value: "Konghucu", label: "Konghucu" },
];

const statusPernikahanOptions = [
    { value: "Belum Menikah", label: "Belum Menikah" },
    { value: "Menikah", label: "Menikah" },
    { value: "Cerai Hidup", label: "Cerai Hidup" },
    { value: "Cerai Mati", label: "Cerai Mati" },
];

const pendidikanOptions = [
    { value: "SD", label: "SD" },
    { value: "SMP", label: "SMP" },
    { value: "SMA/SMK", label: "SMA/SMK" },
    { value: "D3", label: "D3" },
    { value: "S1/D4", label: "S1/D4" },
    { value: "S2", label: "S2" },
    { value: "S3", label: "S3" },
];

const FormProfile = ({ initialData, onSubmit, onDocumentUpload, isDocUploading = false, readOnly = false, isAdd = false }: FormProfileProps) => {
    const { options: golonganRuangOptions, items: golonganRuangItems } = useMasterData("golonganRuang", "Pilih Golongan Ruang", [
        { value: "Golongan I", label: "Golongan I" },
        { value: "Golongan II", label: "Golongan II" },
        { value: "Golongan III", label: "Golongan III" },
        { value: "Golongan IV", label: "Golongan IV" },
    ], true);
    const { options: jenisPegawaiOptions, items: jenisPegawaiItems } = useMasterData("jenisPegawai", "Pilih Jenis Pegawai", [], true);
    const { options: profesiOptions, items: profesiItems } = useMasterData("profesi", "Pilih Profesi", [], true);
    const { options: unitKerjaOptions, items: unitKerjaItems } = useMasterData("unitKerja", "Pilih Unit Kerja", [], true);

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<propsType>(initialData);
    const [previewDoc, setPreviewDoc] = useState<{ label: string; url: string; fieldName: string } | null>(null);
    const [uploadDoc, setUploadDoc] = useState<{ label: string; fieldName: string } | null>(null);

    const docFileInputRef = useRef<HTMLInputElement>(null);
    const uploadTargetRef = useRef<{ label: string; fieldName: string } | null>(null);

    useEffect(() => {
        const mapToId = (val: string, itemsList: any[]) => {
            if (!val) return "";
            if (/^\d+$/.test(val)) return val;
            const found = itemsList.find(item => item.nama.toLowerCase() === val.toLowerCase());
            return found ? String(found.id) : val;
        };

        setFormData({
            ...initialData,
            jenisPegawai: mapToId(initialData.jenisPegawai, jenisPegawaiItems),
            profesi: mapToId(initialData.profesi, profesiItems),
            golonganRuang: mapToId(initialData.golonganRuang, golonganRuangItems),
            unitKerja: mapToId(initialData.unitKerja, unitKerjaItems),
        });
    }, [initialData, jenisPegawaiItems, profesiItems, golonganRuangItems, unitKerjaItems]);

    const masaKerja = useMemo(() => hitungMasaKerja(formData.tanggalMasuk), [formData.tanggalMasuk]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        const mapToId = (val: string, itemsList: any[]) => {
            if (!val) return "";
            if (/^\d+$/.test(val)) return val;
            const found = itemsList.find(item => item.nama.toLowerCase() === val.toLowerCase());
            return found ? String(found.id) : val;
        };

        setFormData({
            ...initialData,
            jenisPegawai: mapToId(initialData.jenisPegawai, jenisPegawaiItems),
            profesi: mapToId(initialData.profesi, profesiItems),
            golonganRuang: mapToId(initialData.golonganRuang, golonganRuangItems),
            unitKerja: mapToId(initialData.unitKerja, unitKerjaItems),
        });
        setIsEditing(false);
    };

    const handleSubmit = async () => {
        if (onSubmit) {
            setIsSubmitting(true);
            try {
                await onSubmit(formData);
                setIsEditing(false);
            } catch (err) {
                console.error("Gagal menyimpan profil:", err);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setIsEditing(false);
        }
    };

    const handleDocFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const target = uploadTargetRef.current || uploadDoc;
        if (!file || !target) return;
        e.target.value = "";

        if (onDocumentUpload) {
            const success = await onDocumentUpload(target.fieldName, file);
            if (success) {
                setUploadDoc(null);
                uploadTargetRef.current = null;
            }
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <CardHeader title="Data Profil" />
                {!readOnly && (
                    <div className={styles.cardActions}>
                        {isEditing ? (
                            <>
                                <Button
                                    label={isSubmitting ? "Menyimpan..." : (isAdd ? "Simpan" : "Ajukan Perubahan")}
                                    icon={<Send size={16} />}
                                    variant="primary"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                />
                                <Button
                                    label="Batal"
                                    icon={<X size={16} />}
                                    variant="light"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                />
                            </>
                        ) : (
                            <Button
                                label="Edit Profil"
                                icon={<Edit size={24} />}
                                variant="primary"
                                onClick={handleEdit}
                            />
                        )}
                    </div>
                )}
            </div>

            <div className={styles.formGrid}>

                <div className={styles.sectionDivider}>
                    <span className={styles.sectionLabel}>
                        <span className={styles.sectionIcon}><UserRound size={14} /></span>
                        Data Pribadi
                    </span>
                </div>

                <Input
                    bgColor="#E6F4EE"
                    label="Nama Lengkap"
                    name="namaLengkap"
                    id="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
                <Input
                    bgColor="#E6F4EE"
                    label="Email"
                    name="email"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />

                <Input
                    bgColor="#E6F4EE"
                    label="NIK"
                    name="nik"
                    id="nik"
                    type="text"
                    onlyNumbers={true}
                    value={formData.nik}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />

                <Input
                    bgColor={"#E6F4EE"}
                    label="NIP (jika ada)"
                    name="nip"
                    id="nip"
                    value={formData.nip}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />

                <Input
                    bgColor="#E6F4EE"
                    label="No. Telepon"
                    name="noTelepon"
                    id="noTelepon"
                    type="text"
                    onlyNumbers={true}
                    value={formData.noTelepon}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />

                <Input
                    bgColor="#E6F4EE"
                    label="Tanggal Lahir"
                    name="tanggalLahir"
                    id="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />

                <Select
                    bgColor="#E6F4EE"
                    label="Jenis Kelamin"
                    name="jenisKelamin"
                    id="jenisKelamin"
                    options={jenisKelaminOptions}
                    value={formData.jenisKelamin}
                    onChange={handleSelectChange}
                    disabled={!isEditing}
                />

                <Select
                    bgColor="#E6F4EE"
                    label="Agama"
                    name="agama"
                    id="agama"
                    options={agamaOptions}
                    value={formData.agama}
                    onChange={handleSelectChange}
                    disabled={!isEditing}
                />

                <Select
                    bgColor="#E6F4EE"
                    label="Status Pernikahan"
                    name="statusPernikahan"
                    id="statusPernikahan"
                    options={statusPernikahanOptions}
                    value={formData.statusPernikahan}
                    onChange={handleSelectChange}
                    disabled={!isEditing}
                />

                <Select
                    bgColor={isEditing ? undefined : "#E6F4EE"}
                    label="Pendidikan Terakhir"
                    name="pendidikanTerakhir"
                    id="pendidikanTerakhir"
                    options={pendidikanOptions}
                    value={formData.pendidikanTerakhir}
                    onChange={handleSelectChange}
                    disabled
                />

                <DocumentField
                    label="KTP"
                    name="ktp"
                    id="ktp"
                    fileUrl={formData.ktp}
                    onViewClick={() => {
                        if (formData.ktp) {
                            setPreviewDoc({ label: "KTP", url: formData.ktp, fieldName: "ktp" });
                        } else {
                            setUploadDoc({ label: "KTP", fieldName: "ktp" });
                        }
                    }}
                    bgColor="#E6F4EE"
                />

                {/* <DocumentField
                    label="Buku Nikah"
                    name="bukuNikah"
                    id="bukuNikah"
                    fileUrl={formData.bukuNikah}
                    onViewClick={() => setPreviewDoc({ label: "Buku Nikah", url: formData.bukuNikah || "", fieldName: "bukuNikah" })}
                    bgColor="#E6F4EE"
                /> */}

                <DocumentField
                    label="Kartu Keluarga"
                    name="kartuKeluarga"
                    id="kartuKeluarga"
                    fileUrl={formData.kartuKeluarga}
                    onViewClick={() => {
                        if (formData.kartuKeluarga) {
                            setPreviewDoc({ label: "Kartu Keluarga", url: formData.kartuKeluarga, fieldName: "kartuKeluarga" });
                        } else {
                            setUploadDoc({ label: "Kartu Keluarga", fieldName: "kartuKeluarga" });
                        }
                    }}
                    bgColor="#E6F4EE"
                />

                <div className={styles.fullWidth}>
                    <Textarea
                        bgColor="#E6F4EE"
                        label="Alamat"
                        name="alamat"
                        id="alamat"
                        value={formData.alamat}
                        onChange={handleTextareaChange}
                        disabled={!isEditing}
                        rows={3}
                    />
                </div>

                <div className={styles.sectionDivider}>
                    <span className={styles.sectionLabel}>
                        <span className={styles.sectionIcon}><Briefcase size={14} /></span>
                        Data Kepegawaian
                    </span>
                </div>

                <Input
                    bgColor={isEditing ? undefined : "#E6F4EE"}
                    label="Jabatan"
                    name="jabatan"
                    id="jabatan"
                    value={formData.jabatan}
                    onChange={handleInputChange}
                    className={!isEditing ? styles.disabledInput : ""}
                    disabled
                />

                <Select
                    bgColor="#E6F4EE"
                    label="Profesi"
                    name="profesi"
                    id="profesi"
                    options={profesiOptions}
                    value={formData.profesi}
                    onChange={handleSelectChange}
                    disabled={!isEditing}
                />

                <Input
                    bgColor={isEditing ? undefined : "#E6F4EE"}
                    label="Pangkat Sekarang"
                    name="pangkat"
                    id="pangkat"
                    value={formData.pangkat}
                    onChange={handleInputChange}
                    disabled
                />

                <Select
                    bgColor="#E6F4EE"
                    label="Golongan Ruang"
                    name="golonganRuang"
                    id="golonganRuang"
                    options={golonganRuangOptions}
                    value={formData.golonganRuang}
                    onChange={handleSelectChange}
                    disabled={!isEditing}
                />

                <Select
                    bgColor="#E6F4EE"
                    label="Unit Kerja"
                    name="unitKerja"
                    id="unitKerja"
                    options={unitKerjaOptions}
                    value={formData.unitKerja}
                    onChange={handleSelectChange}
                    disabled={!isEditing}
                />

                <Select
                    bgColor="#E6F4EE"
                    label="Jenis Pegawai"
                    name="jenisPegawai"
                    id="jenisPegawai"
                    options={jenisPegawaiOptions}
                    value={formData.jenisPegawai}
                    onChange={handleSelectChange}
                    disabled={!isEditing}
                />

                <Input
                    bgColor="#E6F4EE"
                    label="Tanggal Masuk"
                    name="tanggalMasuk"
                    id="tanggalMasuk"
                    value={formData.tanggalMasuk}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    type="date"
                />

                <div className={styles.computedField}>
                    <Input
                        bgColor={isEditing ? undefined : "#E6F4EE"}
                        label="Masa Kerja"
                        name="masaKerja"
                        id="masaKerja"
                        value={masaKerja}
                        disabled
                    />
                </div>

                <Input
                    bgColor="#E6F4EE"
                    label="TMT CPNS"
                    name="tmtCpns"
                    id="tmtCpns"
                    value={formData.tmtCpns}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    type="date"
                />

                <Input
                    bgColor="#E6F4EE"
                    label="TMT PNS"
                    name="tmtPns"
                    id="tmtPns"
                    value={formData.tmtPns}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    type="date"
                />

                <Input
                    bgColor={isEditing ? undefined : "#E6F4EE"}
                    label="TMT Pangkat Terakhir"
                    name="tmtPangkatTerakhir"
                    id="tmtPangkatTerakhir"
                    type="date"
                    value={formData.tmtPangkatTerakhir}
                    onChange={handleInputChange}
                    disabled
                />
            </div>

            <input
                ref={docFileInputRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleDocFileSelected}
            />

            <PdfViewerModal
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                fileUrl={previewDoc ? getProxiedFileUrl(previewDoc.url) : null}
                title={`Lihat ${previewDoc?.label || "Dokumen"}`}
                fileName={previewDoc?.label || "Dokumen"}
                extraActions={
                    onDocumentUpload ? (
                        <Button
                            label={isDocUploading ? "Mengupload..." : `Update ${previewDoc?.label || "Dokumen"}`}
                            variant="primary"
                            onClick={() => {
                                if (previewDoc) {
                                    uploadTargetRef.current = { label: previewDoc.label, fieldName: previewDoc.fieldName };
                                    setPreviewDoc(null);
                                    setTimeout(() => {
                                        docFileInputRef.current?.click();
                                    }, 0);
                                }
                            }}
                            disabled={isDocUploading}
                        />
                    ) : undefined
                }
            />
        </div>
    );
};

export default FormProfile;
