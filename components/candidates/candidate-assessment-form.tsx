"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AssessmentAnalyzing } from "@/components/assessment/assessment-analyzing";
import { submitCandidateAssessmentAction } from "@/app/(app)/candidates/actions";

type Question = { id: string; pillar: string; questionText: string; orderIndex: number };
type Area = { pillar: string; label: string; questions: Question[] };

type Props = {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  areas: Area[];
};

const SCALE_LABELS: Record<number, string> = {
  1: "Sangat Tidak Sesuai",
  2: "Tidak Sesuai",
  3: "Netral",
  4: "Sesuai",
  5: "Sangat Sesuai"
};

type Phase = "filling" | "analyzing" | "error";

export function CandidateAssessmentForm({ sessionId, candidateId, candidateName, areas }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [openArea, setOpenArea] = useState<string>(areas[0]?.pillar ?? "");
  const [phase, setPhase] = useState<Phase>("filling");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalQuestions = areas.reduce((sum, a) => sum + a.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / totalQuestions) * 100;
  const allAnswered = answeredCount === totalQuestions;

  // Peringatan sebelum tutup tab jika sudah ada jawaban yang diisi
  useEffect(() => {
    if (phase !== "filling" || answeredCount === 0) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [phase, answeredCount]);

  const handleAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const isAreaComplete = (area: Area) =>
    area.questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setPhase("analyzing");

    const payload = areas.flatMap((area) =>
      area.questions.map((q) => ({
        questionId: q.id,
        pillar: q.pillar,
        value: answers[q.id] as number
      }))
    );

    const result = await submitCandidateAssessmentAction(sessionId, candidateId, payload);
    if (!result.success) {
      setErrorMessage(result.error);
      setPhase("error");
    }
  };

  const handleAnalyzingComplete = () => {
    router.push(`/candidates/${candidateId}/result/${sessionId}`);
  };

  if (phase === "analyzing") return <AssessmentAnalyzing onComplete={handleAnalyzingComplete} />;

  if (phase === "error") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <p className="text-sm font-medium text-rose-600">{errorMessage}</p>
        <Button variant="outline" onClick={() => setPhase("filling")}>Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-3">
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>{answeredCount} dari {totalQuestions} pertanyaan dijawab</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} />
      </div>

      {areas.map((area, areaIndex) => {
        const isOpen = openArea === area.pillar;
        const areaComplete = isAreaComplete(area);
        const areaAnsweredCount = area.questions.filter((q) => answers[q.id] !== undefined).length;

        return (
          <Card key={area.pillar} className={`overflow-hidden transition-all ${isOpen ? "shadow-soft" : ""}`}>
            <button
              type="button"
              onClick={() => setOpenArea(isOpen ? "" : area.pillar)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  areaComplete ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {areaComplete ? <Check className="h-3.5 w-3.5" /> : areaIndex + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{area.label}</p>
                  <p className="text-xs text-slate-500">{areaAnsweredCount} / {area.questions.length} dijawab</p>
                </div>
              </div>
              {isOpen
                ? <ChevronUp className="h-4 w-4 text-slate-400" />
                : <ChevronDown className="h-4 w-4 text-slate-400" />
              }
            </button>

            {isOpen && (
              <CardContent className="space-y-5 border-t border-slate-100 p-5">
                {area.questions.map((q) => {
                  const currentAnswer = answers[q.id];
                  return (
                    <div key={q.id}>
                      <p className="mb-3 text-sm font-medium leading-relaxed text-slate-900">{q.questionText}</p>
                      <div className="space-y-1.5">
                        {[1, 2, 3, 4, 5].map((value) => {
                          const isSelected = currentAnswer === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleAnswer(q.id, value)}
                              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-2.5 text-left text-sm transition-all ${
                                isSelected
                                  ? "border-navy-900 bg-navy-900 text-white"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-navy-200 hover:bg-slate-50"
                              }`}
                            >
                              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                                isSelected ? "border-white" : "border-slate-300 text-slate-400"
                              }`}>{value}</span>
                              {SCALE_LABELS[value]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Auto-buka area berikutnya setelah area ini selesai */}
                {areaComplete && areaIndex < areas.length - 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setOpenArea(areas[areaIndex + 1].pillar)}
                    className="w-full"
                  >
                    Lanjut ke Area {areaIndex + 2}: {areas[areaIndex + 1].label}
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}

      <div className="pt-2">
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full"
        >
          {allAnswered ? "Lihat Hasil Evaluasi" : `Selesaikan semua area dulu (${answeredCount}/${totalQuestions})`}
        </Button>
      </div>
    </div>
  );
}
