import { Document, Page, Text, View } from "@react-pdf/renderer";
import { PDF_STYLES, PDF_COLORS, getBadgeColors } from "@/lib/pdf/styles";

type CandidateCompareRow = {
  candidateId: string;
  candidateName: string;
  overallScore: number;
  areaScores: Record<string, number>;
};

type ComparePDFData = {
  candidates: CandidateCompareRow[];
  areaLabels: Record<string, string>;
  differenceSummary: string;
  combinedDiscussionTopics: string[];
  generatedAt: string;
};

export function ComparePDF({ data }: { data: ComparePDFData }) {
  const areaKeys = Object.keys(data.areaLabels);

  return (
    <Document title={`Perbandingan Kandidat — ${data.candidates.map((c) => c.candidateName).join(" vs ")}`}>
      <Page size="A4" style={PDF_STYLES.page}>
        {/* Header */}
        <View style={PDF_STYLES.pageHeader}>
          <Text style={PDF_STYLES.pageHeaderLabel}>Perbandingan Kandidat</Text>
          <Text style={PDF_STYLES.pageHeaderTitle}>
            {data.candidates.map((c) => c.candidateName).join(" · ")}
          </Text>
          <Text style={PDF_STYLES.pageHeaderSubtitle}>Dibuat {data.generatedAt}</Text>
        </View>

        {/* Overall skor per kandidat */}
        <Text style={PDF_STYLES.sectionTitle}>Overall Compatibility</Text>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
          {data.candidates.map((c) => {
            const badge = getBadgeColors(c.overallScore);
            return (
              <View key={c.candidateId} style={{
                flex: 1,
                backgroundColor: PDF_COLORS.navyLight,
                borderRadius: 8,
                padding: 14,
                alignItems: "center",
              }}>
                <Text style={{ fontSize: 9, color: PDF_COLORS.slate400, marginBottom: 4 }}>{c.candidateName}</Text>
                <Text style={{ fontSize: 28, fontFamily: "Helvetica-Bold", color: PDF_COLORS.white }}>{c.overallScore}</Text>
                <View style={{ ...PDF_STYLES.scoreBadge, backgroundColor: badge.bg, marginTop: 6 }}>
                  <Text style={{ fontSize: 8, color: badge.text }}>{badge.label}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Tabel perbandingan per area */}
        <Text style={PDF_STYLES.sectionTitle}>Skor per Area</Text>
        <View style={PDF_STYLES.tableHeader}>
          <Text style={{ ...PDF_STYLES.tableHeaderCell, flex: 2 }}>Area</Text>
          {data.candidates.map((c) => (
            <Text key={c.candidateId} style={{ ...PDF_STYLES.tableHeaderCell, flex: 1, textAlign: "center" }}>
              {c.candidateName}
            </Text>
          ))}
        </View>

        {areaKeys.map((key) => {
          const scores = data.candidates.map((c) => c.areaScores[key] ?? 0);
          const maxScore = Math.max(...scores);
          return (
            <View key={key} style={PDF_STYLES.tableRow}>
              <Text style={{ ...PDF_STYLES.tableCell, flex: 2 }}>{data.areaLabels[key]}</Text>
              {scores.map((score, i) => {
                const isHighest = score === maxScore && scores.filter((s) => s === maxScore).length === 1;
                return (
                  <Text
                    key={i}
                    style={{
                      ...(isHighest ? PDF_STYLES.tableCellBold : PDF_STYLES.tableCell),
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    {score}
                  </Text>
                );
              })}
            </View>
          );
        })}

        {/* Perbedaan utama */}
        <Text style={PDF_STYLES.sectionTitle}>Perbedaan Utama</Text>
        <View style={PDF_STYLES.insightBox}>
          <Text style={PDF_STYLES.insightText}>{data.differenceSummary}</Text>
        </View>

        {/* Topik diskusi */}
        {data.combinedDiscussionTopics.length > 0 && (
          <>
            <Text style={PDF_STYLES.sectionTitle}>Topik Diskusi Lanjutan</Text>
            {data.combinedDiscussionTopics.slice(0, 8).map((topic, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 5 }}>
                <Text style={{ fontSize: 10, color: PDF_COLORS.slate400, marginRight: 6 }}>·</Text>
                <Text style={{ ...PDF_STYLES.insightText, flex: 1 }}>{topic}</Text>
              </View>
            ))}
          </>
        )}

        {/* Footer */}
        <Text style={PDF_STYLES.disclaimer}>
          Laporan ini adalah alat bantu refleksi pribadi, bukan penentu pilihan.
          Skor tertinggi di satu area (ditandai hijau) bukan berarti kandidat tersebut lebih baik secara keseluruhan.
          Diskusikan dengan keluarga atau orang terpercaya sebelum mengambil keputusan.
          Dibuat menggunakan Panduan Fast Track 30 Hari Membuka Peluang Jodoh.
        </Text>
      </Page>
    </Document>
  );
}
