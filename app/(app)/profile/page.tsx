import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { signOutAction } from "@/app/(auth)/actions";

export default async function ProfilePage() {
  const profile = await requireActiveProfile();
  const supabase = await createSupabaseServerClient();

  const { count: assessmentCount } = await supabase
    .from("assessment_sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("status", "completed");

  const { count: candidateCount } = await supabase
    .from("candidates")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id);

  return (
    <AppShell title="Profile" subtitle="Informasi akun dan ringkasan aktivitas Anda.">
      <div className="mx-auto max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardDescription>Informasi akun</CardDescription>
            <CardTitle>{profile.full_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Status Akses</span>
              <Badge tone="success">Aktif</Badge>
            </div>
            {profile.gender && (
              <div className="flex justify-between">
                <span className="text-slate-500">Gender</span>
                <span className="text-slate-900">{profile.gender === "male" ? "Laki-laki" : "Perempuan"}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Bergabung sejak</span>
              <span className="text-slate-900">{formatDate(profile.created_at)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Ringkasan aktivitas</CardDescription>
            <CardTitle>Progress Anda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-2xl font-semibold text-slate-950">{assessmentCount ?? 0}</p>
                <p className="mt-1 text-xs text-slate-500">Assessment selesai</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-2xl font-semibold text-slate-950">{candidateCount ?? 0}</p>
                <p className="mt-1 text-xs text-slate-500">Kandidat tersimpan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Link href="/assessment/history">
            <Button variant="outline">Riwayat Assessment</Button>
          </Link>
          <form action={signOutAction}>
            <Button variant="ghost" type="submit">Keluar</Button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
