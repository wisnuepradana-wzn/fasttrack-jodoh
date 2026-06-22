"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireActiveProfile } from "@/lib/auth";
import { runSelfAssessmentEngine } from "@/lib/decision-engine";
import type { AnswerRecord } from "@/lib/decision-engine";

// Membuat session assessment baru lalu redirect ke halaman pengisian.
// Dipanggil dari tombol "Mulai Assessment" di app/(app)/assessment/page.tsx.
export async function startSelfAssessmentAction() {
  const profile = await requireActiveProfile();
  const supabase = await createSupabaseServerClient();

  const { data: template, error: templateError } = await supabase
    .from("assessment_templates")
    .select("id")
    .eq("slug", "self-assessment-v1")
    .single();

  if (templateError || !template) {
    redirect("/assessment?error=template_not_found");
  }

  const { data: session, error: sessionError } = await supabase
    .from("assessment_sessions")
    .insert({
      user_id: profile.id,
      template_id: template.id,
      status: "in_progress"
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    redirect("/assessment?error=session_failed");
  }

  redirect(`/assessment/${session.id}`);
}

export type SubmitAnswerInput = {
  questionId: string;
  pillar: string;
  value: number;
};

// Dipanggil sekali di akhir pengisian (sesuai keputusan: jawaban ditampung
// di state browser dulu, baru dikirim semua sekaligus saat submit).
// Menyimpan seluruh jawaban, menjalankan Decision Engine, menyimpan hasil,
// lalu mengembalikan resultId untuk dipakai redirect ke halaman hasil.
export async function submitSelfAssessmentAction(
  sessionId: string,
  answers: SubmitAnswerInput[]
): Promise<{ success: true } | { success: false; error: string }> {
  const profile = await requireActiveProfile();
  const supabase = await createSupabaseServerClient();

  const { data: session, error: sessionFetchError } = await supabase
    .from("assessment_sessions")
    .select("id, user_id, status")
    .eq("id", sessionId)
    .single();

  if (sessionFetchError || !session) {
    return { success: false, error: "Sesi assessment tidak ditemukan." };
  }
  if (session.user_id !== profile.id) {
    return { success: false, error: "Sesi ini bukan milik Anda." };
  }
  if (session.status === "completed") {
    return { success: false, error: "Sesi ini sudah selesai sebelumnya." };
  }

  const answerRows = answers.map((a) => ({
    session_id: sessionId,
    question_id: a.questionId,
    answer_value: a.value
  }));

  const { error: answersError } = await supabase.from("assessment_answers").insert(answerRows);
  if (answersError) {
    return { success: false, error: "Gagal menyimpan jawaban. Silakan coba lagi." };
  }

  const engineInput: AnswerRecord[] = answers.map((a) => ({
    pillar: a.pillar as AnswerRecord["pillar"],
    answer_value: a.value
  }));

  const result = runSelfAssessmentEngine(engineInput);

  const pillarScoresJson: Record<string, number> = {};
  for (const p of result.pillarScores) {
    pillarScoresJson[p.pillar] = p.score;
  }

  const { error: resultError } = await supabase.from("assessment_results").insert({
    session_id: sessionId,
    total_score: result.totalScore,
    pillar_scores: pillarScoresJson,
    recommendation_summary: result.diagnosisSentence,
    recommendation_data: {
      mainCardInsight: result.mainCardInsight,
      priorityActions: result.priorityActions
    }
  });

  if (resultError) {
    return { success: false, error: "Gagal menyimpan hasil. Silakan coba lagi." };
  }

  await supabase
    .from("assessment_sessions")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", sessionId);

  revalidatePath("/dashboard");
  revalidatePath("/assessment/history");
  return { success: true };
}
