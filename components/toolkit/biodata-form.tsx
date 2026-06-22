"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PDFDownloadButton } from "@/components/pdf/pdf-download-button";
import { BioDataPDF } from "@/lib/pdf/biodata-pdf";

type BiodataFields = {
  namaLengkap: string;
  usia: string;
  domisili: string;
  pendidikan: string;
  pekerjaan: string;
  latarBelakangKeluarga: string;
  nilaiHidup: string;
  visiPernikahan: string;
  harapanPasangan: string;
  catatanTambahan: string;
};

const EMPTY: BiodataFields = {
  namaLengkap: "",
  usia: "",
  domisili: "",
  pendidikan: "",
  pekerjaan: "",
  latarBelakangKeluarga: "",
  nilaiHidup: "",
  visiPernikahan: "",
  harapanPasangan: "",
  catatanTambahan: ""
};

const FIELDS: { key: keyof BiodataFields; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: "namaLengkap", label: "Nama Lengkap", placeholder: "Nama lengkap Anda" },
  { key: "usia", label: "Usia", placeholder: "Contoh: 27 tahun" },
  { key: "domisili", label: "Domisili", placeholder: "Kota tempat tinggal saat ini" },
  { key: "pendidikan", label: "Pendidikan Terakhir", placeholder: "Jenjang dan jurusan" },
  { key: "pekerjaan", label: "Pekerjaan", placeholder: "Jabatan dan bidang pekerjaan" },
  {
    key: "latarBelakangKeluarga",
    label: "Latar Belakang Keluarga",
    placeholder: "Ceritakan singkat tentang keluarga Anda, orang tua, dan lingkungan tumbuh kembang.",
    multiline: true
  },
  {
    key: "nilaiHidup",
    label: "Nilai Hidup & Prinsip",
    placeholder: "Apa yang paling penting bagi Anda dalam menjalani kehidupan? Apa yang tidak bisa dikompromikan?",
    multiline: true
  },
  {
    key: "visiPernikahan",
    label: "Visi Pernikahan",
    placeholder: "Bagaimana gambaran rumah tangga yang ingin Anda bangun? Apa peran yang ingin Anda jalani?",
    multiline: true
  },
  {
    key: "harapanPasangan",
    label: "Harapan terhadap Pasangan",
    placeholder: "Kualitas dan nilai apa yang Anda harapkan dari calon pasangan?",
    multiline: true
  },
  {
    key: "catatanTambahan",
    label: "Catatan Tambahan (opsional)",
    placeholder: "Hal lain yang ingin Anda sampaikan yang belum tercakup di atas.",
    multiline: true
  }
];

const filledCount = (data: BiodataFields) =>
  Object.entries(data).filter(([k, v]) => k !== "catatanTambahan" && v.trim() !== "").length;

const REQUIRED_FIELDS = FIELDS.filter((f) => f.key !== "catatanTambahan").length;

export function BiodataForm() {
  const [data, setData] = useState<BiodataFields>(EMPTY);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const filled = filledCount(data);
  const isReady = filled === REQUIRED_FIELDS;

  const handleChange = (key: keyof BiodataFields, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  if (mode === "preview") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Preview Biodata</p>
          <Button variant="outline" size="sm" onClick={() => setMode("edit")}>
            Edit Kembali
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="bg-navy-950 px-8 py-6 text-white">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Biodata Taaruf</p>
            <p className="mt-2 text-2xl font-semibold">{data.namaLengkap || "—"}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-300">
              {data.usia && <span>{data.usia}</span>}
              {data.domisili && <span>· {data.domisili}</span>}
              {data.pekerjaan && <span>· {data.pekerjaan}</span>}
            </div>
          </div>
          <CardContent className="divide-y divide-slate-100 p-0">
            {FIELDS.filter((f) => f.key !== "namaLengkap" && f.key !== "usia" && f.key !== "domisili" && f.key !== "pekerjaan").map((field) => {
              const value = data[field.key];
              if (!value) return null;
              return (
                <div key={field.key} className="px-6 py-5">
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                    {field.label}
                  </p>
                  <p className="text-sm leading-7 text-slate-700 whitespace-pre-line">{value}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <PDFDownloadButton
            document={<BioDataPDF data={data} />}
            fileName={`biodata-taaruf-${data.namaLengkap.toLowerCase().replace(/\s+/g, "-") || "saya"}.pdf`}
            label="Export PDF"
          />
          <Button variant="outline" onClick={() => setMode("edit")}>
            Edit Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>{filled} dari {REQUIRED_FIELDS} bagian wajib diisi</span>
        <span>{Math.round((filled / REQUIRED_FIELDS) * 100)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100">
        <div
          className="h-1.5 rounded-full bg-navy-900 transition-all duration-500"
          style={{ width: `${(filled / REQUIRED_FIELDS) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        {FIELDS.map((field) => (
          <Card key={field.key} className="p-5">
            <label className="mb-1.5 block text-sm font-semibold text-slate-950">
              {field.label}
              {field.key !== "catatanTambahan" && (
                <span className="ml-1 text-rose-400">*</span>
              )}
            </label>
            {field.multiline ? (
              <Textarea
                placeholder={field.placeholder}
                value={data[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                rows={3}
                className="resize-none"
              />
            ) : (
              <Input
                placeholder={field.placeholder}
                value={data[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            )}
          </Card>
        ))}
      </div>

      <Button
        onClick={() => setMode("preview")}
        disabled={!isReady}
        className="w-full"
      >
        {isReady ? "Lihat Preview Biodata" : `Lengkapi biodata dulu (${filled}/${REQUIRED_FIELDS})`}
      </Button>
    </div>
  );
}
