import { useState } from 'react'
import Button from '../../../../ui/atoms/Button';
import Select from '../../../../ui/atoms/Select';
import Input from '../../../../ui/atoms/Input';
import styles from './FormCetakRekap.module.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';


const BULAN_OPTIONS = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
]

export interface CetakRekapPayload {
    bulanAwal: number;
    tahunAwal: number;
    bulanAkhir: number;
    tahunAkhir: number;
}

interface FormCetakRekapProps {
    isSubmitting?: boolean;
    onCancel: () => void;
    onSubmit: (payload: CetakRekapPayload) => void;
}

const FormCetakRekap = ({ isSubmitting, onCancel, onSubmit }: FormCetakRekapProps) => {
    const [periodeAwal, setPeriodeAwal] = useState<Dayjs | null>(null);
    const [periodeAkhir, setPeriodeAkhir] = useState<Dayjs | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!periodeAwal || !periodeAkhir) {
            setError("Semua field harus diisi.");
            return;
        }

        const bulanAwal = periodeAwal.month() + 1;
        const tahunAwal = periodeAwal.year();

        const bulanAkhir = periodeAkhir.month() + 1;
        const tahunAkhir = periodeAkhir.year();

        const startDate = new Date(tahunAwal, bulanAwal - 1, 1);
        const endDate = new Date(tahunAkhir, bulanAkhir - 1, 1);

        if (startDate > endDate) {
            setError("Periode awal tidak boleh lebih besar dari periode akhir.");
            return;
        }

        onSubmit({
            bulanAwal,
            tahunAwal,
            bulanAkhir,
            tahunAkhir,
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.periodLabel}>Pilih rentang waktu</div>
            <div className={styles.row}>
                <DatePicker
                    label="Periode Awal"
                    views={["year", "month"]}
                    openTo='year'
                    value={periodeAwal}
                    onChange={(newValue) => setPeriodeAwal(newValue)}
                    slotProps={{
                        popper: {
                            disablePortal: true
                        },
                        textField: {
                            sx: {
                                borderRadius: '16px',
                            }
                        },

                    }}
                />
                <DatePicker
                    label="Periode Akhir"
                    views={["year", "month"]}
                    openTo='year'
                    value={periodeAkhir}
                    onChange={(newValue) => setPeriodeAkhir(newValue)}
                    slotProps={{
                        popper: {
                            disablePortal: true
                        }
                    }}
                />

            </div>

            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            <div className={styles.actions}>
                <Button
                    type="submit"
                    label={isSubmitting ? "Memproses..." : "Cetak Rekap"}
                    variant="primary"
                    disabled={isSubmitting}
                />
                <Button
                    type="button"
                    label="Batal"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                />
            </div>
        </form>
    )
}

export default FormCetakRekap