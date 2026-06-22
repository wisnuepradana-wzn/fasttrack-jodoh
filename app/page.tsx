import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#141414] font-sans">
      {/* Left Side - Value Prop */}
      <div className="flex-1 flex flex-col justify-center px-8 py-16 lg:px-16 xl:px-24 relative overflow-hidden">
        {/* Subtle red glow from top-left */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(229,9,20,0.15)_0%,rgba(20,20,20,1)_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mt-10 lg:mt-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider uppercase text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
            Akses Premium · Lifetime Access
          </div>
          
          {/* Hero Heading */}
          <h1 className="text-5xl lg:text-7xl font-heading font-black tracking-tight text-white leading-[1.05] mb-6">
            BERHENTI BUANG WAKTU UNTUK{" "}
            <span className="text-[#E50914]">PENDEKATAN YANG SALAH.</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg lg:text-xl text-[#b3b3b3] leading-relaxed mb-10 font-light max-w-xl">
            Peta jalan 30 hari menuju pernikahan yang terarah. Evaluasi kandidat secara objektif, petakan kesiapan diri, dan jalani taaruf dengan framework profesional.
          </p>

          {/* Checklist Value Props */}
          <div className="space-y-4 mb-12">
            {[
              "Assessment Kesiapan Diri & Diagnosis Personal",
              "Framework Screening 7 Area Kritis — Bukan Sekadar Feeling",
              "Akses Seumur Hidup — Hanya Rp97.000, Sekali Bayar"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#E50914] flex-shrink-0" />
                <span className="text-[#e5e5e5] font-medium text-base lg:text-lg">{item}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <p className="text-sm text-[#666666] italic">
            "Bukan ebook. Bukan kursus video. Ini tools nyata yang bekerja."
          </p>
        </div>
      </div>

      {/* Right Side - Auth Actions */}
      <div className="w-full lg:w-[480px] bg-[#181818] border-l border-white/[0.06] flex flex-col justify-center px-8 py-16 lg:px-12 relative z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-sm mx-auto w-full">
          {/* Right panel heading */}
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-2 tracking-tight">
            Mulai Sekarang
          </h2>
          <p className="text-[#808080] text-sm mb-10 leading-relaxed">
            Bergabung dengan platform dan dapatkan akses penuh ke semua fitur.
          </p>

          <div className="space-y-3">
            {/* Primary CTA - Register */}
            <Link href="/register" className="block group">
              <button className="w-full bg-[#E50914] hover:bg-[#c50009] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-between shadow-[0_0_25px_rgba(229,9,20,0.35)] hover:shadow-[0_0_35px_rgba(229,9,20,0.55)]">
                <span className="text-base lg:text-lg">Daftar Akun Baru</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
            
            {/* Secondary CTA - Login */}
            <Link href="/login" className="block">
              <button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/[0.12] hover:border-white/20 font-semibold py-4 px-6 rounded-xl transition-all duration-200 text-center text-sm">
                Sudah punya akun?{" "}
                <span className="text-[#E50914] font-bold">Masuk di sini</span>
              </button>
            </Link>
          </div>

          {/* Divider */}
          <div className="mt-10 pt-8 border-t border-white/[0.06]">
            <p className="text-center text-xs text-[#666666] leading-relaxed">
              Daftar gratis · Tidak ada biaya langganan<br />
              Lifetime access · Bisa diakses dari HP & laptop
            </p>
          </div>

          {/* Price reminder */}
          <div className="mt-6 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
            <p className="text-[#808080] text-xs uppercase tracking-widest font-semibold mb-1">Harga</p>
            <p className="text-white text-3xl font-heading font-black">Rp97.000</p>
            <p className="text-[#666666] text-xs mt-1">Sekali bayar · Akses selamanya</p>
          </div>
        </div>
      </div>
    </div>
  );
}
