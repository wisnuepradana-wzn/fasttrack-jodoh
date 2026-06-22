import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveStatus, STATUS_LABEL } from "@/lib/decision-engine";
import { statusToBadgeTone } from "@/lib/status-badge";
import { formatDate } from "@/lib/utils";

export default async function AssessmentHistoryPage() {
  const profile = await requireActiveProfile();
  const supabase = await createSupabaseServerClient();

  const { data: sessions } = await supabase
    .from("assessment_sessions")
    .select("id, completed_at, created_at, assessment_results(total_score)")
    .eq("user_id", profile.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false });

  const rows = (sessions ?? []).map((s) => {
    const resultRow = Array.isArray(s.assessment_results) ? s.assessment_results[0] : s.assessment_results;
    const score = resultRow ? Math.round(Number(resultRow.total_score)) : null;
    return {
      id: s.id,
      completedAt: s.completed_at,
      score,
      status: score !== null ? resolveStatus(score) : null
    };
  });

  return (
    <AppShell title="Riwayat Assessment" subtitle="Semua hasil assessment yang pernah Anda selesaikan.">
      {rows.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">
            Anda belum pernah menyelesaikan Assessment Diri. Mulai assessment pertama Anda untuk
            melihat Skor Peluang Jodoh.
          </p>
          <Link href="/assessment" className="mt-4 inline-block">
            <Button>Mulai Assessment</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <Link
              key={row.id}
              href={`/assessment/${row.id}/result`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-soft transition-colors hover:border-navy-200"
            >
              <div>
                <p className="text-sm font-medium text-slate-950">{formatDate(row.completedAt)}</p>
                <p className="mt-1 text-xs text-slate-500">Assessment Diri</p>
              </div>
              <div className="flex items-center gap-3">
                {row.score !== null && (
                  <>
                    <span className="text-lg font-semibold text-slate-950">{row.score}</span>
                    {row.status && (
                      <Badge tone={statusToBadgeTone(row.status)}>{STATUS_LABEL[row.status]}</Badge>
                    )}
                  </>
                )}
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
