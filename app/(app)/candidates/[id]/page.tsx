import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveStatus, STATUS_LABEL } from "@/lib/decision-engine";
import { statusToBadgeTone } from "@/lib/status-badge";
import { formatDate } from "@/lib/utils";

export default async function CandidateDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireActiveProfile();
  const { id: candidateId } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: candidate } = await supabase
    .from("candidates")
    .select("id, user_id, display_name, gender, notes, status, latest_score, last_evaluated_at, created_at")
    .eq("id", candidateId)
    .single();

  if (!candidate || candidate.user_id !== profile.id) notFound();

  const { data: sessions } = await supabase
    .from("assessment_sessions")
    .select("id, completed_at, assessment_results(total_score)")
    .eq("candidate_id", candidateId)
    .eq("user_id", profile.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false });

  const hasScore = candidate.latest_score !== null;
  const latestScore = hasScore ? Math.round(Number(candidate.latest_score)) : null;
  const latestStatus = latestScore !== null ? resolveStatus(latestScore) : null;

  return (
    <AppShell
      title={candidate.display_name}
      subtitle={`Ditambahkan ${formatDate(candidate.created_at)}`}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {/* Skor terakhir */}
          {hasScore && latestScore !== null && latestStatus ? (
            <Card className="overflow-hidden border-navy-200 bg-navy-950 text-white">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-300">Overall Compatibility Terakhir</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-4xl font-semibold">{latestScore}</span>
                  <span className="text-slate-400">/ 100</span>
                  <Badge tone={statusToBadgeTone(latestStatus)} className="ml-auto">
                    {STATUS_LABEL[latestStatus]}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Dievaluasi {formatDate(candidate.last_evaluated_at)}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-slate-500">Belum ada hasil evaluasi untuk kandidat ini.</p>
                <Link href={`/candidates/${candidateId}/assessment`} className="mt-4 inline-block">
                  <Button>Mulai Framework Screening</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Riwayat evaluasi */}
          {(sessions?.length ?? 0) > 0 && (
            <Card>
              <CardHeader>
                <CardDescription>Riwayat</CardDescription>
                <CardTitle>Semua hasil evaluasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sessions?.map((session) => {
                  const resultRow = Array.isArray(session.assessment_results)
                    ? session.assessment_results[0]
                    : session.assessment_results;
                  const score = resultRow ? Math.round(Number(resultRow.total_score)) : null;
                  const status = score !== null ? resolveStatus(score) : null;
                  return (
                    <Link
                      key={session.id}
                      href={`/candidates/${candidateId}/result/${session.id}`}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition-colors hover:border-navy-200"
                    >
                      <span className="text-slate-600">{formatDate(session.completed_at)}</span>
                      <div className="flex items-center gap-2">
                        {score !== null && <span className="font-semibold text-slate-950">{score}</span>}
                        {status && <Badge tone={statusToBadgeTone(status)}>{STATUS_LABEL[status]}</Badge>}
                      </div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardDescription>Info kandidat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <Badge tone={candidate.status === "active" ? "success" : "default"}>
                  {candidate.status === "active" ? "Aktif" : "Diarsipkan"}
                </Badge>
              </div>
              {candidate.gender && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Gender</span>
                  <span className="text-slate-900">{candidate.gender === "male" ? "Laki-laki" : "Perempuan"}</span>
                </div>
              )}
              {candidate.notes && (
                <div>
                  <p className="mb-1 text-slate-500">Catatan</p>
                  <p className="leading-6 text-slate-700">{candidate.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Link href={`/candidates/${candidateId}/assessment`}>
              <Button className="w-full">{hasScore ? "Screening Ulang" : "Mulai Framework Screening"}</Button>
            </Link>
            <Link href="/candidates">
              <Button variant="outline" className="w-full">Kembali ke Daftar</Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
