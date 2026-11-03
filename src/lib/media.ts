export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;

export function isVideoFile(file: File) {
  return file.type.startsWith("video/");
}

export function isVideoUrl(url: string | null | undefined) {
  return !!url && /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url);
}

/**
 * Uploads a file into public/assets/{folder}/ and returns a path under /assets/...
 * for immediate local preview.
 */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("too_large");
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("upload_failed");
  const data = (await res.json()) as { url?: string };
  if (!data.url) throw new Error("upload_failed");
  return data.url;
}
