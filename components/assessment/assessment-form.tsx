"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AssessmentAnalyzing } from "@/components/assessment/assessment-analyzing";
import { submitSelfAssessmentAction, type SubmitAnswerInput } from "@/app/(app)/assessment/actions";

type Question = {
  id: string;
  pillar: string;
  questionText: string;
  orderIndex: number;
};

type AssessmentFormProps = {
  sessionId: string;
  questions: Question[];
};

const SCALE_LABELS: Record<number, string> = {
  1: "Sangat Tidak Setuju",
  2: "Tidak Setuju",
  3: "Netral",
  4: "Setuju",
  5: "Sangat Setuju"
};

// Tahapan UI: mengisi pertanyaan, lalu animasi analyzing, lalu redirect
// otomatis ke halaman hasil (ditangani oleh komponen pemanggil setelah
// submitSelfAssessmentAction selesai).
type Phase = "filling" | "analyzing" | "error";

export function AssessmentForm({ sessionId, questions }: AssessmentFormProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<Phase>("filling");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const currentAnswer = answers[currentQuestion?.id];

  // Peringatan standar browser jika user mencoba menutup tab di tengah
  // pengisian, karena jawaban hanya disimpan di state browser sampai
  // submit terakhir (sesuai keputusan, bukan auto-save per pertanyaan).
  useEffect(() => {
    if (phase !== "filling") return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(answers).length > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [phase, answers]);

  const handleSelectAnswer = useCallback(
    (value: number) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    },
    [currentQuestion]
  );

  const handleNext = () => {
    if (currentAnswer === undefined) return;
    if (isLastQuestion) {
      void handleSubmit();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    // Validasi defensif: pastikan semua pertanyaan benar benar terjawab
    // sebelum submit, meskipun alur normal (lewat handleNext) seharusnya
    // sudah menjamin ini. Jaga jaga ada state yang tidak terduga.
    const unanswered = questions.find((q) => answers[q.id] === undefined);
    if (unanswered) {
      const unansweredIndex = questions.findIndex((q) => q.id === unanswered.id);
      setCurrentIndex(unansweredIndex);
      return;
    }

    setPhase("analyzing");

    const payload: SubmitAnswerInput[] = questions.map((q) => ({
      questionId: q.id,
      pillar: q.pillar,
      value: answers[q.id] as number
    }));

    const result = await submitSelfAssessmentAction(sessionId, payload);

    if (!result.success) {
      setErrorMessage(result.error);
      setPhase("error");
    }
    // Jika sukses, navigasi ditangani oleh onAnalyzingComplete setelah
    // animasi selesai, supaya animasi tetap terasa utuh 2-3 detik
    // alih alih dipotong oleh kecepatan response server.
  };

  const handleAnalyzingComplete = () => {
    router.push(`/assessment/${sessionId}/result`);
  };

  if (phase === "analyzing") {
    return <AssessmentAnalyzing onComplete={handleAnalyzingComplete} />;
  }

  if (phase === "error") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <p className="text-sm font-medium text-rose-600">{errorMessage}</p>
        <Button variant="outline" onClick={() => setPhase("filling")}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>
            Pertanyaan {currentIndex + 1} dari {totalQuestions}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <p className="text-lg font-medium leading-relaxed text-slate-950 sm:text-xl">
          {currentQuestion.questionText}
        </p>

        <div className="mt-8 space-y-2">
          {[1, 2, 3, 4, 5].map((value) => {
            const isSelected = currentAnswer === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleSelectAnswer(value)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-all ${
                  isSelected
                    ? "border-navy-900 bg-navy-900 text-white shadow-soft"
                    : "border-slate-200 bg-white text-slate-700 hover:border-navy-200 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                    isSelected ? "border-white" : "border-slate-300 text-slate-400"
                  }`}
                >
                  {value}
                </span>
                {SCALE_LABELS[value]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </Button>
        <Button onClick={handleNext} disabled={currentAnswer === undefined}>
          {isLastQuestion ? "Selesai" : "Lanjut"}
          {!isLastQuestion && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
