/** On-device posts store — dashboard CRUD and public homepage reads share this key. */
const KEY = "olm-posts";

export type StoredPost = {
  id: string;
  kind: "news" | "event" | "life" | string;
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

function canUseStorage() {
  return typeof localStorage !== "undefined";
}

/** True once the store key exists (even as `[]`), so deletes are not re-imported from cloud. */
export function hasLocalPostsStore() {
  return canUseStorage() && localStorage.getItem(KEY) !== null;
}

function readAll(): StoredPost[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((row): row is StoredPost => !!row && typeof row === "object" && typeof row.id === "string");
  } catch {
    return [];
  }
}

function writeAll(rows: StoredPost[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export function listStoredPosts(kind?: string): StoredPost[] {
  const rows = readAll();
  const filtered = kind ? rows.filter((r) => r.kind === kind) : rows;
  return filtered.sort((a, b) => {
    const aKey = a.kind === "event" ? a.event_start || a.published_at : a.published_at;
    const bKey = b.kind === "event" ? b.event_start || b.published_at : b.published_at;
    return a.kind === "event" ? aKey.localeCompare(bKey) : bKey.localeCompare(aKey);
  });
}

export function listPublishedPosts(kind: "news" | "event" | "life" | "all"): StoredPost[] {
  const rows = listStoredPosts(kind === "all" ? undefined : kind).filter((r) => r.published);
  if (kind === "event") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return rows
      .filter((r) => r.event_start && new Date(r.event_start).getTime() >= start.getTime())
      .sort((a, b) => (a.event_start || "").localeCompare(b.event_start || ""));
  }
  return rows.sort((a, b) => b.published_at.localeCompare(a.published_at));
}

export function upsertStoredPost(post: StoredPost) {
  const rows = readAll();
  const i = rows.findIndex((r) => r.id === post.id);
  if (i >= 0) rows[i] = post;
  else rows.unshift(post);
  writeAll(rows);
  return post;
}

export function deleteStoredPost(id: string) {
  writeAll(readAll().filter((r) => r.id !== id));
}

/** Import remote rows once so seeded cloud content becomes editable locally. */
export function mergeRemoteIntoStore(remote: StoredPost[]) {
  if (!remote.length) return listStoredPosts();
  const rows = readAll();
  const byId = new Map(rows.map((r) => [r.id, r]));
  let changed = false;
  for (const row of remote) {
    if (!byId.has(row.id)) {
      byId.set(row.id, row);
      changed = true;
    }
  }
  if (changed) writeAll([...byId.values()]);
  return [...byId.values()];
}

export function newPostId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
