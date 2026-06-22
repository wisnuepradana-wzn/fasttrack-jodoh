"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveStatus, STATUS_LABEL, MAX_COMPARE_CANDIDATES, MIN_COMPARE_CANDIDATES } from "@/lib/decision-engine";
import { statusToBadgeTone } from "@/lib/status-badge";

type CandidateRow = {
  id: string;
  display_name: string;
  gender: string | null;
  status: string;
  latest_score: number | null;
  last_evaluated_at: string | null;
};

export function CandidateList({ candidates }: { candidates: CandidateRow[] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const evaluatedCandidates = candidates.filter((c) => c.latest_score !== null);
  const canSelectMore = selectedIds.length < MAX_COMPARE_CANDIDATES;

  const toggleSelect = (id: string, hasScore: boolean) => {
    if (!hasScore) return;
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (!canSelectMore) return prev;
      return [...prev, id];
    });
  };

  const handleCompare = () => {
    if (selectedIds.length < MIN_COMPARE_CANDIDATES) return;
    router.push(`/candidates/compare?ids=${selectedIds.join(",")}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {evaluatedCandidates.length > 1
            ? `Pilih ${MIN_COMPARE_CANDIDATES} sampai ${MAX_COMPARE_CANDIDATES} kandidat untuk dibandingkan.`
            : "Tambahkan kandidat lain untuk bisa membandingkan."}
        </p>
        <Link href="/candidates/new">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
            Tambah Kandidat
          </Button>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {candidates.map((candidate) => {
          const hasScore = candidate.latest_score !== null;
          const score = hasScore ? Math.round(Number(candidate.latest_score)) : null;
          const status = score !== null ? resolveStatus(score) : null;
          const isSelected = selectedIds.includes(candidate.id);
          const isDisabled = !hasScore || (!isSelected && !canSelectMore);

          return (
            <Card key={candidate.id} className="relative p-4">
              {hasScore && (
                <button
                  type="button"
                  onClick={() => toggleSelect(candidate.id, hasScore)}
                  disabled={isDisabled && !isSelected}
                  aria-label={`Pilih ${candidate.display_name} untuk dibandingkan`}
                  className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                    isSelected
                      ? "border-navy-900 bg-navy-900"
                      : isDisabled
                        ? "border-slate-200 bg-slate-100"
                        : "border-slate-300 bg-white hover:border-navy-300"
                  }`}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </button>
              )}

              <Link href={`/candidates/${candidate.id}`} className="block pr-8">
                <p className="font-medium text-slate-950">{candidate.display_name}</p>
                {candidate.status === "archived" && (
                  <Badge tone="default" className="mt-1">
                    Diarsipkan
                  </Badge>
                )}
                {hasScore ? (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xl font-semibold text-slate-950">{score}</span>
                    {status && <Badge tone={statusToBadgeTone(status)}>{STATUS_LABEL[status]}</Badge>}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">Belum dievaluasi</p>
                )}
              </Link>
            </Card>
          );
        })}
      </div>

      {selectedIds.length > 0 && (
        <div className="sticky bottom-4 flex items-center justify-between rounded-2xl border border-navy-200 bg-white px-5 py-3 shadow-lift">
          <p className="text-sm text-slate-600">
            {selectedIds.length} kandidat dipilih
            {selectedIds.length < MIN_COMPARE_CANDIDATES &&
              `, pilih minimal ${MIN_COMPARE_CANDIDATES} untuk membandingkan`}
          </p>
          <Button onClick={handleCompare} disabled={selectedIds.length < MIN_COMPARE_CANDIDATES}>
            <Scale className="h-4 w-4" />
            Bandingkan
          </Button>
        </div>
      )}
    </div>
  );
}
