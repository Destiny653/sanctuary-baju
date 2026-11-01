import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getLocalUser, isLocalAuthEnabled, signInLocal } from "@/integrations/supabase/local-auth";
import { LangSwitch, useI18n } from "@/i18n";
import { art } from "@/components/sanctuary/art";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff sign in — Our Lady of Mercy" },
      { name: "description", content: "Sign in to manage news, events and the gallery of the sanctuary." },
      { property: "og:title", content: "Staff sign in — Our Lady of Mercy" },
      { property: "og:description", content: "Sign in to manage news, events and the gallery of the sanctuary." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (getLocalUser()) {
      navigate({ to: "/dashboard", replace: true });
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/dashboard", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        if (isLocalAuthEnabled()) {
          const local = signInLocal(email, password);
          if ("error" in local) throw new Error(local.error);
          navigate({ to: "/dashboard", replace: true });
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        if (isLocalAuthEnabled()) {
          toast.error(t.auth.failed);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/dashboard", data: { display_name: name } },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success(t.auth.checkEmail);
          setMode("in");
        }
      }
    } catch {
      toast.error(t.auth.failed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={art.mountains} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-primary-foreground">
          <p className="font-display text-sm uppercase tracking-[0.3em]">Our Lady of Mercy</p>
          <p className="mt-3 font-serif text-3xl leading-tight">{t.auth.lead}</p>
        </div>
      </div>
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> {t.auth.backToSite}
          </Link>
          <LangSwitch />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-foreground">
            {mode === "in" ? t.auth.title : t.auth.signUp}
          </h1>
          <p className="mt-2 text-muted-foreground">{t.auth.lead}</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "up" && (
              <div className="space-y-2">
                <Label htmlFor="name">{t.auth.name}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "in" ? "current-password" : "new-password"}
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {mode === "in" ? t.auth.signIn : t.auth.signUp}
            </Button>
          </form>
          {!isLocalAuthEnabled() && (
            <button
              type="button"
              className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              onClick={() => setMode(mode === "in" ? "up" : "in")}
            >
              {mode === "in" ? t.auth.noAccount : t.auth.haveAccount}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
