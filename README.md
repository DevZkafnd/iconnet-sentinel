Proyek Next.js (Vercel Deployment Branch)
Ini adalah proyek Next.js yang di-bootstrap menggunakan create-next-app.

⚠️ Catatan Penting: Branch ini dikhususkan untuk Deployment Vercel menggunakan Data Dummy dan arsitektur Serverless. Aplikasi ini berjalan tanpa koneksi database eksternal untuk tujuan demonstrasi dan testing antarmuka.

🚀 Memulai (Getting Started)
Pertama, jalankan development server:

Bash

npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
Buka http://localhost:3000 pada browser Anda untuk melihat hasilnya.

Anda dapat mulai mengedit halaman dengan memodifikasi app/page.tsx. Halaman akan diperbarui secara otomatis saat Anda menyimpan file.

Proyek ini menggunakan next/font untuk mengoptimalkan dan memuat Geist, keluarga font baru untuk Vercel.

🛠 Struktur & Fitur Branch Ini
Branch ini dirancang agar mudah di-deploy tanpa konfigurasi backend yang rumit:

Data Dummy: Semua data yang ditampilkan diambil dari file JSON statis atau hardcoded array. Tidak diperlukan setup MySQL, PostgreSQL, atau MongoDB.

Serverless Functions: Endpoint API (jika ada) berjalan menggunakan Vercel Serverless Functions untuk menyajikan data dummy tersebut.

☁️ Deploy ke Vercel
Cara termudah untuk men-deploy aplikasi Next.js ini adalah menggunakan Platform Vercel dari pembuat Next.js.

Langkah-langkah Deployment:
Push kode dari branch ini ke penyedia Git Anda (GitHub, GitLab, atau Bitbucket).

Masuk ke dashboard Vercel dan pilih "Add New Project".

Import repositori yang berisi proyek ini.

Konfigurasi Build: Biarkan pengaturan default (Build command: next build, Output directory: .next).

Environment Variables: Karena menggunakan data dummy, Anda tidak perlu memasukkan kredensial database apa pun.

Klik Deploy.

Lihat Dokumentasi Deployment Next.js untuk detail lebih lanjut.

📚 Pelajari Lebih Lanjut
Untuk mempelajari lebih lanjut tentang Next.js, lihat sumber daya berikut:

Dokumentasi Next.js - pelajari fitur dan API Next.js.

Learn Next.js - tutorial interaktif Next.js.

Anda dapat melihat repositori GitHub Next.js - masukan dan kontribusi Anda sangat diterima!
