"use client";

import { PostsManager } from "@/components/dashboard/posts-manager";
import { useI18n } from "@/i18n";

export default function DashboardEvents() {
  const { t } = useI18n();
  return <PostsManager kind="event" title={t.dash.events} lead={t.posts.eventsLead} />;
}
