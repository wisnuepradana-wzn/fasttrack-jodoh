// Shared types untuk seluruh modul Decision Engine.
// Dipisah di sini supaya self-assessment.ts dan candidate-assessment.ts
// bisa saling memakai tipe yang sama tanpa duplikasi.

export type SelfPillarKey =
  | "personal"
  | "relational"
  | "opportunity"
  | "compatibility"
  | "readiness";

export type CandidatePillarKey =
  | "aqidah"
  | "karakter"
  | "komunikasi_kandidat"
  | "visi_pernikahan"
  | "finansial_kandidat"
  | "keluarga"
  | "lifestyle";

export type PillarKey = SelfPillarKey | CandidatePillarKey;

export type AnswerRecord = {
  pillar: PillarKey;
  answer_value: number;
  weight?: number | null;
};

export type StatusLevel = "kuat" | "cukup" | "perlu_perbaikan";

export type PillarScoreDetail = {
  pillar: PillarKey;
  score: number;
  status: StatusLevel;
};

// Status badge yang ditampilkan ke user. Label Indonesia, dipisah dari
// status internal "kuat | cukup | perlu_perbaikan" supaya gampang ganti
// copy tanpa mengubah logic.
export const STATUS_LABEL: Record<StatusLevel, string> = {
  kuat: "Sangat Siap",
  cukup: "Cukup Siap",
  perlu_perbaikan: "Perlu Perbaikan"
};

export const STATUS_COLOR: Record<StatusLevel, "emerald" | "amber" | "red"> = {
  kuat: "emerald",
  cukup: "amber",
  perlu_perbaikan: "red"
};

// Threshold yang sama dipakai di Self Assessment maupun Candidate Assessment,
// sesuai keputusan untuk menyamakan ambang batas badge di seluruh produk.
export function resolveStatus(score: number): StatusLevel {
  if (score >= 80) return "kuat";
  if (score >= 60) return "cukup";
  return "perlu_perbaikan";
}
