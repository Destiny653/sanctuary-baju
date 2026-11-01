import * as Dialog from "@radix-ui/react-dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";
import { art } from "@/components/sanctuary/art";
import { galleryQuery } from "@/components/sanctuary/content";
import { SplitText } from "@/components/sanctuary/motion";
import { PageHero, Shell } from "@/components/sanctuary/shell";

const TITLE = "Gallery — Our Lady of Mercy";
const DESC = "Albums of the sanctuary: the Passion of Christ, the rosary mysteries, the people at prayer.";

export const Route = createFileRoute("/gallery")({
  loader: ({ context }) => context.queryClient.ensureQueryData(galleryQuery),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data: albums } = useSuspenseQuery(galleryQuery);
  const [open, setOpen] = useState<{ url: string; caption: string } | null>(null);
  return (
    <Shell>
      {() => (
        <>
          <PageHero
            kicker="Gallery"
            title="Seen in light"
            lede="Every album of the house. Touch a painting to see it whole."
            images={[art.passionCross, art.rosaryGlorious, art.worship, art.evangelSermon]}
          />
          {albums.map((album, ai) => (
            <section key={album.id} className="album band">
              <header className="album-head">
                <span className="album-n">{String(ai + 1).padStart(2, "0")}</span>
                <SplitText text={album.title_en} className="display-lg" />
                {album.description_en && <p className="serif-lead">{album.description_en}</p>}
              </header>
              <div className="masonry">
                {album.images.map((img, i) => (
                  <button
                    type="button"
                    key={img.id}
                    className="masonry-item"
                    data-gsap={i % 3 === 0 ? "zoom" : undefined}
                    onClick={() => setOpen({ url: img.url, caption: img.caption_en })}
                  >
                    <img src={img.url} alt={img.caption_en || album.title_en} loading="lazy" />
                    {img.caption_en && <span>{img.caption_en}</span>}
                  </button>
                ))}
              </div>
            </section>
          ))}
          <Dialog.Root open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
            <Dialog.Portal>
              <Dialog.Overlay className="overlay" />
              <Dialog.Content className="lightbox" aria-describedby={undefined}>
                <Dialog.Title className="sr-only">{open?.caption || "Image"}</Dialog.Title>
                <Dialog.Close className="icon-btn lightbox-close" aria-label="Close">
                  <X strokeWidth={1.6} />
                </Dialog.Close>
                {open && <img src={open.url} alt={open.caption} />}
                {open?.caption && <p>{open.caption}</p>}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </>
      )}
    </Shell>
  );
}
