import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/page-header";
import { useI18n, formatDate } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/messages")({
  component: DashboardMessages,
});

function DashboardMessages() {
  const { t, lang } = useI18n();
  const { data = [], isLoading } = useQuery({
    queryKey: ["dash", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <>
      <PageHeader title={t.dash.messages} lead={t.dash.manage} />
      {isLoading ? (
        <p className="text-muted-foreground">{t.common.loading}</p>
      ) : data.length === 0 ? (
        <p className="text-muted-foreground">{t.dash.noMessages}</p>
      ) : (
        <ul className="grid gap-3">
          {data.map((m) => (
            <li key={m.id} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                {t.dash.from}: <b className="text-foreground">{m.name || m.email}</b>
                {m.email ? ` · ${m.email}` : ""}
                {" · "}
                {formatDate(m.created_at, lang, true)}
              </p>
              {m.subject && <p className="mt-1 font-display text-lg font-bold uppercase">{m.subject}</p>}
              <p className="mt-2 whitespace-pre-wrap text-foreground">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
