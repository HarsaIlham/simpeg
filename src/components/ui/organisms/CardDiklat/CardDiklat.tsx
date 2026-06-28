import { GraduationCap, Calendar, MapPin, Clock, Upload, CreditCard, BadgeDollarSignIcon, BookOpenText, User } from "lucide-react"
import RecordCard from "../../molecules/RecordCard"
import Icon from "../../atoms/Icon"
import Text from "../../atoms/Text"
import Badge from "../../atoms/Badge"
import Button from "../../atoms/Button"
import styles from "./CardDiklat.module.css"
import { getFileUrl } from "../../../../utils/api"
import { formatRupiah } from "../../../../utils/currencyUtils"

export interface CardDiklatData {
    id: number;
    namaDiklat: string;
    kategori: string;
    jenisDiklat: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    tempat: string;
    waktu: string;
    jamPelajaran: string;
    status: string;
    jenisBiaya: string | null;
    totalBiaya: string | null;
    penyelenggara: string;
    pencatat?: string;
    catatan?: string;
    jenisPelaksana?: string;
    hasLaporan?: boolean;
    sertifikat?: string;
    pegawaiNama?: string;
    pegawaiNik?: string;
    idJadwalDiklat?: number;
    noSertifikat?: string;
    statusValidasi?: string;
    statusVerifikasi?: string;
    uploadLaporan: boolean;
}

interface CardDiklatProps {
    data: CardDiklatData;
    onEdit?: () => void;
    onDelete?: () => void;
    onUploadLaporan?: () => void;
    onValidasi?: () => void;
    onTambahPeserta?: () => void;
    onVerifikasi?: () => void;
    onViewDocument?: (url: string) => void;
}

const CardDiklat = ({ data, onEdit, onDelete, onUploadLaporan, onValidasi, onTambahPeserta, onVerifikasi, onViewDocument }: CardDiklatProps) => {
    const fullUrl = getFileUrl(data.sertifikat);
    const isVerifikasiOrValidasi = Boolean(onValidasi || onVerifikasi);
    const isInternal = data.jenisPelaksana === "internal";
    const isBelumTerlaksana = data.status === "mendatang";

    const handleViewDocument = () => {
        if (!fullUrl) return;
        if (onViewDocument) {
            onViewDocument(fullUrl);
        } else {
            window.open(fullUrl, "_blank");
        }
    };
    return (
        <RecordCard
            icon={<Icon icon={GraduationCap} variant="soft" color="#218838" bgColor="#e6f4ea" rounded="md" sizeBox="lg" sizeIcon="sm" />}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            <div className={styles.header}>
                <Text text={`${data.jenisPelaksana?.toUpperCase()} - ${data.namaDiklat}`} weight="bold" color="default" fontSize="18px" />
                <div className={styles.badgeGroup}>
                    <Badge variant="parent">{data.jenisDiklat}</Badge>
                    <Badge variant="info">{data.kategori}</Badge>
                    {(() => {
                        const status = data.statusValidasi?.toLowerCase();
                        const valid = /^\bvalid\b$/.test(status || "");
                        if (valid) {
                            return <Badge variant="success">Valid</Badge>;
                        } else if (status?.includes("tolak") || status?.includes("tidak")) {
                            return <Badge variant="danger">Tidak Valid</Badge>;
                        } else if (data.hasLaporan && data.jenisPelaksana?.toLowerCase() === "internal") {
                            return <Badge variant="warning">Menunggu Validasi</Badge>;
                        } else {
                            return undefined;
                        }
                    })()}
                    {(() => {
                        const status = data.statusVerifikasi?.toLowerCase();
                        if (status?.includes("layak") && !status?.includes("menunggu")) {
                            return <Badge variant="success">Layak</Badge>;
                        } else if (status?.includes("tidak layak") || status?.includes("tidak")) {
                            return <Badge variant="danger">Tidak Layak</Badge>;
                        } else {
                            return undefined;
                        }
                    })()}
                </div>
            </div>

            <div className={styles.bodyWrapper}>
                <div className={styles.row}>
                    <div className={styles.detailList}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailIcon}><Calendar size={14} /></span>
                            <span>{data.tanggalMulai} - {data.tanggalSelesai}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailIcon}><MapPin size={14} /></span>
                            <span>{data.tempat}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailIcon}><Clock size={14} /></span>
                            <span>{data.waktu}</span>
                        </div>
                    </div>
                    <div className={styles.detailList}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailIcon}><BookOpenText size={14} /></span>
                            <span>{data.jamPelajaran} Jam Pelajaran</span>
                        </div>
                        {isInternal && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailIcon}><CreditCard size={14} /></span>
                                <span>{data.jenisBiaya || "-"}</span>
                            </div>
                        )}
                        {isInternal && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailIcon}><BadgeDollarSignIcon size={14} /></span>
                                <span>{formatRupiah(data.totalBiaya)}</span>
                            </div>
                        )}
                    </div>
                    <div className={styles.detailList}>
                        <div className={styles.detailItem}>
                            {data.sertifikat && (
                                <div className={styles.actionsBox}>
                                    <Button
                                        label="Lihat Sertifikat"
                                        variant="transparant"
                                        onClick={handleViewDocument}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isVerifikasiOrValidasi && data.pegawaiNama && (
                    <div className={styles.detailList}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailIcon}><User size={14} /></span>
                            <span><strong>{data.pegawaiNama}</strong> — {data.pegawaiNik}</span>
                        </div>
                    </div>
                )}

                {data.pencatat && (
                    <div className={styles.pencatatWrapper}>
                        <span className={styles.pencatatLabel}>by: {data.pencatat}</span>
                    </div>
                )}
            </div>

            <hr className={styles.divider} />

            <div className={styles.footer}>
                <div className={styles.footerLabel}>
                    <div className={styles.footerRow}>
                        Penyelenggara:
                        <span className={styles.footerLabelBold}>{data.penyelenggara}</span>
                        <div style={{ paddingLeft: "50px" }}>
                            {data.status === "selesai" ? (
                                <Badge variant="success" >Sudah Terlaksana</Badge>
                            ) : data.status === "berlangsung" ? (
                                <Badge variant="warning" >Berlangsung</Badge>
                            ) : (
                                <Badge variant="info" >Belum Terlaksana</Badge>
                            )}
                        </div>
                    </div>
                    <div className={styles.footerRow}>
                        <span className={styles.footerLabelBold}>Catatan:</span>
                        {data.catatan}
                    </div>
                </div>


                <div className={styles.footerRight}>
                    {onUploadLaporan && data.uploadLaporan && (
                        <Button
                            label="Upload Laporan"
                            icon={<Upload size={14} />}
                            variant="primary"
                            size="sm"
                            onClick={onUploadLaporan}
                        />
                    )}
                    {onValidasi && (
                        <Button
                            label="Validasi"
                            variant="primary"
                            size="sm"
                            onClick={onValidasi}
                        />
                    )}
                    {onTambahPeserta && isBelumTerlaksana && (
                        <Button
                            label="Peserta Diklat"
                            variant="primary"
                            size="md"
                            onClick={onTambahPeserta}
                        />
                    )}
                    {onVerifikasi && (
                        <Button
                            label="Verifikasi"
                            variant="primary"
                            size="sm"
                            onClick={onVerifikasi}
                        />
                    )}
                </div>

            </div>
        </RecordCard>
    )
}

export default CardDiklat
