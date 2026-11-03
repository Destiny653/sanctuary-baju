"use client";

import { PostsManager } from "@/components/dashboard/posts-manager";
import { useI18n } from "@/i18n";

export default function DashboardLife() {
  const { t } = useI18n();
  return <PostsManager kind="life" title={t.dash.life} lead={t.posts.lifeLead} />;
}
