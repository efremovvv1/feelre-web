// src/components/SiteShell.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BurgerMenu from "@/components/BurgerMenu";
import ImpressumSheet from "@/components/ImpressumSheet";
import CookieSettingsSheet from "@/components/CookieSettingsSheet";
import CookieBanner from "@/components/CookieBanner";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [openImpressum, setOpenImpressum] = useState(false);
  const [openCookies, setOpenCookies] = useState(false);

  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/auth"); // <-- auth-страницы

  useEffect(() => {
    const onToggle = () => setIsBurgerOpen((v) => !v);
    const onOpen = () => setIsBurgerOpen(true);
    const onClose = () => setIsBurgerOpen(false);
    const onImpressum = () => setOpenImpressum(true);
    const onCookies = () => setOpenCookies(true);

    window.addEventListener("feelre:toggle-menu", onToggle as EventListener);
    window.addEventListener("feelre:open-menu", onOpen as EventListener);
    window.addEventListener("feelre:close-menu", onClose as EventListener);
    window.addEventListener("feelre:open-impressum", onImpressum as EventListener);
    window.addEventListener("feelre:open-cookies", onCookies as EventListener);

    return () => {
      window.removeEventListener("feelre:toggle-menu", onToggle as EventListener);
      window.removeEventListener("feelre:open-menu", onOpen as EventListener);
      window.removeEventListener("feelre:close-menu", onClose as EventListener);
      window.removeEventListener("feelre:open-impressum", onImpressum as EventListener);
      window.removeEventListener("feelre:open-cookies", onCookies as EventListener);
    };
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* не показываем бургер в /auth/* */}
      {!isAuth && <BurgerMenu open={isBurgerOpen} onClose={() => setIsBurgerOpen(false)} />}

      <ImpressumSheet open={openImpressum} onClose={() => setOpenImpressum(false)} />
      <CookieSettingsSheet open={openCookies} onClose={() => setOpenCookies(false)} />
      <CookieBanner />
    </>
  );
}
