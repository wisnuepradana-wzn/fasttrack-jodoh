import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  runCandidateAssessmentEngine,
  resolveStatus, STATUS_LABEL,
  CANDIDATE_PILLAR_LABEL,
  type CandidatePillarKey
} from "@/lib/decision-engine";
import { ComparePDFExport } from "@/components/pdf/compare-pdf-export";
import { formatDate } from "@/lib/utils";
import { runCompareEngine } from "@/lib/decision-engine";
import { statusToBadgeTone } from "@/lib/status-badge";
import type { AnswerRecord } from "@/lib/decision-engine";

export default async function ComparePage({
  searchParams
}: {
  searchParams?: Promise<{ ids?: string }>;
}) {
  const profile = await requireActiveProfile();
  const resolvedParams = await searchParams;
  const rawIds = resolvedParams?.ids ?? "";
  const candidateIds = rawIds.split(",").filter(Boolean).slice(0, 3);

  if (candidateIds.length < 2) notFound();

  const supabase = await createSupabaseServerClient();

  // Ambil data semua kandidat yang diminta, validasi kepemilikan sekaligus
  const { data: candidates } = await supabase
    .from("candidates")
    .select("id, display_name, latest_score")
    .in("id", candidateIds)
    .eq("user_id", profile.id)
    .not("latest_score", "is", null);

  if (!candidates || candidates.length < 2) notFound();

  // Ambil session dan answers terbaru untuk tiap kandidat, untuk re-run engine
  const compareResults = await Promise.all(
    candidates.map(async (candidate) => {
      const { data: session } = await supabase
        .from("assessment_sessions")
        .select("id, template_id")
        .eq("candidate_id", candidate.id)
        .eq("user_id", profile.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!session) return null;

      const { data: answers } = await supabase
        .from("assessment_answers")
        .select("question_id, answer_value, assessment_questions(pillar)")
        .eq("session_id", session.id);

      if (!answers) return null;

      const engineInput: AnswerRecord[] = answers.map((a) => ({
        pillar: (a.assessment_questions as { pillar: string }).pillar as AnswerRecord["pillar"],
        answer_value: a.answer_value
      }));

      return runCandidateAssessmentEngine(candidate.id, engineInput);
    })
  );

  const validResults = compareResults.filter(Boolean) as NonNullable<typeof compareResults[0]>[];
  if (validResults.length < 2) notFound();

  const compareOutput = runCompareEngine(validResults);

  // Buat map dari candidateId ke nama
  const nameMap = Object.fromEntries(candidates.map((c) => [c.id, c.display_name]));

  const pillarKeys = Object.keys(CANDIDATE_PILLAR_LABEL) as CandidatePillarKey[];

  return (
    <AppShell
      title="Perbandingan Kandidat"
      subtitle="Data dan insight untuk membantu diskusi, bukan menentukan pilihan."
    >
      <div className="space-y-4">
        {/* Skor overall per kandidat */}
        <div className={`grid gap-3 ${validResults.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {validResults.map((result) => {
            const status = resolveStatus(result.overallScore);
            return (
              <Card key={result.candidateId} className="p-4 text-center">
                <p className="text-sm font-semibold text-slate-950">{nameMap[result.candidateId]}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{result.overallScore}</p>
                <Badge tone={statusToBadgeTone(status)} className="mt-2">{STATUS_LABEL[status]}</Badge>
              </Card>
            );
          })}
        </div>

        {/* Tabel perbandingan per area */}
        <Card>
          <CardHeader>
            <CardDescription>Perbandingan</CardDescription>
            <CardTitle>Skor per area</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-2 pr-4 text-left font-medium text-slate-500">Area</th>
                  {validResults.map((r) => (
                    <th key={r.candidateId} className="py-2 px-2 text-center font-medium text-slate-950">
                      {nameMap[r.candidateId]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pillarKeys.map((pillar) => {
                  const scores = validResults.map((r) => {
                    const area = r.areas.find((a) => a.pillar === pillar);
                    return area?.score ?? 0;
                  });
                  const maxScore = Math.max(...scores);
                  return (
                    <tr key={pillar} className="border-b border-slate-50">
                      <td className="py-3 pr-4 text-slate-700">{CANDIDATE_PILLAR_LABEL[pillar]}</td>
                      {scores.map((score, i) => {
                        const status = resolveStatus(score);
                        const isHighest = score === maxScore && scores.filter((s) => s === maxScore).length === 1;
                        return (
                          <td key={i} className="py-3 px-2 text-center">
                            <span className={`font-semibold ${isHighest ? "text-emerald-600" : "text-slate-950"}`}>
                              {score}
                            </span>
                            <Badge tone={statusToBadgeTone(status)} className="ml-2 text-xs">
                              {STATUS_LABEL[status]}
                            </Badge>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Perbedaan utama */}
        <Card>
          <CardHeader>
            <CardDescription>Insight</CardDescription>
            <CardTitle>Perbedaan utama</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-slate-700">
              {/* Ganti placeholder candidateId dengan nama asli */}
              {compareOutput.differenceSummary.replace(
                /kandidat dengan id ([a-f0-9-]+)/g,
                (_, id: string) => nameMap[id] ?? id
              )}
            </p>
          </CardContent>
        </Card>

        {/* Topik diskusi gabungan */}
        {compareOutput.combinedDiscussionTopics.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <CardDescription>Topik diskusi lanjutan</CardDescription>
              </div>
              <CardTitle>Untuk digali lebih dalam</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {compareOutput.combinedDiscussionTopics.map((topic, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  {topic}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-sm leading-6 text-slate-600">
            Data di atas adalah alat bantu refleksi pribadi, bukan penentu pilihan. Keputusan akhir sepenuhnya ada di tangan Anda, dan sebaiknya didiskusikan bersama keluarga atau orang terpercaya.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/candidates">
            <Button variant="outline">Kembali ke Daftar</Button>
          </Link>
          <ComparePDFExport
            candidates={validResults.map((r) => ({
              candidateId: r.candidateId,
              candidateName: nameMap[r.candidateId] ?? r.candidateId,
              overallScore: r.overallScore,
              areaScores: Object.fromEntries(r.areas.map((a) => [a.pillar, a.score]))
            }))}
            areaLabels={Object.fromEntries(
              Object.entries(CANDIDATE_PILLAR_LABEL).map(([k, v]) => [k, v])
            )}
            differenceSummary={compareOutput.differenceSummary.replace(
              /kandidat dengan id ([a-f0-9-]+)/g,
              (_, id: string) => nameMap[id] ?? id
            )}
            combinedDiscussionTopics={compareOutput.combinedDiscussionTopics}
            generatedAt={formatDate(new Date().toISOString())}
          />
        </div>
      </div>
    </AppShell>
  );
}
