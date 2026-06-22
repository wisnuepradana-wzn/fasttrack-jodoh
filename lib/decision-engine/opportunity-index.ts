// Modul perhitungan skor inti, dipakai bersama oleh Self Assessment
// dan Candidate Assessment karena rumusnya identik: rata rata tertimbang
// per pillar, lalu rata rata tertimbang keseluruhan untuk skor total.
//
// Catatan penamaan: secara internal kita sebut "Opportunity Index",
// namun di seluruh tampilan UI tetap memakai istilah "Skor Peluang Jodoh"
// (untuk Self Assessment) atau "Overall Compatibility" (untuk Candidate
// Assessment). Pemisahan ini sengaja, supaya istilah teknis di kode lebih
// jelas tanpa mengubah copy yang sudah disepakati untuk user.

import { AnswerRecord, PillarKey, PillarScoreDetail, resolveStatus } from "./types";

export type OpportunityIndexResult = {
  totalScore: number;
  pillarScores: Record<string, number>;
  pillarDetails: PillarScoreDetail[];
  weakestPillar: PillarKey | null;
  strongestPillar: PillarKey | null;
};

export function calculateOpportunityIndex(answers: AnswerRecord[]): OpportunityIndexResult {
  const buckets: Record<string, { sum: number; max: number }> = {};

  for (const answer of answers) {
    const weight = answer.weight ?? 1;
    const weighted = answer.answer_value * weight;
    const max = 5 * weight;

    if (!buckets[answer.pillar]) buckets[answer.pillar] = { sum: 0, max: 0 };
    buckets[answer.pillar].sum += weighted;
    buckets[answer.pillar].max += max;
  }

  const pillarScores: Record<string, number> = {};
  const pillarDetails: PillarScoreDetail[] = [];
  let totalWeighted = 0;
  let totalMax = 0;

  for (const [pillar, bucket] of Object.entries(buckets)) {
    const score = bucket.max ? Math.round((bucket.sum / bucket.max) * 100) : 0;
    pillarScores[pillar] = score;
    pillarDetails.push({
      pillar: pillar as PillarKey,
      score,
      status: resolveStatus(score)
    });
    totalWeighted += bucket.sum;
    totalMax += bucket.max;
  }

  const totalScore = totalMax ? Math.round((totalWeighted / totalMax) * 100) : 0;

  const sortedByScore = [...pillarDetails].sort((a, b) => a.score - b.score);
  const weakestPillar = sortedByScore[0]?.pillar ?? null;
  const strongestPillar = sortedByScore[sortedByScore.length - 1]?.pillar ?? null;

  return {
    totalScore,
    pillarScores,
    pillarDetails,
    weakestPillar,
    strongestPillar
  };
}
