import "./globals.css";
import SiteShell from "@/components/SiteShell";
import { Montserrat } from "next/font/google";

export const metadata = {
  title: "FEELRE",
  description: "AI shopping assistant",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-mont",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="min-h-dvh flex flex-col">
        <SiteShell>
          
          <main className="flex-1">{children}</main>
          
        </SiteShell>
      </body>
    </html>
  );
}
