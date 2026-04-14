import { useState } from "react";
import { Send, X, Edit } from "lucide-react";
import styles from "./FormProfile.module.css";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import Textarea from "../../atoms/Textarea";
import Button from "../../atoms/Button";
import CardHeader from "../../molecules/CardHeader";

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
    jabatan: string;
    unitKerja: string;
    alamat: string;
}

interface FormProfileProps {
    initialData: propsType;
    onSubmit?: (data: propsType) => void;
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
    { value: "S1", label: "S1" },
    { value: "S2", label: "S2" },
    { value: "S3", label: "S3" },
];

const FormProfile = ({ initialData, onSubmit }: FormProfileProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<propsType>(initialData);
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
        setFormData(initialData);
        setIsEditing(false);
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(formData);
        }
        setIsEditing(false);
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <CardHeader title="Data Profil" />
                <div className={styles.cardActions}>
                    {isEditing ? (
                        <>
                            <Button
                                label="Ajukan Perubahan"
                                icon={<Send size={16} />}
                                variant="primary"
                                onClick={handleSubmit}
                            />
                            <Button
                                label="Batal"
                                icon={<X size={16} />}
                                variant="light"
                                onClick={handleCancel}
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
            </div>

            <div className={styles.formGrid}>
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
                    value={formData.nik}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />

                <Input
                    bgColor="#E6F4EE"   
                    label="NIP (jika ada)"
                    name="nip"
                    id="nip"
                    value={formData.nip}
                    onChange={handleInputChange}
                    disabled={true}
                />

                <Input
                    bgColor="#E6F4EE"   
                    label="No. Telepon"
                    name="noTelepon"
                    id="noTelepon"
                    type="tel"
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
                    bgColor="#E6F4EE"
                    label="Pendidikan Terakhir"
                    name="pendidikanTerakhir"
                    id="pendidikanTerakhir"
                    options={pendidikanOptions}
                    value={formData.pendidikanTerakhir}
                    onChange={handleSelectChange}
                    disabled={!isEditing}
                />

                <Input
                    bgColor="#E6F4EE"
                    label="Jabatan"
                    name="jabatan"
                    id="jabatan"
                    value={formData.jabatan}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />

                <Input
                    bgColor="#E6F4EE"
                    label="Unit Kerja"
                    name="unitKerja"
                    id="unitKerja"
                    value={formData.unitKerja}
                    onChange={handleInputChange}
                    disabled={!isEditing}
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
            </div>
        </div>
    );
};

export default FormProfile;
