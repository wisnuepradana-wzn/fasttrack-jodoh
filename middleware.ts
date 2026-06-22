import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

type CookieToSet = {
  name: string;
  value: string;
  options?: any;
};

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers
    }
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/pending-access") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/assessment") ||
    pathname.startsWith("/program") ||
    pathname.startsWith("/candidates") ||
    pathname.startsWith("/toolkit") ||
    pathname.startsWith("/profile") ||
    isAdminRoute;

  if (!user) {
    if (isProtectedRoute && !isPublicRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, access_status")
    .eq("id", user.id)
    .maybeSingle();

  if (isAdminRoute && profile?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute && profile?.access_status !== "active" && !pathname.startsWith("/pending-access")) {
    return NextResponse.redirect(new URL("/pending-access", req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/auth/:path*",
    "/pending-access",
    "/dashboard",
    "/dashboard/:path*",
    "/assessment",
    "/assessment/:path*",
    "/program",
    "/program/:path*",
    "/candidates",
    "/candidates/:path*",
    "/toolkit",
    "/toolkit/:path*",
    "/profile",
    "/profile/:path*",
    "/admin",
    "/admin/:path*",
    "/api/:path*"
  ]
};
