import { useState } from "react";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import Textarea from "../../atoms/Textarea";
import styles from "./FormLaporanDiklat.module.css";
import type { CardDiklatData } from "../CardDiklat/CardDiklat";
import { parseLocalDateToISO } from "../../../../utils/dateUtils";
import { useMasterData } from "../../../../hooks/useMasterData";

interface FormLaporanDiklatProps {
    initialData?: CardDiklatData | null;
    isEdit?: boolean;
    isMaster?: boolean;
    onCancel: () => void;
    onSubmit?: (formData: FormData) => void;
    isLoading?: boolean;
}

const KATEGORI_OPTIONS = [
    { value: "internal", label: "Internal" },
    { value: "external", label: "External" },
];

const FormLaporanDiklat = ({ initialData, onCancel, onSubmit, isEdit, isMaster = false, isLoading = false }: FormLaporanDiklatProps) => {
    const { options: jenisDiklatOptions } = useMasterData("kategoriDiklat", "Pilih Jenis Diklat", []);
    const { options: kategoriPegawaiOptions } = useMasterData("tipeDiklat", "Pilih Kategori Pegawai", []);
    const { options: jenisBiayaOptions } = useMasterData("jenisBiaya", "Pilih Jenis Biaya", []);

    const [namaDiklat, setNamaDiklat] = useState(initialData?.namaDiklat ?? "");
    const [kategori, setKategori] = useState(initialData?.jenisDiklat ?? "");
    const [jenisDiklat, setJenisDiklat] = useState(initialData?.kategori ?? "");
    const [tanggalMulai, setTanggalMulai] = useState(
        initialData?.tanggalMulai ? parseLocalDateToISO(initialData.tanggalMulai) : ""
    );
    const [tanggalSelesai, setTanggalSelesai] = useState(
        initialData?.tanggalSelesai ? parseLocalDateToISO(initialData.tanggalSelesai) : ""
    );
    const [tempat, setTempat] = useState(initialData?.tempat ?? "");
    const [jamPelajaran, setJamPelajaran] = useState(initialData?.jamPelajaran ?? "");
    const [waktu, setWaktu] = useState(() => {
        if (!initialData?.waktu) return "";
        return initialData.waktu.substring(0, 5); // Takes "HH:MM" from "HH:MM:SS"
    });
    const [jenisBiaya, setJenisBiaya] = useState(initialData?.jenisBiaya ?? "");
    const [totalBiaya, setTotalBiaya] = useState(initialData?.totalBiaya ?? "");
    const [penyelenggara, setPenyelenggara] = useState(initialData?.penyelenggara ?? "");
    const [jenisPelaksana, setJenisPelaksana] = useState(initialData?.jenisPelaksana ?? "");
    const [catatan, setCatatan] = useState(initialData?.catatan ?? "");
    const [noSertif, setNoSertif] = useState(initialData?.noSertifikat ?? "");
    const [sertifikatFile, setSertifikatFile] = useState<File | null>(null);

    const isInternal = jenisPelaksana === "internal";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!onSubmit) return;

        const formData = new FormData();
        formData.append("nama_kegiatan", namaDiklat);
        formData.append("kategori", jenisDiklat);
        formData.append("jenis_diklat", kategori);
        formData.append("penyelenggara", penyelenggara);
        formData.append("lokasi", tempat);
        formData.append("tanggal_mulai", tanggalMulai);
        formData.append("tanggal_selesai", tanggalSelesai);

        let formattedWaktu = waktu;
        if (waktu && waktu.length === 5) {
            formattedWaktu = `${waktu}:00`;
        }
        formData.append("waktu", formattedWaktu);

        formData.append("jp", jamPelajaran);
        formData.append("jenis_pelaksana", jenisPelaksana);
        formData.append("catatan", catatan);
        if (!initialData) {
            formData.append("no_sertif", noSertif);
            if (sertifikatFile) {
                formData.append("upload_sertif", sertifikatFile);
            }
        }

        if (isInternal) {
            formData.append("jenis_biaya", jenisBiaya);
            formData.append("total_biaya", totalBiaya.replace(/[^0-9]/g, ""));
        }


        onSubmit(formData);
    };


    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="nama-diklat"
                        name="nama-diklat"
                        label="Nama Diklat"
                        value={namaDiklat}
                        onChange={(e) => setNamaDiklat(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Select
                        id="kategori-pegawai"
                        name="kategori-pegawai"
                        label="Kategori Pegawai"
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                        required
                        searchable
                        options={kategoriPegawaiOptions}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="penyelenggara"
                        name="penyelenggara"
                        label="Penyelenggara"
                        value={penyelenggara}
                        onChange={(e) => setPenyelenggara(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Select
                        id="jenis-diklat"
                        name="jenis-diklat"
                        label="Jenis Diklat"
                        value={jenisDiklat}
                        onChange={(e) => setJenisDiklat(e.target.value)}
                        required
                        searchable
                        options={jenisDiklatOptions}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="jam-pelajaran"
                        name="jam-pelajaran"
                        label="Jumlah Jam Pelajaran"
                        value={jamPelajaran}
                        onChange={(e) => setJamPelajaran(e.target.value)}
                        onlyNumbers
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="lokasi"
                        name="lokasi"
                        label="Lokasi"
                        value={tempat}
                        onChange={(e) => setTempat(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="tanggal-mulai"
                        name="tanggal-mulai"
                        type="date"
                        label="Tanggal Mulai"
                        value={tanggalMulai}
                        onChange={(e) => setTanggalMulai(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="tanggal-selesai"
                        name="tanggal-selesai"
                        type="date"
                        label="Tanggal Selesai"
                        value={tanggalSelesai}
                        onChange={(e) => setTanggalSelesai(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="waktu"
                        name="waktu"
                        label="Waktu"
                        type="time"
                        value={waktu}
                        onChange={(e) => setWaktu(e.target.value)}
                        required
                    />
                </div>
                {isInternal && (
                    <div className={styles.col}>
                        <Select
                            id="jenis-biaya"
                            name="jenis-biaya"
                            label="Jenis Biaya"
                            value={jenisBiaya}
                            onChange={(e) => setJenisBiaya(e.target.value)}
                            required
                            searchable
                            options={jenisBiayaOptions}
                        />
                    </div>
                )}
            </div>

            {isInternal && (
                <Input
                    id="total-biaya"
                    name="total-biaya"
                    label="Total Biaya"
                    value={totalBiaya}
                    onChange={(e) => setTotalBiaya(e.target.value)}
                    type="text"
                    isRupiah
                    required
                />
            )}

            <div className={styles.row}>
                <div className={styles.col}>
                    <Select
                        id="jenis-pelaksana"
                        name="jenis-pelaksana"
                        label="Jenis Pelaksana"
                        disabled={!!initialData}
                        value={jenisPelaksana}
                        onChange={(e) => setJenisPelaksana(e.target.value)}
                        required
                        searchable
                        options={KATEGORI_OPTIONS}
                    />
                </div>
            </div>

            {!initialData && (
                <div className={styles.row}>
                    <div className={styles.col}>
                        <Input
                            id="no-sertif"
                            name="no_sertif"
                            label="Nomor Sertifikat"
                            value={noSertif}
                            onChange={(e) => setNoSertif(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.col}>
                        <Input
                            id="upload-sertif"
                            name="upload_sertif"
                            type="file"
                            label="Upload Sertifikat"
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setSertifikatFile(file);
                            }}
                            required
                        />
                    </div>
                </div>
            )}

            <Textarea
                id="catatan"
                name="catatan"
                label="Catatan"
                disabled={!isEdit}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
            />

            {(isEdit || isMaster) && (
                <div className={styles.actions}>
                    <Button
                        type="submit"
                        label={isLoading ? "Menyimpan..." : (initialData ? "Update" : "Simpan")}
                        variant="primary"
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        label="Batal"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    />
                </div>
            )}
        </form>
    )
}

export default FormLaporanDiklat;