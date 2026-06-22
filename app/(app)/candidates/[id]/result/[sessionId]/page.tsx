import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Scale, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveStatus, STATUS_LABEL } from "@/lib/decision-engine";
import { statusToBadgeTone } from "@/lib/status-badge";
import { CandidatePDFExport } from "@/components/pdf/candidate-pdf-export";
import { formatDate } from "@/lib/utils";

type AreaResult = {
  pillar: string;
  label: string;
  score: number;
  status: string;
  statusLabel: string;
  insight: string;
  discussionTopics: string[] | null;
};

type RecommendationData = {
  areas: AreaResult[];
};

export default async function CandidateResultPage({
  params
}: {
  params: Promise<{ id: string; sessionId: string }>;
}) {
  const profile = await requireActiveProfile();
  const { id: candidateId, sessionId } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: candidate } = await supabase
    .from("candidates")
    .select("id, user_id, display_name, notes")
    .eq("id", candidateId)
    .single();

  if (!candidate || candidate.user_id !== profile.id) notFound();

  const { data: session } = await supabase
    .from("assessment_sessions")
    .select("id, user_id, candidate_id")
    .eq("id", sessionId)
    .single();

  if (!session || session.user_id !== profile.id || session.candidate_id !== candidateId) notFound();

  const { data: result } = await supabase
    .from("assessment_results")
    .select("total_score, pillar_scores, recommendation_data")
    .eq("session_id", sessionId)
    .single();

  if (!result) notFound();

  const totalScore = Math.round(Number(result.total_score));
  const totalStatus = resolveStatus(totalScore);
  const recommendation = result.recommendation_data as unknown as RecommendationData;
  const areas = recommendation?.areas ?? [];

  const strengths = areas.filter((a) => a.status === "kuat");
  const needsWork = areas.filter((a) => a.status === "cukup" || a.status === "perlu_perbaikan");
  const allDiscussionTopics = areas
    .filter((a) => a.discussionTopics && a.discussionTopics.length > 0)
    .flatMap((a) => a.discussionTopics as string[]);

  // Cek jumlah kandidat lain yang sudah dievaluasi (untuk tombol compare)
  const { count: evaluatedCount } = await supabase
    .from("candidates")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .not("latest_score", "is", null)
    .neq("id", candidateId);

  const canCompare = (evaluatedCount ?? 0) >= 1;

  return (
    <AppShell
      title={`Hasil Screening — ${candidate.display_name}`}
      subtitle="Hasil Framework Screening — ringkasan kecocokan berdasarkan 7 area penilaian."
    >
      <div className="space-y-4">
        {/* Kartu skor utama */}
        <Card className="overflow-hidden border-navy-200 bg-navy-950 text-white">
          <CardContent className="p-6 sm:p-8">
            <p className="text-sm font-medium text-slate-300">Overall Compatibility</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-semibold sm:text-5xl">{totalScore}</span>
              <span className="text-lg text-slate-400">/ 100</span>
              <Badge tone={statusToBadgeTone(totalStatus)} className="ml-auto">
                {STATUS_LABEL[totalStatus]}
              </Badge>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-white transition-all duration-700" style={{ width: `${totalScore}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* Grid 7 area */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area) => {
            const status = resolveStatus(area.score);
            return (
              <Card key={area.pillar} className="p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{area.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{area.score}</p>
                <Badge tone={statusToBadgeTone(status)} className="mt-2">{STATUS_LABEL[status]}</Badge>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Kekuatan */}
          {strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardDescription>Kekuatan</CardDescription>
                <CardTitle>Area yang sudah kuat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {strengths.map((area) => (
                  <div key={area.pillar} className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">{area.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{area.insight}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Area perlu didalami */}
          {needsWork.length > 0 && (
            <Card>
              <CardHeader>
                <CardDescription>Area yang perlu didalami</CardDescription>
                <CardTitle>Perlu diskusi lebih lanjut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {needsWork.map((area) => {
                  const status = resolveStatus(area.score);
                  return (
                    <div key={area.pillar} className={`rounded-2xl border px-4 py-3 ${
                      status === "cukup"
                        ? "border-amber-100 bg-amber-50"
                        : "border-rose-100 bg-rose-50"
                    }`}>
                      <p className={`text-xs font-medium uppercase tracking-wide ${
                        status === "cukup" ? "text-amber-700" : "text-rose-700"
                      }`}>{area.label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{area.insight}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Topik diskusi lanjutan */}
        {allDiscussionTopics.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <CardDescription>Topik diskusi lanjutan</CardDescription>
              </div>
              <CardTitle>Pertanyaan untuk digali lebih dalam</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allDiscussionTopics.map((topic, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    {topic}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aksi */}
        <div className="flex flex-wrap gap-3">
          <Link href={`/candidates/${candidateId}/assessment`}>
            <Button variant="outline">Screening Ulang</Button>
          </Link>
          {canCompare && (
            <Link href={`/candidates?compare=${candidateId}`}>
              <Button variant="outline">
                <Scale className="h-4 w-4" />
                Bandingkan
              </Button>
            </Link>
          )}
          <CandidatePDFExport
            candidateName={candidate.display_name}
            overallScore={totalScore}
            evaluatedAt={formatDate(new Date().toISOString())}
            areas={areas}
          />
        </div>
      </div>
    </AppShell>
  );
}
