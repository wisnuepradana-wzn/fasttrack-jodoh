import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DayChecklist } from "@/components/program/day-checklist";

export default async function ProgramDayPage({
  params
}: {
  params: Promise<{ dayNumber: string }>;
}) {
  const profile = await requireActiveProfile();
  const { dayNumber } = await params;
  const dayNumberInt = Number(dayNumber);

  if (!Number.isInteger(dayNumberInt) || dayNumberInt < 1 || dayNumberInt > 30) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();

  const { data: day } = await supabase
    .from("program_days")
    .select("id, day_number, week_number, title, objective, content, action_items")
    .eq("day_number", dayNumberInt)
    .eq("is_active", true)
    .single();

  if (!day) {
    notFound();
  }

  const { data: completion } = await supabase
    .from("program_day_completions")
    .select("is_completed, notes")
    .eq("user_id", profile.id)
    .eq("day_id", day.id)
    .maybeSingle();

  const actionItems = (day.action_items as string[]) ?? [];

  return (
    <AppShell title={`Hari ${day.day_number}`} subtitle={`Minggu ${day.week_number} • ${day.title}`}>
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between text-sm">
          {day.day_number > 1 ? (
            <Link
              href={`/program/day/${day.day_number - 1}`}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"
            >
              <ChevronLeft className="h-4 w-4" />
              Hari {day.day_number - 1}
            </Link>
          ) : (
            <span />
          )}
          {day.day_number < 30 ? (
            <Link
              href={`/program/day/${day.day_number + 1}`}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"
            >
              Hari {day.day_number + 1}
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </div>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <Badge tone="default">Minggu {day.week_number}</Badge>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">{day.title}</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">{day.objective}</p>
            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-700">{day.content}</p>
          </CardContent>
        </Card>

        <DayChecklist
          dayId={day.id}
          dayNumber={day.day_number}
          actionItems={actionItems}
          initialCompleted={completion?.is_completed ?? false}
        />
      </div>
    </AppShell>
  );
}
