import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireActiveProfile } from "@/lib/auth";
import { createCandidateAction } from "@/app/(app)/candidates/actions";

const ERROR_MESSAGES: Record<string, string> = {
  name_required: "Nama kandidat tidak boleh kosong.",
  create_failed: "Gagal menambahkan kandidat. Silakan coba lagi."
};

export default async function NewCandidatePage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireActiveProfile();
  const errorCode = (await searchParams)?.error;
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] : null;

  return (
    <AppShell title="Tambah Kandidat" subtitle="Buat kandidat baru untuk evaluasi.">
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardDescription>Kandidat baru</CardDescription>
            <CardTitle>Data dasar kandidat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}
            <form action={createCandidateAction} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nama Kandidat</label>
                <Input name="displayName" placeholder="Contoh: Sarah" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
                <select
                  name="gender"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-navy-500 focus:ring-4 focus:ring-navy-100"
                >
                  <option value="">Tidak diisi</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Catatan Awal (opsional)</label>
                <Textarea
                  name="notes"
                  placeholder="Catatan singkat tentang kandidat, jalur perkenalan, atau hal lain yang ingin diingat."
                  rows={3}
                />
              </div>
              <p className="text-sm leading-6 text-slate-500">
                Setelah kandidat dibuat, Anda akan diarahkan untuk mulai mengisi Framework Screening (7 area, 35 pertanyaan).
              </p>
              <Button type="submit" className="w-full">
                Tambah Kandidat dan Mulai Evaluasi
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
