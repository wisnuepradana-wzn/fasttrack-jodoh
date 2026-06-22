import { Document, Page, Text, View } from "@react-pdf/renderer";
import { PDF_STYLES, PDF_COLORS } from "@/lib/pdf/styles";

type BiodataData = {
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

const SECTIONS = [
  { key: "pendidikan" as keyof BiodataData, label: "Pendidikan Terakhir" },
  { key: "pekerjaan" as keyof BiodataData, label: "Pekerjaan" },
  { key: "latarBelakangKeluarga" as keyof BiodataData, label: "Latar Belakang Keluarga" },
  { key: "nilaiHidup" as keyof BiodataData, label: "Nilai Hidup & Prinsip" },
  { key: "visiPernikahan" as keyof BiodataData, label: "Visi Pernikahan" },
  { key: "harapanPasangan" as keyof BiodataData, label: "Harapan terhadap Pasangan" },
  { key: "catatanTambahan" as keyof BiodataData, label: "Catatan Tambahan" },
];

export function BioDataPDF({ data }: { data: BiodataData }) {
  return (
    <Document title={`Biodata Taaruf — ${data.namaLengkap}`}>
      <Page size="A4" style={PDF_STYLES.page}>
        {/* Header */}
        <View style={PDF_STYLES.pageHeader}>
          <Text style={PDF_STYLES.pageHeaderLabel}>Biodata Taaruf Profesional</Text>
          <Text style={PDF_STYLES.pageHeaderTitle}>{data.namaLengkap || "—"}</Text>
          <Text style={PDF_STYLES.pageHeaderSubtitle}>
            {[data.usia, data.domisili].filter(Boolean).join(" · ")}
          </Text>
        </View>

        {/* Isi per section */}
        {SECTIONS.map((section) => {
          const value = data[section.key];
          if (!value) return null;
          return (
            <View key={section.key}>
              <Text style={PDF_STYLES.fieldLabel}>{section.label}</Text>
              <Text style={PDF_STYLES.fieldValue}>{value}</Text>
            </View>
          );
        })}

        {/* Footer */}
        <Text style={PDF_STYLES.disclaimer}>
          Dokumen ini dibuat menggunakan Panduan Fast Track 30 Hari Membuka Peluang Jodoh.
          Bersifat pribadi dan hanya untuk keperluan proses taaruf.
        </Text>
      </Page>
    </Document>
  );
}
