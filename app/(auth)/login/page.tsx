import Link from "next/link";
import { loginAction } from "@/app/(auth)/actions";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; reset?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params?.error;
  const resetSuccess = params?.reset === "success";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff,white_35%)] px-4 py-10">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardDescription>Selamat datang kembali</CardDescription>
            <CardTitle>Masuk ke akun Anda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resetSuccess && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Password berhasil diperbarui. Silakan masuk dengan password baru Anda.
              </div>
            )}
            {errorMessage && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}

            <GoogleButton redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard`} />

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">atau</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form action={loginAction} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <Input name="email" type="email" placeholder="nama@email.com" required />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-navy-900 hover:underline">Lupa password?</Link>
              </div>
              <Input name="password" type="password" placeholder="••••••••" required />
              <Button className="w-full" type="submit">Masuk</Button>
            </form>

            <p className="text-center text-sm text-slate-500">
              Belum punya akun? <Link href="/register" className="font-medium text-navy-900">Daftar di sini</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
