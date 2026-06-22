"use client";

import { PDFDownloadButton } from "@/components/pdf/pdf-download-button";
import { ComparePDF } from "@/lib/pdf/compare-pdf";

type CandidateCompareRow = {
  candidateId: string;
  candidateName: string;
  overallScore: number;
  areaScores: Record<string, number>;
};

type Props = {
  candidates: CandidateCompareRow[];
  areaLabels: Record<string, string>;
  differenceSummary: string;
  combinedDiscussionTopics: string[];
  generatedAt: string;
};

export function ComparePDFExport(props: Props) {
  const names = props.candidates.map((c) => c.candidateName).join("-vs-");
  return (
    <PDFDownloadButton
      document={<ComparePDF data={props} />}
      fileName={`perbandingan-${names.toLowerCase().replace(/\s+/g, "-")}.pdf`}
      label="Export PDF Perbandingan"
    />
  );
}
