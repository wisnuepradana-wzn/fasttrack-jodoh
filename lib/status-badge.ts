import type { StatusLevel } from "@/lib/decision-engine";

// Memetakan status internal Decision Engine ("kuat" | "cukup" | "perlu_perbaikan")
// ke tone yang dikenali komponen Badge UI ("success" | "warning" | "danger").
// Dipisah di sini supaya tidak ada string tone yang diketik manual berulang
// kali di berbagai halaman, yang rawan typo dan salah warna.
export function statusToBadgeTone(status: StatusLevel): "success" | "warning" | "danger" {
  if (status === "kuat") return "success";
  if (status === "cukup") return "warning";
  return "danger";
}
