import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import "@/styles.css";

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
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
