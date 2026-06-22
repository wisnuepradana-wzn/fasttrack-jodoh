import Link from "next/link";
import { registerAction } from "@/app/(auth)/actions";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function RegisterPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const errorMessage = (await searchParams)?.error;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff,white_35%)] px-4 py-10">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardDescription>Buat akun baru</CardDescription>
            <CardTitle>Daftar untuk akses premium</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <GoogleButton redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/pending-access`} />

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">atau</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form action={registerAction} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nama Lengkap</label>
                <Input name="full_name" placeholder="Nama Anda" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Username (opsional)</label>
                <Input name="username" placeholder="username" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
                <select
                  name="gender"
                  required
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-navy-500 focus:ring-4 focus:ring-navy-100"
                >
                  <option value="">Pilih gender</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <Input name="email" type="email" placeholder="nama@email.com" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <Input name="password" type="password" placeholder="••••••••" required />
              </div>
              <Button className="w-full" type="submit">Daftar</Button>
            </form>

            <p className="text-center text-sm text-slate-500">
              Sudah punya akun? <Link href="/login" className="font-medium text-navy-900">Masuk</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
