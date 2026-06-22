// Recommendation Engine khusus Self Assessment.
// Menggabungkan hasil Opportunity Index dengan bank konten di rules.ts
// menjadi satu paket hasil siap pakai untuk Dashboard maupun halaman
// Hasil Assessment.

import { calculateOpportunityIndex } from "./opportunity-index";
import {
  SELF_DIAGNOSIS_SENTENCE,
  SELF_INSIGHT_SENTENCE,
  SELF_PILLAR_LABEL,
  SELF_PRIORITY_ACTIONS
} from "./rules";
import { AnswerRecord, SelfPillarKey, STATUS_LABEL, resolveStatus } from "./types";

export type SelfAssessmentResult = {
  totalScore: number;
  statusLabel: string;
  pillarScores: Array<{
    pillar: SelfPillarKey;
    label: string;
    score: number;
    statusLabel: string;
  }>;
  mainCardInsight: string;
  diagnosisSentence: string;
  priorityActions: Array<{ label: string; dayNumber: number }>;
};

export function runSelfAssessmentEngine(answers: AnswerRecord[]): SelfAssessmentResult {
  const { totalScore, pillarDetails, weakestPillar } = calculateOpportunityIndex(answers);

  const pillarScores = pillarDetails.map((detail) => {
    const pillar = detail.pillar as SelfPillarKey;
    return {
      pillar,
      label: SELF_PILLAR_LABEL[pillar],
      score: detail.score,
      statusLabel: STATUS_LABEL[detail.status]
    };
  });

  // Fallback ke "opportunity" jika untuk alasan tertentu weakestPillar
  // tidak terdeteksi (misal jawaban kosong), supaya engine tidak pernah
  // mengembalikan insight kosong ke UI.
  const focusPillar = (weakestPillar as SelfPillarKey) ?? "opportunity";

  return {
    totalScore,
    statusLabel: STATUS_LABEL[resolveStatus(totalScore)],
    pillarScores,
    mainCardInsight: SELF_INSIGHT_SENTENCE[focusPillar],
    diagnosisSentence: SELF_DIAGNOSIS_SENTENCE[focusPillar],
    priorityActions: SELF_PRIORITY_ACTIONS[focusPillar]
  };
}
