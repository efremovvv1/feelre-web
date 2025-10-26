// src/app/layout.tsx
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import { montserrat } from "@/styles/fonts";

export const metadata = {
  title: "FEELRE",
  description: "AI shopping assistant",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* body ДОЛЖЕН быть прямым ребёнком html и единственным */}
      <body className={`${montserrat.variable} min-h-dvh antialiased bg-[#fdf6f8]`}>
        {/* Любые оболочки/шейлы идут уже внутри body */}
        <SiteShell>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
