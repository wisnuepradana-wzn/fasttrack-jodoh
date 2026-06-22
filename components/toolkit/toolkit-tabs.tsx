"use client";

import { useState } from "react";
import { BiodataForm } from "@/components/toolkit/biodata-form";
import { RedFlagChecklist } from "@/components/toolkit/red-flag-checklist";

const TABS = [
  {
    id: "biodata",
    label: "Template Biodata",
    description: "Buat biodata taaruf yang rapi, jujur, dan siap dibagikan."
  },
  {
    id: "redflag",
    label: "Checklist Red Flag",
    description: "Nilai kandidat dari 10 area penting, dapat insight otomatis di akhir."
  }
];

export function ToolkitTabs() {
  const [active, setActive] = useState("biodata");
  const current = TABS.find(t => t.id === active)!;

  return (
    <div>
      {/* Tab switcher */}
      <div className="mb-6 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
              active === tab.id
                ? "bg-navy-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="mb-6 text-sm leading-6 text-slate-600">{current.description}</p>

      {/* Content */}
      {active === "biodata" && <BiodataForm />}
      {active === "redflag" && <RedFlagChecklist />}
    </div>
  );
}
