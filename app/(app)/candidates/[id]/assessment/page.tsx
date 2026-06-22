import { redirect } from "next/navigation";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Halaman ini tidak dirender, langsung membuat session baru dan redirect
// ke form pengisian. Dipanggil saat user klik "Evaluasi Kandidat" dari
// halaman detail kandidat.
export default async function StartCandidateAssessmentPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireActiveProfile();
  const { id: candidateId } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: candidate } = await supabase
    .from("candidates")
    .select("id, user_id")
    .eq("id", candidateId)
    .single();

  if (!candidate || candidate.user_id !== profile.id) {
    redirect("/candidates");
  }

  const { data: template } = await supabase
    .from("assessment_templates")
    .select("id")
    .eq("slug", "candidate-assessment-v1")
    .single();

  if (!template) redirect("/candidates?error=template_not_found");

  const { data: session } = await supabase
    .from("assessment_sessions")
    .insert({
      user_id: profile.id,
      template_id: template.id,
      candidate_id: candidateId,
      status: "in_progress"
    })
    .select("id")
    .single();

  if (!session) redirect(`/candidates/${candidateId}?error=session_failed`);

  redirect(`/candidates/${candidateId}/assessment/${session.id}`);
}
