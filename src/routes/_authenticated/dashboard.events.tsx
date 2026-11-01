import { createFileRoute } from "@tanstack/react-router";
import { PostsManager } from "@/components/dashboard/posts-manager";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/_authenticated/dashboard/events")({
  component: DashboardEvents,
});

function DashboardEvents() {
  const { t } = useI18n();
  return <PostsManager kind="event" title={t.dash.events} lead={t.posts.eventsLead} />;
}
