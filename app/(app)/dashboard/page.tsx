import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SELF_PILLAR_LABEL, resolveStatus, STATUS_LABEL, type SelfPillarKey } from "@/lib/decision-engine";
import { statusToBadgeTone } from "@/lib/status-badge";

type RecommendationData = {
  mainCardInsight: string;
  priorityActions: Array<{ label: string; dayNumber: number }>;
};

export default async function DashboardPage() {
  const profile = await requireActiveProfile();
  const supabase = await createSupabaseServerClient();

  // Diperbaiki: query sebelumnya tidak memfilter user_id secara eksplisit
  // (mengandalkan RLS secara tidak sengaja). Sekarang join lewat
  // assessment_sessions dan filter user_id eksplisit, supaya benar secara
  // logic, tidak hanya benar secara kebetulan lewat RLS.
  const { data: latestSession } = await supabase
    .from("assessment_sessions")
    .select(
      "id, completed_at, assessment_results(total_score, pillar_scores, recommendation_summary, recommendation_data)"
    )
    .eq("user_id", profile.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const latestResultRow = latestSession
    ? Array.isArray(latestSession.assessment_results)
      ? latestSession.assessment_results[0]
      : latestSession.assessment_results
    : null;

  const { data: progress } = await supabase
    .from("user_program_progress")
    .select("current_day, progress_percent, status")
    .eq("user_id", profile.id)
    .maybeSingle();

  const currentDay = Math.min(progress?.current_day ?? 1, 30);

  const { data: currentDayData } = await supabase
    .from("program_days")
    .select("id, day_number, title, action_items")
    .eq("day_number", currentDay)
    .eq("is_active", true)
    .maybeSingle();

  const { count: candidateCount } = await supabase
    .from("candidates")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id);

  const { data: lastCandidate } = await supabase
    .from("candidates")
    .select("display_name, latest_score")
    .eq("user_id", profile.id)
    .not("last_evaluated_at", "is", null)
    .order("last_evaluated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const hasAssessment = Boolean(latestResultRow);
  const totalScore = latestResultRow ? Math.round(Number(latestResultRow.total_score)) : 0;
  const totalStatus = resolveStatus(totalScore);
  const recommendation = latestResultRow?.recommendation_data as unknown as RecommendationData | undefined;
  const pillarScores = (latestResultRow?.pillar_scores as Record<string, number>) ?? {};

  const pillarRows = (Object.keys(SELF_PILLAR_LABEL) as SelfPillarKey[]).map((key) => {
    const score = Math.round(pillarScores[key] ?? 0);
    return { key, label: SELF_PILLAR_LABEL[key], score, status: resolveStatus(score) };
  });

  const focusItems = (currentDayData?.action_items as string[]) ?? [];

  return (
    <AppShell title="Dashboard" subtitle="Ringkasan peluang, progress, dan fokus hari ini.">
      <div className="space-y-4">
        {/* Kartu Utama: Peluang Jodoh Saat Ini */}
        <Card className="overflow-hidden border-navy-200 bg-navy-950 text-white">
          <CardContent className="p-6 sm:p-8">
            {hasAssessment ? (
              <>
                <p className="text-sm font-medium text-slate-300">Skor Peluang Jodoh Anda</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-4xl font-semibold sm:text-5xl">{totalScore}</span>
                  <span className="text-lg text-slate-400">/ 100</span>
                  <Badge tone={statusToBadgeTone(totalStatus)} className="ml-auto">
                    {STATUS_LABEL[totalStatus]}
                  </Badge>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-white transition-all duration-700"
                    style={{ width: `${totalScore}%` }}
                  />
                </div>
                {recommendation?.mainCardInsight && (
                  <p className="mt-4 text-sm leading-7 text-slate-300">{recommendation.mainCardInsight}</p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-300">Skor Peluang Jodoh Anda</p>
                <p className="mt-2 text-lg font-medium text-white">Belum ada hasil assessment</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Mulai Assessment Diri untuk melihat Skor Peluang Jodoh dan rekomendasi fokus personal Anda.
                </p>
                <Link href="/assessment" className="mt-4 inline-block">
                  <Button>Mulai Assessment</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* 5 Kartu Pilar, hanya ditampilkan jika sudah ada hasil assessment */}
        {hasAssessment && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {pillarRows.map((pillar) => (
              <Card key={pillar.key} className="p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{pillar.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{pillar.score}</p>
                <Badge tone={statusToBadgeTone(pillar.status)} className="mt-2">
                  {STATUS_LABEL[pillar.status]}
                </Badge>
              </Card>
            ))}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Progress Program */}
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">Progress Program</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                Hari {currentDay} / 30
              </p>
              <div className="mt-4">
                <Progress value={progress?.progress_percent ?? 0} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <span>Status</span>
                <Badge tone="default">
                  {progress?.status === "completed"
                    ? "Selesai"
                    : progress?.status === "active"
                      ? "Sedang Berjalan"
                      : "Belum Dimulai"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Tracker ringkas */}
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">Candidate Tracker</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {candidateCount ?? 0} kandidat
              </p>
              {lastCandidate ? (
                <p className="mt-2 text-sm text-slate-600">
                  Terakhir dinilai: {lastCandidate.display_name}
                  {lastCandidate.latest_score !== null && (
                    <span className="ml-1 font-medium text-slate-900">
                      ({Math.round(Number(lastCandidate.latest_score))})
                    </span>
                  )}
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-600">Belum ada kandidat yang dievaluasi.</p>
              )}
              <Link href="/candidates" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 hover:underline">
                <Users className="h-4 w-4" />
                Buka Candidate Tracker
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Fokus Hari Ini */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Fokus Hari Ini</p>
              {currentDayData && (
                <Link
                  href={`/program/day/${currentDayData.day_number}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 hover:underline"
                >
                  Lanjutkan
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
            {currentDayData ? (
              <>
                <p className="mt-1 font-semibold text-slate-950">{currentDayData.title}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {focusItems.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                Belum ada hari program yang aktif. Mulai Program 30 Hari untuk melihat fokus harian Anda.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
