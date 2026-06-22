// Recommendation Engine khusus Candidate Assessment.
// Menggabungkan hasil Opportunity Index (dipakai ulang dari modul yang
// sama dengan Self Assessment, karena rumus skornya identik) dengan bank
// insight per area dari rules-candidate.ts.

import { calculateOpportunityIndex } from "./opportunity-index";
import {
  CANDIDATE_DISCUSSION_TOPICS,
  CANDIDATE_INSIGHT_BANK,
  CANDIDATE_PILLAR_LABEL,
  pickVariant
} from "./rules-candidate";
import { AnswerRecord, CandidatePillarKey, STATUS_LABEL, StatusLevel } from "./types";

export type CandidateAreaResult = {
  pillar: CandidatePillarKey;
  label: string;
  score: number;
  status: StatusLevel;
  statusLabel: string;
  insight: string;
  // Topik diskusi hanya disertakan untuk area yang berstatus cukup atau
  // perlu_perbaikan, sesuai keputusan agar user fokus ke area yang
  // memang masih perlu digali, bukan ditampilkan untuk semua area.
  discussionTopics: string[] | null;
};

export type CandidateAssessmentResult = {
  candidateId: string;
  overallScore: number;
  overallStatusLabel: string;
  areas: CandidateAreaResult[];
};

export function runCandidateAssessmentEngine(
  candidateId: string,
  answers: AnswerRecord[]
): CandidateAssessmentResult {
  const { totalScore, pillarDetails } = calculateOpportunityIndex(answers);

  const areas: CandidateAreaResult[] = pillarDetails.map((detail) => {
    const pillar = detail.pillar as CandidatePillarKey;
    // Seed memakai kombinasi candidateId + pillar, supaya variasi kalimat
    // konsisten untuk kandidat dan area yang sama, namun berbeda antar
    // kandidat agar tidak terasa template saat membandingkan beberapa orang.
    const seed = `${candidateId}-${pillar}`;
    const insightOptions = CANDIDATE_INSIGHT_BANK[pillar][detail.status];
    const insight = pickVariant(insightOptions, seed);

    const discussionTopics =
      detail.status === "cukup" || detail.status === "perlu_perbaikan"
        ? CANDIDATE_DISCUSSION_TOPICS[pillar]
        : null;

    return {
      pillar,
      label: CANDIDATE_PILLAR_LABEL[pillar],
      score: detail.score,
      status: detail.status,
      statusLabel: STATUS_LABEL[detail.status],
      insight,
      discussionTopics
    };
  });

  return {
    candidateId,
    overallScore: totalScore,
    overallStatusLabel: STATUS_LABEL[
      totalScore >= 80 ? "kuat" : totalScore >= 60 ? "cukup" : "perlu_perbaikan"
    ],
    areas
  };
}
