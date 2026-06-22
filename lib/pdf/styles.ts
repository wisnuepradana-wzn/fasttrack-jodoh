import { StyleSheet, Font } from "@react-pdf/renderer";

// Warna konsisten dengan design system web app (navy-950, slate, emerald, amber, rose)
export const PDF_COLORS = {
  navy: "#0a1628",
  navyLight: "#1e3a5f",
  white: "#ffffff",
  slate950: "#020617",
  slate700: "#334155",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50: "#f8fafc",
  emerald600: "#059669",
  emerald50: "#ecfdf5",
  amber500: "#f59e0b",
  amber50: "#fffbeb",
  rose500: "#f43f5e",
  rose50: "#fff1f2",
};

export const PDF_STYLES = StyleSheet.create({
  page: {
    backgroundColor: PDF_COLORS.white,
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 48,
    paddingRight: 48,
    fontFamily: "Helvetica",
  },

  // Header halaman (navy gelap)
  pageHeader: {
    backgroundColor: PDF_COLORS.navy,
    marginTop: -48,
    marginLeft: -48,
    marginRight: -48,
    marginBottom: 32,
    paddingTop: 32,
    paddingBottom: 32,
    paddingLeft: 48,
    paddingRight: 48,
  },
  pageHeaderLabel: {
    fontSize: 8,
    color: PDF_COLORS.slate400,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  pageHeaderTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.white,
    marginBottom: 4,
  },
  pageHeaderSubtitle: {
    fontSize: 11,
    color: PDF_COLORS.slate400,
  },

  // Score card utama
  scoreCard: {
    backgroundColor: PDF_COLORS.navyLight,
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreNumber: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.white,
  },
  scoreLabel: {
    fontSize: 10,
    color: PDF_COLORS.slate400,
    marginBottom: 4,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },

  // Section
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.slate700,
    marginBottom: 8,
    marginTop: 20,
    paddingBottom: 6,
    borderBottom: `1 solid ${PDF_COLORS.slate200}`,
  },

  // Field biodata
  fieldLabel: {
    fontSize: 8,
    color: PDF_COLORS.slate400,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  fieldValue: {
    fontSize: 10,
    color: PDF_COLORS.slate700,
    lineHeight: 1.6,
    marginBottom: 12,
  },

  // Area row (untuk 7 area screening)
  areaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottom: `1 solid ${PDF_COLORS.slate100}`,
  },
  areaName: {
    flex: 1,
    fontSize: 10,
    color: PDF_COLORS.slate700,
  },
  areaScore: {
    width: 36,
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.slate950,
    textAlign: "right",
    marginRight: 8,
  },

  // Insight box
  insightBox: {
    backgroundColor: PDF_COLORS.slate50,
    borderRadius: 6,
    padding: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 10,
    color: PDF_COLORS.slate700,
    lineHeight: 1.7,
  },

  // Footer disclaimer
  disclaimer: {
    marginTop: 24,
    paddingTop: 12,
    borderTop: `1 solid ${PDF_COLORS.slate200}`,
    fontSize: 8,
    color: PDF_COLORS.slate400,
    lineHeight: 1.5,
  },

  // Compare table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: PDF_COLORS.slate100,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.slate500,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottom: `1 solid ${PDF_COLORS.slate100}`,
  },
  tableCell: {
    fontSize: 10,
    color: PDF_COLORS.slate700,
  },
  tableCellBold: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.emerald600,
  },
});

// Helper: warna badge berdasarkan skor
export function getBadgeColors(score: number): { bg: string; text: string; label: string } {
  if (score >= 80) return { bg: PDF_COLORS.emerald50, text: PDF_COLORS.emerald600, label: "Sangat Siap" };
  if (score >= 60) return { bg: PDF_COLORS.amber50, text: PDF_COLORS.amber500, label: "Cukup Siap" };
  return { bg: PDF_COLORS.rose50, text: PDF_COLORS.rose500, label: "Perlu Perbaikan" };
}

export function formatScoreLabel(score: number): string {
  if (score >= 80) return "Sangat Siap";
  if (score >= 60) return "Cukup Siap";
  return "Perlu Perbaikan";
}
