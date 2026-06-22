"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireActiveProfile } from "@/lib/auth";

// Menandai satu hari program sebagai selesai atau belum, lalu memperbarui
// ringkasan progress di user_program_progress (current_day dan
// progress_percent) supaya Dashboard tidak perlu menghitung ulang dari nol
// setiap kali halaman dimuat.
export async function toggleDayCompletionAction(
  dayId: string,
  dayNumber: number,
  isCompleted: boolean
): Promise<{ success: boolean }> {
  const profile = await requireActiveProfile();
  const supabase = await createSupabaseServerClient();

  const { error: upsertError } = await supabase.from("program_day_completions").upsert(
    {
      user_id: profile.id,
      day_id: dayId,
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null
    },
    { onConflict: "user_id,day_id" }
  );

  if (upsertError) {
    return { success: false };
  }

  const { count: completedCount } = await supabase
    .from("program_day_completions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("is_completed", true);

  const totalCompleted = completedCount ?? 0;
  const progressPercent = Math.round((totalCompleted / 30) * 100);
  // current_day mengikuti hari tertinggi yang sedang dikerjakan, minimal
  // hari yang baru saja ditandai, supaya "Fokus Hari Ini" di Dashboard maju
  // mengikuti hari yang baru disentuh, bukan cuma menghitung total selesai.
  const nextCurrentDay = Math.min(30, Math.max(dayNumber, 1));

  // Ambil started_at yang sudah ada (jika ada), supaya tidak ke-overwrite
  // setiap kali user menandai hari baru selesai. started_at hanya boleh
  // terisi sekali, di hari pertama progress dimulai.
  const { data: existingProgress } = await supabase
    .from("user_program_progress")
    .select("started_at")
    .eq("user_id", profile.id)
    .maybeSingle();

  await supabase.from("user_program_progress").upsert(
    {
      user_id: profile.id,
      current_day: nextCurrentDay,
      progress_percent: progressPercent,
      status: totalCompleted >= 30 ? "completed" : totalCompleted > 0 ? "active" : "not_started",
      started_at: existingProgress?.started_at ?? (totalCompleted > 0 ? new Date().toISOString() : null),
      completed_at: totalCompleted >= 30 ? new Date().toISOString() : null
    },
    { onConflict: "user_id" }
  );

  revalidatePath(`/program/day/${dayNumber}`);
  revalidatePath("/dashboard");
  revalidatePath("/program");

  return { success: true };
}
