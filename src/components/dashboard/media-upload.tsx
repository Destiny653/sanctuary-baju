import { useRef, useState } from "react";
import { Film, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { MAX_UPLOAD_BYTES, uploadMedia } from "@/lib/media";
import { Button } from "@/components/ui/button";

/** Single media field: shows a preview and uploads one image or video. */
export function MediaField({
  value,
  onChange,
  kind,
  folder,
  label,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  kind: "image" | "video";
  folder: string;
  label: string;
}) {
  const { t } = useI18n();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function pickFile(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(t.dash.tooLarge);
      return;
    }
    setBusy(true);
    try {
      onChange(await uploadMedia(file, folder));
    } catch {
      toast.error(t.dash.error);
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-center gap-4 rounded-lg border border-dashed border-border bg-muted/40 p-3">
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
          {value ? (
            kind === "video" ? (
              <video src={value} className="h-full w-full object-cover" muted preload="metadata" />
            ) : (
              <img src={value} alt="" className="h-full w-full object-cover" />
            )
          ) : kind === "video" ? (
            <Film className="h-6 w-6 text-muted-foreground" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={() => ref.current?.click()}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {busy ? t.dash.uploading : value ? t.dash.replace : kind === "video" ? t.dash.uploadVideo : t.dash.upload}
          </Button>
          {value && !busy && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
              <X className="h-4 w-4" /> {t.common.remove}
            </Button>
          )}
        </div>
        <input
          ref={ref}
          type="file"
          hidden
          accept={kind === "video" ? "video/*" : "image/*"}
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
