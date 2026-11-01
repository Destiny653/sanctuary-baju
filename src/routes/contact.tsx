import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin } from "lucide-react";
import { art } from "@/components/sanctuary/art";
import { PageHero, Shell } from "@/components/sanctuary/shell";
import { Intentions, Visit } from "@/components/sanctuary/story";

const TITLE = "Contact — Our Lady of Mercy";
const DESC = "Tell the gate house the day you are coming, or leave a prayer intention. No charge, no ticket.";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

function ContactPage() {
  return (
    <Shell>
      {(book) => (
        <>
          <PageHero
            kicker="Contact"
            title="The gate is open"
            lede="Write so we can set out chairs, or leave what you came with in the book."
            images={[art.hands, art.face, art.evangelCall, art.dawn]}
          />
          <section className="contact-cards band">
            <div className="glass" data-gsap>
              <MapPin strokeWidth={1.4} />
              <h3>Find us</h3>
              <p>The gate house, Stillwater, north garden.</p>
            </div>
            <div className="glass" data-gsap>
              <Clock strokeWidth={1.4} />
              <h3>Open</h3>
              <p>Every day, from first light until night prayer.</p>
            </div>
            <div className="glass" data-gsap>
              <Mail strokeWidth={1.4} />
              <h3>Write</h3>
              <p>Use the form below. Nothing is charged at the door.</p>
            </div>
          </section>
          <Visit book={book} />
          <Intentions book={book} />
        </>
      )}
    </Shell>
  );
}
