import React, { useState } from "react";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import Button from "../../atoms/Button";
import styles from "./FormJabatan.module.css";
import type { CardJabatanData } from "../CardJabatan/CardJabatan";
import { useMasterData } from "../../../../hooks/useMasterData";

interface FormJabatanProps {
    initialData?: CardJabatanData | null;
    onCancel: () => void;
    onSubmit: (formData: FormData) => void;
    isPegawai?: boolean;
}

const FormJabatan = ({ initialData, onCancel, onSubmit, isPegawai = true }: FormJabatanProps) => {
    const { options: unitKerjaOptions } = useMasterData("unitKerja", "Pilih Unit Kerja", [
        { value: "1", label: "Pelayanan Medis" },
        { value: "2", label: "SDM" },
        { value: "3", label: "Keuangan" },
        { value: "4", label: "Umum & Operasional" }
    ], true);

    const [skFile, setSkFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = new FormData();
        submitData.append("nama_jabatan", formData.namaJabatan);
        if (formData.unit_kerja_id) {
            submitData.append("unit_kerja_id", String(formData.unit_kerja_id));
        }
        submitData.append("is_current", formData.isCurrent ? "1" : "0");
        submitData.append("tmt_mulai", formData.tmt_mulai);

        if (formData.tmt_selesai) {
            submitData.append("tmt_selesai", formData.tmt_selesai);
        }

        if (formData.note) {
            submitData.append("note", formData.note);
        }

        if (skFile) {
            submitData.append("sk_jabatan", skFile);
        }

        onSubmit(submitData);
    };

    const [formData, setFormData] = useState<CardJabatanData>({
        id: initialData?.id ?? 0,
        unit_kerja_id: initialData?.unit_kerja_id ?? 0,
        unit_kerja_nama: initialData?.unit_kerja_nama ?? "",
        namaJabatan: initialData?.namaJabatan ?? "",
        isCurrent: initialData?.isCurrent ?? false,
        tmt_mulai: initialData?.tmt_mulai ?? "",
        tmt_selesai: initialData?.tmt_selesai ?? "",
        link_sk: initialData?.link_sk ?? null,
        note: initialData?.note ?? "",
    });

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="nama-jabatan"
                        name="nama-jabatan"
                        label="Nama Jabatan"
                        value={formData.namaJabatan}
                        onChange={(e) => setFormData({ ...formData, namaJabatan: e.target.value })}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Select
                        id="unit-kerja"
                        name="unit-kerja"
                        label="Unit Kerja"
                        options={unitKerjaOptions}
                        value={formData.unit_kerja_id ? String(formData.unit_kerja_id) : ""}
                        onChange={(e) => setFormData({ ...formData, unit_kerja_id: Number(e.target.value) })}
                        required
                    />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.col}>
                    <Input
                        id="tmt"
                        name="tmt"
                        type="date"
                        label="TMT (Terhitung Mulai Tanggal)"
                        value={formData.tmt_mulai}
                        onChange={(e) => setFormData({ ...formData, tmt_mulai: e.target.value })}
                        required
                    />
                </div>
                <div className={styles.col}>
                    <Input
                        id="tanggal-selesai"
                        name="tanggal-selesai"
                        type="date"
                        label="Tanggal Selesai"
                        value={formData.tmt_selesai}
                        onChange={(e) => setFormData({ ...formData, tmt_selesai: e.target.value })}
                        required={!formData.isCurrent}
                        disabled={formData.isCurrent}
                    />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.col}>
                    <Select
                        id="status-jabatan"
                        name="status-jabatan"
                        label="Status Jabatan"
                        options={[
                            { value: "aktif", label: "Aktif" },
                            { value: "tidak-aktif", label: "Tidak Aktif" }
                        ]}
                        value={formData.isCurrent ? "aktif" : "tidak-aktif"}
                        onChange={(e) => setFormData({ ...formData, isCurrent: e.target.value === "aktif" })}
                        required
                    />
                </div>
                <div className={styles.col}></div>
            </div>
            <Input
                id="dokumen"
                name="dokumen"
                type="file"
                label="Upload Dokumen"
                onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setSkFile(file);
                }}
                required={isPegawai && !initialData?.link_sk}
            />
            {initialData?.link_sk && !skFile &&(
                <span className={styles.fileHint} style={{ color: 'var(--color-muted, #6B7280)', fontSize: '12px', fontStyle: 'italic', marginTop: '-12px', display: 'block' }}>
                    File SK sudah ada. Upload baru hanya jika ingin mengganti.
                </span>
            )}

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
    );
};

export default FormJabatan;
