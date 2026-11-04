# Talesha (display headers)

Drop licensed Talesha webfont files here, then wire them in `src/styles.css` by prepending `url()` sources to each `@font-face` for `"Talesha"`.

Expected filenames (any subset is fine):

- `Talesha-Regular.woff2` / `.woff`
- `Talesha-Medium.woff2` / `.woff`
- `Talesha-SemiBold.woff2` / `.woff`
- `Talesha-Bold.woff2` / `.woff`

Example after files are present:

```css
src:
  url("/fonts/talesha/Talesha-Regular.woff2") format("woff2"),
  url("/fonts/talesha/Talesha-Regular.woff") format("woff"),
  local("Talesha"),
  local("Talesha Regular");
```

Until then, headers use Cormorant Garamond (`--font-display-fallback` from `next/font`) as a close high-contrast serif.
