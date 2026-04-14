import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import styles from "./FormPendidikan.module.css";

interface FormPendidikanProps {
    onCancel: () => void;
    onSubmit?: (e: React.FormEvent) => void;
}

const tingkatPendidikanOptions = [
    { value: "", label: "Pilih Tingkat Pendidikan" },
    { value: "sd", label: "SD" },
    { value: "smp", label: "SMP" },
    { value: "sma", label: "SMA" },
    { value: "s1", label: "S1" },
    { value: "s2", label: "S2" },
    { value: "s3", label: "S3" },
];


const FormPendidikan = ({ onCancel, onSubmit }: FormPendidikanProps) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
        console.log("Form Tersubmit!");
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Select
                        id="tingkat-pendidikan"
                        name="tingkat-pendidikan"
                        label="Tingkat Pendidikan"
                        options={tingkatPendidikanOptions}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="jurusan"
                        name="jurusan"
                        label="Jurusan"
                        required
                    />
                </div>
            </div>

            <Input
                id="institusi"
                name="institusi"
                label="Institusi"
                required
            />
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="tanggal-mulai"
                        name="tanggal-mulai"
                        label="Tanggal Mulai"
                        type="date"
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="tanggal-selesai"
                        name="tanggal-selesai"
                        label="Tanggal Selesai"
                        type="date"
                        required
                    />
                </div>
            </div>
            <Input
                id="dokumen"
                name="dokumen"
                type="file"
                label="Upload Dokumen"
            />

            <div className={styles.actions}>
                <Button
                    type="submit"
                    label="Simpan"
                    variant="primary"
                />
                <Button
                    type="button"
                    label="Batal"
                    variant="secondary"
                    onClick={onCancel}
                />
            </div>
        </form>
    )
}

export default FormPendidikan