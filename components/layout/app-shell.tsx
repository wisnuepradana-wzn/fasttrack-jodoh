
import { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Topbar } from "@/components/layout/topbar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function AppShell({
  children,
  title,
  subtitle
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const { data: profile } = user
    ? await supabase.from("profiles").select("role, access_status").eq("id", user.id).single()
    : { data: null };

  const isAdmin = profile?.role === "admin";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff,white_40%)] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <AppSidebar isAdmin={isAdmin} />
        <main className="flex min-h-screen flex-1 flex-col px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          <Topbar
            title={title}
            subtitle={subtitle}
            statusLabel={profile?.access_status === "active" ? "Akses Aktif" : profile?.access_status?.toUpperCase()}
          />
          <div className="flex-1">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
