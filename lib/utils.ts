import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Sebelumnya cn() hanya join(" ") sederhana, padahal clsx dan tailwind-merge
// sudah ada di dependencies. Tanpa twMerge, class yang konflik (misal
// "p-5 pt-0" dari komponen dasar digabung dengan "p-6" dari pemanggil)
// hasilnya tidak terprediksi karena urutan kemenangan CSS tidak mengikuti
// urutan atribut class di HTML. twMerge memastikan class yang ditulis lebih
// belakang (override dari pemanggil) yang menang untuk utility yang sama.
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

export function formatDate(input?: string | Date | null) {
  if (!input) return "-";
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}
