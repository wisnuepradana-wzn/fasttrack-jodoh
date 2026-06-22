import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SELF_PILLAR_LABEL } from "@/lib/decision-engine";
import { startSelfAssessmentAction } from "./actions";

export default async function AssessmentPage() {
  const profile = await requireActiveProfile();
  const supabase = await createSupabaseServerClient();

  // Dua tahap: ambil template_id dulu, baru count pertanyaan.
  // Menghindari join syntax !inner yang bergantung pada nama relasi di
  // Supabase schema (rawan error kalau nama foreign key tidak match).
  const { data: template } = await supabase
    .from("assessment_templates")
    .select("id")
    .eq("slug", "self-assessment-v1")
    .single();

  const { count: questionCount } = template
    ? await supabase
        .from("assessment_questions")
        .select("id", { count: "exact", head: true })
        .eq("template_id", template.id)
        .eq("is_active", true)
    : { count: 30 };

  const { data: previousSessions } = await supabase
    .from("assessment_sessions")
    .select("id")
    .eq("user_id", profile.id)
    .eq("status", "completed")
    .limit(1);

  const hasPreviousAssessment = (previousSessions?.length ?? 0) > 0;
  const pillarEntries = Object.entries(SELF_PILLAR_LABEL);

  return (
    <AppShell
      title="Assessment Diri"
      subtitle={`${questionCount ?? 30} pertanyaan untuk memetakan peluang dan hambatan utama Anda.`}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardDescription>{hasPreviousAssessment ? "Ulangi assessment" : "Mulai assessment"}</CardDescription>
            <CardTitle>Kenali kondisi peluang jodoh Anda saat ini</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-7 text-slate-600">
              Assessment ini terdiri dari {questionCount ?? 30} pertanyaan sederhana dengan skala 1
              sampai 5, dibagi ke dalam 5 area yang saling melengkapi. Tidak ada jawaban benar atau
              salah, jawab saja sejujur mungkin berdasarkan kondisi Anda sekarang. Seluruh proses
              biasanya memakan waktu sekitar 10 sampai 15 menit.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {pillarEntries.map(([key, label]) => (
                <div
                  key={key}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  {label}
                </div>
              ))}
            </div>
            {hasPreviousAssessment && (
              <p className="text-sm leading-6 text-slate-500">
                Anda sudah pernah menyelesaikan assessment ini sebelumnya. Mengulang assessment
                membuat sesi baru, hasil sebelumnya tetap tersimpan di riwayat dan tidak akan hilang.
              </p>
            )}
            <form action={startSelfAssessmentAction} className="pt-2">
              <Button type="submit">
                {hasPreviousAssessment ? "Ulangi Assessment" : "Mulai Assessment"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Output</CardDescription>
            <CardTitle>Skor + rekomendasi personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
            <p>Hasil akan menampilkan Skor Peluang Jodoh, breakdown 5 area, dan area yang paling perlu Anda perhatikan.</p>
            <p>Anda juga akan mendapat 3 langkah konkret yang langsung terhubung ke hari tertentu di Program 30 Hari.</p>
            <p>Semua riwayat tersimpan, sehingga Anda bisa membandingkan perkembangan setiap kali mengulang.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
