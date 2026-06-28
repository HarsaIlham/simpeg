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
        tempat: item.tempat || "",
        waktu: item.waktu || "",
        jamPelajaran: item.jp != null ? String(item.jp) : "-",
        status: item.status_diklat || "",
        jenisBiaya: item.jenis_biaya || null,
        totalBiaya: item.total_biaya || null,
        penyelenggara: item.penyelenggara || "",
        pencatat: item.created_by || "",
        catatan: item.catatan || "",
        jenisPelaksana: item.jenis_pelaksana || "",
        sertifikat: item.sertif || "",
        noSertifikat: item.no_sertif || "",
        statusValidasi: item.status_validasi || "",
        statusVerifikasi: item.status_kelayakan || "",
        uploadLaporan: !!item.upload_laporan,
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

    const { data: pegawaiResponse, isLoading: pegawaiLoading, error: pegawaiError, refetch: refetchPegawai } = useQuery({
        queryKey: ["pegawaiAdmin", Number(id), "pegawai"],
        queryFn: () => pegawaiService.getBySection(Number(id), "pegawai"),
        enabled: !!id,
    });

    const { data: keluargaResponse, isLoading: keluargaLoading, error: keluargaError, refetch: refetchKeluarga } = useQuery({
        queryKey: ["pegawaiAdmin", Number(id), "keluarga"],
        queryFn: () => pegawaiService.getBySection(Number(id), "keluarga"),
        enabled: !!id && activeTab === "keluarga",
    });

    const { data: diklatResponse, isLoading: diklatLoading, error: diklatError, refetch: refetchDiklat } = useQuery({
        queryKey: ["pegawaiAdmin", Number(id), "diklat"],
        queryFn: () => pegawaiService.getBySection(Number(id), "diklat"),
        enabled: !!id && activeTab === "diklat",
    });

    const { data: riwayatResponse, isLoading: riwayatLoading, error: riwayatError, refetch: refetchRiwayat } = useQuery({
        queryKey: ["pegawaiAdmin", Number(id), "riwayat"],
        queryFn: () => pegawaiService.getBySection(Number(id), "riwayat-karir"),
        enabled: !!id && activeTab === "riwayat",
    });

    const isLoading = pegawaiLoading;
    const error = pegawaiError ? (pegawaiError as any).message || "Gagal mengambil data pegawai." : null;

    const basicData = useMemo(() => {
        if (!pegawaiResponse?.success || !pegawaiResponse?.data) return null;
        return pegawaiResponse.data;
    }, [pegawaiResponse]);

    const profileData = useMemo(() => {
        if (!basicData) return null;
        const pegawai = basicData.pegawai || basicData;
        const pribadi = basicData.pribadi || {};
        return mapToProfileData(pegawai, pribadi);
    }, [basicData]);

    const photoUrl = useMemo(() => {
        if (!basicData) return null;
        const pegawai = basicData.pegawai || basicData;
        return pegawai.link_photo_profil || null;
    }, [basicData]);

    const statusPegawai = useMemo(() => {
        if (!basicData) return "Aktif";
        const pegawai = basicData.pegawai || basicData;
        return pegawai.status_pegawai || "Aktif";
    }, [basicData]);

    const pegawaiMeta = useMemo(() => {
        if (!basicData) return { nama: "", nip: "", jabatan: "", email: "", noTelp: "", unitKerja: "" };
        const pegawai = basicData.pegawai || basicData;
        const pribadi = basicData.pribadi || {};
        return {
            nama: pegawai.nama || "",
            nip: pegawai.nip || "",
            jabatan: pegawai.jabatan || "",
            email: pegawai.email || "",
            noTelp: pribadi?.no_hp || pribadi?.no_telp || "",
            unitKerja: pegawai.unit_kerja || "",
        };
    }, [basicData]);

    const diklatList = useMemo(() => {
        if (!diklatResponse?.success || !diklatResponse?.data) return [];
        const diklatData = diklatResponse.data.diklat;
        const list = Array.isArray(diklatData) ? diklatData : (diklatData?.data || []);
        return mapToDiklatCards(list);
    }, [diklatResponse]);

    const keluargaList = useMemo(() => {
        if (!keluargaResponse?.success || !keluargaResponse?.data) return [];
        const keluarga = keluargaResponse.data.keluarga || {};
        return [
            ...(keluarga.kontak_darurat || []).map(transformKontakDarurat),
            ...(keluarga.anak || []).map(transformAnak),
            ...(keluarga.pasangan || []).map(transformPasangan),
            ...(keluarga.orang_tua || []).map(transformOrangTua),
            ...(keluarga.tanggungan_lain || []).map(transformTanggunganLain),
        ];
    }, [keluargaResponse]);

    const jabatanList = useMemo(() => {
        if (!riwayatResponse?.success || !riwayatResponse?.data) return [];
        const riwayat = riwayatResponse.data.riwayat_karir || {};
        return mapToJabatanCards(riwayat.jabatan || []);
    }, [riwayatResponse]);

    const strList = useMemo(() => {
        if (!riwayatResponse?.success || !riwayatResponse?.data) return [];
        const riwayat = riwayatResponse.data.riwayat_karir || {};
        return mapToStrCards(riwayat.str || []);
    }, [riwayatResponse]);

    const sipList = useMemo(() => {
        if (!riwayatResponse?.success || !riwayatResponse?.data) return [];
        const riwayat = riwayatResponse.data.riwayat_karir || {};
        return mapToSipCards(riwayat.sip || []);
    }, [riwayatResponse]);

    const penugasanList = useMemo(() => {
        if (!riwayatResponse?.success || !riwayatResponse?.data) return [];
        const riwayat = riwayatResponse.data.riwayat_karir || {};
        return mapToPenugasanCards(riwayat.penugasan_klinis || []);
    }, [riwayatResponse]);

    const pendidikanList = useMemo(() => {
        if (!riwayatResponse?.success || !riwayatResponse?.data) return [];
        const riwayat = riwayatResponse.data.riwayat_karir || {};
        return mapToPendidikanCards(riwayat.pendidikan || []);
    }, [riwayatResponse]);

    const pangkatList = useMemo(() => {
        if (!riwayatResponse?.success || !riwayatResponse?.data) return [];
        const riwayat = riwayatResponse.data.riwayat_karir || {};
        return mapToPangkatCards(riwayat.pangkat || []);
    }, [riwayatResponse]);

    const handleRefresh = useCallback(() => {
        if (activeTab === "pegawai") refetchPegawai();
        else if (activeTab === "keluarga") refetchKeluarga();
        else if (activeTab === "diklat") refetchDiklat();
        else if (activeTab === "riwayat") refetchRiwayat();
    }, [activeTab, refetchPegawai, refetchKeluarga, refetchDiklat, refetchRiwayat]);

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

            {isLoading ? renderLoading() : error || !basicData ? renderError() : (
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
                            diklatLoading ? (
                                <div className={styles.centeredState}>
                                    <div className={styles.spinner} />
                                    <p className={styles.stateText}>Memuat data diklat...</p>
                                </div>
                            ) : diklatError ? (
                                <div className={styles.centeredState}>
                                    <p className={styles.errorText}>{(diklatError as any).message || "Gagal memuat data diklat."}</p>
                                </div>
                            ) : (
                                <TabDiklat diklatList={diklatList} isAdmin={isAdmin} onRefresh={handleRefresh} />
                            )
                        )}
                        {activeTab === "keluarga" && (
                            keluargaLoading ? (
                                <div className={styles.centeredState}>
                                    <div className={styles.spinner} />
                                    <p className={styles.stateText}>Memuat data keluarga...</p>
                                </div>
                            ) : keluargaError ? (
                                <div className={styles.centeredState}>
                                    <p className={styles.errorText}>{(keluargaError as any).message || "Gagal memuat data keluarga."}</p>
                                </div>
                            ) : (
                                <TabKeluarga keluargaList={keluargaList} isAdmin={isAdmin} pegawaiId={Number(id)} onRefresh={handleRefresh} />
                            )
                        )}
                        {activeTab === "riwayat" && (
                            riwayatLoading ? (
                                <div className={styles.centeredState}>
                                    <div className={styles.spinner} />
                                    <p className={styles.stateText}>Memuat riwayat karir...</p>
                                </div>
                            ) : riwayatError ? (
                                <div className={styles.centeredState}>
                                    <p className={styles.errorText}>{(riwayatError as any).message || "Gagal memuat riwayat karir."}</p>
                                </div>
                            ) : (
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
                            )
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default DetailPegawai;