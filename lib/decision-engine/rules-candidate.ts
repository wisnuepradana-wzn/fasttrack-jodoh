// Bank konten untuk Candidate Assessment: label area, dan insight per
// kondisi (kuat, cukup, perlu_perbaikan) untuk masing masing dari 7 area.
// Setiap kondisi punya 2 variasi kalimat, dipilih salah satu secara acak
// supaya tidak terasa template saat user mengevaluasi beberapa kandidat.

import { CandidatePillarKey, StatusLevel } from "./types";

export const CANDIDATE_PILLAR_LABEL: Record<CandidatePillarKey, string> = {
  aqidah: "Aqidah & Nilai Hidup",
  karakter: "Karakter & Akhlak",
  komunikasi_kandidat: "Komunikasi",
  visi_pernikahan: "Visi Pernikahan",
  finansial_kandidat: "Finansial",
  keluarga: "Keluarga & Lingkungan",
  lifestyle: "Gaya Hidup & Kecocokan"
};

type InsightBank = Record<CandidatePillarKey, Record<StatusLevel, string[]>>;

export const CANDIDATE_INSIGHT_BANK: InsightBank = {
  aqidah: {
    kuat: [
      "Nilai hidup dan keyakinannya terlihat sangat sejalan dengan Anda, ini fondasi yang baik untuk dibangun lebih jauh.",
      "Komitmen dan kesungguhannya dalam menjalani proses ini terlihat cukup konsisten sejak awal."
    ],
    cukup: [
      "Secara umum nilai hidupnya cukup sejalan, namun ada baiknya didalami lebih jauh soal cara dia memaknai dan menjalankan keyakinannya sehari hari.",
      "Kesungguhan dan arah tujuannya sudah cukup terlihat, meski masih ada beberapa hal yang perlu diobrolkan lebih terbuka."
    ],
    perlu_perbaikan: [
      "Belum banyak hal yang bisa dinilai soal kesejalanan nilai hidup, ini area yang penting untuk didiskusikan lebih mendalam sebelum melanjutkan.",
      "Batasan dan kesungguhan dalam proses ini masih terasa belum jelas, ada baiknya digali lebih lanjut."
    ]
  },
  karakter: {
    kuat: [
      "Karakter dan caranya bersikap terlihat cukup matang dan konsisten dalam berbagai situasi.",
      "Kemampuannya mengelola emosi dan bertanggung jawab atas tindakannya terlihat menonjol."
    ],
    cukup: [
      "Secara umum karakternya terlihat baik, namun belum banyak situasi yang benar benar menguji bagaimana dia bersikap di bawah tekanan.",
      "Ada baiknya memperhatikan lebih jauh bagaimana responnya saat menghadapi ketidaksepakatan atau situasi yang kurang nyaman."
    ],
    perlu_perbaikan: [
      "Belum cukup banyak hal yang bisa dijadikan gambaran soal karakternya, ini perlu waktu dan interaksi lebih untuk benar benar dipahami.",
      "Beberapa momen menunjukkan respons yang perlu diperhatikan lebih lanjut sebelum mengambil kesimpulan."
    ]
  },
  komunikasi_kandidat: {
    kuat: [
      "Komunikasi yang terbangun terasa nyaman dan dua arah, ini fondasi yang baik untuk menjalani proses ke depan.",
      "Dia terlihat cukup terbuka membahas topik yang penting, termasuk yang sedikit sensitif."
    ],
    cukup: [
      "Komunikasi sejauh ini berjalan cukup baik, namun belum banyak diuji dengan topik yang lebih mendalam atau sensitif.",
      "Ada baiknya mulai membahas hal hal yang lebih substansial untuk melihat bagaimana komunikasinya saat topiknya tidak ringan."
    ],
    perlu_perbaikan: [
      "Komunikasi yang terbangun masih terasa terbatas, perlu lebih banyak percakapan untuk benar benar memahami caranya berkomunikasi.",
      "Responsivitas dan keterbukaannya dalam berdiskusi masih jadi catatan yang perlu diperhatikan."
    ]
  },
  visi_pernikahan: {
    kuat: [
      "Visi pernikahan dan rencana masa depan terlihat cukup selaras, ini modal penting untuk membangun rumah tangga bersama.",
      "Keterbukaannya membahas ekspektasi pernikahan secara detail menunjukkan kesiapan yang baik."
    ],
    cukup: [
      "Sebagian besar visi pernikahan sudah selaras, namun masih ada beberapa area yang perlu dibahas lebih detail, terutama soal pembagian peran.",
      "Diskusi soal rencana masa depan sudah dimulai, namun perlu didalami lagi agar lebih konkret."
    ],
    perlu_perbaikan: [
      "Belum banyak kesepakatan yang terbangun soal visi pernikahan, ini termasuk area krusial yang sebaiknya didiskusikan secara mendalam.",
      "Ekspektasi soal peran dan rencana masa depan masih terasa belum dibahas secara terbuka."
    ]
  },
  finansial_kandidat: {
    kuat: [
      "Tanggung jawab dan keterbukaannya soal keuangan terlihat cukup baik, ini fondasi penting untuk mengelola rumah tangga bersama.",
      "Rencana keuangannya sejauh ini terlihat cukup matang dan realistis."
    ],
    cukup: [
      "Secara umum terlihat cukup bertanggung jawab, namun pembahasan soal rencana keuangan jangka panjang masih bisa lebih didalami.",
      "Keterbukaan soal keuangan sudah mulai terbangun, namun perlu dibahas lebih detail soal pengelolaan ke depan."
    ],
    perlu_perbaikan: [
      "Diskusi mengenai pengelolaan keuangan belum cukup mendalam, ini penting untuk dibahas lebih terbuka sebelum melanjutkan.",
      "Belum banyak gambaran soal tanggung jawab dan rencana finansialnya, perlu obrolan yang lebih jujur soal ini."
    ]
  },
  keluarga: {
    kuat: [
      "Hubungan dengan keluarga dan lingkungannya terlihat sehat, ini biasanya jadi indikator yang baik untuk kehidupan rumah tangga ke depan.",
      "Caranya menghormati dan menjalin hubungan dengan keluarga Anda juga terlihat cukup baik sejauh ini."
    ],
    cukup: [
      "Hubungan dengan keluarga terlihat cukup baik, namun belum banyak interaksi langsung yang bisa dijadikan gambaran lebih jauh.",
      "Ada baiknya mulai melibatkan kedua keluarga lebih jauh untuk melihat bagaimana dinamikanya."
    ],
    perlu_perbaikan: [
      "Belum banyak informasi soal hubungan keluarga dan lingkungannya, ini penting untuk digali lebih lanjut.",
      "Dinamika dengan keluarga masih jadi area yang perlu lebih banyak diperhatikan sebelum melanjutkan proses."
    ]
  },
  lifestyle: {
    kuat: [
      "Gaya hidup dan kebiasaan hariannya terlihat cukup sejalan, ini akan memudahkan penyesuaian dalam kehidupan sehari hari nanti.",
      "Fleksibilitasnya dalam menghadapi perbedaan kebiasaan juga terlihat baik."
    ],
    cukup: [
      "Sebagian gaya hidupnya cukup sejalan, namun ada beberapa kebiasaan yang mungkin perlu saling menyesuaikan ke depannya.",
      "Ada baiknya membahas lebih jauh soal rutinitas harian yang diharapkan masing masing setelah menikah."
    ],
    perlu_perbaikan: [
      "Masih ada cukup banyak perbedaan gaya hidup yang belum terbahas, ini penting untuk didiskusikan agar tidak jadi kejutan di kemudian hari.",
      "Kecocokan dalam kebiasaan harian masih jadi area yang perlu lebih banyak diobrolkan."
    ]
  }
};

export const CANDIDATE_DISCUSSION_TOPICS: Record<CandidatePillarKey, string[]> = {
  aqidah: [
    "Tanyakan bagaimana dia memaknai pernikahan dalam perjalanan keagamaannya.",
    "Diskusikan bagaimana kebiasaan ibadah sehari hari yang ingin dijalani bersama nanti.",
    "Bicarakan secara terbuka, apa yang membuatnya yakin sudah siap untuk menikah sekarang."
  ],
  karakter: [
    "Tanyakan bagaimana caranya biasa menyelesaikan konflik dengan orang terdekat.",
    "Perhatikan caranya merespons saat ada rencana yang berubah mendadak.",
    "Diskusikan pengalaman masa lalu yang menurutnya membentuk caranya bersikap sekarang."
  ],
  komunikasi_kandidat: [
    "Coba bahas satu topik yang menurut Anda berpotensi sensitif, dan perhatikan caranya merespons.",
    "Tanyakan bagaimana dia biasa menyampaikan sesuatu yang tidak disukai pada pasangan.",
    "Diskusikan ekspektasi masing masing soal frekuensi dan cara berkomunikasi setelah menikah."
  ],
  visi_pernikahan: [
    "Diskusikan secara spesifik, akan tinggal di mana dan bagaimana pembagian tanggung jawab rumah tangga.",
    "Bicarakan pandangan masing masing soal pendidikan dan pengasuhan anak kelak.",
    "Tanyakan apa yang menurutnya paling penting untuk dijaga dalam pernikahan jangka panjang."
  ],
  finansial_kandidat: [
    "Diskusikan bagaimana rencana pengelolaan keuangan rumah tangga setelah menikah, termasuk siapa yang mengelola apa.",
    "Bicarakan secara terbuka soal kebiasaan menabung dan prioritas pengeluaran masing masing.",
    "Tanyakan bagaimana pandangannya soal berbagi tanggung jawab finansial dalam rumah tangga."
  ],
  keluarga: [
    "Coba luangkan waktu untuk silaturahmi dan mengenal keluarganya lebih dekat.",
    "Tanyakan bagaimana hubungannya dengan keluarga selama ini, termasuk momen momen yang kurang mudah.",
    "Diskusikan bagaimana rencana menjaga hubungan baik dengan kedua keluarga setelah menikah."
  ],
  lifestyle: [
    "Bicarakan bagaimana rutinitas harian masing masing dan bagaimana menggabungkannya nanti.",
    "Diskusikan cara masing masing menghabiskan waktu luang dan apakah ada ruang untuk saling menyesuaikan.",
    "Tanyakan kebiasaan apa yang menurutnya paling penting untuk dijaga dalam kehidupan rumah tangga."
  ]
};

// Pemilihan acak yang deterministik berdasarkan seed (misal id kandidat
// atau id area), supaya hasilnya konsisten setiap kali dilihat ulang,
// bukan berubah ubah acak setiap reload halaman.
export function pickVariant(options: string[], seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return options[hash % options.length];
}
