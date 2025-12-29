# Next.js Project (Vercel Deployment Branch)

Ini adalah proyek [Next.js](https://nextjs.org) yang di-bootstrap menggunakan [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## ⚠️ Tentang Branch Ini

**Branch ini dikhususkan untuk keperluan Deployment ke Vercel.**

Fokus utama dari versi ini adalah demonstrasi antarmuka dan fungsionalitas front-end menggunakan arsitektur **Serverless**. Harap diperhatikan bahwa:

* **Data Dummy:** Aplikasi ini **tidak** terhubung ke database eksternal (Real DB). Semua data yang ditampilkan adalah data statis (dummy/mock data) untuk tujuan testing dan demo.
* **Serverless Ready:** Kode telah dioptimalkan agar berjalan mulus di lingkungan serverless Vercel tanpa perlu konfigurasi backend yang rumit.

## 🚀 Cara Menjalankan (Getting Started)

Pertama, jalankan development server:

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev

Buka http://localhost:3000 pada browser Anda untuk melihat hasilnya.

Anda dapat mulai mengedit halaman dengan memodifikasi app/page.tsx. Halaman akan diperbarui secara otomatis saat Anda mengedit file tersebut.

Proyek ini menggunakan next/font untuk mengoptimalkan dan memuat Geist, font family baru dari Vercel.

☁️ Deploy ke Vercel
Cara termudah untuk men-deploy aplikasi Next.js ini adalah menggunakan Platform Vercel dari pembuat Next.js.

Panduan Singkat Deployment:
Push branch ini ke repositori Git Anda.

Import project ke Vercel.

Environment Variables: Karena menggunakan Data Dummy, Anda tidak perlu mengatur environment variable untuk koneksi database.

Klik Deploy.

Lihat Dokumentasi deployment Next.js untuk detail lebih lanjut.

📚 Pelajari Lebih Lanjut
Untuk mempelajari lebih lanjut tentang Next.js, silakan lihat sumber daya berikut:

Dokumentasi Next.js - pelajari fitur dan API Next.js.

Learn Next.js - tutorial interaktif Next.js.

Anda juga dapat melihat repositori GitHub Next.js - masukan dan kontribusi Anda sangat diterima!
