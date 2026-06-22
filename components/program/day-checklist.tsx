"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toggleDayCompletionAction } from "@/app/(app)/program/actions";

type DayChecklistProps = {
  dayId: string;
  dayNumber: number;
  actionItems: string[];
  initialCompleted: boolean;
};

export function DayChecklist({ dayId, dayNumber, actionItems, initialCompleted }: DayChecklistProps) {
  // Checklist per item disimpan sebagai state lokal saja (tidak ada kolom
  // database untuk status per item, hanya status keseluruhan hari di
  // program_day_completions). Mencentang semua item adalah cara user
  // mengonfirmasi ke diri sendiri sebelum menekan "Tandai Selesai".
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    () => actionItems.map(() => initialCompleted)
  );
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  const allChecked = checkedItems.every(Boolean);

  const toggleItem = (index: number) => {
    if (isCompleted) return;
    setCheckedItems((prev) => prev.map((c, i) => (i === index ? !c : c)));
  };

  const handleMarkComplete = () => {
    startTransition(async () => {
      const result = await toggleDayCompletionAction(dayId, dayNumber, true);
      if (result.success) setIsCompleted(true);
    });
  };

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <p className="mb-4 text-sm font-medium text-slate-700">Checklist</p>
        <div className="space-y-2">
          {actionItems.map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleItem(index)}
              disabled={isCompleted}
              className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                checkedItems[index]
                  ? "border-emerald-200 bg-emerald-50 text-slate-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              } ${isCompleted ? "cursor-default" : ""}`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  checkedItems[index] ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                }`}
              >
                {checkedItems[index] && <Check className="h-3 w-3 text-white" />}
              </span>
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <Check className="h-4 w-4" />
              Hari ini sudah ditandai selesai
            </div>
          ) : (
            <Button onClick={handleMarkComplete} disabled={!allChecked || isPending}>
              {isPending ? "Menyimpan..." : "Tandai Selesai"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
