import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, ClipboardList, CalendarCheck, Users } from "lucide-react";

const WHAT_YOU_GET = [
  "Assessment Diri 30 pertanyaan dengan skor dan diagnosis personal",
  "Program 30 Hari dengan panduan harian yang terasa seperti konsultan pribadi",
  "Framework Screening Kandidat — 7 area evaluasi, bukan sekadar feeling",
  "Bandingkan hingga 3 kandidat secara objektif dan berdampingan",
  "Export PDF laporan untuk didiskusikan bersama keluarga",
  "Template Biodata Taaruf Profesional siap pakai",
  "Checklist Red Flag dengan insight otomatis",
  "Dashboard dengan skor, progress, dan fokus harian",
  "Akses seumur hidup — bayar sekali, pakai selamanya",
];

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Bukan kuis random",
    desc: "30 pertanyaan terstruktur yang mengukur 5 area kesiapan nyata: pribadi, relasional, peluang, kecocokan, dan kesiapan proses. Hasilnya bukan angka kosong, tapi diagnosis konkret yang menunjuk ke mana kamu harus fokus."
  },
  {
    icon: Users,
    title: "Bukan sekadar daftar nama",
    desc: "Framework Screening 7 area membantu kamu menilai kandidat secara objektif, bukan hanya berdasarkan perasaan sesaat. Bandingkan hingga 3 kandidat berdampingan dan ekspor hasilnya jadi PDF untuk didiskusikan dengan keluarga."
  },
  {
    icon: CalendarCheck,
    title: "Bukan panduan yang dibaca lalu dilupakan",
    desc: "30 hari program dengan panduan harian yang personal dan checklist konkret. Setiap hari ada arahan jelas tentang apa yang harus dilakukan, bukan teori yang menggantung."
  },
];

const PILLAR_PREVIEW = [
  { label: "Kesiapan Pribadi", score: 78, status: "Cukup Siap" },
  { label: "Peluang Pertemuan", score: 58, status: "Perlu Perbaikan" },
  { label: "Daya Tarik Relasional", score: 74, status: "Cukup Siap" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff,white_38%)]">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">

        {/* Hero */}
        <section className="mb-16">
          <Badge tone="success" className="mb-5">Web App Premium · Lifetime Access · Rp94.000</Badge>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Sudah serius ingin menikah,<br className="hidden sm:block" /> tapi tidak tahu<br className="hidden sm:block" /> harus mulai dari mana?
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Fast Track Jodoh bukan ebook dan bukan kursus video. Ini web app yang membantu kamu memetakan kesiapan diri, mengevaluasi kandidat secara objektif, dan menjalani 30 hari program yang benar-benar terarah.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register">
              <Button size="lg">Mulai Sekarang <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Sudah punya akun</Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Daftar gratis · Akses fitur terbuka setelah konfirmasi · Tidak ada biaya langganan
          </p>
        </section>

        {/* Dashboard preview */}
        <section className="mb-16">
          <p className="mb-4 text-sm font-medium text-slate-500">Begini tampilan dashboard kamu setelah assessment selesai</p>
          <Card className="overflow-hidden border-none bg-navy-950 text-white shadow-lift">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-400">Skor Peluang Jodoh Anda</p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-5xl font-semibold">72</span>
                <span className="text-xl text-slate-400">/ 100</span>
                <span className="ml-auto rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">Cukup Siap</span>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-2 w-[72%] rounded-full bg-white" />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Hambatan terbesar Anda saat ini adalah rendahnya Peluang Pertemuan. Fokus ke jalur perkenalan baru dan perluas lingkaran sosial yang relevan.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {PILLAR_PREVIEW.map(({ label, score, status }) => (
                  <div key={label} className="rounded-2xl bg-white/8 p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">{score}</p>
                    <p className="mt-1 text-xs text-slate-400">{status}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Bukan ini, bukan itu */}
        <section className="mb-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Yang membedakan</p>
          <h2 className="mb-8 text-2xl font-semibold text-slate-950">
            Dirancang untuk yang serius, bukan yang sekadar penasaran
          </h2>
          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <Card key={title}>
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-50">
                    <Icon className="h-5 w-5 text-navy-900" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">{title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Yang kamu dapat */}
        <section className="mb-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Yang kamu dapat</p>
          <h2 className="mb-8 text-2xl font-semibold text-slate-950">Satu akses, semua yang kamu butuhkan</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {WHAT_YOU_GET.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="text-sm leading-6 text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Clarifier */}
        <section className="mb-16 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
          <p className="text-sm font-semibold text-slate-950">Ini bukan aplikasi cari jodoh</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Fast Track Jodoh tidak mencarikan pasangan untukmu, tidak menghubungkan kamu dengan siapapun, dan tidak punya database calon. Yang ada di sini adalah alat bantu untuk mempersiapkan diri, mengevaluasi kandidat yang sudah kamu temui, dan menjalani proses taaruf dengan lebih terstruktur. Keputusan tetap sepenuhnya di tanganmu.
          </p>
        </section>

        {/* CTA akhir */}
        <section className="rounded-2xl bg-navy-950 px-8 py-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Harga</p>
          <p className="mt-3 text-4xl font-semibold text-white">Rp94.000</p>
          <p className="mt-2 text-sm text-slate-400">Sekali bayar · Lifetime access · Tidak ada biaya tambahan</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg">Daftar dan Mulai Sekarang <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Daftar gratis · Akses fitur terbuka setelah konfirmasi admin · Bisa diakses dari HP dan laptop
          </p>
        </section>

      </main>
    </div>
  );
}
