"use client";

import { PDFDownloadButton } from "@/components/pdf/pdf-download-button";
import { CandidateScreeningPDF } from "@/lib/pdf/candidate-screening-pdf";

type AreaResult = {
  pillar: string;
  label: string;
  score: number;
  insight: string;
  discussionTopics: string[] | null;
};

type Props = {
  candidateName: string;
  overallScore: number;
  evaluatedAt: string;
  areas: AreaResult[];
};

export function CandidatePDFExport({ candidateName, overallScore, evaluatedAt, areas }: Props) {
  return (
    <PDFDownloadButton
      document={
        <CandidateScreeningPDF
          data={{ candidateName, overallScore, evaluatedAt, areas }}
        />
      }
      fileName={`screening-${candidateName.toLowerCase().replace(/\s+/g, "-")}.pdf`}
      label="Export PDF"
    />
  );
}
