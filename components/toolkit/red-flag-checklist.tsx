"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, XCircle, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Response = "baik" | "perhatian" | "serius" | null;

type CheckItem = {
  id: string;
  label: string;
  description: string;
};

const ITEMS: CheckItem[] = [
  {
    id: "konsistensi",
    label: "Konsistensi ucapan dan tindakan",
    description: "Apa yang dia katakan sejalan dengan apa yang dia lakukan, tidak hanya saat ingin memberi kesan baik."
  },
  {
    id: "keterbukaan",
    label: "Keterbukaan dan transparansi",
    description: "Dia terbuka soal latar belakang, kondisi, dan hal-hal penting tanpa perlu banyak didesak."
  },
  {
    id: "perlakuan_orang_lain",
    label: "Cara memperlakukan orang di sekitarnya",
    description: "Perhatikan bagaimana dia bersikap kepada keluarga, teman, atau bahkan orang yang tidak dikenalnya, bukan hanya kepada kamu."
  },
  {
    id: "stabilitas_emosi",
    label: "Kestabilan emosi saat ada ketidaksepakatan",
    description: "Saat ada perbedaan pendapat atau situasi tidak nyaman, dia merespons dengan tenang dan dewasa."
  },
  {
    id: "keseriusan",
    label: "Kejelasan tujuan dan keseriusan proses",
    description: "Dia datang ke proses ini dengan niat yang jelas dan tidak terkesan hanya mencoba-coba."
  },
  {
    id: "hubungan_keluarga",
    label: "Hubungan dengan keluarga dan orang tua",
    description: "Relasinya dengan keluarga terlihat sehat, tidak ada konflik besar yang disembunyikan atau belum diselesaikan."
  },
  {
    id: "finansial",
    label: "Tanggung jawab dan kematangan finansial",
    description: "Ada gambaran yang realistis dan bertanggung jawab soal kondisi dan rencana keuangannya ke depan."
  },
  {
    id: "nilai_ibadah",
    label: "Konsistensi nilai hidup dan ibadah",
    description: "Komitmen ibadah dan nilai hidupnya terlihat konsisten, bukan hanya ditampilkan saat ingin memberi kesan baik."
  },
  {
    id: "menghormati_batasan",
    label: "Menghormati batasan yang kamu tetapkan",
    description: "Dia menghargai batasan yang kamu jaga selama proses, tanpa mencoba menekan atau melewatinya."
  },
  {
    id: "tempo_proses",
    label: "Tidak ada tekanan untuk mempercepat proses",
    description: "Proses berjalan pada tempo yang nyaman untuk kedua pihak, tanpa ada desakan untuk segera memutuskan sebelum kamu siap."
  }
];

const RESPONSE_CONFIG = {
  baik: {
    label: "Terlihat baik",
    icon: CheckCircle2,
    color: "border-emerald-200 bg-emerald-50 text-emerald-700",
    selectedCard: "border-emerald-300 bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  perhatian: {
    label: "Ada sedikit kekhawatiran",
    icon: AlertCircle,
    color: "border-amber-200 bg-amber-50 text-amber-700",
    selectedCard: "border-amber-300 bg-amber-50",
    iconColor: "text-amber-500"
  },
  serius: {
    label: "Ini jadi perhatian serius",
    icon: XCircle,
    color: "border-rose-200 bg-rose-50 text-rose-700",
    selectedCard: "border-rose-300 bg-rose-50",
    iconColor: "text-rose-500"
  }
};

// Insight bank — 3 variasi per kondisi, dipilih deterministik dari hash jawaban
const INSIGHT_BANK: Record<string, string[]> = {
  aman: [
    "Dari yang terlihat sejauh ini, tidak ada tanda yang perlu diwaspadai secara serius. Ini bukan berarti semua pertanyaan sudah terjawab, masih banyak hal yang perlu didalami seiring berjalannya proses. Tapi fondasi awal yang kamu lihat cukup meyakinkan untuk dilanjutkan dengan lebih serius.",
    "Secara keseluruhan, apa yang kamu amati sejauh ini tidak menunjukkan tanda peringatan yang signifikan. Proses ini layak untuk dilanjutkan dengan lebih mendalam. Tetap perhatikan konsistensinya seiring waktu, karena karakter seseorang paling jelas terlihat bukan di momen terbaik mereka.",
    "Hasil checklist ini tidak menemukan area yang perlu diwaspadai secara serius. Itu kabar baik. Lanjutkan proses dengan kepala dingin, dan biarkan waktu serta interaksi yang lebih dalam menjadi penentu berikutnya."
  ],
  waspada: [
    "Ada beberapa area yang layak untuk diperhatikan lebih jauh sebelum melangkah. Bukan berarti ini sinyal untuk berhenti, tapi pertanyaan-pertanyaan yang muncul dari area tersebut perlu dijawab secara terbuka sebelum proses berlanjut. Diskusikan hal ini secara langsung, dan perhatikan bagaimana responsnya.",
    "Satu atau dua area yang kamu tandai sebagai kekhawatiran layak untuk tidak diabaikan begitu saja. Proses taaruf memang membutuhkan waktu untuk mengenal lebih dalam, dan mungkin area-area ini belum sempat terbahas secara terbuka. Coba buka percakapan tentangnya, dan lihat bagaimana dia merespons.",
    "Ada hal yang perlu diperhatikan lebih lanjut berdasarkan apa yang kamu amati. Kekhawatiran kecil yang diabaikan di awal kadang jadi sumber masalah yang lebih besar di kemudian hari. Tidak perlu terburu-buru menyimpulkan, tapi jangan juga menutup mata."
  ],
  pertimbangkan: [
    "Ada cukup banyak hal yang perlu didiskusikan secara terbuka dan jujur sebelum kamu mengambil keputusan lebih jauh. Beberapa area yang kamu tandai adalah hal-hal yang sulit diabaikan begitu saja dalam proses memilih pasangan hidup. Tidak ada salahnya memperlambat proses dan mencari kejelasan terlebih dahulu.",
    "Hasil ini menunjukkan beberapa area yang perlu mendapat perhatian serius. Bukan untuk menghakimi, tapi untuk memastikan bahwa keputusan yang kamu ambil nanti didasarkan pada gambaran yang jelas, bukan harapan semata. Libatkan orang yang kamu percaya untuk mendiskusikan ini.",
    "Cukup banyak yang perlu diklarifikasi berdasarkan pengamatan kamu sejauh ini. Proses taaruf yang baik memberikan ruang untuk pertanyaan-pertanyaan ini dijawab secara tuntas. Jangan ragu untuk memperlambat tempo dan menuntut kejelasan sebelum melangkah lebih jauh."
  ],
  serius: [
    "Hasil ini perlu menjadi bahan pertimbangan yang serius. Banyaknya area yang menjadi perhatian bukan berarti orang ini buruk, tapi ini adalah sinyal bahwa ada banyak hal yang belum jelas atau belum terselesaikan. Keputusan sebesar ini layak untuk tidak tergesa-gesa. Diskusikan dengan orang yang kamu percaya sepenuhnya.",
    "Ada banyak tanda yang muncul dari checklist ini yang tidak bisa diabaikan begitu saja. Mengambil jeda dan mencari lebih banyak informasi sebelum melanjutkan adalah keputusan yang bijak, bukan tanda kelemahan. Kamu berhak untuk memilih dengan tenang dan tanpa tekanan.",
    "Terlalu banyak area yang menjadi kekhawatiran serius untuk diabaikan. Ini bukan vonis, tapi ini adalah sinyal yang perlu didengarkan. Proses taaruf yang sehat seharusnya memberi rasa tenang dan keyakinan yang semakin kuat, bukan kekhawatiran yang semakin bertumpuk."
  ]
};

function pickInsight(bank: string[], answers: Record<string, Response>): string {
  const seed = Object.entries(answers)
    .sort()
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return bank[hash % bank.length];
}

function getCondition(answers: Record<string, Response>) {
  const serius = Object.values(answers).filter((v) => v === "serius").length;
  const perhatian = Object.values(answers).filter((v) => v === "perhatian").length;
  if (serius >= 5) return "serius";
  if (serius >= 3 || (serius >= 2 && perhatian >= 2)) return "pertimbangkan";
  if (serius >= 1 || perhatian >= 2) return "waspada";
  return "aman";
}

const CONDITION_BADGE = {
  aman: { label: "Tidak ada tanda signifikan", tone: "success" as const },
  waspada: { label: "Perlu diperhatikan lebih lanjut", tone: "warning" as const },
  pertimbangkan: { label: "Ada hal yang perlu diklarifikasi", tone: "warning" as const },
  serius: { label: "Perlu pertimbangan serius", tone: "danger" as const }
};

export function RedFlagChecklist() {
  const [answers, setAnswers] = useState<Record<string, Response>>({});
  const [showResult, setShowResult] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === ITEMS.length;
  const progressPercent = (answeredCount / ITEMS.length) * 100;

  const handleAnswer = (id: string, response: Response) => {
    setAnswers((prev) => {
      const updated = { ...prev, [id]: response };
      return updated;
    });
    setShowResult(false);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
  };

  const condition = allAnswered ? getCondition(answers) : null;
  const insight = condition ? pickInsight(INSIGHT_BANK[condition], answers) : null;
  const conditionBadge = condition ? CONDITION_BADGE[condition] : null;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>{answeredCount} dari {ITEMS.length} poin dinilai</span>
          {answeredCount > 0 && (
            <button onClick={handleReset} className="flex items-center gap-1 text-slate-400 hover:text-slate-600">
              <RotateCcw className="h-3 w-3" />
              Ulangi
            </button>
          )}
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100">
          <div
            className="h-1.5 rounded-full bg-navy-900 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {ITEMS.map((item, index) => {
          const current = answers[item.id];
          const isAnswered = current !== undefined;

          return (
            <Card
              key={item.id}
              className={`transition-all duration-200 ${
                isAnswered
                  ? RESPONSE_CONFIG[current!].selectedCard
                  : "border-slate-200 bg-white"
              }`}
            >
              <CardContent className="p-5">
                <div className="mb-3 flex items-start gap-3">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isAnswered ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950">{item.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(["baik", "perhatian", "serius"] as const).map((resp) => {
                    const cfg = RESPONSE_CONFIG[resp];
                    const Icon = cfg.icon;
                    const isSelected = current === resp;
                    return (
                      <button
                        key={resp}
                        type="button"
                        onClick={() => handleAnswer(item.id, resp)}
                        className={`flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 text-center text-xs font-medium transition-all ${
                          isSelected
                            ? cfg.color + " ring-1 ring-offset-1 ring-current"
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isSelected ? "" : "text-slate-300"}`} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hasil — muncul otomatis setelah semua dijawab */}
      {allAnswered && (
        <Card className="overflow-hidden border-navy-200">
          <div className="border-b border-navy-100 bg-navy-950 px-6 py-5">
            <p className="text-sm font-medium text-slate-300">Hasil Checklist Red Flag</p>
            {conditionBadge && (
              <div className="mt-2">
                <Badge tone={conditionBadge.tone}>{conditionBadge.label}</Badge>
              </div>
            )}
          </div>
          <CardContent className="p-6">
            {/* Ringkasan per kategori */}
            <div className="mb-5 grid grid-cols-3 gap-3">
              {(["baik", "perhatian", "serius"] as const).map((resp) => {
                const count = Object.values(answers).filter((v) => v === resp).length;
                const cfg = RESPONSE_CONFIG[resp];
                const Icon = cfg.icon;
                return (
                  <div key={resp} className={`rounded-2xl border p-3 text-center ${cfg.color}`}>
                    <Icon className="mx-auto mb-1 h-5 w-5" />
                    <p className="text-lg font-semibold">{count}</p>
                    <p className="text-xs">{cfg.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Insight naratif */}
            <p className="text-sm leading-7 text-slate-700">{insight}</p>

            <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
              Hasil ini adalah alat bantu refleksi pribadi, bukan vonis atau keputusan akhir. Diskusikan dengan orang yang kamu percaya sebelum mengambil langkah berikutnya.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
