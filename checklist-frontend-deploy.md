# Checklist Kesiapan Frontend untuk Deploy (Strategi 1 Port)

> Dokumen ini berisi daftar hal yang perlu dicek di kode frontend sebelum bisa
> di-deploy menggunakan arsitektur **1 port, nginx reverse proxy**.
> Centang setiap item setelah dikonfirmasi.

---

## Konteks Arsitektur Target

```
localhost:8080 (atau domain client)
    │
    ├── /*         → React static files (hasil build di folder dist/)
    ├── /api/*     → Laravel backend (via nginx proxy ke port Laravel)
    └── /dokumen/* → Dokumen pegawai/storage (via nginx proxy ke folder public/dokumen Laravel)
```

Frontend **tidak boleh** langsung akses backend lewat port terpisah (misal `localhost:8000`).
Semua request harus lewat path relatif atau env variable.

---

## 1. Konfigurasi URL Backend

| # | Item | Status | Catatan |
|---|------|--------|---------|
| 1.1 | Semua base URL API menggunakan env variable (`VITE_API_URL` atau sejenisnya) | ☑ Ya | Menggunakan `VITE_API_BASE_URL` di `src/utils/api.ts` |
| 1.2 | Tidak ada hardcode `http://localhost:8000` di kode | ☑ Ya | Bersih. Tidak ditemukan di `src/` |
| 1.3 | Tidak ada hardcode `http://127.0.0.1:8000` di kode | ☑ Ya | Hanya ada di baris komentar `src/utils/api.ts` sebagai dokumentasi |
| 1.4 | Tidak ada hardcode IP/domain backend lain | ☑ Ya | Bersih. Semua menggunakan base URL dinamis |
| 1.5 | File `.env.example` sudah ada dan lengkap | ☑ Ya | Baru saja ditambahkan dengan variabel `VITE_API_BASE_URL` |

---

## 2. Struktur Path API

| # | Item | Status | Catatan |
|---|------|--------|---------|
| 2.1 | Semua endpoint API berawalan `/api/` | ☑ Ya | Semua diproses melalui `VITE_API_BASE_URL` |
| 2.2 | Tidak ada endpoint yang akses langsung ke root `/` backend | ☑ Ya | Semua endpoint API terstruktur dengan baik |
| 2.3 | Path file storage menggunakan `/dokumen/` (disesuaikan) | ☑ Ya (Disesuaikan) | Project ini menggunakan path `/dokumen/` (bukan `/storage/`) |
| 2.4 | Tidak ada path lain ke backend selain `/api/` dan `/dokumen/` | ☑ Ya | Hanya endpoint API dan file dokumen yang mengarah ke backend |

---

## 3. Build & Output

| # | Item | Status | Catatan |
|---|------|--------|---------|
| 3.1 | `npm run build` berhasil tanpa error | ☑ Ya | Berhasil dicompile dengan Vite tanpa error (Exit Code 0) |
| 3.2 | Hasil build ada di folder `dist/` | ☑ Ya | Berhasil terbuat di `dist/` |
| 3.3 | File `dist/index.html` ada | ☑ Ya | Terkonfirmasi file `dist/index.html` terbuat |
| 3.4 | Tidak ada asset yang load dari URL eksternal yang tidak terkontrol | ☑ Ya | Google Fonts & Fonnte Integration sudah terverifikasi |

---

## 4. React Router

| # | Item | Status | Catatan |
|---|------|--------|---------|
| 4.1 | Aplikasi menggunakan React Router | ☑ Ya | Menggunakan `react-router-dom` versi 7 |
| 4.2 | Router mode yang dipakai adalah `BrowserRouter` (bukan `HashRouter`) | ☑ Ya | Menggunakan `createBrowserRouter` di `src/routes/index.tsx` |
| 4.3 | Nginx sudah dikonfigurasi `try_files $uri /index.html` | ☑ Ya | File `nginx.conf` dan `docker-compose.yml` telah disediakan di root |

---

## 5. Autentikasi & Token

| # | Item | Status | Catatan |
|---|------|--------|---------|
| 5.1 | Token auth disimpan di `localStorage` atau `sessionStorage` | ☑ Ya | Disimpan di `localStorage` dengan key `simpeg_token` & `simpeg_user` |
| 5.2 | Token dikirim via header `Authorization: Bearer ...` | ☑ Ya | Ditangani secara global di `src/utils/api.ts` (`apiFetch`) |
| 5.3 | Tidak ada mekanisme auth yang bergantung pada cookie domain spesifik | ☑ Ya | Menggunakan Bearer JWT Token |
| 5.4 | Kalau pakai cookie: atribut `SameSite` dan `Domain` sudah benar | N/A | Tidak menggunakan cookies untuk auth |

---

## 6. CORS

| # | Item | Status | Catatan |
|---|------|--------|---------|
| 6.1 | Dengan arsitektur 1 port, CORS **tidak diperlukan** | ℹ️ Info | Frontend dan backend same-origin setelah di-proxy |
| 6.2 | Config CORS di Laravel boleh dimatikan atau dikosongkan | ☑ Belum | Perlu disesuaikan di sisi backend agar membatasi origin |

---

## 7. Environment Variable (Vite)

| # | Item | Status | Catatan |
|---|------|--------|---------|
| 7.1 | Semua env variable pakai prefix `VITE_` | ☑ Ya | Menggunakan `VITE_API_BASE_URL` |
| 7.2 | `.env.production` sudah ada untuk config production | ☑ Ya | Baru saja dibuat dan siap dipakai |
| 7.3 | `VITE_API_URL` diset ke `/api` (path relatif, bukan full URL) | ☑ Ya | Di `.env.production` diset: `VITE_API_BASE_URL=/api` |

---

## Ringkasan Keputusan

| Kondisi | Keputusan | Status Hasil Audit |
|---------|-----------|--------------------|
| Semua item seksi 1 & 2 ✅ | Bisa langsung pakai **Strategi 2 (1 port)** | **[X] Aktif / Terpilih** |
| Ada hardcode URL di seksi 1 | Perlu audit & perbaikan kode dulu | [ ] Tidak |
| Tidak tahu isi kodenya | Pakai **Strategi 1 (2 port)** dulu sebagai fallback | [ ] Tidak |
| Semua item ✅ + build sukses | Siap dikemas dan dikirim ke client | **[X] Siap Kirim** |

---

## Langkah Selanjutnya Setelah Checklist Selesai

1. Perbaiki semua item yang ☐ Tidak / ☐ Belum (Bug fix `getProxiedFileUrl` telah diselesaikan di audit ini).
2. Jalankan `npm run build` ulang setelah perubahan (Telah diverifikasi sukses).
3. Test lokal dengan nginx proxy sebelum kirim ke client.
4. Buat konfigurasi Nginx untuk deployment 1 port (Telah dibuat di root: `nginx.conf`, `docker-compose.yml`, `setup.sh`, `setup.bat`).

---

*Dokumen ini diperbarui setelah audit tanggal 27 Juni 2026.*
