import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Providers } from "./providers";
import "@/styles.css";

/** Close high-contrast serif until licensed Talesha webfonts are dropped in /public/fonts/talesha. */
const displayFallback = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display-fallback",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Our Lady of Mercy",
    template: "%s — Our Lady of Mercy",
  },
  description:
    "Sanctuary of Our Lady of Mercy. A white chapel above still water, open from first light.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#8FD0F5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={displayFallback.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
