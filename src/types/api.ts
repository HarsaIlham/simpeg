export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface LoginResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  user: {
    id: number;
    nik: string;
    role: "admin" | "pegawai" | "hrd" | "direktur";
    nama: string;
  };
}

export interface JadwalDiklat {
  jadwal_id: number;
  status_diklat: string;
  nama_kegiatan: string;
  penyelenggara: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  tempat: string;
  waktu: string;
}

export interface Notifikasi {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface StatusAksi {
  status_lengkap: boolean;
  sisa_hari?: number;
  keterangan: string[];
}

export interface ListAksiItem {
  id: number;
  action_code: string;
  title: string;
  message: string;
  action_payload: StatusAksi;
  is_read: boolean;
  is_resolved: boolean;
  created_at: string;
}

export interface DashboardPegawaiData {
  label: string;
  nama: string;
  nip: string;
  jabatan: string;
  jenis_jabatan: string;
  unit_kerja: string;
  jumlah_diklat_selesai: number;
  jumlah_diklat_dijadwalkan_belum_selesai: number;
  list_jadwal_diklat_mendatang: JadwalDiklat[];
  list_notifikasi: Notifikasi[];
  list_aksi: ListAksiItem[];
}

export interface DashboardResponse {
  role: string;
  dashboard: DashboardPegawaiData;
}

export interface ChartDataItem {
  label: string;
  value: number;
}

export interface DashboardHrdPegawai {
  total_pegawai: number;
  total_pegawai_kurang_lengkap: number;
  total_pegawai_lengkap: number;
  jenis_pegawai: Record<string, number>;
  profesi: Record<string, number>;
  tingkat_pendidikan: Record<string, number>;
  tahun_masuk_5_tahun_terakhir: Record<string, number>;
}

export interface DashboardHrdDiklat {
  total_diklat: number;
  selesai: number;
  berlangsung: number;
  pegawai_sudah_ikut: number;
  pegawai_belum_ikut: number;
  diklat_per_kategori: Record<string, number>;
}

export interface DashboardHrdDashboard {
  label: string;
  pegawai: DashboardHrdPegawai;
  diklat_asn: DashboardHrdDiklat;
  diklat_tenkes: DashboardHrdDiklat;
}

export interface DashboardHrdResponse {
  role: string;
  dashboard: DashboardHrdDashboard;
}

export interface ProfileStatusPerubahan {
  fitur: string;
  status: "pending" | "approved" | "rejected";
  note: string;
  last_update: string;
}

export interface ProfileData {
  nip: string;
  nik: string;
  nama: string;
  jenis_pegawai: string;
  profesi: string;
  pendidikan_terakhir: string;
  unit_kerja: string;
  jk: string;
  tanggal_lahir: string;
  jabatan_sekarang: string;
  agama: string;
  status_kawin: string;
  alamat: string;
  no_telp: string;
  email: string;
  link_photo_profile: string | null;
  status_pegawai: string;
  tgl_masuk: string;
  pangkat: string;
  golongan_ruang: string;
  tmt_cpns: string;
  tmt_pns: string;
  tmt_pangkat: string;
  masa_kerja: string;
  last_update: string;
  status_perubahan?: ProfileStatusPerubahan | null;
  no_kk?: string;
  link_kk?: string | null;
  ktp_file_path?: string | null;
}

export interface ProfileResponse {
  role: string;
  profile: ProfileData;
}

export interface UploadPhotoResponse {
  foto_path: string;
  link_photo_profile: string;
  updated_at: string;
}

export interface UploadKtpResponse {
  ktp_file_path: string;
  link_ktp_file: string;
  updated_at: string;
}

export interface UploadKkResponse {
  kk_file_path: string;
  link_kk: string;
  updated_at: string;
}

export type UpdateProfileRequest = Partial<Omit<ProfileData, 'link_photo_profile'>> & {
  note: string;
};

export interface UpdateProfileResponse {
  id_perubahan_data: number;
  status: string;
  fitur: string;
  jumlah_detail: number;
}


export interface RiwayatDiklatItem {
  id: number;
  nama: string;
  kategori: string;
  jenis: string;
  pelaksana: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: "mendatang" | "berlangsung" | "selesai";
  tempat: string;
  waktu: string;
  created_by: string;
  jp: number;
  total_biaya: number;
  jenis_biaya: string;
  jenis_pelaksana: string;
  catatan?: string;
  no_sertif?: string | null;
  sertif_file_path?: string | null;
  status_validasi?: string | null;
  uploadlaporan: boolean;
}

export interface DiklatRingkasan {
  total_riwayat: number;
  selesai: number;
  akan_datang: number;
}

export interface DiklatPegawaiData {
  label: string;
  ringkasan: DiklatRingkasan;
  riwayat_diklat: RiwayatDiklatItem[];
}

export interface DiklatResponse {
  role: string;
  diklat: DiklatPegawaiData;
}

export interface DiklatPegawaiHrdItem extends RiwayatDiklatItem {
  id_diklat: number;
  id_jadwal_diklat: number;
  pegawai_id: number;
  pegawai_nama: string;
  pegawai_nik: string;
  status_kelayakan: string | null;
  status_validasi: string | null;
}

export interface DiklatPegawaiHrdListResponse {
  total: number;
  list: DiklatPegawaiHrdItem[];
}

// ─── HRD Diklat Management Types ───

export interface CreateMasterDiklatRequest {
  nama_kegiatan: string;
  kategori: string;
  jenis_diklat: string;
  penyelenggara: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jp: number;
  waktu?: string;
  jenis_pelaksana: "internal" | "external";
  jenis_biaya?: string;
  total_biaya?: number;
  catatan?: string;
}

export interface CreateMasterDiklatResponse {
  id_diklat: number;
  nama_kegiatan: string;
  kategori: string;
  jenis_diklat: string;
  penyelenggara: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jp: number;
  waktu: string | null;
  jenis_biaya: string | null;
  total_biaya: number | null;
  catatan: string | null;
  jenis_pelaksana: "internal" | "external";
}

export interface PesertaDiklatItem {
  pegawai_id: number;
  nama: string;
  nik: string;
  unit_kerja: string;
  profesi: string;
  status: boolean;
}

export interface PesertaDiklatResponse {
  diklat_id: number;
  total_pegawai: number;
  list: PesertaDiklatItem[];
}

export interface SyncPesertaResponse {
  diklat_id: number;
  peserta_terdaftar: number;
}

export interface UpdateStatusKelayakanResponse {
  id_jadwal_diklat: number;
  diklat_id: number;
  pegawai_id: number;
  status_kelayakan: string;
}

export interface UpdateStatusValidasiResponse {
  id_jadwal_diklat: number;
  diklat_id: number;
  pegawai_id: number;
  status_validasi: string;
}

export interface ChangeRequestUser {
  id: number;
  username: string;
  role: string;
  nama: string;
}

export interface AdminChangeRequest {
  id: number;
  by_user: ChangeRequestUser;
  fitur: string;
  status: "pending" | "approved" | "rejected";
  note: string | null;
  jumlah_detail: number;
  created_at: string;
  updated_at: string;
}

export interface ChangeRequestDetail {
  id: number;
  target_table: string;
  kolom: string;
  old_value: string | null;
  value: string | null;
}

export interface ChangeRequestDetailResponse {
  id: number;
  fitur: string;
  status: "pending" | "approved" | "rejected";
  details: ChangeRequestDetail[];
}

export interface ChangeRequestActionResponse {
  id: number;
  status: "approved" | "rejected";
}


export interface RiwayatPendidikanItem {
  id: number;
  jenjang: string;
  institusi: string;
  jurusan: string;
  tahun_lulus: number;
  nomor_ijazah: string | null;
  link_ijazah: string | null;
}

export interface RiwayatPendidikanLabel {
  welcome: string;
  summary: RiwayatPendidikanListResponse
}

export interface RiwayatPendidikanListResponse {
  label: string;
  total: number;
  items: RiwayatPendidikanItem[];
}

export type RiwayatPendidikanMutationResponse = RiwayatPendidikanItem;


export interface RiwayatJabatanItem {
  id: number;
  unit_kerja_id: number;
  unit_kerja_nama: string;
  nama_jabatan: string;
  is_current: boolean;
  tmt_mulai: string;
  tmt_selesai: string;
  link_sk: string;
  note: string;
}

export interface RiwayatJabatanListResponse {
  label: string;
  total: number;
  items: RiwayatJabatanItem[];
}

export type RiwayatJabatanMutationResponse = RiwayatJabatanItem;


export interface RiwayatPangkatItem {
  id: number;
  nama_pangkat: string;
  is_current: boolean;
  pejabat_penetap: string | null;
  tmt_sk: string | null;
  started_at: string | null;
  ended_at: string | null;
  link_sk: string | null;
  note: string | null;
}

export interface RiwayatPangkatListResponse {
  label: string;
  total: number;
  items: RiwayatPangkatItem[];
}

export type RiwayatPangkatMutationResponse = RiwayatPangkatItem;


export interface RiwayatStrItem {
  id: number;
  nomor_str: string;
  tanggal_terbit: string;
  tanggal_kadaluarsa: string | null;
  is_current: boolean;
  link_sk: string | null;
}

export interface RiwayatStrListResponse {
  label: string;
  total: number;
  items: RiwayatStrItem[];
}

export type RiwayatStrMutationResponse = RiwayatStrItem;


export interface RiwayatSipItem {
  id: number;
  jenis_sip_id: number | null;
  jenis_sip_nama: string;
  nomor_sip: string;
  tanggal_terbit: string;
  tanggal_kadaluarsa: string | null;
  is_current: boolean;
  link_sk: string | null;
}

export interface RiwayatSipListResponse {
  label: string;
  total: number;
  items: RiwayatSipItem[];
}

export type RiwayatSipMutationResponse = RiwayatSipItem;


export interface RiwayatPenugasanKlinisItem {
  id: number;
  nomor_surat: string;
  tgl_mulai: string;
  tgl_kadaluarsa: string | null;
  is_current: boolean;
  link_dokumen: string | null;
}

export interface RiwayatPenugasanKlinisListResponse {
  label: string;
  total: number;
  items: RiwayatPenugasanKlinisItem[];
}

export type RiwayatPenugasanKlinisMutationResponse = RiwayatPenugasanKlinisItem;


export interface PasanganItem {
  id: number;
  nama_lengkap: string;
  nik: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  pekerjaan: string | null;
  instansi: string | null;
  status_pernikahan: string | null;
  tanggal_pernikahan: string | null;
  nomor_buku_nikah: string | null;
  status_tanggungan: number | boolean;
  npwp_pasangan: string | null;
  buku_nikah_file_path: string | null;
}

export interface AnakItem {
  id: number;
  nama_lengkap: string;
  nik: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: string | null;
  status_anak: string | null;
  pendidikan_terakhir: string | null;
  status_tanggungan: number | boolean;
  usia: number | null;
  keterangan_disabilitas: string | null;
  akta_kelahiran_file_path: string | null;
}

export interface OrangTuaItem {
  id: number;
  nama_ayah: string | null;
  nama_ibu: string | null;
  status_hidup: string | null;
  alamat: string | null;
}

export interface KontakDaruratItem {
  id: number;
  nama_kontak: string;
  hubungan_keluarga: string;
  nomor_hp: string;
  alamat: string | null;
}

export interface KeluargaRincian {
  pasangan: PasanganItem[];
  anak: AnakItem[];
  orang_tua: OrangTuaItem[];
  kontak_darurat: KontakDaruratItem[];
}

export interface KeluargaRingkasanResponse {
  total_keluarga: number;
  rincian: KeluargaRincian;
}


export type StrSipJenis = "STR" | "SIP";
export type StrSipStatus = "aktif" | "hampir_habis" | "tidak_aktif";

export interface StrSipRecord {
  id: number;
  nama: string;
  nip: string;
  profesi: string;
  jenis: StrSipJenis;
  nomor: string;
  dokumen: string | null;
  tanggalTerbit: string;
  tanggalHabis: string;
  status: StrSipStatus;
}

export interface MasterDataItem {
  id: number;
  nama: string;
}

export type MasterDataResponse = MasterDataItem[];

export interface CvGeneratedResponse {
  header: {
    nama: string;
    alamat: string;
    no_telp: string;
    email: string;
  };
  profil: {
    jabatan: string;
    profesi: string;
    unit_kerja: string;
    masa_kerja: string;
  };
  data_diri: {
    nip: string;
    nik: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    golongan_ruang: string;
    pangkat: string;
    jabatan: string;
    unit_kerja: string;
    tmt_pns: string;
    status_kepegawaian: string;
  };
  pendidikan: {
    jenjang: string;
    jurusan: string;
    institusi: string;
    tahun_lulus: number | string;
  }[];
  diklat: {
    nama: string;
    jenis: string;
    pelaksana: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    jp: number;
    no_sertif: string;
  }[];
  riwayat_jabatan: {
    jabatan: string;
    unit_kerja: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    is_current: boolean;
    catatan: string;
  }[];
  str: {
    nomor_str: string;
    tanggal_terbit: string;
    tanggal_kadaluarsa: string;
    is_current: boolean;
  }[];
  sip: {
    jenis_sip: string;
    nomor_sip: string;
    tanggal_terbit: string;
    tanggal_kadaluarsa: string;
    is_current: boolean;
  }[];
  penugasan_klinis: {
    nomor_surat: string;
    tanggal_mulai: string;
    tanggal_kadaluarsa: string;
    is_current: boolean;
  }[];
  ttd: {
    kota: string;
    tanggal: string;
  };
}

export interface PegawaiData {
  id: number;
  nik: string;
  nip: string | null;
  nama: string;
  email: string;
  no_telp: string;
  tanggal_lahir: string;
  jk: "Laki-laki" | "Perempuan";
  agama: string;
  status_kawin: string;
  alamat: string;
  jenis_pegawai: string;
  profesi: string;
  unit_kerja: string;
  jabatan_sekarang: string;
  pangkat: string;
  golongan_ruang: string;
  tgl_masuk: string;
  tmt_cpns: string | null;
  tmt_pns: string | null;
  status_pegawai: string;
  link_photo_profile: string | null;
}

export interface PegawaiListResponse {
  total: number;
  items: PegawaiData[];
}

export interface DetailPegawaiInfo {
  id_pegawai: number;
  nik: string;
  nip: string | null;
  nama: string;
  email: string;
  link_photo_profil: string | null;
  jabatan: string | null;
  unit_kerja: string | null;
  profesi: string | null;
  golongan_ruang: string | null;
  pangkat: string | null;
  jenis_pegawai: string | null;
  status_pegawai: string | null;
  tgl_masuk: string | null;
  tmt_cpns: string | null;
  tmt_pns: string | null;
}

export interface DetailPribadiInfo {
  jenis_kelamin: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  agama: string | null;
  status_perkawinan: string | null;
  alamat: string | null;
  no_hp: string | null;
  no_telp: string | null;
  npwp: string | null;
  bpjs_kesehatan: string | null;
  bpjs_ketenagakerjaan: string | null;
}

export interface DetailPasanganItem {
  id: number;
  nama: string;
  status_hubungan: string;
  pekerjaan: string | null;
  no_hp: string | null;
}

export interface DetailAnakItem {
  id: number;
  nama: string;
  tanggal_lahir: string | null;
  pendidikan: string | null;
}

export interface DetailKeluargaInfo {
  pasangan: DetailPasanganItem[];
  anak: DetailAnakItem[];
  orang_tua: any[];
  kontak_darurat: any[];
  tanggungan_lain: any[];
}

export interface DetailJabatanItem {
  id: number;
  jabatan: string;
  unit_kerja: string;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  is_current: boolean;
}

export interface DetailStrItem {
  id: number;
  nomor_str: string;
  tanggal_terbit: string | null;
  tanggal_kadaluarsa: string | null;
  is_current: boolean;
}

export interface DetailSipItem {
  id: number;
  jenis_sip: string;
  nomor_sip: string;
  tanggal_terbit: string | null;
  tanggal_kadaluarsa: string | null;
  is_current: boolean;
}

export interface DetailPenugasanKlinisItem {
  id: number;
  nomor_surat: string;
  tanggal_mulai: string | null;
  tanggal_kadaluarsa: string | null;
  is_current: boolean;
}

export interface DetailRiwayatKarirInfo {
  jabatan: DetailJabatanItem[];
  str: DetailStrItem[];
  sip: DetailSipItem[];
  penugasan_klinis: DetailPenugasanKlinisItem[];
  pendidikan?: any[];
  pangkat?: any[];
}

export interface DetailDiklatItem {
  id: number;
  nama: string;
  jenis: string;
  kategori: string;
  penyelenggara: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jp: number;
  status_diklat: string;
}

export interface DetailPegawaiResponse {
  pegawai: DetailPegawaiInfo;
  pribadi: DetailPribadiInfo;
  keluarga: DetailKeluargaInfo;
  riwayat_karir: DetailRiwayatKarirInfo;
  diklat: DetailDiklatItem[];
}


