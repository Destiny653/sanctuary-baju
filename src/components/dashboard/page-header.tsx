import type { ReactNode } from "react";

export function PageHeader({ title, lead, action }: { title: string; lead?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-foreground md:text-4xl">{title}</h1>
        {lead && <p className="mt-1 text-muted-foreground">{lead}</p>}
      </div>
      {action}
    </div>
  );
}
