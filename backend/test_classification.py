from app.workers.social_worker import classify_content

directors = [
    {
        "name": "Chipta Perdana", 
        "role": "Direktur Utama",
        "product": "ICONNET",
        "keywords": ["Ekspansi Jaringan", "Strategi Korporat", "Jaringan Internet", "Broadband Rumah", "Transformasi Digital"]
    },
    {
        "name": "Aditya Syarief", 
        "role": "Direktur Perencanaan & Pengembangan",
        "product": "Konektivitas MPLS",
        "keywords": ["Perencanaan Strategis", "Pengembangan Bisnis", "Jaringan Serat Optik", "Infrastruktur Telekomunikasi", "Smart City"]
    },
    {
        "name": "Lintje Lumembang", 
        "role": "Direktur Pelayanan TI",
        "product": "PV Rooftop",
        "keywords": ["Pelayanan TI", "Solusi Digital", "Aplikasi PLN", "Digitalisasi Layanan", "Green Energy"]
    },
    {
        "name": "Joyce Lanny Wantannia", 
        "role": "Direktur Niaga & Pemasaran",
        "product": "Pemasaran Digital",
        "keywords": ["Strategi Niaga", "Penjualan ICONNET", "Layanan Pelanggan", "Customer Experience", "Bundling Internet"]
    },
    {
        "name": "Nyoman Ngurah Widyatnya", 
        "role": "Direktur Keuangan & Man Risk",
        "product": "Manajemen Aset",
        "keywords": ["Kinerja Keuangan", "Manajemen Risiko", "Efisiensi Biaya", "Aset Perusahaan", "Pendapatan Usaha", "Laba Perusahaan"]
    },
    {
        "name": "Soffin Hadi", 
        "role": "Direktur Operasi",
        "product": "Managed Service",
        "keywords": ["Operasional Jaringan", "Pemeliharaan Sistem", "Gangguan Layanan", "Service Level Agreement", "NOC"]
    },
    {
        "name": "Dedi Budi Utomo", 
        "role": "Direktur MHC",
        "product": "Talent Management",
        "keywords": ["Human Capital", "Pengembangan SDM", "Budaya Perusahaan", "Pelatihan Pegawai", "Rekrutmen"]
    }
]

texts = [
    "🗿 icon +",
    "😁😁",
    "di kantor metrotv bang klo pgn tanya2 harga metro.",
    "oke otw 😁"
]

print("Testing Classification:")
for t in texts:
    d, p = classify_content(t, directors)
    print(f"Text: '{t}' -> Director: {d}, Product: {p}")
