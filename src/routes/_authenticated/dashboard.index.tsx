import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Images, Mail, Newspaper, Sparkles, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n";
import { PageHeader } from "@/components/dashboard/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: Overview,
});

async function count(table: "posts" | "gallery_images" | "leaders" | "contact_messages", kind?: string) {
  const base = supabase.from(table).select("id", { count: "exact", head: true });
  const { count: c } = kind ? await supabase.from("posts").select("id", { count: "exact", head: true }).eq("kind", kind) : await base;
  return c ?? 0;
}

function Overview() {
  const { t } = useI18n();
  const { data } = useQuery({
    queryKey: ["dash", "counts"],
    queryFn: async () => {
      const [news, events, life, gallery, leaders, messages] = await Promise.all([
        count("posts", "news"),
        count("posts", "event"),
        count("posts", "life"),
        count("gallery_images"),
        count("leaders"),
        count("contact_messages"),
      ]);
      return { news, events, life, gallery, leaders, messages };
    },
  });
  const cards = [
    { to: "/dashboard/news", label: t.dash.news, n: data?.news, icon: Newspaper },
    { to: "/dashboard/events", label: t.dash.events, n: data?.events, icon: CalendarDays },
    { to: "/dashboard/life", label: t.dash.life, n: data?.life, icon: Sparkles },
    { to: "/dashboard/gallery", label: t.dash.gallery, n: data?.gallery, icon: Images },
    { to: "/dashboard/leadership", label: t.dash.leadership, n: data?.leaders, icon: Users },
    { to: "/dashboard/messages", label: t.dash.messages, n: data?.messages, icon: Mail },
  ] as const;
  return (
    <>
      <PageHeader title={t.dash.welcome} lead={t.dash.counts} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.to}
            className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
          >
            <c.icon className="h-6 w-6 text-primary" />
            <p className="mt-4 font-display text-5xl font-bold text-card-foreground">{c.n ?? "–"}</p>
            <p className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
    </>
  );
}
