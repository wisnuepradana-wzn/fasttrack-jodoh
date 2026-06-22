import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    q: "Ini aplikasi cari jodoh?",
    a: "Bukan. Ini bukan dating app, bukan marketplace taaruf, dan bukan platform matchmaking. Ini adalah guided action system, alat bantu pribadi untuk mempersiapkan diri, memperluas peluang pertemuan, dan mengevaluasi calon pasangan secara terstruktur."
  },
  {
    q: "Apakah ada video atau materi dalam bentuk kelas?",
    a: "Tidak ada video. Fokus produk ini adalah web app interaktif, bukan tontonan. Anda menggunakan fitur-fiturnya secara aktif, bukan sekadar menonton."
  },
  {
    q: "Saya langsung bisa akses setelah daftar?",
    a: "Belum langsung. Setelah mendaftar, akun Anda berstatus pending dan perlu diaktifkan secara manual oleh admin terlebih dahulu. Ini adalah bagian dari sistem akses terkendali produk ini."
  },
  {
    q: "Berapa lama proses aktivasi?",
    a: "Biasanya dalam 1x24 jam setelah mendaftar. Admin akan meninjau dan mengaktifkan akun Anda secara manual."
  },
  {
    q: "Apakah data saya aman dan privat?",
    a: "Ya. Semua data, termasuk nama kandidat, catatan, dan hasil assessment, hanya bisa diakses oleh Anda sendiri. Tidak ada data yang dibagikan ke pengguna lain. Kandidat yang Anda simpan juga bersifat sepenuhnya privat."
  },
  {
    q: "Apakah hasil assessment menentukan siapa yang harus saya pilih?",
    a: "Tidak. Skor dan insight yang dihasilkan adalah alat bantu refleksi, bukan keputusan otomatis. Aplikasi ini tidak pernah merekomendasikan \"pilih kandidat A\" atau \"kandidat B lebih cocok\". Semua keputusan tetap sepenuhnya di tangan Anda."
  },
  {
    q: "Apakah assessment dan riwayat tersimpan?",
    a: "Ya. Semua hasil assessment, baik assessment diri maupun evaluasi kandidat, tersimpan secara permanen dan bisa dibuka kembali kapan saja."
  },
  {
    q: "Apakah bisa dipakai lebih dari sekali?",
    a: "Ya. Assessment diri bisa diulang kapan saja untuk melihat perkembangan dari waktu ke waktu. Program 30 Hari juga tetap bisa diakses ulang setelah selesai, termasuk saat Anda bertemu kandidat baru."
  },
  {
    q: "Apakah ada biaya tambahan setelah membeli?",
    a: "Tidak ada. Ini adalah one-time payment dengan lifetime access. Tidak ada biaya langganan bulanan, tidak ada fitur premium berbayar tambahan."
  },
  {
    q: "Apakah ini untuk pria saja atau wanita juga?",
    a: "Untuk keduanya. Produk ini dirancang netral gender dan relevan untuk pria maupun wanita Muslim usia 23–45 yang ingin menjalani proses mencari pasangan dengan cara yang lebih terstruktur."
  }
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff,white_35%)]">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">FAQ</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Pertanyaan yang sering ditanyakan
          </h1>
        </div>

        <div className="mt-10 space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-soft"
            >
              <p className="font-semibold text-slate-950">{faq.q}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-navy-950 px-8 py-8 text-center text-white">
          <p className="font-semibold">Masih ada pertanyaan lain?</p>
          <p className="mt-2 text-sm text-slate-300">Daftar dulu, coba langsung, dan rasakan sendiri.</p>
          <Link href="/register" className="mt-5 inline-block">
            <Button>Daftar Sekarang</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
