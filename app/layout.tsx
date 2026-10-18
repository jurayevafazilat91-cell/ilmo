import type { Metadata, Viewport } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: "ILMO — xatoning ortidagi ishonchni top",
  description: "ILMO noto‘g‘ri javob ortidagi xato ishonchni topadi, qarshi misol bilan uni buzadi va o‘quvchini o‘rgatuvchiga aylantiradi.",
};

export const viewport: Viewport = { themeColor: "#143d2c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className="antialiased">
      <body className="min-h-dvh font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
