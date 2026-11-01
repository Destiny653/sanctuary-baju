import { Hero } from "./hero";
import { ScrollVideo } from "./scroll-video";
import { Evangel, Happenings, Marquees, PassionScroll } from "./home-sections";
import { Shell } from "./shell";
import { Descent, Interlude, Way } from "./story";

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
          <Descent />
          <Happenings />
        </>
      )}
    </Shell>
  );
}
