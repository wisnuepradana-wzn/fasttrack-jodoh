"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireActiveProfile } from "@/lib/auth";
import { runCandidateAssessmentEngine } from "@/lib/decision-engine";
import type { AnswerRecord } from "@/lib/decision-engine";

// Membuat kandidat baru, lalu redirect ke halaman pengisian 35 pertanyaan
// untuk kandidat tersebut. Dipanggil dari form di candidates/new/page.tsx.
export async function createCandidateAction(formData: FormData) {
  const profile = await requireActiveProfile();
  const supabase = await createSupabaseServerClient();

  const displayName = (formData.get("displayName") as string)?.trim();
  const gender = (formData.get("gender") as string) || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!displayName) {
    redirect("/candidates/new?error=name_required");
  }

  const { data: candidate, error: candidateError } = await supabase
    .from("candidates")
    .insert({
      user_id: profile.id,
      display_name: displayName,
      gender,
      notes
    })
    .select("id")
    .single();

  if (candidateError || !candidate) {
    redirect("/candidates/new?error=create_failed");
  }

  revalidatePath("/candidates");
  redirect(`/candidates/${candidate.id}/assessment`);
}

// Membuat session assessment baru untuk kandidat yang sudah ada, dipanggil
// saat user ingin mengevaluasi ulang kandidat yang sebelumnya sudah dinilai.
export async function startCandidateAssessmentAction(candidateId: string) {
  const profile = await requireActiveProfile();
  const supabase = await createSupabaseServerClient();

  const { data: candidate, error: candidateFetchError } = await supabase
    .from("candidates")
    .select("id, user_id")
    .eq("id", candidateId)
    .single();

  if (candidateFetchError || !candidate || candidate.user_id !== profile.id) {
    redirect("/candidates?error=candidate_not_found");
  }

  const { data: template, error: templateError } = await supabase
    .from("assessment_templates")
    .select("id")
    .eq("slug", "candidate-assessment-v1")
    .single();

  if (templateError || !template) {
    redirect("/candidates?error=template_not_found");
  }

  const { data: session, error: sessionError } = await supabase
    .from("assessment_sessions")
    .insert({
      user_id: profile.id,
      template_id: template.id,
      candidate_id: candidateId,
      status: "in_progress"
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    redirect(`/candidates/${candidateId}?error=session_failed`);
  }

  redirect(`/candidates/${candidateId}/assessment/${session.id}`);
}

export type SubmitCandidateAnswerInput = {
  questionId: string;
  pillar: string;
  value: number;
};

// Dipanggil sekali di akhir pengisian 35 pertanyaan (pola sama seperti
// Self Assessment: jawaban ditampung di state browser, submit sekaligus).
export async function submitCandidateAssessmentAction(
  sessionId: string,
  candidateId: string,
  answers: SubmitCandidateAnswerInput[]
): Promise<{ success: true } | { success: false; error: string }> {
  const profile = await requireActiveProfile();
  const supabase = await createSupabaseServerClient();

  const { data: session, error: sessionFetchError } = await supabase
    .from("assessment_sessions")
    .select("id, user_id, candidate_id, status")
    .eq("id", sessionId)
    .single();

  if (sessionFetchError || !session) {
    return { success: false, error: "Sesi evaluasi tidak ditemukan." };
  }
  if (session.user_id !== profile.id) {
    return { success: false, error: "Sesi ini bukan milik Anda." };
  }
  if (session.candidate_id !== candidateId) {
    return { success: false, error: "Sesi ini tidak sesuai dengan kandidat yang dipilih." };
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

  const result = runCandidateAssessmentEngine(candidateId, engineInput);

  const pillarScoresJson: Record<string, number> = {};
  for (const area of result.areas) {
    pillarScoresJson[area.pillar] = area.score;
  }

  const { error: resultError } = await supabase.from("assessment_results").insert({
    session_id: sessionId,
    total_score: result.overallScore,
    pillar_scores: pillarScoresJson,
    recommendation_data: {
      areas: result.areas
    }
  });

  if (resultError) {
    return { success: false, error: "Gagal menyimpan hasil. Silakan coba lagi." };
  }

  await supabase
    .from("assessment_sessions")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", sessionId);

  // Update ringkasan di tabel candidates supaya halaman list dan dashboard
  // tidak perlu menghitung ulang dari assessment_results setiap kali.
  await supabase
    .from("candidates")
    .update({
      latest_score: result.overallScore,
      last_evaluated_at: new Date().toISOString()
    })
    .eq("id", candidateId);

  revalidatePath("/candidates");
  revalidatePath(`/candidates/${candidateId}`);
  revalidatePath("/dashboard");
  return { success: true };
}
