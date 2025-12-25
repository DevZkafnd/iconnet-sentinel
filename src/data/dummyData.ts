export interface Direktur {
  id: number;
  nama: string;
  jabatan: string;
  produk: string;
  gambar: string;
  sentimen: number; // 0-100
  kataKunciUtama: string[]; // Added
  statistik: {
    totalSebutan: number;
    positif: number;
    negatif: number;
    netral: number;
  };
}

export interface DataTren {
  hari: string;
  sebutan: number;
  label?: string; // Added for annotation
}

export interface ItemBerita {
  id: number;
  idDirektur: number;
  judul: string;
  sumber: string;
  tanggal: string;
  sentimen: 'positive' | 'negative' | 'neutral';
  platform: 'Instagram' | 'Twitter' | 'Facebook' | 'LinkedIn' | 'News' | 'TikTok' | 'Internal' | 'YouTube' | 'Intranet' | 'Google Review' | 'Play Store Review';
  tautan: string;
}

export interface DataKompetitor {
    nama: string;
    positif: number;
    netral: number;
    negatif: number;
}

export interface IsuUtama {
    topik: string;
    jumlah: number;
    sentimen: 'positive' | 'negative' | 'neutral';
}

export const statistikKorporat = {
    totalSebutan: 5644,
    skorSentimen: 73,
    potensiJangkauan: "2.4M",
    perubahanSebutan: 12, // percentage
};

export const analisisKompetitor: DataKompetitor[] = [
    { nama: 'ICONNET', positif: 87, netral: 10, negatif: 3 },
    { nama: 'Indihome', positif: 45, netral: 27, negatif: 28 },
    { nama: 'MyRepublic', positif: 65, netral: 20, negatif: 15 },
    { nama: 'Biznet', positif: 70, netral: 15, negatif: 15 },
];

export const isuUtama: IsuUtama[] = [
    { topik: "Gangguan WiFi", jumlah: 450, sentimen: 'negative' },
    { topik: "Promo Pasang Baru", jumlah: 320, sentimen: 'positive' },
    { topik: "Pelayanan Teknisi", jumlah: 210, sentimen: 'neutral' },
    { topik: "Giveaway Akhir Tahun", jumlah: 180, sentimen: 'positive' },
    { topik: "Tagihan Melonjak", jumlah: 90, sentimen: 'negative' },
];

export const daftarDirektur: Direktur[] = [
  {
    id: 1,
    nama: 'Chipta Perdana',
    jabatan: 'Direktur Utama',
    produk: 'ICONNET',
    gambar: 'https://i.pravatar.cc/150?u=chipta',
    sentimen: 88,
    kataKunciUtama: ["Ekspansi", "Inovasi", "Jaringan"],
    statistik: {
      totalSebutan: 1250,
      positif: 850,
      negatif: 150,
      netral: 250,
    },
  },
  {
    id: 2,
    nama: 'Aditya Syarief',
    jabatan: 'Direktur Perencanaan',
    produk: 'Konektivitas MPLS',
    gambar: 'https://i.pravatar.cc/150?u=aditya',
    sentimen: 92,
    kataKunciUtama: ["Kerjasama B2B", "Strategi", "MPLS"],
    statistik: {
      totalSebutan: 850,
      positif: 700,
      negatif: 50,
      netral: 100,
    },
  },
  {
    id: 3,
    nama: 'Lintje Lumembang',
    jabatan: 'Direktur TI',
    produk: 'PV Rooftop',
    gambar: 'https://i.pravatar.cc/150?u=lintje',
    sentimen: 75,
    kataKunciUtama: ["Green Energy", "Digitalisasi", "PV Rooftop"],
    statistik: {
      totalSebutan: 640,
      positif: 300,
      negatif: 140,
      netral: 200,
    },
  },
  {
    id: 4,
    nama: 'Joyce Lanny Wantannia',
    jabatan: 'Direktur Niaga',
    produk: 'Pemasaran Digital & Bundling',
    gambar: 'https://i.pravatar.cc/150?u=joyce',
    sentimen: 82,
    kataKunciUtama: ["Marketing", "Bundling", "Customer"],
    statistik: {
      totalSebutan: 920,
      positif: 600,
      negatif: 120,
      netral: 200,
    },
  },
  {
    id: 5,
    nama: 'Nyoman Ngurah Widyatnya',
    jabatan: 'Direktur Keuangan',
    produk: 'Manajemen Risiko & Revenue',
    gambar: 'https://i.pravatar.cc/150?u=nyoman',
    sentimen: 80,
    kataKunciUtama: ["Revenue", "Efisiensi", "Audit"],
    statistik: {
      totalSebutan: 430,
      positif: 280,
      negatif: 50,
      netral: 100,
    },
  },
  {
    id: 6,
    nama: 'Soffin Hadi',
    jabatan: 'Direktur Operasi',
    produk: 'Sistem Monitoring Gangguan (NOC)',
    gambar: 'https://i.pravatar.cc/150?u=soffin',
    sentimen: 45,
    kataKunciUtama: ["Gangguan", "Pemadaman", "Komplain"],
    statistik: {
      totalSebutan: 2100,
      positif: 200,
      negatif: 1500,
      netral: 400,
    },
  },
  {
    id: 7,
    nama: 'Dedi Budi Utomo',
    jabatan: 'Direktur MHC',
    produk: 'Layanan Human Capital',
    gambar: 'https://i.pravatar.cc/150?u=dedi',
    sentimen: 85,
    kataKunciUtama: ["SDM", "Pelatihan", "Budaya Kerja"],
    statistik: {
      totalSebutan: 350,
      positif: 250,
      negatif: 20,
      netral: 80,
    },
  },
];

export const umpanBerita: ItemBerita[] = [
  // Chipta Perdana (ICONNET) - High Positive
  { id: 1, idDirektur: 1, judul: 'ICONNET Perluas Jaringan ke 50 Kota Baru', sumber: 'Detik Finance', tanggal: '2 Jam lalu', sentimen: 'positive', platform: 'News', tautan: 'https://detik.com/finance/iconnet-50-kota' },
  { id: 2, idDirektur: 1, judul: 'Dirut PLN Icon Plus Resmikan Kantor Baru', sumber: 'Kompas.com', tanggal: '5 Jam lalu', sentimen: 'positive', platform: 'News', tautan: 'https://kompas.com/properti/iconplus-kantor-baru' },
  { id: 3, idDirektur: 1, judul: 'Internet ICONNET makin stabil, mantap pak Dirut!', sumber: '@netizen_prow', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'Twitter', tautan: 'https://twitter.com/netizen_prow/status/123' },
  { id: 4, idDirektur: 1, judul: 'Capaian Pelanggan ICONNET Tembus 1 Juta', sumber: 'Investor Daily', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://investor.id/iconnet-1-juta' },
  { id: 5, idDirektur: 1, judul: 'Layanan internet desa makin terjangkau', sumber: '@warga_desa', tanggal: '3 Jam lalu', sentimen: 'positive', platform: 'Twitter', tautan: 'https://twitter.com/warga_desa/status/456' },
  { id: 6, idDirektur: 1, judul: 'Inovasi Digital PLN Icon Plus Diapresiasi Menteri', sumber: 'CNN Indonesia', tanggal: '4 Jam lalu', sentimen: 'positive', platform: 'News', tautan: 'https://cnnindonesia.com/teknologi/inovasi-pln' },
  { id: 7, idDirektur: 1, judul: 'Pak Chipta dorong digitalisasi UMKM', sumber: 'Bisnis.com', tanggal: '6 Jam lalu', sentimen: 'positive', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:789' },
  { id: 8, idDirektur: 1, judul: 'Jaringan Fiber Optik ICONNET Makin Luas', sumber: 'TechAsia', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://techasia.com/iconnet-fiber' },
  { id: 9, idDirektur: 1, judul: 'Terima kasih ICONNET sinyal kencang buat WFH', sumber: '@pejuang_wfh', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'Instagram', tautan: 'https://instagram.com/p/abc' },
  { id: 10, idDirektur: 1, judul: 'Program CSR Icon Plus sentuh daerah 3T', sumber: 'Republika', tanggal: '3 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://republika.co.id/csr-iconplus' },
  { id: 11, idDirektur: 1, judul: 'Ada gangguan dikit di area Jaksel tapi cepet bener', sumber: '@anak_jaksel', tanggal: '5 Jam lalu', sentimen: 'neutral', platform: 'Twitter', tautan: 'https://twitter.com/anak_jaksel/status/101' },
  { id: 12, idDirektur: 1, judul: 'Kadang lemot pas hujan deras', sumber: '@user_biasa', tanggal: '1 Hari lalu', sentimen: 'negative', platform: 'Facebook', tautan: 'https://facebook.com/user_biasa/posts/112' },
  { id: 13, idDirektur: 1, judul: 'CS nya ramah tapi teknisi agak telat', sumber: 'Google Review', tanggal: '2 Hari lalu', sentimen: 'neutral', platform: 'News', tautan: 'https://google.com/maps/reviews/iconnet' },
  
  // Aditya Syarief (MPLS) - B2B Focus
  { id: 21, idDirektur: 2, judul: 'Kerjasama Strategis PLN Icon Plus dengan Bank BUMN', sumber: 'Bisnis Indonesia', tanggal: '3 Jam lalu', sentimen: 'positive', platform: 'News', tautan: 'https://bisnis.com/korporasi/pln-icon-plus-bumn' },
  { id: 22, idDirektur: 2, judul: 'Implementasi MPLS untuk Smart City', sumber: 'Tech Daily', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:222' },
  { id: 23, idDirektur: 2, judul: 'Solusi konektivitas korporat yang handal', sumber: 'CIO Magazine', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:333' },
  { id: 24, idDirektur: 2, judul: 'Transformasi infrastruktur digital nasional', sumber: 'Berita Satu', tanggal: '3 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://beritasatu.com/ekonomi/transformasi-digital' },
  { id: 25, idDirektur: 2, judul: 'Pak Aditya paparkan roadmap 2025', sumber: 'Intranet', tanggal: '4 Jam lalu', sentimen: 'positive', platform: 'News', tautan: 'https://intranet.pln.co.id/news/roadmap' },
  { id: 26, idDirektur: 2, judul: 'Kemitraan baru dengan penyedia konten global', sumber: 'DailySocial', tanggal: '5 Jam lalu', sentimen: 'positive', platform: 'News', tautan: 'https://dailysocial.id/post/pln-icon-plus-partner' },
  { id: 27, idDirektur: 2, judul: 'Layanan VPN IP makin diminati sektor finansial', sumber: 'Infobank', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:444' },
  { id: 28, idDirektur: 2, judul: 'Dukungan infrastruktur untuk IKN', sumber: 'Kompas', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://kompas.com/ikn/infrastruktur' },
  { id: 29, idDirektur: 2, judul: 'Sinergi BUMN untuk negeri', sumber: '@bumn_info', tanggal: '3 Hari lalu', sentimen: 'positive', platform: 'Instagram', tautan: 'https://instagram.com/p/def' },
  { id: 30, idDirektur: 2, judul: 'Peningkatan kapasitas bandwidth internasional', sumber: 'Telko.id', tanggal: '4 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://telko.id/news/bandwidth' },
  { id: 31, idDirektur: 2, judul: 'Harga paket korporat perlu penyesuaian', sumber: 'Forum IT', tanggal: '1 Hari lalu', sentimen: 'neutral', platform: 'Facebook', tautan: 'https://facebook.com/groups/itforum/permalink/555' },
  { id: 32, idDirektur: 2, judul: 'Proses tender agak lama', sumber: 'Vendor Partner', tanggal: '2 Hari lalu', sentimen: 'negative', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:666' },

  // Lintje Lumembang (TI/PV Rooftop) - Green Energy
  { id: 41, idDirektur: 3, judul: 'Transformasi Digital di Tubuh PLN Icon Plus', sumber: 'Majalah TI', tanggal: '4 Jam lalu', sentimen: 'positive', platform: 'News', tautan: 'https://majalahti.com/transformasi-digital' },
  { id: 42, idDirektur: 3, judul: 'PV Rooftop solusi hemat listrik masa depan', sumber: 'Green Energy Blog', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'Facebook', tautan: 'https://facebook.com/greenenergy/posts/777' },
  { id: 43, idDirektur: 3, judul: 'Aplikasi PLN Mobile makin canggih', sumber: '@gadget_reviewer', tanggal: '3 Jam lalu', sentimen: 'positive', platform: 'Twitter', tautan: 'https://twitter.com/gadget_reviewer/status/888' },
  { id: 44, idDirektur: 3, judul: 'Dukungan IT untuk keandalan listrik', sumber: 'Dunia Energi', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://duniaenergi.com/it-pln' },
  { id: 45, idDirektur: 3, judul: 'Sistem pembayaran makin mudah terintegrasi', sumber: 'Fintech News', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:999' },
  { id: 46, idDirektur: 3, judul: 'Green Data Center PLN Icon Plus', sumber: 'Tech in Asia', tanggal: '3 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://techinasia.com/green-data-center' },
  { id: 47, idDirektur: 3, judul: 'Bu Lintje inspirasi wanita di bidang tech', sumber: 'Kartini Tech', tanggal: '4 Jam lalu', sentimen: 'positive', platform: 'Instagram', tautan: 'https://instagram.com/p/ghi' },
  { id: 48, idDirektur: 3, judul: 'Efisiensi operasional lewat digitalisasi', sumber: 'SWA', tanggal: '5 Jam lalu', sentimen: 'positive', platform: 'News', tautan: 'https://swa.co.id/digitalisasi-operasional' },
  { id: 49, idDirektur: 3, judul: 'Program smart home makin diminati', sumber: 'Property Indo', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'Facebook', tautan: 'https://facebook.com/propertyindo/posts/000' },
  { id: 50, idDirektur: 3, judul: 'Komitmen terhadap energi bersih', sumber: 'Environment Watch', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://environmentwatch.org/clean-energy' },
  { id: 51, idDirektur: 3, judul: 'Aplikasi kadang force close', sumber: 'Play Store Review', tanggal: '1 Jam lalu', sentimen: 'negative', platform: 'News', tautan: 'https://play.google.com/store/apps/details?id=pln.mobile&reviewId=111' },
  { id: 52, idDirektur: 3, judul: 'Update sistem butuh waktu lama', sumber: 'Internal User', tanggal: '3 Jam lalu', sentimen: 'neutral', platform: 'Twitter', tautan: 'https://twitter.com/internal_user/status/222' },

  // Joyce Lanny Wantannia (Niaga)
  { id: 61, idDirektur: 4, judul: 'Promo Bundling Internet + TV Kabel Menarik', sumber: 'Promo Hunter', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'Instagram', tautan: 'https://instagram.com/p/jkl' },
  { id: 62, idDirektur: 4, judul: 'Strategi pemasaran digital yang efektif', sumber: 'Marketeers', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://marketeers.com/strategi-digital' },
  { id: 63, idDirektur: 4, judul: 'Pelanggan puas dengan paket loyalty', sumber: 'Survey Kepuasan', tanggal: '3 Jam lalu', sentimen: 'positive', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:333' },
  { id: 64, idDirektur: 4, judul: 'Penawaran khusus pelanggan baru', sumber: 'Iklan FB', tanggal: '4 Jam lalu', sentimen: 'positive', platform: 'Facebook', tautan: 'https://facebook.com/ads/promo-baru' },
  { id: 65, idDirektur: 4, judul: 'Peningkatan revenue dari sektor ritel', sumber: 'Laporan Keuangan', tanggal: '5 Jam lalu', sentimen: 'positive', platform: 'News', tautan: 'https://investor.id/revenue-ritel' },
  { id: 66, idDirektur: 4, judul: 'Bundling OTT makin lengkap', sumber: '@movie_mania', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'Twitter', tautan: 'https://twitter.com/movie_mania/status/444' },
  { id: 67, idDirektur: 4, judul: 'Kemudahan registrasi online', sumber: 'User Experience', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://uxdesign.cc/easy-registration' },
  { id: 68, idDirektur: 4, judul: 'Kampanye pemasaran yang kreatif', sumber: 'AdWorld', tanggal: '3 Hari lalu', sentimen: 'positive', platform: 'Instagram', tautan: 'https://instagram.com/p/mno' },
  { id: 69, idDirektur: 4, judul: 'Kolaborasi dengan merchant gaya hidup', sumber: 'Lifestyle Blog', tanggal: '4 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://lifestyleblog.com/merchant-collab' },
  { id: 70, idDirektur: 4, judul: 'Respon positif pasar milenial', sumber: 'Youth Insight', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:555' },
  { id: 71, idDirektur: 4, judul: 'Telemarketing agak mengganggu', sumber: '@privasi_user', tanggal: '2 Jam lalu', sentimen: 'negative', platform: 'Twitter', tautan: 'https://twitter.com/privasi_user/status/666' },
  { id: 72, idDirektur: 4, judul: 'Syarat promo kurang jelas', sumber: 'Forum Diskusi', tanggal: '1 Hari lalu', sentimen: 'neutral', platform: 'Facebook', tautan: 'https://facebook.com/groups/diskusi/permalink/777' },

  // Nyoman Ngurah Widyatnya (Keuangan)
  { id: 81, idDirektur: 5, judul: 'Kinerja Keuangan PLN Icon Plus Positif di Q3', sumber: 'Investor Daily', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://investor.id/kinerja-q3' },
  { id: 82, idDirektur: 5, judul: 'Pengelolaan aset yang makin efisien', sumber: 'Aset Manajemen', tanggal: '3 Jam lalu', sentimen: 'positive', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:888' },
  { id: 83, idDirektur: 5, judul: 'Transparansi laporan keuangan', sumber: 'Audit Publik', tanggal: '4 Jam lalu', sentimen: 'positive', platform: 'News', tautan: 'https://auditpublik.com/transparansi' },
  { id: 84, idDirektur: 5, judul: 'Pertumbuhan laba bersih signifikan', sumber: 'Market News', tanggal: '5 Jam lalu', sentimen: 'positive', platform: 'News', tautan: 'https://marketnews.com/laba-bersih' },
  { id: 85, idDirektur: 5, judul: 'Strategi investasi yang tepat sasaran', sumber: 'Bisnis Keuangan', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:999' },
  { id: 86, idDirektur: 5, judul: 'Manajemen risiko yang prudent', sumber: 'Risk Watch', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://riskwatch.com/prudent-management' },
  { id: 87, idDirektur: 5, judul: 'Kontribusi dividen ke induk meningkat', sumber: 'BUMN Track', tanggal: '3 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://bumntrack.com/dividen-naik' },
  { id: 88, idDirektur: 5, judul: 'Efisiensi biaya operasional', sumber: 'CFO Magazine', tanggal: '4 Hari lalu', sentimen: 'positive', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:000' },
  { id: 89, idDirektur: 5, judul: 'Apresiasi dari pemegang saham', sumber: 'Rups News', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://rupsnews.com/apresiasi' },
  { id: 90, idDirektur: 5, judul: 'Kesehatan cash flow terjaga', sumber: 'Analisa Saham', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://analisasaham.com/cash-flow' },
  { id: 91, idDirektur: 5, judul: 'Proses reimbursement agak lama', sumber: 'Internal Karyawan', tanggal: '1 Jam lalu', sentimen: 'negative', platform: 'Twitter', tautan: 'https://twitter.com/karyawan_curhat/status/111' },
  { id: 92, idDirektur: 5, judul: 'Anggaran pemasaran perlu ditambah', sumber: 'Divisi Niaga', tanggal: '2 Jam lalu', sentimen: 'neutral', platform: 'Internal', tautan: 'https://internal.pln.co.id/forum/topic/123' },

  // Soffin Hadi (Operasi) - Mixed/Negative Scenario
  { id: 101, idDirektur: 6, judul: 'Tim respons cepat tanggap bencana', sumber: 'Berita Daerah', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://beritadaerah.com/tanggap-bencana' },
  { id: 102, idDirektur: 6, judul: 'Pemeliharaan jaringan terencana', sumber: 'Info Pelanggan', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'Facebook', tautan: 'https://facebook.com/infopelanggan/posts/333' },
  { id: 103, idDirektur: 6, judul: 'ICONNET Down lagi di area Bekasi?? Tolong dong pak Direktur Operasi!', sumber: '@kecewa_berat', tanggal: '10 Menit lalu', sentimen: 'negative', platform: 'Twitter', tautan: 'https://twitter.com/kecewa_berat/status/444' },
  { id: 104, idDirektur: 6, judul: 'Gangguan massal sejak pagi belum ada perbaikan', sumber: 'Mediashare', tanggal: '1 Jam lalu', sentimen: 'negative', platform: 'Facebook', tautan: 'https://facebook.com/mediashare/posts/555' },
  { id: 105, idDirektur: 6, judul: 'Respon penanganan gangguan dinilai lambat', sumber: 'Consumer Watch', tanggal: '3 Jam lalu', sentimen: 'negative', platform: 'News', tautan: 'https://consumerwatch.org/slow-response' },
  { id: 106, idDirektur: 6, judul: 'Pak Soffin mohon evaluasi tim lapangan', sumber: 'LinkedIn User', tanggal: '5 Jam lalu', sentimen: 'neutral', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:666' },
  { id: 107, idDirektur: 6, judul: 'Teknisi datang tidak bawa alat lengkap', sumber: 'Pelanggan Kecewa', tanggal: '6 Jam lalu', sentimen: 'negative', platform: 'Instagram', tautan: 'https://instagram.com/p/pqr' },
  { id: 108, idDirektur: 6, judul: 'Janji perbaikan 24 jam tapi molor', sumber: '@netizen_marah', tanggal: '7 Jam lalu', sentimen: 'negative', platform: 'Twitter', tautan: 'https://twitter.com/netizen_marah/status/777' },
  { id: 109, idDirektur: 6, judul: 'Kabel semrawut di tiang depan rumah', sumber: 'Warga Komplek', tanggal: '8 Jam lalu', sentimen: 'negative', platform: 'Facebook', tautan: 'https://facebook.com/warga_komplek/posts/888' },
  { id: 110, idDirektur: 6, judul: 'Call center susah dihubungi saat gangguan', sumber: 'Suara Pembaca', tanggal: '9 Jam lalu', sentimen: 'negative', platform: 'News', tautan: 'https://suarapembaca.com/call-center-sibuk' },
  { id: 111, idDirektur: 6, judul: 'Perbaikan jaringan butuh waktu lama', sumber: 'Laporan Warga', tanggal: '10 Jam lalu', sentimen: 'negative', platform: 'Twitter', tautan: 'https://twitter.com/laporan_warga/status/999' },
  { id: 112, idDirektur: 6, judul: 'Sering RTO pas jam kerja', sumber: '@pekerja_remote', tanggal: '11 Jam lalu', sentimen: 'negative', platform: 'Twitter', tautan: 'https://twitter.com/pekerja_remote/status/000' },
  { id: 113, idDirektur: 6, judul: 'Mohon info estimasi nyala kembali', sumber: 'Grup WA Warga', tanggal: '12 Jam lalu', sentimen: 'neutral', platform: 'Facebook', tautan: 'https://facebook.com/groups/warga/permalink/111' },
  { id: 114, idDirektur: 6, judul: 'Apresiasi teknisi yang kerja hujan-hujanan', sumber: '@warga_baik', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'Instagram', tautan: 'https://instagram.com/p/stu' },

  // Dedi Budi Utomo (MHC)
  { id: 121, idDirektur: 7, judul: 'Program wellbeing karyawan PLN Icon Plus', sumber: 'HR Asia', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://hrasia.com/wellbeing' },
  { id: 122, idDirektur: 7, judul: 'Pelatihan digital talent untuk masa depan', sumber: 'Tech Academy', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:222' },
  { id: 123, idDirektur: 7, judul: 'Budaya kerja kolaboratif dan inovatif', sumber: 'Career Blog', tanggal: '3 Jam lalu', sentimen: 'positive', platform: 'Facebook', tautan: 'https://facebook.com/careerblog/posts/333' },
  { id: 124, idDirektur: 7, judul: 'Rekrutmen talenta muda berbakat', sumber: 'Jobstreet', tanggal: '4 Jam lalu', sentimen: 'positive', platform: 'News', tautan: 'https://jobstreet.co.id/news/rekrutmen' },
  { id: 125, idDirektur: 7, judul: 'Pak Dedi inspirasi leadership', sumber: 'Internal Podcast', tanggal: '5 Jam lalu', sentimen: 'positive', platform: 'Instagram', tautan: 'https://instagram.com/p/vwx' },
  { id: 126, idDirektur: 7, judul: 'Penghargaan Best Employer Brand', sumber: 'Award Night', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://awardnight.com/best-employer' },
  { id: 127, idDirektur: 7, judul: 'Fasilitas kantor yang nyaman', sumber: 'Office Tour', tanggal: '2 Hari lalu', sentimen: 'positive', platform: 'YouTube', tautan: 'https://youtube.com/watch?v=xyz123' },
  { id: 128, idDirektur: 7, judul: 'Program beasiswa untuk anak karyawan', sumber: 'CSR Info', tanggal: '3 Hari lalu', sentimen: 'positive', platform: 'News', tautan: 'https://csrinfo.com/beasiswa' },
  { id: 129, idDirektur: 7, judul: 'Work Life Balance yang terjaga', sumber: 'Testimoni Karyawan', tanggal: '4 Hari lalu', sentimen: 'positive', platform: 'LinkedIn', tautan: 'https://linkedin.com/feed/update/urn:li:activity:444' },
  { id: 130, idDirektur: 7, judul: 'Pengembangan karir yang jelas', sumber: 'HR Portal', tanggal: '1 Hari lalu', sentimen: 'positive', platform: 'Intranet', tautan: 'https://intranet.pln.co.id/hr/career' },
  { id: 131, idDirektur: 7, judul: 'Proses rekrutmen agak lambat infonya', sumber: 'Jobseeker', tanggal: '2 Jam lalu', sentimen: 'neutral', platform: 'Twitter', tautan: 'https://twitter.com/jobseeker/status/555' },
  { id: 132, idDirektur: 7, judul: 'Perlu lebih banyak training teknis', sumber: 'Survey Internal', tanggal: '3 Jam lalu', sentimen: 'neutral', platform: 'Internal', tautan: 'https://internal.pln.co.id/survey/result' },
];

export const dapatkanDataTren = (idDirektur?: number): DataTren[] => {
  // If no directorId (Overview), return high volume data
  const baseMentions = idDirektur 
    ? (daftarDirektur.find(d => d.id === idDirektur)?.statistik.totalSebutan || 100)
    : 5000;
    
  const dailyBase = Math.floor(baseMentions / 30); 
  
  return [
    { hari: 'Senin', sebutan: dailyBase + Math.floor(Math.random() * (idDirektur ? 50 : 500)) },
    { hari: 'Selasa', sebutan: dailyBase + Math.floor(Math.random() * (idDirektur ? 50 : 500)) },
    { hari: 'Rabu', sebutan: dailyBase + Math.floor(Math.random() * (idDirektur ? 50 : 500)) },
    { hari: 'Kamis', sebutan: dailyBase + Math.floor(Math.random() * (idDirektur ? 50 : 500)) },
    { hari: 'Jumat', sebutan: dailyBase + Math.floor(Math.random() * (idDirektur ? 100 : 1000)), label: 'Viral Twibbon' }, // Peak with label
    { hari: 'Sabtu', sebutan: dailyBase + Math.floor(Math.random() * (idDirektur ? 80 : 800)) },
    { hari: 'Minggu', sebutan: dailyBase + Math.floor(Math.random() * (idDirektur ? 60 : 600)) },
  ];
};
