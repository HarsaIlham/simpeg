# Catatan Bug & Sinkronisasi API (11 Juni 2026)

Dokumen ini berisi catatan mengenai temuan bug, penyesuaian di Frontend (FE), serta rekomendasi perubahan pada Backend (BE) untuk sinkronisasi fitur.

---

## 1. Validasi Field `jurusan` pada Riwayat Pendidikan (Penting - Perlu Tindakan di BE)

### Masalah:
*   **Alur di FE:** Pada form tambah/edit riwayat pendidikan, jika pegawai memilih jenjang pendidikan **SD** atau **SMP**, secara logis tidak ada "jurusan". Oleh karena itu, FE akan menyembunyikan input jurusan dan mengirimkan nilai `null` (atau tidak mengirimkan field `jurusan`) ke BE.
*   **Kendala di BE:** Saat ini, class validation di BE (`StorePendidikanRequest.php` dan `UpdatePendidikanRequest.php`) mewajibkan field `jurusan` diisi (`required`):
    ```php
    'jurusan' => ['required', 'string', 'max:255'],
    ```
    Hal ini menyebabkan request dari FE ditolak oleh BE dengan error `422 Validasi gagal`.

### Rekomendasi Solusi untuk BE:
Ubah aturan validasi untuk field `jurusan` menjadi **`nullable`** agar dapat menerima nilai `null` ketika jenjang pendidikan tidak memiliki jurusan (seperti SD/SMP).
```php
'jurusan' => ['nullable', 'string', 'max:255'],
```
*Catatan: Mohon pastikan kolom `jurusan` pada tabel database terkait (`riwayat_pendidikan` / sejenisnya) juga sudah diset menjadi nullable di migration.*
    

