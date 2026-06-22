import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CandidateList } from "@/components/candidates/candidate-list";
import { Users, Scale, FileText, CheckCircle2 } from "lucide-react";

const HOW_IT_WORKS = [
  {
    icon: Users,
    title: "Tambah kandidat",
    desc: "Simpan nama dan catatan awal. Tidak ada yang bisa melihat ini selain kamu."
  },
  {
    icon: CheckCircle2,
    title: "Isi Framework Screening",
    desc: "35 pertanyaan di 7 area — aqidah, karakter, komunikasi, visi pernikahan, finansial, keluarga, dan gaya hidup. Hasilnya skor objektif plus insight per area."
  },
  {
    icon: Scale,
    title: "Bandingkan secara objektif",
    desc: "Kalau ada lebih dari satu kandidat, bandingkan berdampingan. Data yang bicara, bukan hanya perasaan."
  },
  {
    icon: FileText,
    title: "Export PDF untuk diskusi",
    desc: "Hasilnya bisa diekspor jadi PDF yang rapi untuk didiskusikan bersama keluarga atau orang terpercaya."
  }
];

export default async function CandidatesPage() {
  const profile = await requireActiveProfile();
  const supabase = await createSupabaseServerClient();

  const { data: candidates } = await supabase
    .from("candidates")
    .select("id, display_name, gender, status, latest_score, last_evaluated_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const hasCandidates = (candidates?.length ?? 0) > 0;

  return (
    <AppShell
      title="Candidate Tracker"
      subtitle="Evaluasi kandidat secara objektif, bandingkan, dan ekspor hasilnya."
    >
      {hasCandidates ? (
        <CandidateList candidates={candidates ?? []} />
      ) : (
        <div className="max-w-2xl space-y-4">
          {/* Empty state utama */}
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
              <p className="text-sm font-semibold text-slate-950">Belum ada kandidat</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Candidate Tracker membantu kamu menilai calon pasangan secara terstruktur, bukan
                sekadar mengandalkan feeling. Tambahkan kandidat pertama kamu untuk mulai.
              </p>
            </div>
            <CardContent className="p-6">
              <Link href="/candidates/new">
                <Button>Tambah Kandidat Pertama</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Cara kerja */}
          <p className="px-1 text-sm font-medium text-slate-500">Begini cara kerjanya</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {HOW_IT_WORKS.map(({ icon: Icon, title, desc }) => (
              <Card key={title}>
                <CardContent className="p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-navy-50">
                    <Icon className="h-4 w-4 text-navy-900" />
                  </div>
                  <p className="font-semibold text-slate-950">{title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Catatan privasi */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-sm leading-6 text-slate-600">
              <span className="font-semibold text-slate-950">Sepenuhnya privat.</span> Nama kandidat, catatan, dan hasil evaluasi hanya bisa dilihat oleh kamu. Tidak ada yang dibagikan ke siapapun, termasuk admin.
            </p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
