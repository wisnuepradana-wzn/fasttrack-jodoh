import Link from "next/link";
import { Check } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const WEEK_TITLES: Record<number, string> = {
  1: "Persiapan Diri",
  2: "Meningkatkan Daya Tarik Relasional",
  3: "Memperluas Peluang Pertemuan",
  4: "Action dan Tindak Lanjut"
};

export default async function ProgramPage() {
  const profile = await requireActiveProfile();
  const supabase = await createSupabaseServerClient();

  const { data: days } = await supabase
    .from("program_days")
    .select("id, day_number, week_number, title")
    .eq("is_active", true)
    .order("day_number", { ascending: true });

  const { data: progress } = await supabase
    .from("user_program_progress")
    .select("current_day, progress_percent, status")
    .eq("user_id", profile.id)
    .maybeSingle();

  const { data: completions } = await supabase
    .from("program_day_completions")
    .select("day_id, is_completed")
    .eq("user_id", profile.id)
    .eq("is_completed", true);

  const completedDayIds = new Set((completions ?? []).map((c) => c.day_id));
  const currentDay = progress?.current_day ?? 1;
  const progressPercent = progress?.progress_percent ?? 0;
  const allDays = days ?? [];

  const daysByWeek = allDays.reduce<Record<number, typeof allDays>>((acc, day) => {
    if (!acc[day.week_number]) acc[day.week_number] = [];
    acc[day.week_number].push(day);
    return acc;
  }, {});

  const continueLabel = progress?.status === "completed" ? "Buka Ulang Materi" : "Lanjutkan Hari Ini";
  const continueDay = progress?.status === "completed" ? 1 : currentDay;

  return (
    <AppShell title="Program 30 Hari" subtitle="Checklist harian, progress tracker, dan action plan.">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {Object.entries(daysByWeek).map(([weekNumber, weekDays]) => (
            <Card key={weekNumber}>
              <CardHeader>
                <CardDescription>Minggu {weekNumber}</CardDescription>
                <CardTitle>{WEEK_TITLES[Number(weekNumber)]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {weekDays.map((day) => {
                  const isCompleted = completedDayIds.has(day.id);
                  const isCurrent = day.day_number === currentDay && !isCompleted;
                  return (
                    <Link
                      key={day.id}
                      href={`/program/day/${day.day_number}`}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors ${
                        isCurrent
                          ? "border-navy-200 bg-navy-50 text-slate-900"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          isCompleted
                            ? "bg-emerald-500 text-white"
                            : isCurrent
                              ? "bg-navy-900 text-white"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isCompleted ? <Check className="h-3.5 w-3.5" /> : day.day_number}
                      </span>
                      <span className="flex-1">{day.title}</span>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardDescription>Progress Anda</CardDescription>
            <CardTitle>
              Hari {Math.min(currentDay, 30)} / 30
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPercent} />
            <p className="text-sm leading-6 text-slate-600">
              {progress?.status === "completed"
                ? "Anda sudah menyelesaikan seluruh program. Materi tetap bisa dibuka ulang kapan saja, termasuk saat bertemu kandidat baru."
                : "Setiap hari punya panduan dan checklist sederhana. Selesaikan satu per satu sesuai ritme Anda."}
            </p>
            <Link href={`/program/day/${continueDay}`}>
              <Button className="w-full">{continueLabel}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
