import { createFileRoute } from "@tanstack/react-router";
import { PostsManager } from "@/components/dashboard/posts-manager";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/_authenticated/dashboard/news")({
  component: DashboardNews,
});

function DashboardNews() {
  const { t } = useI18n();
  return <PostsManager kind="news" title={t.dash.news} lead={t.posts.newsLead} />;
}
