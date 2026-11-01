import { art } from "./art";
import { useState, type CSSProperties } from "react";
import { hours, parties, places } from "./data";
import { MaryFigure } from "./mary";
import { Petals, Shards } from "./shards";
import type { Notebook } from "./use-notebook";
import InfiniteSpiral from "../InfiniteSpiral";

const delay = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as CSSProperties;

export function About() {
  return (
    <section className="about band" id="about" data-scroll>
      <p className="drift-word" aria-hidden="true">
        Sanctuary
      </p>
      <div className="about-grid">
        <div>
          <p className="kicker" data-reveal>
            About us
          </p>
          <h2 className="display-lg" data-reveal style={delay(80)}>
            A house on still water
          </h2>
          <p className="serif-lead" data-reveal style={delay(160)}>
            The sanctuary stands on a green hill above a pool that rarely takes the wind, palms on
            one side and an old baobab on the other. It was opened so anyone could sit in a finished
            silence.
          </p>
          <p className="body-copy" data-reveal style={delay(240)}>
            The house keeps the hours. It does not keep an account. There is no admission, no
            reserved place set aside for payment, and nothing sold along the cloister. If you need
            a chair, there is a chair.
          </p>
          <blockquote className="pull" data-reveal style={delay(320)}>
            Come as you are. The house is not keeping score.
          </blockquote>
        </div>
        <figure className="about-figure glass-frame" data-reveal style={delay(120)}>
          <img src={art.sanctuary} alt="The white chapel on its hill, reflected in the still pool" loading="lazy" />
          <figcaption>The chapel, from the south walk</figcaption>
        </figure>
      </div>
      <ol className="hours">
        {hours.map((hour, i) => (
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
  return (
    <section className="interlude" id="mercy" data-scroll="sticky" aria-label="Mercy">
      <div className="interlude-stage">
        <img className="fly fly-a" src={art.face} alt="" loading="lazy" />
        <img className="fly fly-b" src={art.hands} alt="" loading="lazy" />
        <h2 className="interlude-word">Mercy</h2>
        <img className="fly fly-c" src={art.angels} alt="" loading="lazy" />
        <p className="interlude-note">Wider than the water. Open before the first bell.</p>
      </div>
    </section>
  );
}

export function Way() {
  return (
    <section className="way" id="way" data-scroll>
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

export function Company() {
  return (
    <section className="company" id="company" data-scroll>
      <div className="company-copy">
        <div className="glass company-card" data-reveal>
          <p className="kicker">The company</p>
          <h2 className="display-lg">They keep the wall</h2>
          <p className="serif-lead">
            Three carved figures attend the north side of the nave. They are not ornament. They are
            the posture the house hopes for: attention, without an audience.
          </p>
          <a className="pill" href="#descent">
            Read more
          </a>
        </div>
      </div>
      <div className="company-frame">
        <img
          className="para float"
          src={art.angels}
          alt="Three carved African angels with white wings, kneeling and hovering in prayer"
          loading="lazy"
        />
      </div>
    </section>
  );
}

const MYSTERY_IMAGES = Array.from({ length: 20 }, (_, i) => {
  const names = [
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
  ];
  const num = String(i + 1).padStart(2, "0");
  return {
    src: `/assets/mysteries/${num}_${names[i]}.png`,
    alt: names[i]?.replace(/_/g, " "),
  };
});

export function Descent() {
  return (
    <section className="descent" id="descent" data-scroll>
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
            <MaryFigure
              className="descent-figure-center"
              alt="Mary lowered through a field of pale cloud, a gold ring turning behind her head"
            />
          }
        />
      </div>
      <div className="descent-copy glass" data-reveal>
        <p className="kicker">The rosary</p>
        <h2 className="display-lg">A weapon, not a decoration</h2>
        <p className="body-copy">
          <em>"The prayer of a righteous person is powerful and effective."</em>
          <br /><span className="cite">James 5:16</span>
        </p>
        <p className="body-copy">
          The rosary breaks strongholds. It has turned battles, ended plagues, and
          brought peace to households that had none. It is not recitation — it is
          intercession. Mary stood at the cross when others fled. She knows what to
          carry to God and how.
        </p>
        <p className="body-copy">
          <em>"Ask and it will be given to you; seek and you will find."</em>
          <br /><span className="cite">Matthew 7:7</span>
        </p>
      </div>
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
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  return (
    <section className="intentions band" id="intentions">
      <Shards />
      <div className="intent-grid">
        <div data-reveal>
          <p className="kicker">The book</p>
          <h2 className="display-lg">Leave a name</h2>
          <p className="serif-lead">
            Write what you came with. It is kept in the notebook on this device, not sent anywhere,
            and not read aloud.
          </p>
        </div>
        <form
          className="stack-form glass"
          data-reveal
          style={delay(120)}
          onSubmit={(event) => {
            event.preventDefault();
            if (text.trim().length < 3) {
              setError("A few words are enough, but not fewer than that.");
              return;
            }
            book.addIntention(name, text);
            setName("");
            setText("");
            setError("");
          }}
        >
          <label>
            Name, if you wish
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={60}
              autoComplete="name"
            />
          </label>
          <label>
            Intention
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
            Write it
          </button>
        </form>
      </div>
      <ul className="intention-list">
        {book.intentions.length === 0 && (
          <li className="empty-note">The book is open. The first line can be yours.</li>
        )}
        {book.intentions.map((item) => (
          <li key={item.id} className="glass">
            <strong>{item.name || "A pilgrim"}</strong>
            <p>{item.text}</p>
            <button type="button" onClick={() => book.removeIntention(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Visit({ book }: { book: Notebook }) {
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [party, setParty] = useState<string>(parties[0] ?? "1");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <section className="visit band" id="contact">
        <div className="glass visit-done">
          <p className="kicker">Contact us</p>
          <h2 className="display-lg">The gate will be open</h2>
          <p className="serif-lead">
            Come to the gate house on the day you named. A chair will be there if we have one. You
            will not be asked for anything at the door.
          </p>
          <button className="pill" type="button" onClick={() => setSent(false)}>
            Write another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="visit band" id="contact">
      <div className="visit-grid">
        <div data-reveal>
          <p className="kicker">Contact us</p>
          <h2 className="display-lg">Tell us the day</h2>
          <p className="serif-lead">
            Write only so we can set out chairs. You will not be charged. There is no ticket, no
            reserved seat for a fee, and no collection at the door.
          </p>
        </div>
        <form
          className="stack-form glass"
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
          <label>
            Your name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={80}
              autoComplete="name"
            />
          </label>
          <label>
            Day
            <input
              type="date"
              value={day}
              onChange={(event) => setDay(event.target.value)}
              required
            />
          </label>
          <label>
            How many
            <select value={party} onChange={(event) => setParty(event.target.value)}>
              {parties.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            A note, if needed
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={240}
              rows={3}
            />
          </label>
          <button className="pill" type="submit">
            Send word
          </button>
        </form>
      </div>
    </section>
  );
}
