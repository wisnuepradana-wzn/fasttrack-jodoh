import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordAction } from "@/app/(auth)/actions";

const MESSAGES: Record<string, { text: string; type: "success" | "error" }> = {
  sent:    { text: "Link reset password sudah dikirim ke email Anda. Cek inbox atau folder spam.", type: "success" },
  failed:  { text: "Gagal mengirim email. Pastikan email terdaftar dan coba lagi.", type: "error" }
};

export default async function ForgotPasswordPage({
  searchParams
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const status = (await searchParams)?.status;
  const message = status ? MESSAGES[status] : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fbff,white_35%)] px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardDescription>Reset password</CardDescription>
            <CardTitle>Lupa password?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <div className={`rounded-2xl border px-4 py-3 text-sm ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}>
                {message.text}
              </div>
            )}
            {!message || message.type === "error" ? (
              <>
                <p className="text-sm text-slate-600">
                  Masukkan email yang Anda daftarkan. Kami akan kirimkan link untuk membuat password baru.
                </p>
                <form action={forgotPasswordAction} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                    <Input name="email" type="email" placeholder="email@contoh.com" required />
                  </div>
                  <Button type="submit" className="w-full">Kirim Link Reset</Button>
                </form>
              </>
            ) : (
              <p className="text-sm text-slate-600">Silakan buka email Anda dan klik link yang dikirimkan.</p>
            )}
            <Link href="/login" className="block text-center text-sm font-medium text-navy-900 hover:underline">
              Kembali ke login
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
