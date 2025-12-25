export interface Director {
  id: number;
  name: string;
  title: string;
  product: string;
  image: string;
  sentiment: number; // 0-100
  topKeywords: string[]; // Added
  stats: {
    totalMentions: number;
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface TrendData {
  day: string;
  mentions: number;
  label?: string; // Added for annotation
}

export interface NewsItem {
  id: number;
  directorId: number;
  title: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  platform: 'Instagram' | 'Twitter' | 'Facebook' | 'LinkedIn' | 'News' | 'TikTok' | 'Internal' | 'YouTube' | 'Intranet' | 'Google Review' | 'Play Store Review';
  url: string;
}

export interface CompetitorData {
    name: string;
    positive: number;
    neutral: number;
    negative: number;
}

export interface TopIssue {
    topic: string;
    count: number;
    sentiment: 'positive' | 'negative' | 'neutral';
}

export const corporateStats = {
    totalMentions: 5644,
    sentimentScore: 73,
    potentialReach: "2.4M",
    mentionsChange: 12, // percentage
};

export const competitorAnalysis: CompetitorData[] = [
    { name: 'ICONNET', positive: 87, neutral: 10, negative: 3 },
    { name: 'Indihome', positive: 45, neutral: 27, negative: 28 },
    { name: 'MyRepublic', positive: 65, neutral: 20, negative: 15 },
    { name: 'Biznet', positive: 70, neutral: 15, negative: 15 },
];

export const topIssues: TopIssue[] = [
    { topic: "Gangguan WiFi", count: 450, sentiment: 'negative' },
    { topic: "Promo Pasang Baru", count: 320, sentiment: 'positive' },
    { topic: "Pelayanan Teknisi", count: 210, sentiment: 'neutral' },
    { topic: "Giveaway Akhir Tahun", count: 180, sentiment: 'positive' },
    { topic: "Tagihan Melonjak", count: 90, sentiment: 'negative' },
];

export const directors: Director[] = [
  {
    id: 1,
    name: 'Chipta Perdana',
    title: 'Direktur Utama',
    product: 'ICONNET',
    image: 'https://i.pravatar.cc/150?u=chipta',
    sentiment: 88,
    topKeywords: ["Ekspansi", "Inovasi", "Jaringan"],
    stats: {
      totalMentions: 1250,
      positive: 850,
      negative: 150,
      neutral: 250,
    },
  },
  {
    id: 2,
    name: 'Aditya Syarief',
    title: 'Direktur Perencanaan',
    product: 'Konektivitas MPLS',
    image: 'https://i.pravatar.cc/150?u=aditya',
    sentiment: 92,
    topKeywords: ["Kerjasama B2B", "Strategi", "MPLS"],
    stats: {
      totalMentions: 850,
      positive: 700,
      negative: 50,
      neutral: 100,
    },
  },
  {
    id: 3,
    name: 'Lintje Lumembang',
    title: 'Direktur TI',
    product: 'PV Rooftop',
    image: 'https://i.pravatar.cc/150?u=lintje',
    sentiment: 75,
    topKeywords: ["Green Energy", "Digitalisasi", "PV Rooftop"],
    stats: {
      totalMentions: 640,
      positive: 300,
      negative: 140,
      neutral: 200,
    },
  },
  {
    id: 4,
    name: 'Joyce Lanny Wantannia',
    title: 'Direktur Niaga',
    product: 'Pemasaran Digital & Bundling',
    image: 'https://i.pravatar.cc/150?u=joyce',
    sentiment: 82,
    topKeywords: ["Marketing", "Bundling", "Customer"],
    stats: {
      totalMentions: 920,
      positive: 600,
      negative: 120,
      neutral: 200,
    },
  },
  {
    id: 5,
    name: 'Nyoman Ngurah Widyatnya',
    title: 'Direktur Keuangan',
    product: 'Manajemen Risiko & Revenue',
    image: 'https://i.pravatar.cc/150?u=nyoman',
    sentiment: 80,
    topKeywords: ["Revenue", "Efisiensi", "Audit"],
    stats: {
      totalMentions: 430,
      positive: 280,
      negative: 50,
      neutral: 100,
    },
  },
  {
    id: 6,
    name: 'Soffin Hadi',
    title: 'Direktur Operasi',
    product: 'Sistem Monitoring Gangguan (NOC)',
    image: 'https://i.pravatar.cc/150?u=soffin',
    sentiment: 45,
    topKeywords: ["Gangguan", "Pemadaman", "Komplain"],
    stats: {
      totalMentions: 2100,
      positive: 200,
      negative: 1500,
      neutral: 400,
    },
  },
  {
    id: 7,
    name: 'Dedi Budi Utomo',
    title: 'Direktur MHC',
    product: 'Layanan Human Capital',
    image: 'https://i.pravatar.cc/150?u=dedi',
    sentiment: 85,
    topKeywords: ["SDM", "Pelatihan", "Budaya Kerja"],
    stats: {
      totalMentions: 350,
      positive: 250,
      negative: 20,
      neutral: 80,
    },
  },
];

export const newsFeed: NewsItem[] = [
  // Chipta Perdana (ICONNET) - High Positive
  { id: 1, directorId: 1, title: 'ICONNET Perluas Jaringan ke 50 Kota Baru', source: 'Detik Finance', date: '2 Jam lalu', sentiment: 'positive', platform: 'News', url: 'https://detik.com/finance/iconnet-50-kota' },
  { id: 2, directorId: 1, title: 'Dirut PLN Icon Plus Resmikan Kantor Baru', source: 'Kompas.com', date: '5 Jam lalu', sentiment: 'positive', platform: 'News', url: 'https://kompas.com/properti/iconplus-kantor-baru' },
  { id: 3, directorId: 1, title: 'Internet ICONNET makin stabil, mantap pak Dirut!', source: '@netizen_prow', date: '1 Hari lalu', sentiment: 'positive', platform: 'Twitter', url: 'https://twitter.com/netizen_prow/status/123' },
  { id: 4, directorId: 1, title: 'Capaian Pelanggan ICONNET Tembus 1 Juta', source: 'Investor Daily', date: '2 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://investor.id/iconnet-1-juta' },
  { id: 5, directorId: 1, title: 'Layanan internet desa makin terjangkau', source: '@warga_desa', date: '3 Jam lalu', sentiment: 'positive', platform: 'Twitter', url: 'https://twitter.com/warga_desa/status/456' },
  { id: 6, directorId: 1, title: 'Inovasi Digital PLN Icon Plus Diapresiasi Menteri', source: 'CNN Indonesia', date: '4 Jam lalu', sentiment: 'positive', platform: 'News', url: 'https://cnnindonesia.com/teknologi/inovasi-pln' },
  { id: 7, directorId: 1, title: 'Pak Chipta dorong digitalisasi UMKM', source: 'Bisnis.com', date: '6 Jam lalu', sentiment: 'positive', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:789' },
  { id: 8, directorId: 1, title: 'Jaringan Fiber Optik ICONNET Makin Luas', source: 'TechAsia', date: '1 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://techasia.com/iconnet-fiber' },
  { id: 9, directorId: 1, title: 'Terima kasih ICONNET sinyal kencang buat WFH', source: '@pejuang_wfh', date: '2 Hari lalu', sentiment: 'positive', platform: 'Instagram', url: 'https://instagram.com/p/abc' },
  { id: 10, directorId: 1, title: 'Program CSR Icon Plus sentuh daerah 3T', source: 'Republika', date: '3 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://republika.co.id/csr-iconplus' },
  { id: 11, directorId: 1, title: 'Ada gangguan dikit di area Jaksel tapi cepet bener', source: '@anak_jaksel', date: '5 Jam lalu', sentiment: 'neutral', platform: 'Twitter', url: 'https://twitter.com/anak_jaksel/status/101' },
  { id: 12, directorId: 1, title: 'Kadang lemot pas hujan deras', source: '@user_biasa', date: '1 Hari lalu', sentiment: 'negative', platform: 'Facebook', url: 'https://facebook.com/user_biasa/posts/112' },
  { id: 13, directorId: 1, title: 'CS nya ramah tapi teknisi agak telat', source: 'Google Review', date: '2 Hari lalu', sentiment: 'neutral', platform: 'News', url: 'https://google.com/maps/reviews/iconnet' },
  
  // Aditya Syarief (MPLS) - B2B Focus
  { id: 21, directorId: 2, title: 'Kerjasama Strategis PLN Icon Plus dengan Bank BUMN', source: 'Bisnis Indonesia', date: '3 Jam lalu', sentiment: 'positive', platform: 'News', url: 'https://bisnis.com/korporasi/pln-icon-plus-bumn' },
  { id: 22, directorId: 2, title: 'Implementasi MPLS untuk Smart City', source: 'Tech Daily', date: '1 Hari lalu', sentiment: 'positive', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:222' },
  { id: 23, directorId: 2, title: 'Solusi konektivitas korporat yang handal', source: 'CIO Magazine', date: '2 Hari lalu', sentiment: 'positive', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:333' },
  { id: 24, directorId: 2, title: 'Transformasi infrastruktur digital nasional', source: 'Berita Satu', date: '3 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://beritasatu.com/ekonomi/transformasi-digital' },
  { id: 25, directorId: 2, title: 'Pak Aditya paparkan roadmap 2025', source: 'Intranet', date: '4 Jam lalu', sentiment: 'positive', platform: 'News', url: 'https://intranet.pln.co.id/news/roadmap' },
  { id: 26, directorId: 2, title: 'Kemitraan baru dengan penyedia konten global', source: 'DailySocial', date: '5 Jam lalu', sentiment: 'positive', platform: 'News', url: 'https://dailysocial.id/post/pln-icon-plus-partner' },
  { id: 27, directorId: 2, title: 'Layanan VPN IP makin diminati sektor finansial', source: 'Infobank', date: '1 Hari lalu', sentiment: 'positive', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:444' },
  { id: 28, directorId: 2, title: 'Dukungan infrastruktur untuk IKN', source: 'Kompas', date: '2 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://kompas.com/ikn/infrastruktur' },
  { id: 29, directorId: 2, title: 'Sinergi BUMN untuk negeri', source: '@bumn_info', date: '3 Hari lalu', sentiment: 'positive', platform: 'Instagram', url: 'https://instagram.com/p/def' },
  { id: 30, directorId: 2, title: 'Peningkatan kapasitas bandwidth internasional', source: 'Telko.id', date: '4 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://telko.id/news/bandwidth' },
  { id: 31, directorId: 2, title: 'Harga paket korporat perlu penyesuaian', source: 'Forum IT', date: '1 Hari lalu', sentiment: 'neutral', platform: 'Facebook', url: 'https://facebook.com/groups/itforum/permalink/555' },
  { id: 32, directorId: 2, title: 'Proses tender agak lama', source: 'Vendor Partner', date: '2 Hari lalu', sentiment: 'negative', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:666' },

  // Lintje Lumembang (TI/PV Rooftop) - Green Energy
  { id: 41, directorId: 3, title: 'Transformasi Digital di Tubuh PLN Icon Plus', source: 'Majalah TI', date: '4 Jam lalu', sentiment: 'positive', platform: 'News', url: 'https://majalahti.com/transformasi-digital' },
  { id: 42, directorId: 3, title: 'PV Rooftop solusi hemat listrik masa depan', source: 'Green Energy Blog', date: '2 Hari lalu', sentiment: 'positive', platform: 'Facebook', url: 'https://facebook.com/greenenergy/posts/777' },
  { id: 43, directorId: 3, title: 'Aplikasi PLN Mobile makin canggih', source: '@gadget_reviewer', date: '3 Jam lalu', sentiment: 'positive', platform: 'Twitter', url: 'https://twitter.com/gadget_reviewer/status/888' },
  { id: 44, directorId: 3, title: 'Dukungan IT untuk keandalan listrik', source: 'Dunia Energi', date: '1 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://duniaenergi.com/it-pln' },
  { id: 45, directorId: 3, title: 'Sistem pembayaran makin mudah terintegrasi', source: 'Fintech News', date: '2 Hari lalu', sentiment: 'positive', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:999' },
  { id: 46, directorId: 3, title: 'Green Data Center PLN Icon Plus', source: 'Tech in Asia', date: '3 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://techinasia.com/green-data-center' },
  { id: 47, directorId: 3, title: 'Bu Lintje inspirasi wanita di bidang tech', source: 'Kartini Tech', date: '4 Jam lalu', sentiment: 'positive', platform: 'Instagram', url: 'https://instagram.com/p/ghi' },
  { id: 48, directorId: 3, title: 'Efisiensi operasional lewat digitalisasi', source: 'SWA', date: '5 Jam lalu', sentiment: 'positive', platform: 'News', url: 'https://swa.co.id/digitalisasi-operasional' },
  { id: 49, directorId: 3, title: 'Program smart home makin diminati', source: 'Property Indo', date: '1 Hari lalu', sentiment: 'positive', platform: 'Facebook', url: 'https://facebook.com/propertyindo/posts/000' },
  { id: 50, directorId: 3, title: 'Komitmen terhadap energi bersih', source: 'Environment Watch', date: '2 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://environmentwatch.org/clean-energy' },
  { id: 51, directorId: 3, title: 'Aplikasi kadang force close', source: 'Play Store Review', date: '1 Jam lalu', sentiment: 'negative', platform: 'News', url: 'https://play.google.com/store/apps/details?id=pln.mobile&reviewId=111' },
  { id: 52, directorId: 3, title: 'Update sistem butuh waktu lama', source: 'Internal User', date: '3 Jam lalu', sentiment: 'neutral', platform: 'Twitter', url: 'https://twitter.com/internal_user/status/222' },

  // Joyce Lanny Wantannia (Niaga)
  { id: 61, directorId: 4, title: 'Promo Bundling Internet + TV Kabel Menarik', source: 'Promo Hunter', date: '1 Hari lalu', sentiment: 'positive', platform: 'Instagram', url: 'https://instagram.com/p/jkl' },
  { id: 62, directorId: 4, title: 'Strategi pemasaran digital yang efektif', source: 'Marketeers', date: '2 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://marketeers.com/strategi-digital' },
  { id: 63, directorId: 4, title: 'Pelanggan puas dengan paket loyalty', source: 'Survey Kepuasan', date: '3 Jam lalu', sentiment: 'positive', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:333' },
  { id: 64, directorId: 4, title: 'Penawaran khusus pelanggan baru', source: 'Iklan FB', date: '4 Jam lalu', sentiment: 'positive', platform: 'Facebook', url: 'https://facebook.com/ads/promo-baru' },
  { id: 65, directorId: 4, title: 'Peningkatan revenue dari sektor ritel', source: 'Laporan Keuangan', date: '5 Jam lalu', sentiment: 'positive', platform: 'News', url: 'https://investor.id/revenue-ritel' },
  { id: 66, directorId: 4, title: 'Bundling OTT makin lengkap', source: '@movie_mania', date: '1 Hari lalu', sentiment: 'positive', platform: 'Twitter', url: 'https://twitter.com/movie_mania/status/444' },
  { id: 67, directorId: 4, title: 'Kemudahan registrasi online', source: 'User Experience', date: '2 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://uxdesign.cc/easy-registration' },
  { id: 68, directorId: 4, title: 'Kampanye pemasaran yang kreatif', source: 'AdWorld', date: '3 Hari lalu', sentiment: 'positive', platform: 'Instagram', url: 'https://instagram.com/p/mno' },
  { id: 69, directorId: 4, title: 'Kolaborasi dengan merchant gaya hidup', source: 'Lifestyle Blog', date: '4 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://lifestyleblog.com/merchant-collab' },
  { id: 70, directorId: 4, title: 'Respon positif pasar milenial', source: 'Youth Insight', date: '1 Hari lalu', sentiment: 'positive', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:555' },
  { id: 71, directorId: 4, title: 'Telemarketing agak mengganggu', source: '@privasi_user', date: '2 Jam lalu', sentiment: 'negative', platform: 'Twitter', url: 'https://twitter.com/privasi_user/status/666' },
  { id: 72, directorId: 4, title: 'Syarat promo kurang jelas', source: 'Forum Diskusi', date: '1 Hari lalu', sentiment: 'neutral', platform: 'Facebook', url: 'https://facebook.com/groups/diskusi/permalink/777' },

  // Nyoman Ngurah Widyatnya (Keuangan)
  { id: 81, directorId: 5, title: 'Kinerja Keuangan PLN Icon Plus Positif di Q3', source: 'Investor Daily', date: '2 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://investor.id/kinerja-q3' },
  { id: 82, directorId: 5, title: 'Pengelolaan aset yang makin efisien', source: 'Aset Manajemen', date: '3 Jam lalu', sentiment: 'positive', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:888' },
  { id: 83, directorId: 5, title: 'Transparansi laporan keuangan', source: 'Audit Publik', date: '4 Jam lalu', sentiment: 'positive', platform: 'News', url: 'https://auditpublik.com/transparansi' },
  { id: 84, directorId: 5, title: 'Pertumbuhan laba bersih signifikan', source: 'Market News', date: '5 Jam lalu', sentiment: 'positive', platform: 'News', url: 'https://marketnews.com/laba-bersih' },
  { id: 85, directorId: 5, title: 'Strategi investasi yang tepat sasaran', source: 'Bisnis Keuangan', date: '1 Hari lalu', sentiment: 'positive', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:999' },
  { id: 86, directorId: 5, title: 'Manajemen risiko yang prudent', source: 'Risk Watch', date: '2 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://riskwatch.com/prudent-management' },
  { id: 87, directorId: 5, title: 'Kontribusi dividen ke induk meningkat', source: 'BUMN Track', date: '3 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://bumntrack.com/dividen-naik' },
  { id: 88, directorId: 5, title: 'Efisiensi biaya operasional', source: 'CFO Magazine', date: '4 Hari lalu', sentiment: 'positive', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:000' },
  { id: 89, directorId: 5, title: 'Apresiasi dari pemegang saham', source: 'Rups News', date: '1 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://rupsnews.com/apresiasi' },
  { id: 90, directorId: 5, title: 'Kesehatan cash flow terjaga', source: 'Analisa Saham', date: '2 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://analisasaham.com/cash-flow' },
  { id: 91, directorId: 5, title: 'Proses reimbursement agak lama', source: 'Internal Karyawan', date: '1 Jam lalu', sentiment: 'negative', platform: 'Twitter', url: 'https://twitter.com/karyawan_curhat/status/111' },
  { id: 92, directorId: 5, title: 'Anggaran pemasaran perlu ditambah', source: 'Divisi Niaga', date: '2 Jam lalu', sentiment: 'neutral', platform: 'Internal', url: 'https://internal.pln.co.id/forum/topic/123' },

  // Soffin Hadi (Operasi) - Mixed/Negative Scenario
  { id: 101, directorId: 6, title: 'Tim respons cepat tanggap bencana', source: 'Berita Daerah', date: '1 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://beritadaerah.com/tanggap-bencana' },
  { id: 102, directorId: 6, title: 'Pemeliharaan jaringan terencana', source: 'Info Pelanggan', date: '2 Hari lalu', sentiment: 'positive', platform: 'Facebook', url: 'https://facebook.com/infopelanggan/posts/333' },
  { id: 103, directorId: 6, title: 'ICONNET Down lagi di area Bekasi?? Tolong dong pak Direktur Operasi!', source: '@kecewa_berat', date: '10 Menit lalu', sentiment: 'negative', platform: 'Twitter', url: 'https://twitter.com/kecewa_berat/status/444' },
  { id: 104, directorId: 6, title: 'Gangguan massal sejak pagi belum ada perbaikan', source: 'Mediashare', date: '1 Jam lalu', sentiment: 'negative', platform: 'Facebook', url: 'https://facebook.com/mediashare/posts/555' },
  { id: 105, directorId: 6, title: 'Respon penanganan gangguan dinilai lambat', source: 'Consumer Watch', date: '3 Jam lalu', sentiment: 'negative', platform: 'News', url: 'https://consumerwatch.org/slow-response' },
  { id: 106, directorId: 6, title: 'Pak Soffin mohon evaluasi tim lapangan', source: 'LinkedIn User', date: '5 Jam lalu', sentiment: 'neutral', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:666' },
  { id: 107, directorId: 6, title: 'Teknisi datang tidak bawa alat lengkap', source: 'Pelanggan Kecewa', date: '6 Jam lalu', sentiment: 'negative', platform: 'Instagram', url: 'https://instagram.com/p/pqr' },
  { id: 108, directorId: 6, title: 'Janji perbaikan 24 jam tapi molor', source: '@netizen_marah', date: '7 Jam lalu', sentiment: 'negative', platform: 'Twitter', url: 'https://twitter.com/netizen_marah/status/777' },
  { id: 109, directorId: 6, title: 'Kabel semrawut di tiang depan rumah', source: 'Warga Komplek', date: '8 Jam lalu', sentiment: 'negative', platform: 'Facebook', url: 'https://facebook.com/warga_komplek/posts/888' },
  { id: 110, directorId: 6, title: 'Call center susah dihubungi saat gangguan', source: 'Suara Pembaca', date: '9 Jam lalu', sentiment: 'negative', platform: 'News', url: 'https://suarapembaca.com/call-center-sibuk' },
  { id: 111, directorId: 6, title: 'Perbaikan jaringan butuh waktu lama', source: 'Laporan Warga', date: '10 Jam lalu', sentiment: 'negative', platform: 'Twitter', url: 'https://twitter.com/laporan_warga/status/999' },
  { id: 112, directorId: 6, title: 'Sering RTO pas jam kerja', source: '@pekerja_remote', date: '11 Jam lalu', sentiment: 'negative', platform: 'Twitter', url: 'https://twitter.com/pekerja_remote/status/000' },
  { id: 113, directorId: 6, title: 'Mohon info estimasi nyala kembali', source: 'Grup WA Warga', date: '12 Jam lalu', sentiment: 'neutral', platform: 'Facebook', url: 'https://facebook.com/groups/warga/permalink/111' },
  { id: 114, directorId: 6, title: 'Apresiasi teknisi yang kerja hujan-hujanan', source: '@warga_baik', date: '1 Hari lalu', sentiment: 'positive', platform: 'Instagram', url: 'https://instagram.com/p/stu' },

  // Dedi Budi Utomo (MHC)
  { id: 121, directorId: 7, title: 'Program wellbeing karyawan PLN Icon Plus', source: 'HR Asia', date: '1 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://hrasia.com/wellbeing' },
  { id: 122, directorId: 7, title: 'Pelatihan digital talent untuk masa depan', source: 'Tech Academy', date: '2 Hari lalu', sentiment: 'positive', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:222' },
  { id: 123, directorId: 7, title: 'Budaya kerja kolaboratif dan inovatif', source: 'Career Blog', date: '3 Jam lalu', sentiment: 'positive', platform: 'Facebook', url: 'https://facebook.com/careerblog/posts/333' },
  { id: 124, directorId: 7, title: 'Rekrutmen talenta muda berbakat', source: 'Jobstreet', date: '4 Jam lalu', sentiment: 'positive', platform: 'News', url: 'https://jobstreet.co.id/news/rekrutmen' },
  { id: 125, directorId: 7, title: 'Pak Dedi inspirasi leadership', source: 'Internal Podcast', date: '5 Jam lalu', sentiment: 'positive', platform: 'Instagram', url: 'https://instagram.com/p/vwx' },
  { id: 126, directorId: 7, title: 'Penghargaan Best Employer Brand', source: 'Award Night', date: '1 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://awardnight.com/best-employer' },
  { id: 127, directorId: 7, title: 'Fasilitas kantor yang nyaman', source: 'Office Tour', date: '2 Hari lalu', sentiment: 'positive', platform: 'YouTube', url: 'https://youtube.com/watch?v=xyz123' },
  { id: 128, directorId: 7, title: 'Program beasiswa untuk anak karyawan', source: 'CSR Info', date: '3 Hari lalu', sentiment: 'positive', platform: 'News', url: 'https://csrinfo.com/beasiswa' },
  { id: 129, directorId: 7, title: 'Work Life Balance yang terjaga', source: 'Testimoni Karyawan', date: '4 Hari lalu', sentiment: 'positive', platform: 'LinkedIn', url: 'https://linkedin.com/feed/update/urn:li:activity:444' },
  { id: 130, directorId: 7, title: 'Pengembangan karir yang jelas', source: 'HR Portal', date: '1 Hari lalu', sentiment: 'positive', platform: 'Intranet', url: 'https://intranet.pln.co.id/hr/career' },
  { id: 131, directorId: 7, title: 'Proses rekrutmen agak lambat infonya', source: 'Jobseeker', date: '2 Jam lalu', sentiment: 'neutral', platform: 'Twitter', url: 'https://twitter.com/jobseeker/status/555' },
  { id: 132, directorId: 7, title: 'Perlu lebih banyak training teknis', source: 'Survey Internal', date: '3 Jam lalu', sentiment: 'neutral', platform: 'Internal', url: 'https://internal.pln.co.id/survey/result' },
];

export const getTrendData = (directorId?: number): TrendData[] => {
  // If no directorId (Overview), return high volume data
  const baseMentions = directorId 
    ? (directors.find(d => d.id === directorId)?.stats.totalMentions || 100)
    : 5000;
    
  const dailyBase = Math.floor(baseMentions / 30); 
  
  return [
    { day: 'Senin', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 50 : 500)) },
    { day: 'Selasa', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 50 : 500)) },
    { day: 'Rabu', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 50 : 500)) },
    { day: 'Kamis', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 50 : 500)) },
    { day: 'Jumat', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 100 : 1000)), label: 'Viral Twibbon' }, // Peak with label
    { day: 'Sabtu', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 80 : 800)) },
    { day: 'Minggu', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 60 : 600)) },
  ];
};
