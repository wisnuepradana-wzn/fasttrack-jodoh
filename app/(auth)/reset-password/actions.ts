"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function resetPasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "").trim();
  const confirm = String(formData.get("confirm") ?? "").trim();

  if (!password || password.length < 8) {
    redirect("/reset-password?error=too_short");
  }
  if (password !== confirm) {
    redirect("/reset-password?error=mismatch");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?reset=success");
}
