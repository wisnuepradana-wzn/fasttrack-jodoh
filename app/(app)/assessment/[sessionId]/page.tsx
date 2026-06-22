import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { requireActiveProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AssessmentForm } from "@/components/assessment/assessment-form";

export default async function AssessmentSessionPage({
  params
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const profile = await requireActiveProfile();
  const { sessionId } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: session, error: sessionError } = await supabase
    .from("assessment_sessions")
    .select("id, user_id, status, template_id")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session || session.user_id !== profile.id) {
    notFound();
  }

  if (session.status === "completed") {
    redirect(`/assessment/${sessionId}/result`);
  }

  const { data: questions, error: questionsError } = await supabase
    .from("assessment_questions")
    .select("id, pillar, question_text, order_index")
    .eq("template_id", session.template_id)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (questionsError || !questions || questions.length === 0) {
    notFound();
  }

  const formattedQuestions = questions.map((q) => ({
    id: q.id,
    pillar: q.pillar,
    questionText: q.question_text,
    orderIndex: q.order_index
  }));

  return (
    <AppShell title="Assessment Diri" subtitle="Jawab dengan jujur sesuai kondisi Anda sekarang.">
      <AssessmentForm sessionId={sessionId} questions={formattedQuestions} />
    </AppShell>
  );
}
