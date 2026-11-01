import * as Dialog from "@radix-ui/react-dialog";
import { Menu, Search, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { corpus, places } from "./data";
import type { Notebook } from "./use-notebook";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/locations", label: "Locations" },
  { href: "/contact", label: "Contact" },
] as const;


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

export function Nav({
  onSearch,
  onBook,
}: {
  onSearch: () => void;
  onBook: () => void;
}) {
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
        {LINKS.map((link) => (
          <Link key={link.href} to={link.href} activeOptions={{ exact: true }} activeProps={{ className: "is-current" }}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="nav-tools">
        <button type="button" className="search-pill" onClick={onSearch}>
          <span>Search</span>
          <Search strokeWidth={1.6} />
        </button>
        <button type="button" className="icon-btn" onClick={onBook} aria-label="Your notebook">
          <UserRound strokeWidth={1.6} />
        </button>
        <button
          type="button"
          className="icon-btn menu-btn"
          aria-label="Open menu"
          onClick={() => setMenu(true)}
        >
          <Menu strokeWidth={1.6} />
        </button>
      </div>
      <Dialog.Root open={menu} onOpenChange={setMenu}>
        <Dialog.Portal>
          <Dialog.Overlay className="overlay" />
          <Dialog.Content className="menu-sheet" aria-describedby={undefined}>
            <Dialog.Title className="sr-only">Menu</Dialog.Title>
            <Dialog.Close className="icon-btn menu-close" aria-label="Close menu">
              <X strokeWidth={1.6} />
            </Dialog.Close>
            <nav className="menu-links" aria-label="Mobile">
              {LINKS.map((link) => (
                <Link key={link.href} to={link.href} activeOptions={{ exact: true }} activeProps={{ className: "is-current" }}
                  onClick={() => setMenu(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
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
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const ROUTE_OF: Record<string, "/" | "/locations" | "/contact" | "/gallery" | "/news" | "/events"> = {
    locations: "/locations",
    contact: "/contact",
    intentions: "/contact",
    gallery: "/gallery",
    news: "/news",
    events: "/events",
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
        title: item.name || "An intention",
        text: item.text,
      })),
    ];
    if (!q) return base.slice(0, 8);
    return base.filter((item) => (item.title + " " + item.text).toLowerCase().includes(q)).slice(0, 8);
  }, [query, intentions]);

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
            <Dialog.Description className="kicker">Search the house</Dialog.Description>
            <Dialog.Close className="icon-btn is-ink" aria-label="Close search">
              <X strokeWidth={1.6} />
            </Dialog.Close>
          </div>
          <Dialog.Title className="sr-only">Search</Dialog.Title>
          <input
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Chapel, vespers, gate"
            autoFocus
          />
          <ul className="search-results">
            {results.length === 0 && <li className="empty-note">Nothing under that name.</li>}
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
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="book-sheet">
          <div className="sheet-top">
            <div>
              <Dialog.Description className="kicker">On this device</Dialog.Description>
              <Dialog.Title className="sheet-title">Your notebook</Dialog.Title>
            </div>
            <Dialog.Close className="icon-btn is-ink" aria-label="Close notebook">
              <X strokeWidth={1.6} />
            </Dialog.Close>
          </div>
          <section className="book-block">
            <h3>Intentions</h3>
            {book.intentions.length === 0 && (
              <p className="empty-note">Nothing written yet. The book in the nave is open.</p>
            )}
            <ul className="book-list">
              {book.intentions.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name || "A pilgrim"}</strong>
                    <p>{item.text}</p>
                  </div>
                  <button type="button" onClick={() => book.removeIntention(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="book-block">
            <h3>Word sent to the gate</h3>
            {book.visits.length === 0 && (
              <p className="empty-note">No visit noted. The door does not require one.</p>
            )}
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
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Mark className="mark" />
        <p>Sanctuary of Our Lady of Mercy</p>
      </div>
      <nav aria-label="Footer">
        {LINKS.map((link) => (
          <Link key={link.href} to={link.href} activeOptions={{ exact: true }} activeProps={{ className: "is-current" }}>
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="footer-note">
        Stillwater, north garden. Open every day. The afternoon of Good Friday is kept for the liturgy alone.
        The house keeps no shop.
      </p>
    </footer>
  );
}
