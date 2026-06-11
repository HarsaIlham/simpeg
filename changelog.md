# Changelog - 11 Juni 2026

Berikut adalah ringkasan perubahan dan perbaikan yang diimplementasikan pada proyek hari ini:

---

## 1. Pembatasan Edit Diklat Internal pada Halaman DataDiklat
*   **Komponen:** `src/components/pages/DataDiklat/DataDiklat.tsx`
*   **Perubahan:**
    *   Pengguna hanya diizinkan untuk mengedit diklat bertipe **internal** jika diklat tersebut dibuat/dicatat oleh pengguna yang bersangkutan (`diklat.pencatat === user.nama`).
    *   Tombol edit (ikon pensil) pada `CardDiklat` akan disembunyikan secara otomatis untuk diklat internal yang dibuat oleh orang lain.
    *   Jika fungsi edit diakses secara paksa, sistem akan menampilkan popup peringatan: *"Anda hanya dapat mengedit diklat internal yang Anda buat sendiri."*

## 2. Penyimpanan Global Nilai Auth (Memory Cache)
*   **Komponen:** `src/contexts/AuthContext.tsx`, `src/utils/api.ts`
*   **Perubahan:**
    *   Menambahkan variabel global `globalUser` dan `globalToken` dalam `AuthContext.tsx` untuk menyimpan data autentikasi langsung di memory cache.
    *   Mengekspos fungsi `getGlobalUser()` dan `getGlobalToken()` agar file non-React (seperti `api.ts`) dapat mengakses data token secara langsung tanpa overhead pembacaan `localStorage.getItem` secara berulang-ulang pada setiap pemanggilan API.
