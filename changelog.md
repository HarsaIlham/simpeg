# Changelog - 11 Juni 2026

Berikut adalah ringkasan perubahan dan perbaikan yang diimplementasikan pada proyek hari ini:

---

## 1. Pembatasan Edit Diklat Internal pada Halaman DataDiklat
*   **Komponen:** `src/components/pages/DataDiklat/DataDiklat.tsx`
*   **Perubahan:**
    *   Pengguna hanya diizinkan untuk mengedit diklat bertipe **internal** jika diklat tersebut dibuat/dicatat oleh pengguna yang bersangkutan (`diklat.pencatat === user.nama`).
    *   Tombol edit (ikon pensil) pada `CardDiklat` akan disembunyikan secara otomatis untuk diklat internal yang dibuat oleh orang lain.
    *   Jika fungsi edit diakses secara paksa, sistem akan menampilkan popup peringatan: *"Anda hanya dapat mengedit diklat internal yang Anda buat sendiri."*

## 2. Penyimpanan Global Nilai Auth (Zustand Store)
*   **Komponen:** `src/store/useAuthStore.ts`, `src/contexts/AuthContext.tsx`, `src/utils/api.ts`
*   **Perubahan:**
    *   Membuat store Zustand `useAuthStore` untuk mengelola data user, token, dan inisialisasi sesi secara global dan terpusat.
    *   Mengekspos helper `getGlobalUser()` dan `getGlobalToken()` dari store Zustand agar utility non-React (seperti `apiFetch` di `api.ts`) dan komponen-komponen React non-reaktif dapat langsung membaca data autentikasi dari memori tanpa overhead pembacaan disk (`localStorage`) secara terus menerus.
    *   Menerapkan fungsi getter non-reaktif `getGlobalUser()` di berbagai komponen (`Pegawai.tsx`, `PegawaiHrd.tsx`, `Home.tsx`, `DashboardPegawai.tsx`, `DataDiklat.tsx`, `DetailPegawai.tsx`) untuk mengoptimalkan performa rendering.

## 3. Integrasi DataTable pada DashboardAdmin
*   **Komponen:** `src/components/pages/Home/templates/DashboardAdmin/DashboardAdmin.tsx`
*   **Perubahan:**
    *   Mengubah tampilan daftar pengajuan perubahan data pegawai dari model kartu (`CardRequest`) menjadi format tabel terstruktur menggunakan komponen `DataTable`.
    *   Kolom yang disediakan mencakup: Pengirim (Nama & Role), Fitur / Bagian yang diubah, Jumlah field yang berubah, Tanggal pengajuan (format relatif), Badge Status, dan tombol aksi "Tinjau".
