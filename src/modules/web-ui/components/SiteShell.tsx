// src/components/SiteShell.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/modules/web-ui/components/Header";
import Footer from "@/modules/web-ui/components/Footer";
import BurgerMenu from "@/modules/web-ui/components/BurgerMenu";
import ImpressumSheet from "@/modules/web-ui/components/ImpressumSheet";
import CookieSettingsSheet from "@/modules/web-ui/components/CookieSettingsSheet";
import CookieBanner from "@/modules/web-ui/components/CookieBanner";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [openImpressum, setOpenImpressum] = useState(false);
  const [openCookies, setOpenCookies] = useState(false);

  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/auth");

  useEffect(() => {
    const toggle = () => setIsBurgerOpen(v => !v);
    const open = () => setIsBurgerOpen(true);
    const close = () => setIsBurgerOpen(false);
    const openImpr = () => setOpenImpressum(true);
    const openCk = () => setOpenCookies(true);

    window.addEventListener("feelre:toggle-menu", toggle);
    window.addEventListener("feelre:open-menu", open);
    window.addEventListener("feelre:close-menu", close);
    window.addEventListener("feelre:open-impressum", openImpr);
    window.addEventListener("feelre:open-cookies", openCk);

    return () => {
      window.removeEventListener("feelre:toggle-menu", toggle);
      window.removeEventListener("feelre:open-menu", open);
      window.removeEventListener("feelre:close-menu", close);
      window.removeEventListener("feelre:open-impressum", openImpr);
      window.removeEventListener("feelre:open-cookies", openCk);
    };
  }, []);

  // если открыта любая модалка/меню — блокируем скролл страницы
  const modalOpen = isBurgerOpen || openImpressum || openCookies;
  useEffect(() => {
    document.body.classList.toggle("scroll-locked", modalOpen);
  }, [modalOpen]);

  return (
    <>
      <Header />
      {/* ВАЖНО: только grow, без min-h-0 и overflow-x-hidden */}
      <main className="grow">{children}</main>
      <Footer />

      {!isAuth && (
        <BurgerMenu open={isBurgerOpen} onClose={() => setIsBurgerOpen(false)} />
      )}

      <ImpressumSheet open={openImpressum} onClose={() => setOpenImpressum(false)} />
      <CookieSettingsSheet open={openCookies} onClose={() => setOpenCookies(false)} />
      <CookieBanner />
    </>
  );
}
