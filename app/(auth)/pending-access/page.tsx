import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PendingAccessPage({
  searchParams
}: {
  searchParams?: Promise<{ created?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff,white_35%)] px-4 py-10">
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardDescription>Akun Anda sudah dibuat</CardDescription>
            <CardTitle>Menunggu aktivasi admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-7 text-slate-600">
              Anda bisa login, tetapi fitur premium belum bisa dipakai sebelum admin mengaktifkan akses akun.
            </p>
            {resolvedSearchParams?.created ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Pendaftaran berhasil. Silakan tunggu aktivasi.
              </div>
            ) : null}
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="outline">Masuk</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">Kembali ke Beranda</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
