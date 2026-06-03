export interface PegawaiItem {
    id: number;
    nama: string;
    jabatan: string;
    nik: string;
    profesi: string;
    status: string; // e.g. "Aktif"
    role: "admin" | "hrd" | "direktur" | "pegawai";
    statusData: "lengkap" | "belum-lengkap";
    jenisPegawai: string; // e.g. "PNS", "PPPK", "Pegawai Kontrak"
    pendidikan: string; // e.g. "D3", "D4", "S1", "S2", "S3"
    statusPegawai: string; // e.g. "PNS", "PPPK", "Pegawai Kontrak"
}

export const dummyPegawaiList: PegawaiItem[] = [
    {
        id: 1,
        nama: "Dr. Ahmad Wijaya",
        jabatan: "pegawai",
        nik: "35097890754002",
        profesi: "Dokter Spesialis Penyakit Dalam",
        status: "Aktif",
        role: "pegawai",
        statusData: "lengkap",
        jenisPegawai: "PNS",
        pendidikan: "S2",
        statusPegawai: "PNS"
    },
    {
        id: 2,
        nama: "Dr. Budi Santoso",
        jabatan: "HRD",
        nik: "35097890754002",
        profesi: "Dokter Spesialis Bedah",
        status: "Aktif",
        role: "hrd",
        statusData: "lengkap",
        jenisPegawai: "PNS",
        pendidikan: "S2",
        statusPegawai: "PNS"
    },
    {
        id: 3,
        nama: "Ns. Siti Rahayu",
        jabatan: "Direktur",
        nik: "35097890754002",
        profesi: "Perawat",
        status: "Aktif",
        role: "direktur",
        statusData: "lengkap",
        jenisPegawai: "PNS",
        pendidikan: "S1",
        statusPegawai: "PNS"
    },
    {
        id: 4,
        nama: "Dr. Lisa Permata",
        jabatan: "Admin",
        nik: "35097890754002",
        profesi: "Perawat",
        status: "Aktif",
        role: "admin",
        statusData: "lengkap",
        jenisPegawai: "PPPK",
        pendidikan: "S1",
        statusPegawai: "PPPK"
    },
    {
        id: 5,
        nama: "Apt. Eko Prasetyo",
        jabatan: "pegawai",
        nik: "35097890754002",
        profesi: "Apoteker",
        status: "Aktif",
        role: "pegawai",
        statusData: "belum-lengkap",
        jenisPegawai: "Pegawai Kontrak",
        pendidikan: "S1",
        statusPegawai: "Pegawai Kontrak"
    },
    {
        id: 6,
        nama: "Dr. Hendra Kusuma",
        jabatan: "pegawai",
        nik: "35097890754003",
        profesi: "Dokter Spesialis Anak",
        status: "Aktif",
        role: "pegawai",
        statusData: "lengkap",
        jenisPegawai: "PNS",
        pendidikan: "S2",
        statusPegawai: "PNS"
    },
    {
        id: 7,
        nama: "Ns. Kartika Sari",
        jabatan: "pegawai",
        nik: "35097890754004",
        profesi: "Perawat",
        status: "Aktif",
        role: "pegawai",
        statusData: "belum-lengkap",
        jenisPegawai: "PPPK",
        pendidikan: "D3",
        statusPegawai: "PPPK"
    },
    {
        id: 8,
        nama: "Apt. Mega Wati",
        jabatan: "pegawai",
        nik: "35097890754005",
        profesi: "Apoteker",
        status: "Aktif",
        role: "pegawai",
        statusData: "lengkap",
        jenisPegawai: "Pegawai Kontrak",
        pendidikan: "S1",
        statusPegawai: "Pegawai Kontrak"
    }
];

export const dummyPesertaDiklatMap: Record<number, number[]> = {
    1: [1, 3],      
    2: [2, 5],     
    3: [1, 4, 7],   
};
