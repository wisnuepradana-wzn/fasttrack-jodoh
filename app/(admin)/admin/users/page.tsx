import { requireAdminProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setUserAccessAction } from "@/app/(admin)/actions";
import { formatDate } from "@/lib/utils";

const STATUS_CONFIG = {
  pending:   { label: "Pending",    tone: "warning" as const },
  active:    { label: "Aktif",      tone: "success" as const },
  suspended: { label: "Suspended",  tone: "danger"  as const },
};

const SUCCESS_MESSAGES: Record<string, string> = {
  "1": "Status user berhasil diperbarui."
};

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams?: Promise<{ updated?: string; error?: string; filter?: string }>;
}) {
  await requireAdminProfile();
  const supabase = await createSupabaseServerClient();
  const resolved = await searchParams;
  const successMsg = resolved?.updated ? SUCCESS_MESSAGES[resolved.updated] : null;
  const errorMsg = resolved?.error ? decodeURIComponent(resolved.error) : null;
  const filter = resolved?.filter ?? "all";

  let query = supabase
    .from("profiles")
    .select("id, full_name, email, username, gender, role, access_status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (filter !== "all") query = query.eq("access_status", filter);

  const { data: users } = await query;

  const filters = [
    { value: "all",       label: "Semua" },
    { value: "pending",   label: "Pending" },
    { value: "active",    label: "Aktif" },
    { value: "suspended", label: "Suspended" },
  ];

  return (
    <AppShell title="User Management" subtitle="Aktivasi dan kontrol akses user.">
      <div className="space-y-4">
        {successMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMsg}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <a
              key={f.value}
              href={f.value === "all" ? "/admin/users" : `/admin/users?filter=${f.value}`}
              className={`inline-flex h-9 items-center rounded-2xl px-4 text-sm font-medium transition-colors ${
                filter === f.value
                  ? "bg-navy-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </a>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Daftar user ({users?.length ?? 0})</CardDescription>
            <CardTitle>Kelola akses akun</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 font-medium text-slate-500">Nama</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Email</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Daftar</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(users ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                      Tidak ada user ditemukan.
                    </td>
                  </tr>
                ) : (
                  (users ?? []).map((user) => {
                    const statusCfg = STATUS_CONFIG[user.access_status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
                    return (
                      <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-5 py-4 font-medium text-slate-950">{user.full_name}</td>
                        <td className="px-5 py-4 text-slate-600">{user.email ?? user.username ?? "—"}</td>
                        <td className="px-5 py-4 text-slate-500">{formatDate(user.created_at)}</td>
                        <td className="px-5 py-4">
                          <Badge tone={statusCfg.tone}>{statusCfg.label}</Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            {user.access_status === "pending" && (
                              <form action={setUserAccessAction}>
                                <input type="hidden" name="user_id" value={user.id} />
                                <input type="hidden" name="status" value="active" />
                                <Button size="sm" type="submit">Aktifkan</Button>
                              </form>
                            )}
                            {user.access_status === "active" && (
                              <form action={setUserAccessAction}>
                                <input type="hidden" name="user_id" value={user.id} />
                                <input type="hidden" name="status" value="suspended" />
                                <Button size="sm" variant="outline" type="submit">Suspend</Button>
                              </form>
                            )}
                            {user.access_status === "suspended" && (
                              <form action={setUserAccessAction}>
                                <input type="hidden" name="user_id" value={user.id} />
                                <input type="hidden" name="status" value="active" />
                                <Button size="sm" type="submit">Aktifkan Kembali</Button>
                              </form>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
