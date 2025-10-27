// src/app/layout.tsx
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import { montserrat } from "@/styles/fonts";

export const metadata = {
  title: "FEELRE",
  description: "AI shopping assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* body — ЕДИНСТВЕННЫЙ flex-контейнер на всю высоту */}
      <body className={`${montserrat.variable} min-h-dvh flex flex-col`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
