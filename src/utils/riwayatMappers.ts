import type { CardPendidikanData } from "../components/ui/organisms/CardPendidikan/CardPendidikan";
import type { CardJabatanData } from "../components/ui/organisms/CardJabatan/CardJabatan";
import type { CardPangkatData } from "../components/ui/organisms/CardPangkat/CardPangkat";
import type { CardStrData } from "../components/ui/organisms/CardStr/CardStr";
import type { CardSipData } from "../components/ui/organisms/CardSip/CardSip";
import type { CardPenugasanKlinisData } from "../components/ui/organisms/CardPenugasanKlinis/CardPenugasanKlinis";

export const mapPendidikanToCard = (item: any): CardPendidikanData => ({
  id: item.id,
  jenjang: item.jenjang || "",
  institusi: item.institusi || "",
  jurusan: item.jurusan || "",
  tahun_lulus: item.tahun_lulus || "",
  nomor_ijazah: item.nomor_ijazah || "",
  link_ijazah: item.link_ijazah || item.ijazah_file_path || "",
});

export const mapJabatanToCard = (item: any): CardJabatanData => ({
  id: item.id,
  unit_kerja_id: item.unit_kerja_id || 0,
  unit_kerja_nama: item.unit_kerja_nama || item.unit_kerja || "",
  namaJabatan: item.nama_jabatan || item.jabatan || "",
  isCurrent: !!item.is_current,
  tmt_mulai: item.tmt_mulai || item.tanggal_mulai || "",
  tmt_selesai: item.tmt_selesai || item.tanggal_selesai || "",
  link_sk: item.link_sk || item.file_path || null,
  note: item.note || "",
});

export const mapPangkatToCard = (item: any): CardPangkatData => ({
  id: item.id,
  namaPangkat: item.nama_pangkat || item.pangkat || "",
  isCurrent: !!item.is_current,
  pejabatPenetap: item.pejabat_penetap || null,
  tmtSk: item.tmt_sk || null,
  startedAt: item.started_at || item.tanggal_mulai || null,
  endedAt: item.ended_at || item.tanggal_selesai || null,
  linkSk: item.link_sk || null,
  note: item.note || "",
});

export const mapStrToCard = (item: any): CardStrData => ({
  id: item.id,
  nomorStr: item.nomor_str || "",
  tanggalTerbit: item.tanggal_terbit || "",
  tanggalKadaluarsa: item.tanggal_kadaluarsa || null,
  isCurrent: !!item.is_current,
  linkSk: item.link_sk || item.file_path || null,
});

export const mapSipToCard = (item: any): CardSipData => ({
  id: item.id,
  jenisSipId: item.jenis_sip_id || 0,
  jenisSipNama: item.jenis_sip_nama || item.jenis_sip || "",
  nomorSip: item.nomor_sip || "",
  tanggalTerbit: item.tanggal_terbit || "",
  tanggalKadaluarsa: item.tanggal_kadaluarsa || null,
  isCurrent: !!item.is_current,
  linkSk: item.link_sk || item.file_path || null,
});

export const mapPenugasanToCard = (item: any): CardPenugasanKlinisData => ({
  id: item.id,
  nomorSurat: item.nomor_surat || "",
  tglMulai: item.tgl_mulai || item.tanggal_mulai || "",
  tglKadaluarsa: item.tgl_kadaluarsa || item.tanggal_kadaluarsa || null,
  isCurrent: !!item.is_current,
  linkDokumen: item.link_dokumen || item.file_path || null,
});
