// import type {
//     ChartDataItem,
//     DashboardHrdData,
//     DashboardDiklatAsnData,
//     DashboardDiklatNakesData,
// } from "../types/api";


// const jenisPegawai: ChartDataItem[] = [
//     { label: "PNS", value: 45 },
//     { label: "P3K", value: 30 },
//     { label: "Honorer", value: 28 },
//     { label: "Magang", value: 12 },
//     { label: "ASN", value: 8 },
// ];

// const profesiPegawai: ChartDataItem[] = [
//     { label: "Dokter", value: 25 },
//     { label: "Perawat", value: 60 },
//     { label: "Bidan", value: 15 },
//     { label: "Apoteker", value: 8 },
//     { label: "Admin", value: 10 },
//     { label: "Lainnya", value: 5 },
// ];

// const tingkatPendidikan: ChartDataItem[] = [
//     { label: "S2", value: 5 },
//     { label: "S1/D4", value: 48 },
//     { label: "D3", value: 38 },
//     { label: "D1", value: 2 },
//     { label: "D2", value: 4 },
//     { label: "SMA/Sederajat", value: 26 },
// ];

// const tahunMasuk: ChartDataItem[] = [
//     { label: "2019", value: 15 },
//     { label: "2020", value: 22 },
//     { label: "2021", value: 30 },
//     { label: "2022", value: 48 },
//     { label: "2023", value: 35 },
//     { label: "2024", value: 28 },
//     { label: "2025", value: 20 },
// ];

// export const DUMMY_HRD_PEGAWAI: DashboardHrdData = {
//     summary: {
//         total_pegawai: 123,
//         belum_isi_data: 12,
//         data_lengkap: 111,
//     },
//     jenis_pegawai: jenisPegawai,
//     profesi_pegawai: profesiPegawai,
//     tingkat_pendidikan: tingkatPendidikan,
//     tahun_masuk: tahunMasuk,
    
// };

// const kategoriDiklatAsn: ChartDataItem[] = [
//     { label: "Struktural", value: 45 },
//     { label: "Fungsional", value: 30 },
//     { label: "Teknis", value: 15 },
// ];

// const asnProfesi: ChartDataItem[] = [
//     { label: "Dokter", value: 18 },
//     { label: "Perawat", value: 55 },
//     { label: "Bidan", value: 12 },
//     { label: "Apoteker", value: 6 },
//     { label: "Admin", value: 15 },
//     { label: "Lainnya", value: 5 },
// ];

// const asnBelumSudahDiklat: ChartDataItem[] = [
//     { label: "Sudah Diklat", value: 80 },
//     { label: "Belum Diklat", value: 20 },
// ];

// export const DUMMY_HRD_DIKLAT_ASN: DashboardDiklatAsnData = {
//     summary: {
//         total_asn: 123,
//         asn_aktif: 111,
//         asn_nonaktif: 12,
//     },
//     jumlah_kategori_diklat: kategoriDiklatAsn,
//     profesi_pegawai: asnProfesi,
//     belum_sudah_diklat: asnBelumSudahDiklat,
//     kategori_diklat: {
//         teknis: 45,
//         seminar: 45,
//         webinar: 45,
//     },
// };


// const nakesStrSipAkanHabis: ChartDataItem[] = [
//     { label: "STR", value: 30 },
//     { label: "SIP", value: 80 },
// ];

// const nakesBelumSudahDiklat: ChartDataItem[] = [
//     { label: "2020", value: 18 },
//     { label: "2021", value: 22 },
//     { label: "2022", value: 30 },
//     { label: "2023", value: 48 },
//     { label: "2024", value: 35 },
//     { label: "2025", value: 42 },
// ];

// export const DUMMY_HRD_DIKLAT_NAKES: DashboardDiklatNakesData = {
//     summary: {
//         total_nakes: 123,
//         nakes_aktif: 111,
//         nakes_nonaktif: 12,
//     },
//     str_sip_akan_habis: nakesStrSipAkanHabis,
//     sip_summary: {
//         sip_aktif: 45,
//         sip_nonaktif: 45,
//         cpd: 45,
//     },
//     belum_sudah_diklat: nakesBelumSudahDiklat,
//     kategori_diklat: {
//         akreditasi_mutu: 45,
//         kompetensi_spesifik: 45,
//     },
// };
