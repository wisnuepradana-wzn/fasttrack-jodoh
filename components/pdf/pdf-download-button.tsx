"use client";

import dynamic from "next/dynamic";
import { FileText, Loader2 } from "lucide-react";
import type { ReactElement } from "react";

// PDFDownloadLink hanya jalan di browser (bukan SSR), jadi wajib dynamic import
// dengan ssr: false supaya tidak error saat halaman di-render server-side.
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex cursor-wait items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        Menyiapkan PDF...
      </span>
    )
  }
);

type PDFDownloadButtonProps = {
  document: ReactElement;
  fileName: string;
  label?: string;
};

export function PDFDownloadButton({
  document,
  fileName,
  label = "Export PDF"
}: PDFDownloadButtonProps) {
  return (
    <PDFDownloadLink document={document} fileName={fileName}>
      {({ loading }) =>
        loading ? (
          <span className="inline-flex cursor-wait items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Menyiapkan PDF...
          </span>
        ) : (
          <span className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-navy-900 px-4 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-navy-800">
            <FileText className="h-4 w-4" />
            {label}
          </span>
        )
      }
    </PDFDownloadLink>
  );
}
