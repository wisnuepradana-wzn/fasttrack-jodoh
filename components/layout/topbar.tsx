import { Badge } from "@/components/ui/badge";

export function Topbar({
  title,
  subtitle,
  statusLabel
}: {
  title: string;
  subtitle?: string;
  statusLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {statusLabel ? <Badge tone="success">{statusLabel}</Badge> : null}
    </div>
  );
}
