import { Document, Page, Text, View } from "@react-pdf/renderer";
import { PDF_STYLES, PDF_COLORS, getBadgeColors } from "@/lib/pdf/styles";

type AreaResult = {
  pillar: string;
  label: string;
  score: number;
  insight: string;
  discussionTopics: string[] | null;
};

type CandidatePDFData = {
  candidateName: string;
  overallScore: number;
  evaluatedAt: string;
  areas: AreaResult[];
};

export function CandidateScreeningPDF({ data }: { data: CandidatePDFData }) {
  const overallBadge = getBadgeColors(data.overallScore);
  const strengths = data.areas.filter((a) => a.score >= 80);
  const needsWork = data.areas.filter((a) => a.score < 80);
  const allTopics = data.areas
    .filter((a) => a.discussionTopics && a.discussionTopics.length > 0)
    .flatMap((a) => a.discussionTopics as string[]);

  return (
    <Document title={`Framework Screening — ${data.candidateName}`}>
      <Page size="A4" style={PDF_STYLES.page}>
        {/* Header */}
        <View style={PDF_STYLES.pageHeader}>
          <Text style={PDF_STYLES.pageHeaderLabel}>Hasil Framework Screening</Text>
          <Text style={PDF_STYLES.pageHeaderTitle}>{data.candidateName}</Text>
          <Text style={PDF_STYLES.pageHeaderSubtitle}>Dievaluasi {data.evaluatedAt}</Text>
        </View>

        {/* Skor utama */}
        <View style={PDF_STYLES.scoreCard}>
          <View>
            <Text style={PDF_STYLES.scoreLabel}>Overall Compatibility</Text>
            <Text style={PDF_STYLES.scoreNumber}>{data.overallScore}</Text>
            <Text style={{ ...PDF_STYLES.scoreLabel, marginTop: 2 }}>dari 100</Text>
          </View>
          <View style={{
            ...PDF_STYLES.scoreBadge,
            backgroundColor: overallBadge.bg,
          }}>
            <Text style={{ color: overallBadge.text }}>{overallBadge.label}</Text>
          </View>
        </View>

        {/* 7 Area skor */}
        <Text style={PDF_STYLES.sectionTitle}>Skor per Area</Text>
        {data.areas.map((area) => {
          const badge = getBadgeColors(area.score);
          const isHighest = data.areas.every((a) => a.score <= area.score);
          return (
            <View key={area.pillar} style={PDF_STYLES.areaRow}>
              <Text style={PDF_STYLES.areaName}>{area.label}</Text>
              <Text style={{
                ...PDF_STYLES.areaScore,
                color: isHighest ? PDF_COLORS.emerald600 : PDF_COLORS.slate950
              }}>
                {area.score}
              </Text>
              <View style={{
                ...PDF_STYLES.scoreBadge,
                backgroundColor: badge.bg,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}>
                <Text style={{ fontSize: 8, color: badge.text }}>{badge.label}</Text>
              </View>
            </View>
          );
        })}

        {/* Kekuatan */}
        {strengths.length > 0 && (
          <>
            <Text style={PDF_STYLES.sectionTitle}>Kekuatan</Text>
            {strengths.map((area) => (
              <View key={area.pillar} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: PDF_COLORS.emerald600, marginBottom: 3 }}>
                  {area.label}
                </Text>
                <View style={PDF_STYLES.insightBox}>
                  <Text style={PDF_STYLES.insightText}>{area.insight}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Area perlu didalami */}
        {needsWork.length > 0 && (
          <>
            <Text style={PDF_STYLES.sectionTitle}>Area yang Perlu Didalami</Text>
            {needsWork.map((area) => (
              <View key={area.pillar} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: PDF_COLORS.amber500, marginBottom: 3 }}>
                  {area.label}
                </Text>
                <View style={PDF_STYLES.insightBox}>
                  <Text style={PDF_STYLES.insightText}>{area.insight}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Topik diskusi */}
        {allTopics.length > 0 && (
          <>
            <Text style={PDF_STYLES.sectionTitle}>Topik Diskusi Lanjutan</Text>
            {allTopics.map((topic, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 6 }}>
                <Text style={{ fontSize: 10, color: PDF_COLORS.slate400, marginRight: 6 }}>·</Text>
                <Text style={{ ...PDF_STYLES.insightText, flex: 1 }}>{topic}</Text>
              </View>
            ))}
          </>
        )}

        {/* Footer */}
        <Text style={PDF_STYLES.disclaimer}>
          Laporan ini adalah alat bantu refleksi pribadi, bukan vonis atau keputusan akhir.
          Dibuat menggunakan Panduan Fast Track 30 Hari Membuka Peluang Jodoh.
          Diskusikan dengan orang yang Anda percaya sebelum mengambil keputusan.
        </Text>
      </Page>
    </Document>
  );
}
