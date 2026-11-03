import { Hero } from "./hero";
import { ScrollVideo } from "./scroll-video";
import { Evangel, FinalInvite, Happenings, Marquees, Welcome } from "./landing-sections";
import { PassionScroll } from "./passion-scroll";
import { Shell } from "./shell";
import { Descent, Interlude } from "./story";

export function HomePage() {
  return (
    <Shell>
      {() => (
        <>
          <Hero />
          <Descent />
          <Welcome />
          <ScrollVideo />
          <PassionScroll />
          <Marquees />
          <Evangel />
          <Interlude />
          <Happenings />
          <FinalInvite />
        </>
      )}
    </Shell>
  );
}
