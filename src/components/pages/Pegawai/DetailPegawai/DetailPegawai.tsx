import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { User, GraduationCap, TrendingUp, ArrowLeft, ContactRound } from "lucide-react";

import Topbar from "../../../ui/organisms/Topbar/Topbar";
import MainHeaderSection from "../../../ui/molecules/MainHeaderSection";
import Tabs from "../../../ui/molecules/Tabs";
import Card from "../../../ui/atoms/Card";
import Button from "../../../ui/atoms/Button";

import TabPegawai from "./components/TabPegawai";
import TabDiklat from "./components/TabDiklat";
import TabRiwayat from "./components/TabRiwayat";

import type { propsType } from "../../Profil/components/FormProfile/FormProfile";
import type { CardDiklatData } from "../../../ui/organisms/CardDiklat/CardDiklat";
import type { CardJabatanData } from "../../../ui/organisms/CardJabatan/CardJabatan";
import type { CardStrData } from "../../../ui/organisms/CardStr/CardStr";
import type { CardSipData } from "../../../ui/organisms/CardSip/CardSip";
import type { CardPenugasanKlinisData } from "../../../ui/organisms/CardPenugasanKlinis/CardPenugasanKlinis";
import type { CardPendidikanData } from "../../../ui/organisms/CardPendidikan/CardPendidikan";
import type { CardPangkatData } from "../../../ui/organisms/CardPangkat/CardPangkat";

import { pegawaiService } from "../../../../services/pegawaiService";
import { getGlobalUser } from "../../../../contexts/AuthContext";
import styles from "./DetailPegawai.module.css";
import TabKeluarga from "./components/TabKeluarga";
import type { FamilyMemberData } from "../../../ui/organisms/FamilyMemberCard/FamilyMemberCard";
import type { DetailPegawaiResponse } from "../../../../types/api";

const TAB_ITEMS = [
    { id: "pegawai", label: "Pegawai", icon: <User size={16} /> },
    { id: "keluarga", label: "Keluarga", icon: <ContactRound size={16} /> },
    { id: "diklat", label: "Diklat", icon: <GraduationCap size={16} /> },
    { id: "riwayat", label: "Riwayat Karir", icon: <TrendingUp size={16} /> },

];

const mapToProfileData = (pegawai: any, pribadi: any): propsType => ({
    namaLengkap: pegawai.nama || "",
    nip: pegawai.nip || "",
    nik: pegawai.nik || "",
    email: pegawai.email || "",
    noTelepon: pribadi?.no_hp || pribadi?.no_telp || "",
    tanggalLahir: pribadi?.tanggal_lahir || "",
    jenisKelamin: pribadi?.jenis_kelamin === "L" ? "Laki-laki" : pribadi?.jenis_kelamin === "P" ? "Perempuan" : pribadi?.jenis_kelamin || "",
    agama: pribadi?.agama || "",
    statusPernikahan: pribadi?.status_perkawinan || "",
    pendidikanTerakhir: "",
    jabatan: pegawai.jabatan || "",
    pangkat: pegawai.pangkat || "",
    profesi: pegawai.profesi || "",
    unitKerja: pegawai.unit_kerja || "",
    golonganRuang: pegawai.golongan_ruang || "",
    jenisPegawai: pegawai.jenis_pegawai || "",
    alamat: pribadi?.alamat || "",
    tanggalMasuk: pegawai.tgl_masuk || "",
    tmtCpns: pegawai.tmt_cpns || "",
    tmtPns: pegawai.tmt_pns || "",
    tmtPangkatTerakhir: "",
    ktp: null,
    bukuNikah: null,
    kartuKeluarga: null,
});

const transformPasangan = (item: any): FamilyMemberData => ({
    id: item.id,
    nama: item.nama || item.nama_lengkap || "",
    status: item.status_hubungan || "Istri",
    tanggungan: !!item.status_tanggungan,
    nik: item.nik || undefined,
    tempatLahir: item.tempat_lahir || undefined,
    tanggalLahir: item.tanggal_lahir || undefined,
    pekerjaan: item.pekerjaan || undefined,
    instansi: item.instansi || undefined,
    statusPernikahan: item.status_pernikahan || undefined,
    tanggalPernikahan: item.tanggal_pernikahan || undefined,
    nomorBukuNikah: item.nomor_buku_nikah || undefined,
    npwpPasangan: item.npwp_pasangan || undefined,
    bukuNikahFilePath: item.buku_nikah_file_path || undefined,
});

const transformAnak = (item: any): FamilyMemberData => ({
    id: item.id,
    nama: item.nama || item.nama_lengkap || "",
    status: "Anak",
    tanggungan: !!item.status_tanggungan,
    nik: item.nik || undefined,
    tempatLahir: item.tempat_lahir || undefined,
    tanggalLahir: item.tanggal_lahir || undefined,
    jenisKelamin: item.jenis_kelamin || undefined,
    statusAnak: item.status_anak || undefined,
    pendidikanTerakhir: item.pendidikan || item.pendidikan_terakhir || undefined,
    usia: item.usia ? `${item.usia} tahun` : undefined,
    keteranganDisabilitas: item.keterangan_disabilitas || undefined,
    aktaKelahiranFilePath: item.akta_kelahiran_file_path || undefined,
});

const transformOrangTua = (item: any): FamilyMemberData => ({
    id: item.id,
    nama: "Data Orang Tua",
    status: "Orang Tua",
    tanggungan: false,
    namaAyah: item.nama_ayah || undefined,
    namaIbu: item.nama_ibu || undefined,
    statusHidup: item.status_hidup || undefined,
    alamat: item.alamat || undefined,
});

const transformKontakDarurat = (item: any): FamilyMemberData => ({
    id: item.id,
    nama: item.nama_kontak || item.nama || "",
    status: "Kontak Darurat",
    tanggungan: false,
    hubunganKeluarga: item.hubungan_keluarga || "",
    nomorHp: item.nomor_hp || item.no_hp || "",
    alamat: item.alamat || undefined,
});

const transformTanggunganLain = (item: any): FamilyMemberData => ({
    id: item.id,
    nama: item.nama || "",
    status: "Tanggungan Lain",
    tanggungan: !!item.status_tanggungan,
    hubunganKeluarga: item.hubungan || item.hubungan_keluarga || "",
});


const formatTanggal = (dateStr: string): string => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

const mapToDiklatCards = (diklatList: any[]): CardDiklatData[] =>
    diklatList.map((item) => ({
        id: item.id,
        namaDiklat: item.nama || "",
        kategori: item.kategori || "",
        jenisDiklat: item.jenis || "",
        tanggalMulai: formatTanggal(item.tanggal_mulai),
        tanggalSelesai: formatTanggal(item.tanggal_selesai),
        tempat: "",
        waktu: "",
        jamPelajaran: item.jp != null ? String(item.jp) : "-",
        status: item.status_diklat || "",
        jenisBiaya: null,
        totalBiaya: null,
        penyelenggara: item.penyelenggara || "",
        uploadLaporan: item.upload_laporan || "",
        statusValidasi: item.status_validasi || "",
        statusVerifikasi: item.status_kelayakan || "",
    }));

const mapToJabatanCards = (jabatanList: any[]): CardJabatanData[] =>
    jabatanList.map((item) => ({
        id: item.id,
        unit_kerja_id: 0,
        unit_kerja_nama: item.unit_kerja || "",
        namaJabatan: item.jabatan || "",
        isCurrent: item.is_current,
        tmt_mulai: item.tanggal_mulai || "",
        tmt_selesai: item.tanggal_selesai || "",
        link_sk: item.file_path || null,
    }));

const mapToStrCards = (strList: any[]): CardStrData[] =>
    strList.map((item) => ({
        id: item.id,
        nomorStr: item.nomor_str || "",
        tanggalTerbit: item.tanggal_terbit || "",
        tanggalKadaluarsa: item.tanggal_kadaluarsa || null,
        isCurrent: item.is_current,
        linkSk: item.file_path || null,
    }));

const mapToSipCards = (sipList: any[]): CardSipData[] =>
    sipList.map((item) => ({
        id: item.id,
        jenisSipId: 0,
        jenisSipNama: item.jenis_sip || "",
        nomorSip: item.nomor_sip || "",
        tanggalTerbit: item.tanggal_terbit || "",
        tanggalKadaluarsa: item.tanggal_kadaluarsa || null,
        isCurrent: item.is_current,
        linkSk: item.file_path || null,
    }));

const mapToPenugasanCards = (pkList: any[]): CardPenugasanKlinisData[] =>
    pkList.map((item) => ({
        id: item.id,
        nomorSurat: item.nomor_surat || "",
        tglMulai: item.tanggal_mulai || "",
        tglKadaluarsa: item.tanggal_kadaluarsa || null,
        isCurrent: item.is_current,
        linkDokumen: item.file_path || null,
    }));

const mapToPendidikanCards = (pendidikanList: any[]): CardPendidikanData[] =>
    pendidikanList.map((item) => ({
        id: item.id,
        jenjang: item.jenjang || "",
        institusi: item.institusi || "",
        jurusan: item.jurusan || "",
        tahun_lulus: item.tahun_lulus || "",
        nomor_ijazah: item.nomor_ijazah || "",
        link_ijazah: item.ijazah_file_path || "",
    }));

const mapToPangkatCards = (pangkatList: any[]): CardPangkatData[] =>
    pangkatList.map((item) => ({
        id: item.id,
        namaPangkat: item.pangkat || "",
        isCurrent: item.is_current,
        pejabatPenetap: item.pejabat_penetap || null,
        tmtSk: item.tmt_sk || null,
        startedAt: item.tanggal_mulai || null,
        endedAt: item.tanggal_selesai || null,
        linkSk: item.link_sk || null,
        note: item.note || "",
    }));

const DetailPegawai = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = getGlobalUser();
    const isAdmin = user?.role === "admin" || user?.role === "hrd";

    const [activeTab, setActiveTab] = useState("pegawai");

    const { data: response, isLoading: queryIsLoading, error: queryError, refetch } = useQuery({
        queryKey: ["pegawaiAdmin", Number(id)],
        queryFn: () => pegawaiService.getById(Number(id)),
        enabled: !!id,
    });

    const isLoading = queryIsLoading;
    const error = queryError ? (queryError as any).message || "Gagal mengambil data pegawai." : null;

    const data: DetailPegawaiResponse | null = useMemo(() => {
        if (!response?.success || !response?.data) return null;
        return response.data;
    }, [response]);

    const profileData = useMemo(() => {
        if (!data) return null;
        return mapToProfileData(data.pegawai, data.pribadi);
    }, [data]);

    const photoUrl = useMemo(() => {
        if (!data) return null;
        return data.pegawai.link_photo_profil || null;
    }, [data]);

    const statusPegawai = useMemo(() => {
        if (!data) return "Aktif";
        return data.pegawai.status_pegawai || "Aktif";
    }, [data]);

    const pegawaiMeta = useMemo(() => {
        if (!data) return { nama: "", nip: "", jabatan: "", email: "", noTelp: "", unitKerja: "" };
        const pegawai = data.pegawai;
        const pribadi = data.pribadi;
        return {
            nama: pegawai.nama || "",
            nip: pegawai.nip || "",
            jabatan: pegawai.jabatan || "",
            email: pegawai.email || "",
            noTelp: pribadi?.no_hp || pribadi?.no_telp || "",
            unitKerja: pegawai.unit_kerja || "",
        };
    }, [data]);

    const diklatList = useMemo(() => {
        if (!data) return [];
        return mapToDiklatCards(data.diklat || []);
    }, [data]);

    const keluargaList = useMemo(() => {
        if (!data) return [];
        const keluarga = data.keluarga || {};
        return [
            ...(keluarga.kontak_darurat || []).map(transformKontakDarurat),
            ...(keluarga.anak || []).map(transformAnak),
            ...(keluarga.pasangan || []).map(transformPasangan),
            ...(keluarga.orang_tua || []).map(transformOrangTua),
            ...(keluarga.tanggungan_lain || []).map(transformTanggunganLain),
        ];
    }, [data]);

    const jabatanList = useMemo(() => {
        if (!data) return [];
        const riwayat = data.riwayat_karir || {};
        return mapToJabatanCards(riwayat.jabatan || []);
    }, [data]);

    const strList = useMemo(() => {
        if (!data) return [];
        const riwayat = data.riwayat_karir || {};
        return mapToStrCards(riwayat.str || []);
    }, [data]);

    const sipList = useMemo(() => {
        if (!data) return [];
        const riwayat = data.riwayat_karir || {};
        return mapToSipCards(riwayat.sip || []);
    }, [data]);

    const penugasanList = useMemo(() => {
        if (!data) return [];
        const riwayat = data.riwayat_karir || {};
        return mapToPenugasanCards(riwayat.penugasan_klinis || []);
    }, [data]);

    const pendidikanList = useMemo(() => {
        if (!data) return [];
        const riwayat = data.riwayat_karir || {};
        return mapToPendidikanCards(riwayat.pendidikan || []);
    }, [data]);

    const pangkatList = useMemo(() => {
        if (!data) return [];
        const riwayat = data.riwayat_karir || {};
        return mapToPangkatCards(riwayat.pangkat || []);
    }, [data]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const renderLoading = () => (
        <div className={styles.centeredState}>
            <div className={styles.spinner} />
            <p className={styles.stateText}>Memuat data pegawai...</p>
        </div>
    );

    const renderError = () => (
        <div className={styles.centeredState}>
            <p className={styles.errorText}>{error}</p>
            <Button label="Kembali" variant="primary" onClick={() => navigate("/pegawai")} />
        </div>
    );

    return (
        <>
            <Topbar title="Detail Pegawai" />

            <MainHeaderSection title={pegawaiMeta?.nama || ""} subtitle="Berisi detail data data pegawai" />

            <div className={styles.backRow}>
                <Button
                    label="Kembali ke Daftar Pegawai"
                    variant="primary"
                    icon={<ArrowLeft size={16} />}
                    onClick={() => navigate("/pegawai")}
                />
            </div>

            {isLoading ? renderLoading() : error || !data ? renderError() : (
                <>
                    <div className={styles.tabsWrapper}>
                        <Card>
                            <Tabs tabs={TAB_ITEMS} activeTab={activeTab} onChange={setActiveTab} />
                        </Card>
                    </div>

                    <div className={styles.tabContent}>
                        {activeTab === "pegawai" && profileData && (
                            <TabPegawai
                                profileData={profileData}
                                photoUrl={photoUrl}
                                statusPegawai={statusPegawai}
                                pegawaiMeta={pegawaiMeta}
                                isAdmin={isAdmin}
                                pegawaiId={Number(id)}
                                onRefresh={handleRefresh}
                            />
                        )}
                        {activeTab === "diklat" && (
                            <TabDiklat diklatList={diklatList} isAdmin={isAdmin} onRefresh={handleRefresh} />
                        )}
                        {activeTab === "keluarga" && (
                            <TabKeluarga keluargaList={keluargaList} isAdmin={isAdmin} pegawaiId={Number(id)} onRefresh={handleRefresh} />
                        )}
                        {activeTab === "riwayat" && (
                            <TabRiwayat
                                jabatanList={jabatanList}
                                pangkatList={pangkatList}
                                strList={strList}
                                sipList={sipList}
                                penugasanList={penugasanList}
                                pendidikanList={pendidikanList}
                                isAdmin={isAdmin}
                                pegawaiId={Number(id)}
                                onRefresh={handleRefresh}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default DetailPegawai;