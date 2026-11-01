import * as Dialog from "@radix-ui/react-dialog";
import { Menu, Search, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LangSwitch, useI18n } from "@/i18n";
import { corpus, places } from "./data";
import type { Notebook } from "./use-notebook";

function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M8 34V16.5L24 28.5L40 16.5V34"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M24 8.2l1.3 3.2 3.2 1.3-3.2 1.3L24 17.2l-1.3-3.2-3.2-1.3 3.2-1.3L24 8.2z"
        fill="currentColor"
      />
    </svg>
  );
}

function scrollToId(id: string) {
  const node = document.getElementById(id);
  if (!node) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

function useNavLinks() {
  const { t } = useI18n();
  return [
    { href: "/" as const, label: t.nav.home },
    { href: "/about" as const, label: t.nav.about },
    { href: "/leadership" as const, label: t.nav.leadership },
    { href: "/gallery" as const, label: t.nav.gallery },
    { href: "/news" as const, label: t.nav.news },
    { href: "/events" as const, label: t.nav.events },
    { href: "/locations" as const, label: t.nav.locations },
    { href: "/contact" as const, label: t.nav.contact },
  ];
}

export function Nav({
  onSearch,
  onBook,
}: {
  onSearch: () => void;
  onBook: () => void;
}) {
  const { t } = useI18n();
  const links = useNavLinks();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"site-nav" + (scrolled ? " is-scrolled" : "")}>
      <Link className="brand" to="/">
        <Mark className="mark" />
        <span>Mercy</span>
      </Link>
      <nav className="desk-nav" aria-label="Primary">
        {links.map((link) => (
          <Link key={link.href} to={link.href} activeOptions={{ exact: true }} activeProps={{ className: "is-current" }}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="nav-tools">
        <LangSwitch />
        <button type="button" className="search-pill" onClick={onSearch}>
          <span>{t.nav.search}</span>
          <Search strokeWidth={1.6} />
        </button>
        <button type="button" className="icon-btn" onClick={onBook} aria-label={t.nav.notebook}>
          <UserRound strokeWidth={1.6} />
        </button>
        <button
          type="button"
          className="icon-btn menu-btn"
          aria-label={t.nav.menu}
          onClick={() => setMenu(true)}
        >
          <Menu strokeWidth={1.6} />
        </button>
      </div>
      <Dialog.Root open={menu} onOpenChange={setMenu}>
        <Dialog.Portal>
          <Dialog.Overlay className="overlay" />
          <Dialog.Content className="menu-sheet" aria-describedby={undefined}>
            <Dialog.Title className="sr-only">{t.nav.menu}</Dialog.Title>
            <Dialog.Close className="icon-btn menu-close" aria-label={t.nav.closeMenu}>
              <X strokeWidth={1.6} />
            </Dialog.Close>
            <nav className="menu-links" aria-label="Mobile">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  activeOptions={{ exact: true }}
                  activeProps={{ className: "is-current" }}
                  onClick={() => setMenu(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8">
              <LangSwitch />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}

export function SearchDialog({
  open,
  onOpenChange,
  intentions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intentions: Notebook["intentions"];
}) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const ROUTE_OF: Record<
    string,
    "/" | "/locations" | "/contact" | "/gallery" | "/news" | "/events" | "/about" | "/leadership"
  > = {
    locations: "/locations",
    contact: "/contact",
    intentions: "/contact",
    gallery: "/gallery",
    news: "/news",
    events: "/events",
    about: "/about",
    leadership: "/leadership",
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = [
      ...corpus,
      ...places.map((place) => ({
        id: "locations",
        title: place.name,
        text: place.text,
      })),
      ...intentions.map((item) => ({
        id: "intentions",
        title: item.name || t.common.pilgrim,
        text: item.text,
      })),
    ];
    if (!q) return base.slice(0, 8);
    return base.filter((item) => (item.title + " " + item.text).toLowerCase().includes(q)).slice(0, 8);
  }, [query, intentions, t.common.pilgrim]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) setQuery("");
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="search-sheet">
          <div className="sheet-top">
            <Dialog.Description className="kicker">{t.search.kicker}</Dialog.Description>
            <Dialog.Close className="icon-btn is-ink" aria-label={t.search.close}>
              <X strokeWidth={1.6} />
            </Dialog.Close>
          </div>
          <Dialog.Title className="sr-only">{t.nav.search}</Dialog.Title>
          <input
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search.placeholder}
            autoFocus
          />
          <ul className="search-results">
            {results.length === 0 && <li className="empty-note">{t.search.empty}</li>}
            {results.map((item, i) => (
              <li key={item.title + item.text + i}>
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    setQuery("");
                    const to = ROUTE_OF[item.id] ?? "/";
                    void navigate({ to }).then(() => window.setTimeout(() => scrollToId(item.id), 120));
                  }}
                >
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function BookDialog({
  open,
  onOpenChange,
  book,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Notebook;
}) {
  const { t } = useI18n();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="book-sheet">
          <div className="sheet-top">
            <div>
              <Dialog.Description className="kicker">{t.book.kicker}</Dialog.Description>
              <Dialog.Title className="sheet-title">{t.book.title}</Dialog.Title>
            </div>
            <Dialog.Close className="icon-btn is-ink" aria-label={t.book.close}>
              <X strokeWidth={1.6} />
            </Dialog.Close>
          </div>
          <section className="book-block">
            <h3>{t.book.intentions}</h3>
            {book.intentions.length === 0 && <p className="empty-note">{t.book.noIntentions}</p>}
            <ul className="book-list">
              {book.intentions.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name || t.common.pilgrim}</strong>
                    <p>{item.text}</p>
                  </div>
                  <button type="button" onClick={() => book.removeIntention(item.id)}>
                    {t.common.remove}
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="book-block">
            <h3>{t.book.visits}</h3>
            {book.visits.length === 0 && <p className="empty-note">{t.book.noVisits}</p>}
            <ul className="book-list">
              {book.visits.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>
                      {item.name} · {item.day}
                    </strong>
                    <p>
                      {item.party}
                      {item.note ? ` — ${item.note}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link className="footer-brand-link" to="/">
            <Mark className="mark" />
            <span>{t.footer.name}</span>
          </Link>
          <p className="footer-tagline">{t.footer.tagline}</p>
          <p className="footer-note">{t.footer.note}</p>
        </div>

        <div className="footer-cols">
          <nav className="footer-col" aria-label={t.footer.explore}>
            <h3>{t.footer.explore}</h3>
            <Link to="/" activeOptions={{ exact: true }}>
              {t.nav.home}
            </Link>
            <Link to="/about">{t.nav.about}</Link>
            <Link to="/gallery">{t.nav.gallery}</Link>
            <Link to="/news">{t.nav.news}</Link>
            <Link to="/events">{t.nav.events}</Link>
          </nav>

          <nav className="footer-col" aria-label={t.footer.visit}>
            <h3>{t.footer.visit}</h3>
            <Link to="/locations">{t.nav.locations}</Link>
            <Link to="/contact">{t.nav.contact}</Link>
            <p className="footer-meta">
              <span>{t.footer.hours}</span>
              {t.footer.hoursText}
            </p>
          </nav>

          <nav className="footer-col" aria-label={t.footer.administration}>
            <h3>{t.footer.administration}</h3>
            <Link to="/leadership">{t.nav.leadership}</Link>
            <Link to="/auth" className="footer-staff">
              {t.footer.staff}
            </Link>
            <p className="footer-meta">{t.footer.staffLead}</p>
          </nav>

          <div className="footer-col footer-contact">
            <h3>{t.footer.contactTitle}</h3>
            <p className="footer-meta">{t.footer.place}</p>
            <Link className="footer-cta" to="/contact">
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {year} {t.footer.name}. {t.footer.rights}
        </p>
        <p>{t.footer.place}</p>
      </div>
    </footer>
  );
}
