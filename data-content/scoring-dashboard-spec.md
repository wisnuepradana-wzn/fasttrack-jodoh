# Spesifikasi Scoring Engine & Dashboard

## 1. Skor Total: "Skor Peluang Jodoh"

Rentang 0 sampai 100, dihitung dari rata-rata tertimbang seluruh 30 pertanyaan (logic perhitungan sudah ada dan tetap dipakai dari `lib/scoring.ts`).

### Badge Status (berdasarkan skor total)

| Rentang Skor | Badge | Warna |
|---|---|---|
| 80 sampai 100 | Sangat Siap | Hijau (emerald) |
| 60 sampai 79 | Cukup Siap | Kuning (amber) |
| 0 sampai 59 | Perlu Perbaikan | Merah (red) |

Badge ini juga dipakai untuk skor per pilar, dengan ambang batas yang sama, supaya konsisten di seluruh tampilan (dashboard, hasil assessment, history).

## 2. Kartu Utama Dashboard: "Peluang Jodoh Saat Ini"

Kartu paling atas dan paling menonjol di dashboard. Isinya:
- Progress bar visual menampilkan skor (contoh 72%)
- Badge status (Sangat Siap / Cukup Siap / Perlu Perbaikan)
- Satu kalimat insight singkat yang otomatis dirangkai dari pilar terlemah, contoh: "Anda sudah memiliki pondasi yang cukup baik. Fokus berikutnya adalah memperluas peluang bertemu calon pasangan yang serius."

## 3. Lima Pilar (bukan 3, sudah disesuaikan)

Ditampilkan sebagai 5 kartu kecil (bukan 3 seperti contoh awal, karena assessment sudah final 5 pilar): Kesiapan Pribadi, Daya Tarik Relasional, Peluang Pertemuan, Kesiapan Kecocokan, Kesiapan Proses Taaruf. Tiap kartu menampilkan skor 0 sampai 100 dan badge status masing-masing.

## 4. Diagnosis dan Prioritas (bagian "konsultan pribadi")

Setelah kartu utama dan 5 pilar, ditampilkan bagian Analisis dengan format:

**Hambatan utama Anda**: kalimat yang menyebut nama pilar terlemah secara eksplisit, contoh "Hambatan terbesar Anda saat ini adalah rendahnya Peluang Pertemuan."

**Prioritas 30 Hari**: daftar 3 action item konkret yang diturunkan dari pilar terlemah tersebut. Item ini ditulis ulang agar masing-masing merujuk ke hari spesifik di Program 30 Hari, sehingga user bisa langsung klik dan lanjut ke hari itu. Contoh untuk pilar Peluang Pertemuan:
- Lengkapi biodata taaruf Anda (Hari 9)
- Ikuti minimal satu komunitas baru yang relevan (Hari 17)
- Hubungi orang terpercaya untuk membantu memperluas jalur pertemuan (Hari 16)

## 5. Pemetaan Pilar Terlemah ke Action dan Hari Program

Setiap pilar memiliki 3 action item dengan rujukan hari, diambil dari konten Program 30 Hari yang sudah dibuat:

**Personal (Kesiapan Pribadi)**
- Luruskan kembali niat dan tujuan menikah Anda (Hari 1)
- Lakukan audit kesiapan finansial secara jujur (Hari 2)
- Bangun rutinitas spiritual harian yang konsisten (Hari 5)

**Relational (Daya Tarik Relasional)**
- Latih cara membuka percakapan dan menyampaikan pikiran dengan jelas (Hari 8)
- Susun biodata diri yang representatif (Hari 9)
- Latih kemampuan mendengar secara aktif (Hari 10)

**Opportunity (Peluang Pertemuan)**
- Petakan semua jalur pertemuan yang tersedia bagi Anda (Hari 15)
- Libatkan orang terpercaya untuk membantu memperluas jalur (Hari 16)
- Aktif di komunitas yang relevan dengan nilai hidup Anda (Hari 17)

**Compatibility (Kesiapan Kecocokan)**
- Perjelas standar pasangan Anda secara realistis (Hari 21, Pilar 4)
- Pelajari Framework Screening Calon Pasangan di Toolkit (Hari 23)
- Latih kemampuan menilai kecocokan secara rasional (Hari 27)

**Readiness (Kesiapan Proses Taaruf)**
- Diskusikan kesiapan melibatkan keluarga dalam proses taaruf (Hari 26)
- Tentukan gambaran timeline taaruf yang Anda inginkan (Hari 28)
- Pelajari tahapan taaruf secara umum agar tidak ragu saat menjalani (Hari 29)

## 6. Insight Kalimat Otomatis per Pilar Terlemah

Kalimat yang dipasangkan dengan badge di kartu utama, satu per pilar, ditulis natural dan personal (bukan generic):

**Personal**: "Fondasi pribadi Anda masih perlu dirapikan sebelum melangkah lebih jauh ke proses taaruf."

**Relational**: "Anda sudah cukup terbuka pada peluang, namun cara membangun kesan dan komunikasi awal masih bisa diperkuat."

**Opportunity**: "Anda sudah memiliki pondasi yang cukup baik. Fokus berikutnya adalah memperluas peluang bertemu calon pasangan yang serius."

**Compatibility**: "Anda cukup siap secara pribadi, namun perlu memperjelas standar dan cara menilai kecocokan agar tidak salah langkah."

**Readiness**: "Anda sudah memiliki banyak peluang, namun kesiapan menjalani proses taaruf secara mekanis masih perlu dimantapkan."

## 7. Progress Program di Dashboard

Tetap seperti rencana awal: "Hari X / 30" dengan progress bar, plus "Fokus Hari Ini" menampilkan checklist dari hari yang sedang berjalan (bukan checklist generik).

## 8. Candidate Tracker di Dashboard

Ringkas saja, sesuai arahan: total kandidat, nama kandidat terakhir dinilai, dan skornya. Tidak perlu tabel besar di dashboard, detail lengkap tetap di halaman Candidate Tracker.
