import { createFileRoute } from "@tanstack/react-router";
import { PostsManager } from "@/components/dashboard/posts-manager";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/_authenticated/dashboard/life")({
  component: DashboardLife,
});

function DashboardLife() {
  const { t } = useI18n();
  return <PostsManager kind="life" title={t.dash.life} lead={t.posts.lifeLead} />;
}
