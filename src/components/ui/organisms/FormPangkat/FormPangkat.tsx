import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import styles from "./FormPangkat.module.css";

interface propsType {
    onCancel: () => void;
    onSubmit?: (e: React.FormEvent) => void;
}

const FormPangkat = ({ onSubmit, onCancel }: propsType) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
        console.log("Form Tersubmit!");
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <Input
                id="nama-pangkat"
                name="nama-pangkat"
                label="Nama Pangkat"
                type="text"
                required
            />
            <Input
                id="tmt-pangkat"
                name="tmt-pangkat"
                label="TMT (Terhitung Mulai Tanggal)"
                type="date"
                required
            />
            <Input
                id="no-sk"
                name="no-sk"
                label="No. SK"
                type="text"
                required
            />
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

export default FormPangkat