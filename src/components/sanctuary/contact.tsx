import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { art } from "./art";
import type { Notebook } from "./use-notebook";

const delay = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as CSSProperties;

export function ContactCompose() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      if (error) throw error;
      setStatus("sent");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="contact-stage band band-snow" id="write">
      <div className="contact-compose">
        <aside className="contact-aside" data-reveal>
          <figure className="contact-figure glass-frame">
            <img src={art.hands} alt="" loading="lazy" />
            <figcaption>{t.contact.detailsTitle}</figcaption>
          </figure>

          <div className="contact-detail-panel">
            <p className="kicker">{t.contact.kicker}</p>
            <h2 className="display-md">{t.contact.detailsTitle}</h2>
            <ul className="contact-detail-list">
              <li>
                <span className="contact-detail-icon" aria-hidden="true">
                  <MapPin strokeWidth={1.5} />
                </span>
                <div>
                  <strong>{t.pages.contactFind}</strong>
                  <p>{t.contact.address}</p>
                </div>
              </li>
              <li>
                <span className="contact-detail-icon" aria-hidden="true">
                  <Clock strokeWidth={1.5} />
                </span>
                <div>
                  <strong>{t.pages.contactOpen}</strong>
                  <p>{t.contact.hoursLine}</p>
                </div>
              </li>
              <li>
                <span className="contact-detail-icon" aria-hidden="true">
                  <Phone strokeWidth={1.5} />
                </span>
                <div>
                  <strong>{t.contact.phoneLabel}</strong>
                  <p>
                    <a href={`tel:${t.contact.phone.replace(/\s+/g, "")}`}>{t.contact.phone}</a>
                  </p>
                </div>
              </li>
              <li>
                <span className="contact-detail-icon" aria-hidden="true">
                  <Mail strokeWidth={1.5} />
                </span>
                <div>
                  <strong>{t.contact.emailLabel}</strong>
                  <p>
                    <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
                  </p>
                </div>
              </li>
            </ul>
            <Link className="contact-map-link" href="/locations">
              {t.contact.directions}
            </Link>
          </div>
        </aside>

        <div className="contact-form-panel glass" data-reveal style={delay(100)}>
          {status === "sent" ? (
            <div className="contact-form-done">
              <p className="kicker">{t.contact.kicker}</p>
              <h2 className="display-md">{t.contact.formTitle}</h2>
              <p className="serif-lead">{t.contact.sent}</p>
              <button className="pill" type="button" onClick={() => setStatus("idle")}>
                {t.contact.again}
              </button>
            </div>
          ) : (
            <>
              <p className="kicker">{t.contact.kicker}</p>
              <h2 className="display-md">{t.contact.formTitle}</h2>
              <p className="serif-lead contact-form-lead">{t.contact.formLead}</p>
              <form className="stack-form contact-message-form" onSubmit={onSubmit}>
                <div className="contact-form-row">
                  <label>
                    {t.contact.name}
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      maxLength={80}
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    {t.contact.yourEmail}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      maxLength={120}
                      autoComplete="email"
                    />
                  </label>
                </div>
                <label>
                  {t.contact.subject}
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    maxLength={120}
                  />
                </label>
                <label>
                  {t.contact.message}
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    maxLength={2000}
                    rows={6}
                  />
                </label>
                {status === "error" && <p className="form-error">{t.contact.sendFailed}</p>}
                <button className="pill" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? t.contact.sending : t.contact.sendMessage}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function ContactVisit({ book }: { book: Notebook }) {
  const { t } = useI18n();
  const parties = t.contact.parties;
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [party, setParty] = useState(parties[0] ?? "1");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <section className="contact-visit band band-sky" id="contact">
        <div className="contact-visit-done glass" data-reveal>
          <p className="kicker">{t.contact.visitTitle}</p>
          <h2 className="display-lg">{t.contact.doneTitle}</h2>
          <p className="serif-lead">{t.contact.doneLead}</p>
          <p className="body-copy">{t.contact.savedNote}</p>
          <button className="pill pill-ink" type="button" onClick={() => setSent(false)}>
            {t.contact.again}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-visit band band-sky" id="contact">
      <div className="visit-grid">
        <div data-reveal>
          <p className="kicker">{t.contact.visitTitle}</p>
          <h2 className="display-lg">{t.contact.title}</h2>
          <p className="serif-lead">{t.contact.lead}</p>
          <p className="body-copy">{t.contact.savedNote}</p>
        </div>
        <form
          className="stack-form glass contact-visit-form"
          data-reveal
          style={delay(120)}
          onSubmit={(event) => {
            event.preventDefault();
            book.addVisit({
              name: name.trim(),
              day,
              party,
              note: note.trim(),
            });
            setSent(true);
            setName("");
            setDay("");
            setParty(parties[0] ?? "1");
            setNote("");
          }}
        >
          <div className="contact-form-row">
            <label>
              {t.contact.name}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={80}
                autoComplete="name"
              />
            </label>
            <label>
              {t.contact.day}
              <input type="date" value={day} onChange={(e) => setDay(e.target.value)} required />
            </label>
          </div>
          <label>
            {t.contact.party}
            <select value={party} onChange={(e) => setParty(e.target.value)}>
              {parties.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            {t.contact.note}
            <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={240} rows={3} />
          </label>
          <button className="pill pill-ink" type="submit">
            {t.contact.send}
          </button>
        </form>
      </div>
    </section>
  );
}
