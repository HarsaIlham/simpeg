# SIMPEG RSD Kalisat (Sistem Informasi Manajemen Kepegawaian)

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg)](https://vite.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5.x-orange.svg)](https://github.com/pmndrs/zustand)
[![MUI](https://img.shields.io/badge/MUI-9.x-blue.svg)](https://mui.com/)

SIMPEG RSD Kalisat adalah aplikasi Sistem Informasi Manajemen Kepegawaian yang dirancang khusus untuk memenuhi kebutuhan administrasi, pendataan, dan monitoring pegawai di Rumah Sakit Daerah Kalisat. Aplikasi ini dikembangkan dengan arsitektur **Atomic Design** yang terstruktur, state management modern menggunakan **Zustand**, dan navigasi berbasis peran (Role-based routing).

---

## 🌟 Fitur Utama

- **Dashboard Kepegawaian & HRD**: Visualisasi data pegawai, grafik statistik pelatihan (Diklat), dan rekapitulasi data menggunakan *Recharts*.
- **Manajemen Data Pegawai (CRUD)**: Pengelolaan informasi profil, riwayat jabatan, kepangkatan, pendidikan, STR (Surat Tanda Registrasi), SIP (Surat Izin Praktik), penugasan klinis, dan data keluarga.
- **Monitoring & Pelaporan Diklat**: Cetak dan rekap data Diklat pegawai ke dalam format Excel (*ExcelJS* & *File-saver*) serta PDF (*React-PDF*).
- **Sistem Verifikasi & Validasi Dokumen**: Pengajuan perubahan data oleh pegawai dan validasi dokumen pendukung secara real-time oleh HRD/Admin.
- **Preview PDF Terintegrasi**: Fitur pratinjau dokumen PDF (KTP, KK, STR, SIP, dll.) langsung di dalam aplikasi menggunakan modal interaktif (`PdfViewerModal`).
- **Autentikasi & Otorisasi**: Manajemen sesi pengguna dengan *Auth Context* dan pembagian hak akses (Pegawai, HRD, Admin).

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: React 19, TypeScript
- **Build Tool**: Vite 8
- **State Management**: Zustand & React Context
- **Routing**: React Router DOM v7
- **UI Components & Styling**: Material UI (MUI), Lucide React (Icons), Vanilla CSS (Modular CSS)
- **Visualisasi Data**: Recharts
- **Pustaka Dokumen & Ekspor**: `@react-pdf/renderer` & `react-pdf` (Pratinjau & Cetak PDF), `exceljs` & `file-saver` (Ekspor Excel)

---

## 🚀 Panduan Setup & Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

### 📋 Prasyarat (Prerequisites)

Pastikan Anda telah menginstal perangkat lunak berikut di komputer Anda:
- [Node.js](https://nodejs.org/) (versi **18.x** ke atas direkomendasikan)
- [Git](https://git-scm.com/)

---

### 1. Kloning Repositori (Clone Repository)

Buka terminal atau command prompt Anda, lalu jalankan perintah berikut:

```bash
git clone https://github.com/HarsaIlham/simpeg.git
cd simpeg-kalisat
```

---

### 2. Instalasi Dependensi (Install Dependencies)

Instal semua paket dependensi yang dibutuhkan oleh proyek:

```bash
npm install
```

---

### 3. Konfigurasi Environment Variables

Buat sebuah file baru bernama `.env` di direktori utama (root) proyek ini (sejajar dengan `package.json`), kemudian tambahkan konfigurasi base URL API backend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

> [!NOTE]
> Sesuaikan URL di atas dengan alamat server backend SIMPEG Anda yang sedang berjalan.

---

### 4. Menjalankan Server Pengembangan (Development Server)

Jalankan perintah berikut untuk memulai server lokal untuk pengembangan:

```bash
npm run dev
```

Setelah server berjalan, Anda dapat mengakses aplikasi melalui peramban (browser) di alamat:
`http://localhost:5173` (atau port lain yang tertera di terminal Anda).

---

### 5. Membuat Build Produksi (Production Build)

Untuk mengompilasi dan mengoptimalkan kode proyek ke dalam bentuk siap rilis (produksi):

```bash
npm run build
```

Hasil build akan tersimpan di dalam folder `dist/` dan siap di-deploy ke web server pilihan Anda.

---

### 6. Menjalankan Preview Build Produksi

Untuk menguji hasil build produksi secara lokal sebelum melakukan deployment:

```bash
npm run preview
```

---

## 📁 Struktur Direktori Utama

```text
simpeg-kalisat/
├── public/                 # Aset statis publik
├── src/
│   ├── assets/             # Aset gambar, logo, dan ikon
│   ├── components/         # Komponen UI terstruktur
│   │   ├── pages/          # Halaman aplikasi (Login, Home, Profil, Pegawai, dll.)
│   │   ├── sidebar/        # Komponen navigasi sidebar
│   │   └── ui/             # Reusable UI components
│   │       ├── atoms/      # Elemen terkecil (Button, Badge, Input, Select, Text)
│   │       ├── molecules/  # Gabungan atom (StatCard, FilterBar, PdfViewerModal)
│   │       └── organisms/  # Komponen kompleks (Topbar, FormAkun, CardJabatan, dll.)
│   ├── contexts/           # React Context (AuthContext, SidebarContext)
│   ├── data/               # Data statis dan dummy data untuk simulasi
│   ├── hooks/              # Custom React Hooks
│   ├── routes/             # Konfigurasi routing (ProtectedRoute, Route)
│   ├── services/           # Logika komunikasi API backend (auth, pegawai, diklat, dll.)
│   ├── stores/             # Zustand global stores
│   ├── styles/             # Global CSS style rules
│   ├── types/              # Deklarasi tipe data TypeScript
│   ├── utils/              # Fungsi utilitas (formatting, pdf, excel helpers)
│   ├── main.tsx            # Entry point aplikasi
│   └── vite-env.d.ts
├── .env                    # Konfigurasi environment (diabaikan oleh git)
├── .gitignore              # Daftar file/folder yang diabaikan git
├── eslint.config.js        # Konfigurasi linter kode ESLint
├── package.json            # Konfigurasi proyek & dependensi npm
├── tsconfig.json           # Konfigurasi TypeScript
└── vite.config.ts          # Konfigurasi build tool Vite
```

---

## 🤝 Kontribusi

Jika Anda ingin berkontribusi dalam pengembangan SIMPEG RSD Kalisat:
1. Fork repositori ini.
2. Buat branch fitur baru (`git checkout -b fitur/FiturBaru`).
3. Lakukan commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`).
4. Push ke branch tersebut (`git push origin fitur/FiturBaru`).
5. Buat Pull Request di GitHub.
