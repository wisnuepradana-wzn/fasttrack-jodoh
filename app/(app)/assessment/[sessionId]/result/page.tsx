import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SELF_PILLAR_LABEL, resolveStatus, STATUS_LABEL, type SelfPillarKey } from "@/lib/decision-engine";
import { statusToBadgeTone } from "@/lib/status-badge";

type RecommendationData = {
  mainCardInsight: string;
  priorityActions: Array<{ label: string; dayNumber: number }>;
};

export default async function AssessmentResultPage({
  params
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const profile = await requireActiveProfile();
  const { sessionId } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: session } = await supabase
    .from("assessment_sessions")
    .select("id, user_id, completed_at")
    .eq("id", sessionId)
    .single();

  if (!session || session.user_id !== profile.id) {
    notFound();
  }

  const { data: result } = await supabase
    .from("assessment_results")
    .select("total_score, pillar_scores, recommendation_summary, recommendation_data")
    .eq("session_id", sessionId)
    .single();

  if (!result) {
    notFound();
  }

  const totalScore = Math.round(Number(result.total_score));
  const totalStatus = resolveStatus(totalScore);
  const recommendation = result.recommendation_data as unknown as RecommendationData;
  const pillarScores = result.pillar_scores as Record<string, number>;

  const pillarRows = (Object.keys(SELF_PILLAR_LABEL) as SelfPillarKey[]).map((key) => {
    const score = Math.round(pillarScores[key] ?? 0);
    return {
      key,
      label: SELF_PILLAR_LABEL[key],
      score,
      status: resolveStatus(score)
    };
  });

  return (
    <AppShell title="Hasil Assessment" subtitle="Berikut ringkasan kondisi peluang jodoh Anda saat ini.">
      <div className="space-y-4">
        {/* Kartu Utama: "Peluang Jodoh Saat Ini" */}
        <Card className="overflow-hidden border-navy-200 bg-navy-950 text-white">
          <CardContent className="p-6 sm:p-8">
            <p className="text-sm font-medium text-slate-300">Skor Peluang Jodoh Anda</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-semibold sm:text-5xl">{totalScore}</span>
              <span className="text-lg text-slate-400">/ 100</span>
              <Badge tone={statusToBadgeTone(totalStatus)} className="ml-auto">
                {STATUS_LABEL[totalStatus]}
              </Badge>
            </div>
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-white transition-all duration-700"
                  style={{ width: `${totalScore}%` }}
                />
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{recommendation.mainCardInsight}</p>
          </CardContent>
        </Card>

        {/* 5 Kartu Pilar */}
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

        {/* Diagnosis dan Prioritas */}
        <Card>
          <CardHeader>
            <CardDescription>Analisis</CardDescription>
            <CardTitle>{result.recommendation_summary}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Prioritas 30 Hari</p>
            <div className="space-y-2">
              {recommendation.priorityActions.map((action) => (
                <Link
                  key={action.dayNumber}
                  href={`/program/day/${action.dayNumber}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:border-navy-200 hover:bg-white"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">
                      {action.dayNumber}
                    </span>
                    {action.label}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-navy-900 px-4 text-sm font-medium text-white shadow-soft transition-colors hover:bg-navy-800"
          >
            Lihat Dashboard
          </Link>
          <Link
            href="/assessment/history"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
          >
            Lihat Riwayat Assessment
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
