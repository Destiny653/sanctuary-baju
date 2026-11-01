import { Hero } from "./hero";
import { ScrollVideo } from "./scroll-video";
import { Evangel, Happenings, Marquees, Mysteries, PassionScroll } from "./home-sections";
import { Shell } from "./shell";
import { Company, Descent, Interlude, Way } from "./story";

export function HomePage() {
  return (
    <Shell>
      {() => (
        <>
          <Hero />
          <ScrollVideo />
          <PassionScroll />
          <Marquees />
          <Evangel />
          <Interlude />
          <Way />
          <Mysteries />
          <Company />
          <Descent />
          <Happenings />
        </>
      )}
    </Shell>
  );
}
