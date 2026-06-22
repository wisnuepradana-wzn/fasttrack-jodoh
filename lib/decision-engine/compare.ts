// Modul Compare untuk membandingkan 2 sampai 3 hasil Candidate Assessment
// sekaligus. PENTING: modul ini tidak pernah menentukan kandidat "lebih
// cocok" atau melakukan ranking eksplisit antar kandidat. Tugasnya hanya
// menyusun data berdampingan dan merangkai kalimat perbedaan yang netral,
// sesuai keputusan produk bahwa keputusan akhir tetap di tangan user.

import { CandidateAssessmentResult } from "./candidate-assessment";
import { CANDIDATE_PILLAR_LABEL } from "./rules-candidate";
import { CandidatePillarKey } from "./types";

export const MAX_COMPARE_CANDIDATES = 3;
export const MIN_COMPARE_CANDIDATES = 2;

export type CompareAreaRow = {
  pillar: CandidatePillarKey;
  label: string;
  scoresByCandidateId: Record<string, number>;
};

export type CompareResult = {
  candidateIds: string[];
  areaRows: CompareAreaRow[];
  differenceSummary: string;
  combinedDiscussionTopics: string[];
};

export function runCompareEngine(candidates: CandidateAssessmentResult[]): CompareResult {
  if (candidates.length < MIN_COMPARE_CANDIDATES) {
    throw new Error("Minimal 2 kandidat diperlukan untuk membandingkan.");
  }
  if (candidates.length > MAX_COMPARE_CANDIDATES) {
    throw new Error(`Maksimal ${MAX_COMPARE_CANDIDATES} kandidat untuk dibandingkan sekaligus.`);
  }

  const candidateIds = candidates.map((c) => c.candidateId);

  const allPillars = candidates[0].areas.map((a) => a.pillar);
  const areaRows: CompareAreaRow[] = allPillars.map((pillar) => {
    const scoresByCandidateId: Record<string, number> = {};
    for (const candidate of candidates) {
      const area = candidate.areas.find((a) => a.pillar === pillar);
      scoresByCandidateId[candidate.candidateId] = area?.score ?? 0;
    }
    return { pillar, label: CANDIDATE_PILLAR_LABEL[pillar], scoresByCandidateId };
  });

  const differenceSummary = buildDifferenceSummary(areaRows, candidates);
  const combinedDiscussionTopics = buildCombinedDiscussionTopics(candidates);

  return { candidateIds, areaRows, differenceSummary, combinedDiscussionTopics };
}

// Merangkai satu paragraf netral yang menyebut area dengan selisih skor
// paling besar antar kandidat. Tidak menyimpulkan siapa yang "lebih baik
// secara keseluruhan", hanya menyebut area mana yang menonjol di kandidat
// mana, dan menyerahkan interpretasinya pada user.
function buildDifferenceSummary(
  areaRows: CompareAreaRow[],
  candidates: CandidateAssessmentResult[]
): string {
  const candidateLabels = new Map<string, string>();
  // candidateId dipetakan ke label "Kandidat A/B/C" oleh caller jika perlu;
  // di sini kita pakai candidateId mentah, UI yang akan memetakan ke nama asli.

  type Highlight = { pillar: string; leaderId: string; gap: number };
  const highlights: Highlight[] = [];

  for (const row of areaRows) {
    const entries = Object.entries(row.scoresByCandidateId);
    const sorted = [...entries].sort((a, b) => b[1] - a[1]);
    const gap = sorted[0][1] - sorted[sorted.length - 1][1];
    if (gap >= 10) {
      highlights.push({ pillar: row.label, leaderId: sorted[0][0], gap });
    }
  }

  if (highlights.length === 0) {
    return "Kedua kandidat terlihat cukup seimbang di hampir semua area, tidak ada perbedaan yang terlalu menonjol berdasarkan hasil evaluasi ini.";
  }

  highlights.sort((a, b) => b.gap - a.gap);
  const top = highlights.slice(0, 2);

  const parts = top.map((h) => {
    const candidate = candidates.find((c) => c.candidateId === h.leaderId);
    const displayId = candidate ? candidate.candidateId : h.leaderId;
    return `unggul pada ${h.pillar.toLowerCase()} (kandidat dengan id ${displayId})`;
  });

  return `Perbedaan yang cukup terlihat ada pada beberapa area: ${parts.join(
    ", dan "
  )}. Kedua kandidat tetap memiliki kekuatan dan area yang masih perlu didiskusikan lebih lanjut.`;
}

// Menggabungkan topik diskusi dari semua kandidat yang dibandingkan,
// tanpa duplikat, khusus untuk area yang berstatus cukup atau
// perlu_perbaikan pada salah satu atau lebih kandidat.
function buildCombinedDiscussionTopics(candidates: CandidateAssessmentResult[]): string[] {
  const topics = new Set<string>();
  for (const candidate of candidates) {
    for (const area of candidate.areas) {
      if (area.discussionTopics) {
        for (const topic of area.discussionTopics) {
          topics.add(topic);
        }
      }
    }
  }
  return Array.from(topics);
}
