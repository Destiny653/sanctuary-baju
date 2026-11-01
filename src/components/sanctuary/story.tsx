import { art } from "./art";
import { useState, type CSSProperties } from "react";
import { places } from "./data";
import { MaryFigure } from "./mary";
import { Petals, Shards } from "./shards";
import type { Notebook } from "./use-notebook";
import InfiniteSpiral from "../InfiniteSpiral";
import { useI18n } from "@/i18n";

const delay = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as CSSProperties;

export function About() {
  const { t } = useI18n();
  return (
    <section className="about band band-snow" id="about" data-scroll>
      <p className="drift-word" aria-hidden="true">
        Sanctuary
      </p>
      <div className="about-grid">
        <div>
          <p className="kicker" data-reveal>
            {t.about.kicker}
          </p>
          <h2 className="display-lg" data-reveal style={delay(80)}>
            {t.about.title}
          </h2>
          <p className="serif-lead" data-reveal style={delay(160)}>
            {t.about.lead}
          </p>
          <p className="body-copy" data-reveal style={delay(240)}>
            {t.about.body}
          </p>
          <blockquote className="pull" data-reveal style={delay(320)}>
            {t.about.quote}
          </blockquote>
        </div>
        <figure className="about-figure glass-frame" data-reveal style={delay(120)}>
          <img src={art.sanctuary} alt={t.about.figureAlt} loading="lazy" />
          <figcaption>{t.about.figureCaption}</figcaption>
        </figure>
      </div>
      <ol className="hours">
        {t.about.hours.map((hour, i) => (
          <li key={hour.time} className="glass" data-reveal style={delay(i * 90)}>
            <span className="hours-time">{hour.time}</span>
            <span className="hours-name">{hour.name}</span>
            <span className="hours-note">{hour.note}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Tall scroll scene: the word grows while carved figures drift through it. */
export function Interlude() {
  const { t } = useI18n();
  return (
    <section className="interlude band-sky" id="mercy" data-scroll="sticky" aria-label={t.home.interludeWord}>
      <div className="interlude-stage">
        <h2 className="interlude-word" aria-hidden="true">
          {t.home.interludeWord}
        </h2>
        <img className="fly fly-a" src={art.face} alt="" loading="lazy" />
        <img className="fly fly-b" src={art.hands} alt="" loading="lazy" />
        <img className="fly fly-c" src={art.angels} alt="" loading="lazy" />
        <p className="interlude-note">{t.home.interludeNote}</p>
      </div>
    </section>
  );
}

export function Way() {
  return (
    <section className="way band-snow" id="way" data-scroll>
      <img className="fill ken" src={art.hills} alt="" loading="lazy" />
      <div className="way-shade" />
      <Shards />
      <div className="way-copy glass" data-reveal>
        <p className="kicker">The north garden</p>
        <h2 className="display-lg">He carried it</h2>
        <p className="serif-lead">
          The stations climb the hill on a red-earth path between banana and palm. Christ is there,
          carved life-size, the cross on the shoulder. People begin on their feet. Nothing requires
          them to kneel.
        </p>
      </div>
      <img
        className="way-figure para"
        src={art.christ}
        alt="Carved figure of Christ as an African man carrying the cross"
        loading="lazy"
      />
      <figure className="way-crowd">
        <img
          src={art.worship}
          alt="The congregation standing in the chapel in white and sky-blue cloth, seen from behind"
          loading="lazy"
        />
      </figure>
    </section>
  );
}

const MYSTERY_NAMES = [
  "Annunciation",
  "Visitation",
  "Nativity",
  "Presentation_in_the_Temple",
  "Finding_of_Jesus_in_the_Temple",
  "Baptism_of_Jesus",
  "Wedding_at_Cana",
  "Proclamation_of_the_Kingdom",
  "Transfiguration",
  "Institution_of_the_Eucharist",
  "Agony_in_the_Garden",
  "Scourging_at_the_Pillar",
  "Crowning_with_Thorns",
  "Carrying_of_the_Cross",
  "Crucifixion",
  "Resurrection",
  "Ascension",
  "Descent_of_the_Holy_Spirit",
  "Assumption_of_Mary",
  "Coronation_of_Mary",
] as const;

const MYSTERY_IMAGES: { src: string; alt: string }[] = MYSTERY_NAMES.map((name, i) => {
  const num = String(i + 1).padStart(2, "0");
  return {
    src: `/assets/mysteries/${num}_${name}.png`,
    alt: name.replace(/_/g, " "),
  };
});

function DescentCopy() {
  const { t } = useI18n();
  return (
    <div className="descent-copy glass" data-reveal>
      <p className="kicker">{t.home.weaponKicker}</p>
      <h2 className="display-lg">{t.home.weaponTitle}</h2>
      <p className="body-copy">
        <em>{t.home.weaponQuote1}</em>
        <br />
        <span className="cite">{t.home.weaponCite1}</span>
      </p>
      <p className="body-copy">{t.home.weaponBody}</p>
      <p className="body-copy">
        <em>{t.home.weaponQuote2}</em>
        <br />
        <span className="cite">{t.home.weaponCite2}</span>
      </p>
    </div>
  );
}

export function Descent() {
  const { t } = useI18n();
  return (
    <section className="descent band-sky" id="descent" data-scroll>
      <img className="fill ken" src={art.heaven} alt="" loading="lazy" />
      <div className="rays" aria-hidden="true" />
      <div className="halo" aria-hidden="true" />
      <Petals />
      <div className="descent-spiral">
        <InfiniteSpiral
          items={MYSTERY_IMAGES}
          speed={0.35}
          direction="up"
          animationMode="auto"
          radius={550}
          cardWidth={170}
          cardHeight={170}
          verticalSpacing={70}
          perspective={1200}
          cardsPerTurn={8}
          rotation={0}
          cardTilt={0}
          cardRadius={50}
          centerScale={1.2}
          edgeFade={0.4}
          edgeBlur={4}
          pauseOnHover
          imageFit="cover"
          centerContent={
            <MaryFigure className="descent-figure-center" alt={t.home.descentAlt} />
          }
        />
      </div>
      <DescentCopy />
    </section>
  );
}

export function Locations() {
  return (
    <section className="locations band" id="locations" data-scroll>
      <p className="drift-word is-reverse" aria-hidden="true">
        One house
      </p>
      <div className="section-head">
        <p className="kicker" data-reveal>
          Locations
        </p>
        <h2 className="display-lg" data-reveal style={delay(80)}>
          Four rooms, one house
        </h2>
      </div>
      <ol className="places">
        {places.map((place, i) => (
          <li key={place.n} className="glass" data-reveal style={delay((i % 2) * 140)}>
            <img src={place.image} alt={place.alt} loading="lazy" />
            <div>
              <span className="place-n">{place.n}</span>
              <h3>{place.name}</h3>
              <p>{place.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Intentions({ book }: { book: Notebook }) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  return (
    <section className="intentions band band-snow" id="intentions">
      <Shards />
      <div className="intent-grid">
        <div data-reveal>
          <p className="kicker">{t.intentions.kicker}</p>
          <h2 className="display-lg">{t.intentions.title}</h2>
          <p className="serif-lead">{t.intentions.lead}</p>
        </div>
        <form
          className="stack-form glass"
          data-reveal
          style={delay(120)}
          onSubmit={(event) => {
            event.preventDefault();
            if (text.trim().length < 3) {
              setError(t.intentions.tooShort);
              return;
            }
            book.addIntention(name, text);
            setName("");
            setText("");
            setError("");
          }}
        >
          <label>
            {t.intentions.name}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={60}
              autoComplete="name"
            />
          </label>
          <label>
            {t.intentions.text}
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={280}
              rows={4}
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="pill" type="submit">
            {t.intentions.submit}
          </button>
        </form>
      </div>
      <ul className="intention-list">
        {book.intentions.length === 0 && <li className="empty-note">{t.intentions.empty}</li>}
        {book.intentions.map((item) => (
          <li key={item.id} className="glass">
            <strong>{item.name || t.common.pilgrim}</strong>
            <p>{item.text}</p>
            <button type="button" onClick={() => book.removeIntention(item.id)}>
              {t.common.remove}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
