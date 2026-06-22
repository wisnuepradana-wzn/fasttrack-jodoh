"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

type AnalyzingStep = {
  label: string;
};

const STEPS: AnalyzingStep[] = [
  { label: "Menghitung Skor Peluang Jodoh" },
  { label: "Menganalisis 5 pilar kesiapan" },
  { label: "Menentukan area prioritas" },
  { label: "Menyusun rekomendasi personal" }
];

// Durasi tiap step sekitar 550ms sampai 700ms, total sekitar 2.3 sampai 2.8
// detik untuk seluruh proses, sesuai target 2 sampai 3 detik. Variasi durasi
// kecil antar step supaya tidak terasa seperti animasi mekanis yang seragam.
const STEP_DURATIONS_MS = [600, 700, 550, 650];

type AssessmentAnalyzingProps = {
  // Dipanggil setelah seluruh animasi selesai, baru navigasi/render hasil
  // sebenarnya dilakukan oleh komponen pemanggil.
  onComplete: () => void;
};

export function AssessmentAnalyzing({ onComplete }: AssessmentAnalyzingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= STEPS.length) {
      const finishTimeout = setTimeout(onComplete, 400);
      return () => clearTimeout(finishTimeout);
    }

    const timeout = setTimeout(() => {
      setCurrentStep((step) => step + 1);
    }, STEP_DURATIONS_MS[currentStep]);

    return () => clearTimeout(timeout);
  }, [currentStep, onComplete]);

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <p className="mb-6 text-center text-sm font-medium text-slate-500">
          Menganalisis jawaban Anda...
        </p>
        <div className="space-y-3">
          {STEPS.map((step, index) => {
            const isDone = index < currentStep;
            const isActive = index === currentStep;
            return (
              <div
                key={step.label}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-500 ${
                  isDone || isActive
                    ? "border-navy-200 bg-white opacity-100 shadow-soft"
                    : "border-slate-100 bg-slate-50 opacity-40"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : isActive ? (
                    <Loader2 className="h-5 w-5 animate-spin text-navy-900" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  )}
                </span>
                <span
                  className={`text-sm ${
                    isDone || isActive ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        {currentStep >= STEPS.length && (
          <p className="mt-6 text-center text-sm font-medium text-slate-500">
            Hampir selesai...
          </p>
        )}
      </div>
    </div>
  );
}
