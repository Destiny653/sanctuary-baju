<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- The homepage uploaded film uses a dedicated ScrollVideo section after Hero, with asset pointers and GSAP ScrollTrigger seeking rather than autoplay; short-keyframe media keeps bidirectional scrubbing responsive and reduced-motion visitors receive native playback controls.
- Pages are separate routes (`/`, `/gallery`, `/news`, `/events`, `/locations`, `/contact`), each wrapped in `Shell` from `src/components/sanctuary/shell.tsx`, which owns nav, footer, dialogs, Lenis smooth scroll and GSAP reveals — so motion stays consistent per page.
- Motion uses GSAP + ScrollTrigger driven by Lenis via the GSAP ticker; ReactBits-style pieces (SplitText, VelocityMarquee, Tilt) live in `motion.tsx` rather than an installed package.
- Film narration uses a reversible GSAP word-reveal timeline in motion.tsx driven by decoded video time, with bilingual chapters in film-narration.ts; this keeps text aligned during seeking and native reduced-motion playback.
- News, events and gallery are read from Lovable Cloud tables via query options in `content.ts`, preloaded in route loaders.
- Artwork is served via Lovable Assets pointers in `src/assets/art/*.asset.json`, re-exported from `src/components/sanctuary/art.ts`; reference images through `art.*` (CSS uses the pointer URL directly), never `/art/...` paths.
- Site styling lives as plain CSS classes in `src/styles.css`, driven by oklch tokens in `:root` (`--ink`, `--snow`, `--blue`…); shadcn tokens map onto that palette. Plain CSS must use `var(--token)`, not `var(--color-*)`, because `@theme inline` does not emit those variables.
- The notebook (intentions + visit notes) is stored on-device in localStorage key `olm-notebook`; the page copy promises nothing is sent anywhere, so do not move it server-side without changing that copy.
