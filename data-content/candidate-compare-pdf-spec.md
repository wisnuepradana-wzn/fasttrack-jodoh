# Spesifikasi Compare View & PDF Export — Candidate Tracker

## 1. Compare View

### Kapan aktif
Tombol atau menu Compare baru aktif (tidak disabled/abu abu) ketika user memiliki minimal 2 kandidat dengan status evaluasi selesai (sudah punya skor, bukan kandidat yang baru ditambahkan namanya saja tanpa assessment).

### Aturan jumlah
Maksimal 3 kandidat dipilih sekaligus untuk dibandingkan dalam satu compare view. Jika user punya lebih dari 3 kandidat, dia memilih sendiri kandidat mana yang ingin dibandingkan lewat checkbox di halaman daftar kandidat, dengan validasi yang mencegah lebih dari 3 dipilih sekaligus (checkbox keempat otomatis disabled, dengan pesan singkat seperti "Maksimal 3 kandidat untuk dibandingkan sekaligus").

### Tampilan
Tabel perbandingan dengan kolom: nama kandidat di header, lalu baris untuk setiap 7 area beserta skornya. Skor Overall Compatibility (rata rata 7 area) ditampilkan di baris paling atas dengan visual yang lebih menonjol dibanding baris area lainnya.

Di bawah tabel, ditampilkan satu paragraf "Perbedaan Utama" yang dirangkai otomatis berdasarkan area dengan selisih skor paling besar antar kandidat, contoh: kandidat dengan skor tertinggi di satu area disebut unggul di area itu, kandidat lain disebut unggul di area lain, jika skornya berdekatan di semua area maka kalimat menyebutkan bahwa kedua kandidat cukup seimbang di hampir semua area.

Tetap menampilkan bagian "Topik Diskusi Lanjutan" gabungan dari kandidat-kandidat yang dibandingkan, khusus untuk area area yang berstatus Cukup atau Perlu Didalami pada salah satu atau lebih kandidat yang dibandingkan, supaya user punya panduan diskusi yang konkret meski sedang membandingkan.

### Yang harus dihindari
Tidak ada elemen UI atau teks yang menyatakan "lebih cocok", "pilih ini", atau ranking eksplisit antar kandidat. Tabel hanya menampilkan data dan insight, keputusan akhir tetap di tangan user.

## 2. PDF Export

### Titik pemicu pertama, hasil evaluasi 1 kandidat
Tombol "Export PDF" muncul di halaman detail/hasil kandidat begitu assessment kandidat tersebut selesai dan skor sudah tergenerate. Sebelum assessment selesai, tombol ini tidak ditampilkan.

### Titik pemicu kedua, hasil compare
Tombol "Export PDF" muncul di halaman Compare View begitu hasil perbandingan (skor dan insight) sudah tergenerate untuk minimal 2 kandidat yang dipilih.

### Isi PDF untuk evaluasi 1 kandidat
Halaman judul singkat dengan nama kandidat dan tanggal evaluasi, lalu skor Overall Compatibility, lalu breakdown 7 area dengan skor masing masing, lalu untuk setiap area ditampilkan insight (kekuatan atau area perlu didalami) dan topik diskusi lanjutan jika ada, lalu catatan pribadi yang sudah ditulis user soal kandidat tersebut jika ada, ditutup dengan catatan kecil di bagian bawah halaman bahwa laporan ini adalah alat bantu refleksi pribadi, bukan keputusan otomatis.

### Isi PDF untuk hasil compare
Halaman judul dengan nama nama kandidat yang dibandingkan dan tanggal, lalu tabel perbandingan skor 7 area seperti yang tampil di layar, lalu paragraf Perbedaan Utama, lalu daftar Topik Diskusi Lanjutan gabungan, ditutup dengan catatan yang sama soal alat bantu refleksi, bukan keputusan otomatis.

### Tujuan pemakaian
Karena disebutkan PDF ini akan dibawa untuk didiskusikan dengan keluarga atau orang tua, desainnya dibuat rapi dan mudah dibaca oleh orang yang tidak familiar dengan aplikasi ini sama sekali, artinya tidak ada istilah teknis atau singkatan yang membingungkan, semua label ditulis dengan bahasa yang jelas.

### Implementasi teknis
Sesuai catatan blueprint, PDF generation dilakukan secara server-side. Karena hosting di Netlify bersifat serverless, library yang dipilih nanti sebaiknya yang ringan dan tidak membutuhkan headless browser, contohnya React PDF atau pdf-lib, supaya tetap berjalan baik dalam batasan waktu eksekusi Netlify Function. Detail pemilihan library akan diputuskan saat masuk fase coding fitur ini.

### Penyimpanan riwayat export
Tabel `pdf_exports` yang sudah ada di skema database dipakai untuk menyimpan riwayat setiap export yang dilakukan (jenis: assessment, candidate, atau comparison), sehingga user punya jejak laporan yang pernah dibuat, meski tidak ada pembatasan jumlah export yang boleh dilakukan.
