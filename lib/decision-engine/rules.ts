// Bank konten untuk Self Assessment: kalimat insight kartu utama per pillar
// terlemah, dan daftar action item dengan rujukan hari program.
// Dipisah dari recommendation-engine.ts supaya konten mudah direvisi
// tanpa menyentuh logic pemilihannya.

import { SelfPillarKey } from "./types";

export const SELF_PILLAR_LABEL: Record<SelfPillarKey, string> = {
  personal: "Kesiapan Pribadi",
  relational: "Daya Tarik Relasional",
  opportunity: "Peluang Pertemuan",
  compatibility: "Kesiapan Kecocokan",
  readiness: "Kesiapan Proses Taaruf"
};

// Satu kalimat insight personal yang dipasangkan dengan badge di kartu utama
// dashboard. Ditulis natural, merujuk pillar terlemah secara eksplisit.
export const SELF_INSIGHT_SENTENCE: Record<SelfPillarKey, string> = {
  personal:
    "Fondasi pribadi Anda masih perlu dirapikan sebelum melangkah lebih jauh ke proses taaruf.",
  relational:
    "Anda sudah cukup terbuka pada peluang, namun cara membangun kesan dan komunikasi awal masih bisa diperkuat.",
  opportunity:
    "Anda sudah memiliki pondasi yang cukup baik. Fokus berikutnya adalah memperluas peluang bertemu calon pasangan yang serius.",
  compatibility:
    "Anda cukup siap secara pribadi, namun perlu memperjelas standar dan cara menilai kecocokan agar tidak salah langkah.",
  readiness:
    "Anda sudah memiliki banyak peluang, namun kesiapan menjalani proses taaruf secara mekanis masih perlu dimantapkan."
};

// Kalimat "hambatan utama" untuk bagian Analisis, dipisah dari insight
// kartu utama karena nadanya lebih diagnostik / langsung ke pokok masalah.
export const SELF_DIAGNOSIS_SENTENCE: Record<SelfPillarKey, string> = {
  personal: "Hambatan terbesar Anda saat ini adalah belum matangnya kesiapan pribadi.",
  relational: "Hambatan terbesar Anda saat ini adalah cara membangun daya tarik relasional.",
  opportunity: "Hambatan terbesar Anda saat ini adalah rendahnya peluang pertemuan.",
  compatibility: "Hambatan terbesar Anda saat ini adalah kejelasan standar dan kesiapan kecocokan.",
  readiness: "Hambatan terbesar Anda saat ini adalah kesiapan menjalani proses taaruf secara nyata."
};

export type ActionItem = {
  label: string;
  dayNumber: number;
};

// 3 action item per pillar, masing masing merujuk ke hari spesifik
// di Program 30 Hari, supaya rekomendasi tidak menggantung dan user
// bisa langsung lanjut ke hari yang relevan.
export const SELF_PRIORITY_ACTIONS: Record<SelfPillarKey, ActionItem[]> = {
  personal: [
    { label: "Luruskan kembali niat dan tujuan menikah Anda", dayNumber: 1 },
    { label: "Lakukan audit kesiapan finansial secara jujur", dayNumber: 2 },
    { label: "Bangun rutinitas spiritual harian yang konsisten", dayNumber: 5 }
  ],
  relational: [
    { label: "Latih cara membuka percakapan dan menyampaikan pikiran dengan jelas", dayNumber: 8 },
    { label: "Susun biodata diri yang representatif", dayNumber: 9 },
    { label: "Latih kemampuan mendengar secara aktif", dayNumber: 10 }
  ],
  opportunity: [
    { label: "Petakan semua jalur pertemuan yang tersedia bagi Anda", dayNumber: 15 },
    { label: "Libatkan orang terpercaya untuk membantu memperluas jalur", dayNumber: 16 },
    { label: "Aktif di komunitas yang relevan dengan nilai hidup Anda", dayNumber: 17 }
  ],
  compatibility: [
    { label: "Perjelas standar pasangan Anda secara realistis", dayNumber: 4 },
    { label: "Pelajari Framework Screening Calon Pasangan di Toolkit", dayNumber: 23 },
    { label: "Latih kemampuan menilai kecocokan secara rasional", dayNumber: 27 }
  ],
  readiness: [
    { label: "Diskusikan kesiapan melibatkan keluarga dalam proses taaruf", dayNumber: 26 },
    { label: "Tentukan gambaran timeline taaruf yang Anda inginkan", dayNumber: 28 },
    { label: "Pelajari tahapan taaruf secara umum agar tidak ragu saat menjalani", dayNumber: 29 }
  ]
};
