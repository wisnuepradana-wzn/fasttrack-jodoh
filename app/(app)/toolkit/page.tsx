import { AppShell } from "@/components/layout/app-shell";
import { requireActiveProfile } from "@/lib/auth";
import { ToolkitTabs } from "@/components/toolkit/toolkit-tabs";

export default async function ToolkitPage() {
  await requireActiveProfile();

  return (
    <AppShell
      title="Toolkit"
      subtitle="Template dan alat bantu praktis untuk mempercepat proses."
    >
      <div className="max-w-2xl">
        <ToolkitTabs />
      </div>
    </AppShell>
  );
}
