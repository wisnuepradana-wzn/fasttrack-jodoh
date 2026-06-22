-- =========================================================
-- Migration 004: Seed assessment_questions (Self + Candidate)
-- =========================================================
-- PENTING: Migration ini bergantung pada:
--   1. assessment_templates sudah ada (diseed di 001_init.sql)
--   2. pillar_key enum sudah diperluas (lihat 002_candidate_pillars.sql)
-- Jalankan migration 002 terlebih dahulu dan PASTIKAN sudah commit
-- sebelum menjalankan migration ini, karena PostgreSQL tidak
-- mengizinkan nilai enum baru dipakai dalam transaksi yang sama
-- dengan ALTER TYPE yang menambahkannya.

-- Tambahkan unique constraint pada (template_id, order_index) supaya
-- "on conflict do nothing" di bawah benar benar mencegah duplikasi jika
-- migration ini tidak sengaja dijalankan lebih dari satu kali.
do $$ begin
  alter table public.assessment_questions
    add constraint uq_assessment_questions_template_order
    unique (template_id, order_index);
exception when duplicate_table then null;
end $$;

-- Seed 30 pertanyaan Self Assessment (5 pilar: personal, relational, opportunity, compatibility, readiness)
insert into public.assessment_questions (template_id, pillar, question_text, weight, order_index, min_value, max_value)
select t.id, q.pillar::public.pillar_key, q.question_text, 1, q.order_index, 1, 5
from (
  values
    ('personal', 'Saya memiliki niat dan tujuan menikah yang jelas, bukan sekadar ikut-ikutan atau tekanan sosial.', 1),
    ('personal', 'Saya menjalankan ibadah wajib secara konsisten sebagai bagian dari kesiapan diri.', 2),
    ('personal', 'Saya bisa menerima kekurangan diri sendiri tanpa terus-menerus merasa tidak cukup baik.', 3),
    ('personal', 'Saya mampu mengelola emosi (marah, cemas, kecewa) tanpa membuat keputusan impulsif.', 4),
    ('personal', 'Saya memiliki penghasilan atau rencana finansial yang realistis untuk membangun rumah tangga.', 5),
    ('personal', 'Saya sudah memikirkan dan punya gambaran kasar tentang biaya pernikahan yang saya targetkan.', 6),
    ('personal', 'Saya nyaman dengan diri saya sendiri, tidak bergantung pada validasi orang lain untuk merasa berharga.', 7),
    ('personal', 'Saya punya rutinitas hidup yang stabil (pekerjaan, tempat tinggal, kesehatan) sebagai fondasi berumah tangga.', 8),
    ('relational', 'Saya nyaman memulai percakapan baru dengan orang yang belum saya kenal dekat.', 9),
    ('relational', 'Saya bisa menyampaikan pikiran dan perasaan saya dengan jelas tanpa berputar-putar.', 10),
    ('relational', 'Saya termasuk pendengar yang baik saat orang lain bercerita tentang dirinya.', 11),
    ('relational', 'Saya memiliki cara memperkenalkan diri (biodata, profil, atau cerita singkat) yang representatif dan rapi.', 12),
    ('relational', 'Saya bisa menjaga kesan pertama yang tenang dan meyakinkan saat bertemu orang baru.', 13),
    ('relational', 'Saya terbuka menerima masukan tentang cara saya berkomunikasi dari orang yang saya percaya.', 14),
    ('opportunity', 'Saya memiliki lebih dari satu jalur untuk bertemu calon pasangan (komunitas, kerabat, lembaga taaruf, dll).', 15),
    ('opportunity', 'Saya aktif terlibat dalam lingkungan atau komunitas yang membuka peluang perkenalan baru.', 16),
    ('opportunity', 'Saya memiliki orang-orang terpercaya (keluarga, ustadz, teman) yang bisa membantu mencarikan atau mengenalkan calon.', 17),
    ('opportunity', 'Saya secara rutin meluangkan usaha nyata untuk memperluas relasi, bukan hanya menunggu.', 18),
    ('opportunity', 'Saya cukup dikenal di lingkungan saya sebagai pribadi yang serius untuk menikah.', 19),
    ('opportunity', 'Saya tidak menutup diri dari perkenalan baru karena pengalaman masa lalu yang kurang baik.', 20),
    ('compatibility', 'Saya memiliki standar pasangan yang jelas dan realistis, bukan daftar kriteria yang berubah-ubah.', 21),
    ('compatibility', 'Saya mampu membedakan antara red flag yang serius dan sekadar perbedaan kebiasaan kecil.', 22),
    ('compatibility', 'Saya memahami nilai-nilai hidup (visi pernikahan, prioritas keluarga) yang penting bagi saya.', 23),
    ('compatibility', 'Saya bisa menilai kecocokan secara rasional, tidak hanya berdasarkan ketertarikan fisik atau perasaan sesaat.', 24),
    ('compatibility', 'Saya terbuka mengevaluasi ulang standar saya jika ternyata kurang realistis.', 25),
    ('readiness', 'Saya siap melibatkan keluarga atau wali dalam proses taaruf saya.', 26),
    ('readiness', 'Saya memiliki gambaran timeline yang saya inginkan dari mulai kenal hingga memutuskan.', 27),
    ('readiness', 'Saya siap mengambil keputusan (lanjut atau tidak) dalam waktu yang relatif terbatas, tidak berlarut-larut.', 28),
    ('readiness', 'Saya memahami tahapan taaruf secara umum (perkenalan, nadzor, khitbah) dan merasa siap menjalaninya.', 29),
    ('readiness', 'Saya siap menerima hasil taaruf yang tidak berjalan, tanpa berlama-lama dalam kekecewaan.', 30)
) as q(pillar, question_text, order_index)
cross join (select id from public.assessment_templates where slug = 'self-assessment-v1') as t
on conflict (template_id, order_index) do nothing;

-- Seed 35 pertanyaan Candidate Assessment (7 area: aqidah, karakter, komunikasi_kandidat, visi_pernikahan, finansial_kandidat, keluarga, lifestyle)
insert into public.assessment_questions (template_id, pillar, question_text, weight, order_index, min_value, max_value)
select t.id, q.pillar::public.pillar_key, q.question_text, 1, q.order_index, 1, 5
from (
  values
    ('aqidah', 'Memiliki komitmen menjalankan ibadah wajib secara konsisten', 1),
    ('aqidah', 'Nilai hidup dan prioritas hidupnya sejalan dengan saya', 2),
    ('aqidah', 'Memiliki tujuan menikah yang jelas dan serius', 3),
    ('aqidah', 'Terbuka untuk terus belajar dan bertumbuh dalam pemahaman agama', 4),
    ('aqidah', 'Menjaga batasan yang wajar selama proses perkenalan', 5),
    ('karakter', 'Bertanggung jawab atas perkataan dan tindakannya', 6),
    ('karakter', 'Menepati janji yang sudah disampaikan', 7),
    ('karakter', 'Menghargai orang lain, termasuk dalam hal hal kecil', 8),
    ('karakter', 'Mampu mengendalikan emosi dalam situasi yang kurang nyaman', 9),
    ('karakter', 'Mau meminta maaf dan mengakui kesalahan jika memang salah', 10),
    ('komunikasi_kandidat', 'Nyaman diajak berdiskusi tentang berbagai topik', 11),
    ('komunikasi_kandidat', 'Mendengarkan dengan baik saat saya berbicara', 12),
    ('komunikasi_kandidat', 'Tidak menghindari pembahasan yang sedikit sulit atau sensitif', 13),
    ('komunikasi_kandidat', 'Responsif dan tidak berlarut larut dalam memberi kabar', 14),
    ('komunikasi_kandidat', 'Menghargai pendapat saya meski berbeda dengan pendapatnya', 15),
    ('visi_pernikahan', 'Sepakat mengenai tujuan dan arah membangun keluarga', 16),
    ('visi_pernikahan', 'Sepakat mengenai pendekatan pendidikan anak di masa depan', 17),
    ('visi_pernikahan', 'Sepakat mengenai pembagian peran suami dan istri dalam rumah tangga', 18),
    ('visi_pernikahan', 'Memiliki target dan rencana masa depan yang realistis', 19),
    ('visi_pernikahan', 'Terbuka membahas ekspektasi pernikahan secara jujur dan detail', 20),
    ('finansial_kandidat', 'Memiliki tanggung jawab finansial dalam mengatur keuangan pribadi', 21),
    ('finansial_kandidat', 'Tidak boros dan cukup bijak dalam pengeluaran', 22),
    ('finansial_kandidat', 'Terbuka berdiskusi soal keuangan tanpa merasa canggung', 23),
    ('finansial_kandidat', 'Memiliki rencana keuangan untuk masa depan, sekecil apapun itu', 24),
    ('finansial_kandidat', 'Memahami pentingnya keterbukaan finansial dalam rumah tangga', 25),
    ('keluarga', 'Memiliki hubungan yang baik dengan orang tua dan keluarganya', 26),
    ('keluarga', 'Berada dalam lingkungan pertemanan yang positif dan suportif', 27),
    ('keluarga', 'Menghormati dan menghargai keluarga saya', 28),
    ('keluarga', 'Memiliki cara yang sehat dalam menyelesaikan konflik dengan keluarga', 29),
    ('keluarga', 'Keluarganya cukup terbuka dan mendukung proses yang sedang dijalani', 30),
    ('lifestyle', 'Memiliki aktivitas dan kebiasaan harian yang sejalan dengan saya', 31),
    ('lifestyle', 'Cara menghabiskan waktu luangnya cukup sesuai dengan yang saya harapkan', 32),
    ('lifestyle', 'Memiliki kebiasaan hidup yang sehat dan teratur', 33),
    ('lifestyle', 'Target dan rencana masa depannya searah dengan saya', 34),
    ('lifestyle', 'Cukup fleksibel dalam menyesuaikan diri dengan kebiasaan yang berbeda', 35)
) as q(pillar, question_text, order_index)
cross join (select id from public.assessment_templates where slug = 'candidate-assessment-v1') as t
on conflict (template_id, order_index) do nothing;
