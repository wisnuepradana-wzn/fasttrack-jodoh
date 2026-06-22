import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = {
  name: string;
  value: string;
  options?: any;
};

// Route ini dipanggil oleh Supabase setelah:
// 1. Login/register dengan Google OAuth
// 2. Klik link reset password dari email
//
// Supabase mengirim ?code=... yang harus ditukar dengan session,
// lalu redirect ke halaman tujuan (?next=...) atau default.

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    // Tidak ada code — redirect ke login dengan pesan error
    return NextResponse.redirect(`${origin}/login?error=auth_callback_missing_code`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Akan di-handle oleh middleware
          }
        }
      }
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  // Redirect ke tujuan yang diminta (dashboard, reset-password, dll)
  // Pastikan `next` hanya bisa mengarah ke path internal, bukan URL eksternal
  const redirectPath = next.startsWith("/") ? next : "/dashboard";
  return NextResponse.redirect(`${origin}${redirectPath}`);
}
