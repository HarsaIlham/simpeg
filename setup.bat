@echo off
echo === Memulai Setup Frontend SIMPEG RS Kalisat (Windows) ===

echo 1. Menginstal dependensi...
call npm install

echo 2. Membangun aset produksi...
call npm run build

echo 3. Menjalankan Docker Compose...
docker network inspect simpeg_network >nul 2>&1
if %errorlevel% neq 0 (
    echo Membuat network simpeg_network...
    docker network create simpeg_network
)

docker compose up -d --build

echo === Setup Selesai! Aplikasi berjalan di http://localhost:8080 ===
pause
