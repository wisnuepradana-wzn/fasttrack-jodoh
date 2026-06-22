import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CandidateAssessmentForm } from "@/components/candidates/candidate-assessment-form";
import { CANDIDATE_PILLAR_LABEL } from "@/lib/decision-engine";

export default async function CandidateAssessmentSessionPage({
  params
}: {
  params: Promise<{ id: string; sessionId: string }>;
}) {
  const profile = await requireActiveProfile();
  const { id: candidateId, sessionId } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: candidate } = await supabase
    .from("candidates")
    .select("id, user_id, display_name")
    .eq("id", candidateId)
    .single();

  if (!candidate || candidate.user_id !== profile.id) notFound();

  const { data: session } = await supabase
    .from("assessment_sessions")
    .select("id, user_id, candidate_id, status, template_id")
    .eq("id", sessionId)
    .single();

  if (!session || session.user_id !== profile.id || session.candidate_id !== candidateId) notFound();
  if (session.status === "completed") redirect(`/candidates/${candidateId}/result/${sessionId}`);

  const { data: questions } = await supabase
    .from("assessment_questions")
    .select("id, pillar, question_text, order_index")
    .eq("template_id", session.template_id)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (!questions || questions.length === 0) notFound();

  // Kelompokkan pertanyaan per area/pillar untuk tampilan collapsible
  const groupedQuestions: Record<string, { id: string; pillar: string; questionText: string; orderIndex: number }[]> = {};
  for (const q of questions) {
    if (!groupedQuestions[q.pillar]) groupedQuestions[q.pillar] = [];
    groupedQuestions[q.pillar].push({
      id: q.id,
      pillar: q.pillar,
      questionText: q.question_text,
      orderIndex: q.order_index
    });
  }

  const areaOrder = Object.keys(CANDIDATE_PILLAR_LABEL);
  const orderedGroups = areaOrder
    .filter((key) => groupedQuestions[key])
    .map((key) => ({
      pillar: key,
      label: CANDIDATE_PILLAR_LABEL[key as keyof typeof CANDIDATE_PILLAR_LABEL],
      questions: groupedQuestions[key]
    }));

  return (
    <AppShell
      title={`Framework Screening — ${candidate.display_name}`}
      subtitle="Framework Screening — isi berdasarkan pengamatan dan interaksi Anda dengan kandidat."
    >
      <CandidateAssessmentForm
        sessionId={sessionId}
        candidateId={candidateId}
        candidateName={candidate.display_name}
        areas={orderedGroups}
      />
    </AppShell>
  );
}
