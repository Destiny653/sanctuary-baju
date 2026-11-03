"use client";

import { PostsManager } from "@/components/dashboard/posts-manager";
import { useI18n } from "@/i18n";

export default function DashboardNews() {
  const { t } = useI18n();
  return <PostsManager kind="news" title={t.dash.news} lead={t.posts.newsLead} />;
}
