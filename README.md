# Iconnet Sentinel

**Iconnet Sentinel** adalah aplikasi dashboard pemantauan reputasi dan sentimen korporat yang dirancang untuk memonitor tren, berita, dan kinerja direksi PT Indonesia Comnets Plus (PLN Icon Plus). Aplikasi ini memberikan visualisasi data yang mendalam mengenai sentimen publik, analisis kompetitor, dan isu-isu utama yang beredar di berbagai platform media.

## 🚀 Status Aplikasi

**Status Saat Ini:** `Prototype / Development`

Aplikasi ini sedang dalam tahap pengembangan aktif dengan backend Python dan database PostgreSQL.
- **Backend:** Python (FastAPI) dengan PostgreSQL.
- **Frontend:** Next.js 16 (React 19) dengan Tailwind CSS v4.
- **Data Source:** Saat ini masih transisi dari data dummy ke database PostgreSQL.

## 💡 Fitur Utama

1.  **Dashboard Eksekutif (Overview)**
    *   Kartu KPI untuk Total Sebutan (Mentions), Skor Sentimen, dan Potensi Jangkauan.
    *   Grafik Tren Harian untuk memantau fluktuasi sebutan merek.
    *   Distribusi Sentimen (Positif, Netral, Negatif).
    *   Daftar Isu Utama (Top Issues) yang sedang tren.
    *   *Verbatim Feed*: Daftar berita dan postingan sosial media terbaru.

2.  **Analisis Kompetitor**
    *   Perbandingan sentimen antara ICONNET dan kompetitor (Indihome, MyRepublic, Biznet).
    *   Tabel detail *Share of Voice* dan skor sentimen per kompetitor.

3.  **Pemantauan Direksi (Directors)**
    *   Profil detail untuk setiap direktur.
    *   Statistik personal (total sebutan, sentimen).
    *   Grafik sentimen dan tren spesifik per direktur.
    *   Feed berita yang difilter khusus untuk direktur yang dipilih.

4.  **Sistem Filter Canggih**
    *   **Filter Global:** Berdasarkan Kata Kunci, Platform (Berita/Sosmed), Produk, dan Sentimen.
    *   **Pencarian Real-time:** Filter berita dan data grafik secara instan saat mengetik.

5.  **Utilitas Tambahan**
    *   **Ekspor PDF:** Fitur cetak laporan cerdas.
    *   **Multi-bahasa:** Dukungan alih bahasa Indonesia (ID) dan Inggris (EN).
    *   **Mode Responsif:** Tampilan yang optimal di Desktop dan Tablet.

## 🛠️ Tech Stack

### Frontend
*   **[Next.js 16](https://nextjs.org/)** (App Router)
*   **[React 19](https://react.dev/)**
*   **[Tailwind CSS v4](https://tailwindcss.com/)**
*   **[Recharts](https://recharts.org/)**

### Backend
*   **[Python 3.9](https://www.python.org/)**
*   **[FastAPI](https://fastapi.tiangolo.com/)**
*   **[SQLAlchemy](https://www.sqlalchemy.org/)** (ORM)
*   **[PostgreSQL](https://www.postgresql.org/)** (Database)

### Infrastructure
*   **Docker & Docker Compose**

## ⚙️ Konfigurasi Environment (.env)

Buat file `.env` di root direktori dan tambahkan konfigurasi berikut:

```env
# Google Search API
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# Proxy Configuration (Optional / Direct Connection for Dev)
# PROXY_ADDRESS=142.111.48.253
# PROXY_PORT=7030
# PROXY_USERNAME=zrvwpceq
# PROXY_PASSWORD=ex08is1exkb4
# PROXY_STRING=http://zrvwpceq:ex08is1exkb4@142.111.48.253:7030

# Database Configuration (Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=sentinel_db
```

## 🚀 Cara Menjalankan

### Menggunakan Docker (Recommended)

Pastikan Docker Desktop sudah terinstal dan berjalan.

**Troubleshooting Disk Penuh:**
Jika mengalami error saat build, bersihkan cache Docker:
1.  Buka Docker Desktop -> Settings -> Resources -> Disk Image location.
2.  Atau klik icon 'Bug' (Troubleshoot) di kanan atas -> **Clean / Purge data** -> Pilih **Disk image**.

**Langkah Menjalankan:**

1.  **Jalankan Container (Backend & Database):**
    ```bash
    docker-compose up -d --build
    ```
    Perintah ini akan menjalankan:
    - PostgreSQL database di port `5432`
    - Python Backend API di `http://localhost:8000`

2.  **Jalankan Frontend:**
    ```bash
    npm install
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser.
