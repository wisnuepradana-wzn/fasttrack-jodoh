// Entry point Decision Engine. Modul lain di aplikasi cukup import dari
// "@/lib/decision-engine" tanpa perlu tahu file internal mana yang dipakai.

export * from "./types";
export * from "./opportunity-index";
export * from "./self-assessment";
export * from "./candidate-assessment";
export * from "./compare";
export { SELF_PILLAR_LABEL } from "./rules";
export { CANDIDATE_PILLAR_LABEL } from "./rules-candidate";
