"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/lib/auth";

export async function setUserAccessAction(formData: FormData) {
  const admin = await requireAdminProfile();
  const userId = String(formData.get("user_id") ?? "");
  const status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ access_status: status, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    redirect(`/admin/users?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("admin_actions").insert({
    admin_id: admin.id,
    target_user_id: userId,
    action_type: status === "active" ? "activate" : status === "suspended" ? "suspend" : "reactivate",
    notes: notes || null
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirect("/admin/users?updated=1");
}
