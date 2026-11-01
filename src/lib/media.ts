import { supabase } from "@/integrations/supabase/client";

export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export function isVideoFile(file: File) {
  return file.type.startsWith("video/");
}

export function isVideoUrl(url: string | null | undefined) {
  return !!url && /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url);
}

/**
 * Uploads a file to the private "media" bucket and returns a long-lived signed URL.
 * The bucket stays private (workspace policy), so the public site reads media through
 * the stored signed URL.
 */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("too_large");
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    ...(file.type ? { contentType: file.type } : {}),
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signError } = await supabase.storage.from("media").createSignedUrl(path, TEN_YEARS);
  if (signError || !data) throw signError ?? new Error("sign_failed");
  return data.signedUrl;
}
