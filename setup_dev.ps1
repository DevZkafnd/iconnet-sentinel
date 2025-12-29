# Script Kompresi Manual & Setup Dev
# Menghapus cache Docker dan membangun ulang container dengan konfigurasi optimal

Write-Host "=== ICONNET SENTINEL DEV SETUP ==="
Write-Host "1. Membersihkan System Docker (Prune)..."
docker system prune -a --volumes -f

Write-Host "2. Membangun Container (No Cache)..."
docker-compose up -d --build --force-recreate

Write-Host "3. Selesai! Backend berjalan di http://localhost:8000"
Write-Host "   Gunakan endpoint /force-run/news atau /force-run/social untuk test worker."
