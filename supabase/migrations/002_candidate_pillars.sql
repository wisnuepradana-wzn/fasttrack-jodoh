-- =========================================================
-- Migration 002: Perluas pillar_key enum untuk Candidate Assessment
-- =========================================================
-- 5 nilai awal (personal, relational, opportunity, compatibility, readiness)
-- dipakai oleh Self Assessment. 7 nilai baru di bawah ini khusus dipakai
-- oleh Candidate Assessment. Penamaan diberi suffix _kandidat pada dua
-- nilai yang berpotensi rancu dengan nama pillar Self Assessment
-- (komunikasi vs relational, finansial vs personal), supaya jelas
-- keduanya adalah pillar yang berbeda meski temanya berdekatan.

alter type public.pillar_key add value if not exists 'aqidah';
alter type public.pillar_key add value if not exists 'karakter';
alter type public.pillar_key add value if not exists 'komunikasi_kandidat';
alter type public.pillar_key add value if not exists 'visi_pernikahan';
alter type public.pillar_key add value if not exists 'finansial_kandidat';
alter type public.pillar_key add value if not exists 'keluarga';
alter type public.pillar_key add value if not exists 'lifestyle';
