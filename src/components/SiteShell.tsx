"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const onToggle = () => setIsBurgerOpen(v => !v);
    const onOpen = () => setIsBurgerOpen(true);
    const onClose = () => setIsBurgerOpen(false);

    const onImpressum = () => {
      setIsBurgerOpen(false);
      setOpenImpressum(true);
    };
    const onCookies = () => {
      setIsBurgerOpen(false);
      setOpenCookies(true);
    };

    window.addEventListener("feelre:toggle-menu", onToggle);
    window.addEventListener("feelre:open-menu", onOpen);
    window.addEventListener("feelre:close-menu", onClose);

    window.addEventListener("feelre:open-impressum", onImpressum);
    window.addEventListener("feelre:open-cookies", onCookies);

    return () => {
      window.removeEventListener("feelre:toggle-menu", onToggle);
      window.removeEventListener("feelre:open-menu", onOpen);
      window.removeEventListener("feelre:close-menu", onClose);

      window.removeEventListener("feelre:open-impressum", onImpressum);
      window.removeEventListener("feelre:open-cookies", onCookies);
    };
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      {/* ВАЖНО: якорь для скролла из BurgerMenu */}
      <Footer />

      <BurgerMenu open={isBurgerOpen} onClose={() => setIsBurgerOpen(false)} />
      <ImpressumSheet open={openImpressum} onClose={() => setOpenImpressum(false)} />
      <CookieSettingsSheet open={openCookies} onClose={() => setOpenCookies(false)} />
      <CookieBanner />
    </>
  );
}
