import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";

const FEATURES = [
  "Assessment Diri 30 pertanyaan (5 pilar kesiapan)",
  "Skor Peluang Jodoh dengan insight personal",
  "Program 30 Hari dengan panduan & checklist harian",
  "Candidate Tracker dengan 7 area evaluasi",
  "Perbandingan hingga 3 kandidat sekaligus",
  "Topik diskusi lanjutan per kandidat",
  "Export PDF laporan untuk diskusi keluarga",
  "Template Biodata Taaruf Profesional",
  "Framework Screening Calon Pasangan",
  "Checklist Red Flag Pernikahan",
  "Dashboard premium dengan progress tracker",
  "Semua riwayat assessment tersimpan",
  "Lifetime access, tidak ada biaya langganan",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff,white_35%)]">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Harga</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Satu kali bayar, akses selamanya
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Tidak ada biaya langganan bulanan. Bayar sekali, pakai selamanya.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border-2 border-navy-900 bg-white shadow-lift">
          <div className="bg-navy-950 px-8 py-8 text-white">
            <p className="text-sm font-medium text-slate-300">Fast Track 30 Hari</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-semibold">Rp94.000</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">Lifetime access setelah aktivasi admin</p>
          </div>

          <div className="px-8 py-8">
            <p className="mb-5 text-sm font-medium text-slate-700">Semua yang Anda dapatkan:</p>
            <ul className="space-y-3">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-3">
              <Link href="/register" className="block">
                <Button className="w-full" size="lg">Daftar Sekarang</Button>
              </Link>
              <p className="text-center text-xs leading-6 text-slate-500">
                Daftar akun gratis. Akses fitur premium terbuka setelah admin mengaktifkan akun Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm leading-7 text-slate-600">
          <p className="font-medium text-slate-950">Catatan penting</p>
          <p className="mt-2">
            Produk ini bukan aplikasi cari jodoh atau dating app. Ini adalah guided action system
            yang membantu Anda mempersiapkan diri, memperluas peluang pertemuan, dan mengevaluasi
            calon pasangan secara terstruktur. Keputusan tetap sepenuhnya di tangan Anda.
          </p>
        </div>
      </main>
    </div>
  );
}
