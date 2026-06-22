# Konten Assessment Diri — 30 Pertanyaan, 5 Pilar

Skala jawaban: 1 (Sangat Tidak Setuju) – 5 (Sangat Setuju). Semua pertanyaan netral gender.

---

## Pilar 1: Kesiapan Pribadi (8 pertanyaan)
*Sub-tema: spiritual, emosional, finansial — fondasi sebelum bicara soal orang lain.*

1. Saya memiliki niat dan tujuan menikah yang jelas, bukan sekadar ikut-ikutan atau tekanan sosial.
2. Saya menjalankan ibadah wajib secara konsisten sebagai bagian dari kesiapan diri.
3. Saya bisa menerima kekurangan diri sendiri tanpa terus-menerus merasa tidak cukup baik.
4. Saya mampu mengelola emosi (marah, cemas, kecewa) tanpa membuat keputusan impulsif.
5. Saya memiliki penghasilan atau rencana finansial yang realistis untuk membangun rumah tangga.
6. Saya sudah memikirkan dan punya gambaran kasar tentang biaya pernikahan yang saya targetkan.
7. Saya nyaman dengan diri saya sendiri, tidak bergantung pada validasi orang lain untuk merasa berharga.
8. Saya punya rutinitas hidup yang stabil (pekerjaan, tempat tinggal, kesehatan) sebagai fondasi berumah tangga.

## Pilar 2: Daya Tarik Relasional (6 pertanyaan)
*Cara berkomunikasi dan kesan yang dibangun ke calon pasangan.*

9. Saya nyaman memulai percakapan baru dengan orang yang belum saya kenal dekat.
10. Saya bisa menyampaikan pikiran dan perasaan saya dengan jelas tanpa berputar-putar.
11. Saya termasuk pendengar yang baik saat orang lain bercerita tentang dirinya.
12. Saya memiliki cara memperkenalkan diri (biodata, profil, atau cerita singkat) yang representatif dan rapi.
13. Saya bisa menjaga kesan pertama yang tenang dan meyakinkan saat bertemu orang baru.
14. Saya terbuka menerima masukan tentang cara saya berkomunikasi dari orang yang saya percaya.

## Pilar 3: Peluang Pertemuan (6 pertanyaan)
*Exposure dan jalur perkenalan menuju calon pasangan.*

15. Saya memiliki lebih dari satu jalur untuk bertemu calon pasangan (komunitas, kerabat, lembaga taaruf, dll).
16. Saya aktif terlibat dalam lingkungan atau komunitas yang membuka peluang perkenalan baru.
17. Saya memiliki orang-orang terpercaya (keluarga, ustadz, teman) yang bisa membantu mencarikan atau mengenalkan calon.
18. Saya secara rutin meluangkan usaha nyata untuk memperluas relasi, bukan hanya menunggu.
19. Saya cukup dikenal di lingkungan saya sebagai pribadi yang serius untuk menikah.
20. Saya tidak menutup diri dari perkenalan baru karena pengalaman masa lalu yang kurang baik.

## Pilar 4: Kesiapan Kecocokan (5 pertanyaan)
*Kemampuan menilai dan memahami standar kecocokan secara objektif.*

21. Saya memiliki standar pasangan yang jelas dan realistis, bukan daftar kriteria yang berubah-ubah.
22. Saya mampu membedakan antara red flag yang serius dan sekadar perbedaan kebiasaan kecil.
23. Saya memahami nilai-nilai hidup (visi pernikahan, prioritas keluarga) yang penting bagi saya.
24. Saya bisa menilai kecocokan secara rasional, tidak hanya berdasarkan ketertarikan fisik atau perasaan sesaat.
25. Saya terbuka mengevaluasi ulang standar saya jika ternyata kurang realistis.

## Pilar 5: Kesiapan Proses Taaruf (5 pertanyaan)
*Kesiapan menjalani mekanisme taaruf yang terarah dan terbatas waktu.*

26. Saya siap melibatkan keluarga atau wali dalam proses taaruf saya.
27. Saya memiliki gambaran timeline yang saya inginkan dari mulai kenal hingga memutuskan.
28. Saya siap mengambil keputusan (lanjut atau tidak) dalam waktu yang relatif terbatas, tidak berlarut-larut.
29. Saya memahami tahapan taaruf secara umum (perkenalan, nadzor, khitbah) dan merasa siap menjalaninya.
30. Saya siap menerima hasil taaruf yang tidak berjalan, tanpa berlama-lama dalam kekecewaan.

---

## Catatan implementasi
- Semua pertanyaan punya `weight = 1` secara default (boleh disesuaikan nanti jika ingin pertanyaan tertentu lebih berpengaruh).
- `min_value = 1`, `max_value = 5` untuk semua pertanyaan, sesuai skema `assessment_questions` yang sudah ada.
- `order_index` mengikuti urutan nomor di atas (1–30).
- `pillar` memetakan ke enum `pillar_key` yang sudah ada: `personal`, `relational`, `opportunity`, `compatibility`, `readiness`.
