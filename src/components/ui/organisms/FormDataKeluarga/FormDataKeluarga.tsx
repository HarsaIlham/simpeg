import { useEffect, useState } from "react";
import styles from "./FormDataKeluarga.module.css";
import Select from "../../atoms/Select";
import FormPasangan from "./FormPasangan";
import FormOrangTua from "./FormOrangTua";
import FormAnak from "./FormAnak";
import FormKontakDarurat from "./FormKontakDarurat";
import FormTanggunganLain from "./FormTanggunganLain";
import type { PasanganFormPayload } from "./FormPasangan/FormPasangan";
import type { AnakFormPayload } from "./FormAnak/FormAnak";
import type { OrangTuaFormPayload } from "./FormOrangTua/FormOrangTua";
import type { KontakDaruratFormPayload } from "./FormKontakDarurat/FormKontakDarurat";
import type { TanggunganLainFormPayload } from "./FormTanggunganLain/FormTanggunganLain";

type JenisKeluarga = "" | "Suami" | "Istri" | "Orang Tua" | "Anak" | "Kontak Darurat" | "Tanggungan Lain";

export type FormKeluargaSubmitPayload =
    | { type: "pasangan"; data: PasanganFormPayload }
    | { type: "anak"; data: AnakFormPayload }
    | { type: "orang_tua"; data: OrangTuaFormPayload }
    | { type: "kontak_darurat"; data: KontakDaruratFormPayload }
    | { type: "tanggungan_lain"; data: TanggunganLainFormPayload };

interface FormDataKeluargaProps {
    onCancel: () => void;
    onSubmit?: (payload: FormKeluargaSubmitPayload) => void;
    onTypeChange?: (type: string) => void;
    isLoading?: boolean;
}

const FormDataKeluarga = ({ onCancel, onSubmit, onTypeChange, isLoading }: FormDataKeluargaProps) => {
    const [jenisKeluarga, setJenisKeluarga] = useState<JenisKeluarga>("");

    const typeOptions = [
        { value: "", label: "Pilih Jenis Hubungan" },
        { value: "Suami", label: "Pasangan - Suami" },
        { value: "Istri", label: "Pasangan - Istri" },
        { value: "Orang Tua", label: "Orang Tua" },
        { value: "Anak", label: "Anak" },
        { value: "Kontak Darurat", label: "Kontak Darurat" },
        { value: "Tanggungan Lain", label: "Tanggungan Lain" },
    ];

    useEffect(() => {
        if (onTypeChange) {
            onTypeChange(jenisKeluarga);
        }
    }, [jenisKeluarga, onTypeChange]);

    const handlePasanganSubmit = (data: PasanganFormPayload) => {
        if (onSubmit) onSubmit({ type: "pasangan", data });
    };

    const handleAnakSubmit = (data: AnakFormPayload) => {
        if (onSubmit) onSubmit({ type: "anak", data });
    };

    const handleOrangTuaSubmit = (data: OrangTuaFormPayload) => {
        if (onSubmit) onSubmit({ type: "orang_tua", data });
    };

    const handleKontakDaruratSubmit = (data: KontakDaruratFormPayload) => {
        if (onSubmit) onSubmit({ type: "kontak_darurat", data });
    };

    const handleTanggunganLainSubmit = (data: TanggunganLainFormPayload) => {
        if (onSubmit) onSubmit({ type: "tanggungan_lain", data });
    };

    return (
        <div className={styles.form}>
            <Select
                id="jenis-keluarga"
                name="jenis-keluarga"
                label="Jenis Hubungan"
                options={typeOptions}
                value={jenisKeluarga}
                onChange={(e) => setJenisKeluarga(e.target.value as JenisKeluarga)}
                required
            />
            {jenisKeluarga === "" && (
                <div className={styles.emptyState}>
                    Silakan pilih jenis hubungan terlebih dahulu
                </div>
            )}
            {(jenisKeluarga === "Suami" || jenisKeluarga === "Istri") && (
                <FormPasangan onCancel={onCancel} onSubmit={handlePasanganSubmit} isLoading={isLoading} />
            )}
            {jenisKeluarga === "Orang Tua" && (
                <FormOrangTua onCancel={onCancel} onSubmit={handleOrangTuaSubmit} isLoading={isLoading} />
            )}
            {jenisKeluarga === "Anak" && (
                <FormAnak onCancel={onCancel} onSubmit={handleAnakSubmit} isLoading={isLoading} />
            )}
            {jenisKeluarga === "Kontak Darurat" && (
                <FormKontakDarurat onCancel={onCancel} onSubmit={handleKontakDaruratSubmit} isLoading={isLoading} />
            )}
            {jenisKeluarga === "Tanggungan Lain" && (
                <FormTanggunganLain onCancel={onCancel} onSubmit={handleTanggunganLainSubmit} isLoading={isLoading} />
            )}
        </div>
    )
}

export default FormDataKeluarga