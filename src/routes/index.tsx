import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/sanctuary/home";
import { postsQuery } from "@/components/sanctuary/content";

const TITLE = "Our Lady of Mercy — Mary, the Passion and the Gospel";
const DESCRIPTION =
  "Sanctuary of Our Lady of Mercy: the Virgin, the seven paintings of Christ's Passion, His ministry and the mysteries of the rosary.";

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(postsQuery("news")),
      context.queryClient.ensureQueryData(postsQuery("event")),
    ]),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});
