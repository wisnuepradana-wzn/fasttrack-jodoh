
import Link from "next/link";
import { requireAdminProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";

export default async function AdminPage() {
  await requireAdminProfile();
  const supabase = await createSupabaseServerClient();

  const [{ count: pendingCount }, { count: activeCount }, { count: suspendedCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("access_status", "pending"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("access_status", "active"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("access_status", "suspended")
  ]);

  return (
    <AppShell title="Admin Dashboard" subtitle="Aktivasi dan kontrol akses user.">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Pending</CardDescription>
            <CardTitle>{pendingCount ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active</CardDescription>
            <CardTitle>{activeCount ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Suspended</CardDescription>
            <CardTitle>{suspendedCount ?? 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-6">
        <Link href="/admin/users">
          <Button>Lihat User Management</Button>
        </Link>
      </div>
    </AppShell>
  );
}
