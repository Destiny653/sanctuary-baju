import { createFileRoute } from "@tanstack/react-router";
import { art } from "@/components/sanctuary/art";
import { hours } from "@/components/sanctuary/data";
import { SplitText } from "@/components/sanctuary/motion";
import { PageHero, Shell } from "@/components/sanctuary/shell";
import { Locations } from "@/components/sanctuary/story";

const TITLE = "Locations — Our Lady of Mercy";
const DESC = "The chapel, the garden oratory, the upper room, the gate house and the twin mountains of Mary and Calvary.";

export const Route = createFileRoute("/locations")({
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
  component: LocationsPage,
});

function LocationsPage() {
  return (
    <Shell>
      {() => (
        <>
          <PageHero
            kicker="Locations"
            title="Where the house stands"
            lede="Four rooms above still water, and two mountains beside a waterfall."
            images={[art.sanctuary, art.mountains, art.hills, art.heaven]}
          />
          <Locations />
          <section className="mountains band">
            <img className="mountains-img" src={art.mountains} alt="The twin mountains with a waterfall between them" loading="lazy" data-gsap="zoom" />
            <div className="mountains-copy">
              <SplitText text="The twin mountains" className="display-xl" />
              <div className="mountains-cols">
                <div className="glass" data-gsap="left">
                  <h3>Mount of Mary</h3>
                  <p>Four paths, one for each set of rosary mysteries: joyful, luminous, sorrowful and glorious.</p>
                </div>
                <div className="glass" data-gsap="right">
                  <h3>Mount of Calvary</h3>
                  <p>Fourteen stations of the cross climb to the summit, painted with the Passion of Christ.</p>
                </div>
              </div>
            </div>
          </section>
          <section className="hours-band band">
            <p className="kicker">The hours of the day</p>
            <ol className="hours-row">
              {hours.map((h) => (
                <li key={h.time} className="glass" data-gsap>
                  <b>{h.time}</b>
                  <strong>{h.name}</strong>
                  <span>{h.note}</span>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </Shell>
  );
}
