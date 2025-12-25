# Panduan Deployment ke Vercel

Aplikasi ini sudah siap untuk dideploy ke Vercel. Berikut adalah langkah-langkahnya:

## 1. Persiapan Repository
Pastikan kode Anda sudah di-push ke GitHub, GitLab, atau Bitbucket.

## 2. Setup di Vercel
1. Buka dashboard [Vercel](https://vercel.com).
2. Klik **"Add New..."** -> **"Project"**.
3. Import repository `iconnet-sentinel` Anda.

## 3. Konfigurasi Environment Variables
Di halaman konfigurasi project di Vercel ("Configure Project"), cari bagian **Environment Variables**.
Anda **WAJIB** menambahkan variabel berikut agar fitur login berfungsi:

| Key | Value | Keterangan |
|-----|-------|------------|
| `AUTH_SECRET` | (Gunakan string acak panjang) | Anda bisa generate baru atau gunakan yang ada di `.env.local` |
| `NEXTAUTH_SECRET` | (Sama dengan AUTH_SECRET) | Untuk kompatibilitas NextAuth |
| `NEXTAUTH_URL` | `https://nama-project-anda.vercel.app` | URL domain yang diberikan Vercel (opsional, Vercel biasanya auto-detect) |

> **Tips:** Untuk `AUTH_SECRET`, Anda bisa copy string berikut (ini string acak baru):
> `82d51fa2a66aec0983cec94c14c5dad6ef5824af9bd2f56543ecd9678cfdd0a2`

## 4. Deploy
Klik tombol **"Deploy"**. Vercel akan otomatis:
1. Menginstall dependencies (`npm install`).
2. Melakukan build (`npm run build`).
3. Menjalankan server.

## Catatan Keamanan (Security)
- **Cookies**: Aplikasi ini menggunakan `HttpOnly` cookies yang terenkripsi. Cookie ini tidak bisa dibaca oleh JavaScript browser (anti-XSS) dan hanya dikirim melalui koneksi HTTPS (di production).
- **CSRF**: NextAuth secara otomatis memproteksi dari serangan Cross-Site Request Forgery.
- **Stateless**: Karena menggunakan strategi `JWT`, sesi user disimpan di dalam token terenkripsi, sehingga sangat cepat dan cocok untuk serverless (Vercel).
