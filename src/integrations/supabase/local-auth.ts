/**
 * Local/dev auth — used on localhost so the dashboard works without cloud auth.
 * Credentials: sanctuary@gmail.com / sanctuary123
 */
import type { User } from "@supabase/supabase-js";

const STORAGE_KEY = "olm-local-auth";

export const LOCAL_AUTH_EMAIL = "sanctuary@gmail.com";
export const LOCAL_AUTH_PASSWORD = "sanctuary123";

const LOCAL_USER_ID = "00000000-0000-4000-8000-000000000001";

export function isLocalAuthEnabled() {
  if (typeof window === "undefined") return false;
  const flag =
    process.env["NEXT_PUBLIC_LOCAL_AUTH"] ?? process.env["VITE_LOCAL_AUTH"];
  if (flag === "true") return true;
  if (flag === "false") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0";
}

function buildLocalUser(email: string): User {
  const now = new Date().toISOString();
  return {
    id: LOCAL_USER_ID,
    app_metadata: { provider: "local", providers: ["local"] },
    user_metadata: { display_name: "Sanctuary Staff", role: "admin" },
    aud: "authenticated",
    created_at: now,
    updated_at: now,
    email,
    email_confirmed_at: now,
    phone: "",
    confirmed_at: now,
    last_sign_in_at: now,
    role: "authenticated",
    identities: [],
    is_anonymous: false,
    factors: [],
  } as User;
}

export function getLocalUser(): User | null {
  if (typeof window === "undefined" || !isLocalAuthEnabled()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email?: string; at?: number };
    if (!parsed.email) return null;
    return buildLocalUser(parsed.email);
  } catch {
    return null;
  }
}

export function signInLocal(email: string, password: string): { user: User } | { error: string } {
  const normalized = email.trim().toLowerCase();
  if (normalized !== LOCAL_AUTH_EMAIL || password !== LOCAL_AUTH_PASSWORD) {
    return { error: "invalid" };
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: LOCAL_AUTH_EMAIL, at: Date.now() }));
  return { user: buildLocalUser(LOCAL_AUTH_EMAIL) };
}

export function signOutLocal() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function localStaffInfo(user: User) {
  return {
    userId: user.id,
    email: user.email ?? LOCAL_AUTH_EMAIL,
    roles: ["admin", "editor"] as ("admin" | "editor")[],
    isStaff: true,
    isAdmin: true,
  };
}
