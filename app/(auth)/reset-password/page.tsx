import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordAction } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  too_short: "Password minimal 8 karakter.",
  mismatch: "Konfirmasi password tidak cocok.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; }>;
}) {
  const errorCode = (await searchParams)?.error;
  const errorMessage = errorCode ? (ERROR_MESSAGES[errorCode] ?? decodeURIComponent(errorCode)) : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fbff,white_35%)] px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardDescription>Buat password baru</CardDescription>
            <CardTitle>Reset Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}
            <p className="text-sm text-slate-600">
              Masukkan password baru Anda. Minimal 8 karakter.
            </p>
            <form action={resetPasswordAction} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Password Baru
                </label>
                <Input name="password" type="password" placeholder="Minimal 8 karakter" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Konfirmasi Password
                </label>
                <Input name="confirm" type="password" placeholder="Ulangi password baru" required />
              </div>
              <Button type="submit" className="w-full">Simpan Password Baru</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
