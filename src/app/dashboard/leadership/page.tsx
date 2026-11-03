"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MediaField } from "@/components/dashboard/media-upload";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";

type Leader = {
  id: string;
  name: string;
  role_en: string;
  role_fr: string;
  bio_en: string;
  bio_fr: string;
  photo_url: string | null;
  sort: number;
};

const blank = (): Omit<Leader, "id"> => ({
  name: "",
  role_en: "",
  role_fr: "",
  bio_en: "",
  bio_fr: "",
  photo_url: null,
  sort: 0,
});

export default function DashboardLeadership() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Leader | null>(null);
  const [draft, setDraft] = useState(blank());

  const { data = [], isLoading } = useQuery({
    queryKey: ["dash", "leaders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leaders").select("*").order("sort");
      if (error) throw error;
      return (data ?? []) as Leader[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...draft, sort: editing?.sort ?? data.length };
      if (editing) {
        const { error } = await supabase.from("leaders").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("leaders").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: async () => {
      toast.success(t.dash.saved);
      setEditing(null);
      setDraft(blank());
      await qc.invalidateQueries({ queryKey: ["dash", "leaders"] });
      await qc.invalidateQueries({ queryKey: ["dash", "counts"] });
    },
    onError: () => toast.error(t.dash.error),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leaders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success(t.dash.deleted);
      await qc.invalidateQueries({ queryKey: ["dash", "leaders"] });
      await qc.invalidateQueries({ queryKey: ["dash", "counts"] });
    },
    onError: () => toast.error(t.dash.error),
  });

  return (
    <>
      <PageHeader
        title={t.dash.leadership}
        lead={t.leadership.lead}
        action={
          <Button
            type="button"
            onClick={() => {
              setEditing(null);
              setDraft(blank());
            }}
          >
            <Plus className="h-4 w-4" /> {t.dash.newItem}
          </Button>
        }
      />
      <div className="mb-8 grid gap-4 rounded-xl border border-border bg-card p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t.dash.fieldName}</Label>
            <Input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
          </div>
          <div className="space-y-2 md:col-span-1" />
          <div className="space-y-2">
            <Label>{t.dash.fieldRole} ({t.dash.english})</Label>
            <Input value={draft.role_en} onChange={(e) => setDraft((d) => ({ ...d, role_en: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.fieldRole} ({t.dash.french})</Label>
            <Input value={draft.role_fr} onChange={(e) => setDraft((d) => ({ ...d, role_fr: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.fieldBio} ({t.dash.english})</Label>
            <Textarea value={draft.bio_en} onChange={(e) => setDraft((d) => ({ ...d, bio_en: e.target.value }))} rows={4} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.fieldBio} ({t.dash.french})</Label>
            <Textarea value={draft.bio_fr} onChange={(e) => setDraft((d) => ({ ...d, bio_fr: e.target.value }))} rows={4} />
          </div>
        </div>
        <MediaField
          label={t.dash.fieldPhoto}
          kind="image"
          folder="leaders"
          value={draft.photo_url}
          onChange={(url) => setDraft((d) => ({ ...d, photo_url: url }))}
        />
        <Button type="button" onClick={() => save.mutate()} disabled={!draft.name.trim() || save.isPending}>
          {t.dash.save}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">{t.common.loading}</p>
      ) : data.length === 0 ? (
        <p className="text-muted-foreground">{t.dash.noItems}</p>
      ) : (
        <ul className="grid gap-3">
          {data.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
              {row.photo_url && <img src={row.photo_url} alt="" className="h-16 w-16 rounded-full object-cover" />}
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold uppercase">{row.name}</p>
                <p className="text-sm text-muted-foreground">{row.role_en || row.role_fr}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  setEditing(row);
                  setDraft({ ...row });
                }}
              >
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
