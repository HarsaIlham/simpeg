#!/bin/bash
echo "=== Memulai Setup Frontend SIMPEG RS Kalisat ==="

# 1. Install dependencies
echo "1. Menginstal dependensi..."
npm install

# 2. Build aplikasi
echo "2. Membangun aset produksi..."
npm run build

# 3. Jalankan Docker Compose
echo "3. Menjalankan Docker Compose..."
# Buat network jika belum ada
docker network inspect simpeg_network >/dev/null 2>&1 || docker network create simpeg_network

docker compose up -d --build

echo "=== Setup Selesai! Aplikasi berjalan di http://localhost:8080 ==="
