import { useState, type ReactNode } from "react";
import { BookDialog, Footer, Nav, SearchDialog } from "./chrome";
import { useGsapReveals, useSmoothScroll } from "./motion";
import { useNotebook, type Notebook } from "./use-notebook";
import { useScrollFx } from "./use-scroll-fx";

/** Shared page frame: sky backdrop, nav, footer, dialogs, smooth scroll and reveals. */
export function Shell({ children }: { children: (book: Notebook) => ReactNode }) {
  const book = useNotebook();
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  useSmoothScroll();
  useScrollFx();
  useGsapReveals();

  return (
    <>
      <div className="sky-backdrop" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
      </div>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav onSearch={() => setSearchOpen(true)} onBook={() => setBookOpen(true)} />
      <main id="main">{children(book)}</main>
      <Footer />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} intentions={book.intentions} />
      <BookDialog open={bookOpen} onOpenChange={setBookOpen} book={book} />
    </>
  );
}

/** Surreal maximalist page header used by every inner page. */
export function PageHero({
  kicker,
  title,
  lede,
  images,
}: {
  kicker: string;
  title: string;
  lede: string;
  images: string[];
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-collage" aria-hidden="true">
        {images.slice(0, 4).map((src, i) => (
          <img key={src + i} src={src} alt="" className={"ph-tile ph-" + i} data-parallax={0.12 + i * 0.08} />
        ))}
      </div>
      <div className="page-hero-copy">
        <p className="kicker">{kicker}</p>
        <h1 className="page-title">{title}</h1>
        <p className="serif-lead">{lede}</p>
      </div>
      <span className="page-hero-word" aria-hidden="true">
        {title}
      </span>
    </section>
  );
}
