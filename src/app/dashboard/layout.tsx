"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPinned,
  Newspaper,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getLocalUser } from "@/integrations/supabase/local-auth";
import { LangSwitch, useI18n } from "@/i18n";
import { useStaff } from "@/components/dashboard/use-staff";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const { data: staff, isLoading } = useStaff();
  const router = useRouter();
  const qc = useQueryClient();
  const path = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function gate() {
      if (getLocalUser()) {
        if (!cancelled) setReady(true);
        return;
      }
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/auth");
        return;
      }
      if (!cancelled) setReady(true);
    }
    void gate();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    const { signOutLocal } = await import("@/integrations/supabase/local-auth");
    signOutLocal();
    await supabase.auth.signOut().catch(() => undefined);
    router.replace("/auth");
  }

  const items = [
    { to: "/dashboard", label: t.dash.overview, icon: LayoutDashboard, exact: true },
    { to: "/dashboard/news", label: t.dash.news, icon: Newspaper },
    { to: "/dashboard/events", label: t.dash.events, icon: CalendarDays },
    { to: "/dashboard/life", label: t.dash.life, icon: Sparkles },
    { to: "/dashboard/gallery", label: t.dash.gallery, icon: Images },
    { to: "/dashboard/leadership", label: t.dash.leadership, icon: Users },
    { to: "/dashboard/about", label: t.dash.about, icon: BookOpen },
    { to: "/dashboard/messages", label: t.dash.messages, icon: Mail },
    { to: "/dashboard/settings", label: t.dash.settings, icon: MapPinned },
  ];

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        {t.common.loading}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-display text-lg font-bold text-primary-foreground">
              M
            </span>
            <span className="font-display text-lg font-bold uppercase tracking-widest text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Mercy
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const active = item.exact ? path === item.to : path.startsWith(item.to);
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link href={item.to}>
                          <item.icon /> <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t.dash.viewSite}>
                <Link href="/">
                  <ExternalLink /> <span>{t.dash.viewSite}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut} tooltip={t.dash.signOut}>
                <LogOut /> <span>{t.dash.signOut}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur">
          <SidebarTrigger />
          <span className="text-sm text-muted-foreground">
            {t.dash.signedInAs} <b className="text-foreground">{staff?.email}</b>
          </span>
          <div className="ml-auto dash-lang">
            <LangSwitch />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          {isLoading ? (
            <p className="text-muted-foreground">{t.common.loading}</p>
          ) : !staff?.isStaff ? (
            <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8 text-center">
              <h1 className="font-display text-3xl font-bold uppercase text-foreground">{t.dash.pendingTitle}</h1>
              <p className="mt-3 text-muted-foreground">{t.dash.pendingText}</p>
              <Button variant="outline" className="mt-6" onClick={signOut}>
                {t.dash.signOut}
              </Button>
            </div>
          ) : (
            children
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
