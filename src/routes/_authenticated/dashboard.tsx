import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {

  ExternalLink,

  LayoutDashboard,
  LogOut,





} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Our Lady of Mercy" },
      { name: "description", content: "Manage news, events, sanctuary life and the gallery." },
      { property: "og:title", content: "Dashboard — Our Lady of Mercy" },
      { property: "og:description", content: "Manage news, events, sanctuary life and the gallery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const { t } = useI18n();
  const { data: staff, isLoading } = useStaff();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const path = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }


  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1.5">
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
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={path === "/dashboard"} tooltip={t.dash.overview}>
                    <Link to="/dashboard">
                      <LayoutDashboard /> <span>{t.dash.overview}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t.dash.viewSite}>
                <Link to="/">
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
          <div className="ml-auto">
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
            <Outlet />
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
