import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MediaField } from "@/components/dashboard/media-upload";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";

type Kind = "news" | "event" | "life";

type PostRow = {
  id: string;
  kind: string;
  slug: string;
  title_en: string;
  title_fr: string;
  excerpt_en: string;
  excerpt_fr: string;
  body_en: string;
  body_fr: string;
  cover_url: string | null;
  video_url: string | null;
  published: boolean;
  published_at: string;
  event_start: string | null;
  event_location: string | null;
};

const empty = (kind: Kind): Omit<PostRow, "id"> => ({
  kind,
  slug: "",
  title_en: "",
  title_fr: "",
  excerpt_en: "",
  excerpt_fr: "",
  body_en: "",
  body_fr: "",
  cover_url: null,
  video_url: null,
  published: false,
  published_at: new Date().toISOString(),
  event_start: kind === "event" ? new Date().toISOString() : null,
  event_location: kind === "event" ? "" : null,
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function PostsManager({ kind, title, lead }: { kind: Kind; title: string; lead: string }) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<PostRow | null>(null);
  const [draft, setDraft] = useState(empty(kind));

  const { data = [], isLoading } = useQuery({
    queryKey: ["dash", "posts", kind],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("kind", kind)
        .order(kind === "event" ? "event_start" : "published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PostRow[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...draft,
        kind,
        slug: draft.slug || slugify(draft.title_en || draft.title_fr || "post"),
        event_location: kind === "event" ? draft.event_location : null,
        event_start: kind === "event" ? draft.event_start : null,
      };
      if (editing) {
        const { error } = await supabase.from("posts").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: async () => {
      toast.success(t.dash.saved);
      setEditing(null);
      setDraft(empty(kind));
      await qc.invalidateQueries({ queryKey: ["dash", "posts", kind] });
      await qc.invalidateQueries({ queryKey: ["posts"] });
      await qc.invalidateQueries({ queryKey: ["dash", "counts"] });
    },
    onError: () => toast.error(t.dash.error),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success(t.dash.deleted);
      await qc.invalidateQueries({ queryKey: ["dash", "posts", kind] });
      await qc.invalidateQueries({ queryKey: ["posts"] });
      await qc.invalidateQueries({ queryKey: ["dash", "counts"] });
    },
    onError: () => toast.error(t.dash.error),
  });

  function startEdit(row: PostRow) {
    setEditing(row);
    setDraft({ ...row });
  }

  function startNew() {
    setEditing(null);
    setDraft(empty(kind));
  }

  return (
    <>
      <PageHeader
        title={title}
        lead={lead}
        action={
          <Button type="button" onClick={startNew}>
            <Plus className="h-4 w-4" /> {t.dash.newItem}
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 rounded-xl border border-border bg-card p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t.dash.fieldTitle} ({t.dash.english})</Label>
            <Input
              value={draft.title_en}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  title_en: e.target.value,
                  slug: editing ? d.slug : slugify(e.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.fieldTitle} ({t.dash.french})</Label>
            <Input value={draft.title_fr} onChange={(e) => setDraft((d) => ({ ...d, title_fr: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.fieldExcerpt} ({t.dash.english})</Label>
            <Textarea value={draft.excerpt_en} onChange={(e) => setDraft((d) => ({ ...d, excerpt_en: e.target.value }))} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.fieldExcerpt} ({t.dash.french})</Label>
            <Textarea value={draft.excerpt_fr} onChange={(e) => setDraft((d) => ({ ...d, excerpt_fr: e.target.value }))} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.fieldBody} ({t.dash.english})</Label>
            <Textarea value={draft.body_en} onChange={(e) => setDraft((d) => ({ ...d, body_en: e.target.value }))} rows={5} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.fieldBody} ({t.dash.french})</Label>
            <Textarea value={draft.body_fr} onChange={(e) => setDraft((d) => ({ ...d, body_fr: e.target.value }))} rows={5} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t.dash.fieldSlug}</Label>
            <Input value={draft.slug} onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.fieldDate}</Label>
            <Input
              type="datetime-local"
              value={toLocalInput(draft.published_at)}
              onChange={(e) => setDraft((d) => ({ ...d, published_at: fromLocalInput(e.target.value) }))}
            />
          </div>
          {kind === "event" && (
            <>
              <div className="space-y-2">
                <Label>{t.common.when}</Label>
                <Input
                  type="datetime-local"
                  value={toLocalInput(draft.event_start || draft.published_at)}
                  onChange={(e) => setDraft((d) => ({ ...d, event_start: fromLocalInput(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.dash.fieldPlace}</Label>
                <Input
                  value={draft.event_location ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, event_location: e.target.value }))}
                />
              </div>
            </>
          )}
        </div>
        <MediaField
          label={t.dash.fieldCover}
          kind="image"
          folder={`posts/${kind}`}
          value={draft.cover_url}
          onChange={(url) => setDraft((d) => ({ ...d, cover_url: url }))}
        />
        <MediaField
          label={t.dash.fieldVideo}
          kind="video"
          folder={`posts/${kind}`}
          value={draft.video_url}
          onChange={(url) => setDraft((d) => ({ ...d, video_url: url }))}
        />
        <div className="flex items-center gap-3">
          <Switch
            checked={draft.published}
            onCheckedChange={(v) => setDraft((d) => ({ ...d, published: v }))}
            id="published"
          />
          <Label htmlFor="published">{draft.published ? t.dash.fieldPublished : t.dash.draft}</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => save.mutate()} disabled={save.isPending || !draft.title_en.trim()}>
            {t.dash.save}
          </Button>
          {(editing || draft.title_en) && (
            <Button type="button" variant="outline" onClick={startNew}>
              {t.dash.cancel}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">{t.common.loading}</p>
      ) : data.length === 0 ? (
        <p className="text-muted-foreground">{t.dash.noItems}</p>
      ) : (
        <ul className="grid gap-3">
          {data.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
              {row.cover_url && <img src={row.cover_url} alt="" className="h-16 w-24 rounded-md object-cover" />}
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold uppercase text-foreground">{row.title_en || row.title_fr}</p>
                <p className="text-sm text-muted-foreground">
                  {row.published ? t.dash.fieldPublished : t.dash.draft}
                  {row.event_location ? ` · ${row.event_location}` : ""}
                </p>
              </div>
              <Button type="button" size="sm" variant="secondary" onClick={() => startEdit(row)}>
                <Pencil className="h-4 w-4" /> {t.dash.edit}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (window.confirm(t.dash.confirmDelete)) remove.mutate(row.id);
                }}
              >
                <Trash2 className="h-4 w-4" /> {t.dash.delete}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function toLocalInput(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}
