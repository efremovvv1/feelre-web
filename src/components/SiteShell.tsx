// src/components/SiteShell.tsx
"use client";

import { useEffect, useState } from "react";
import BurgerMenu from "@/components/BurgerMenu";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  // слушаем события от Header
  useEffect(() => {
    const onToggle = () => setIsBurgerOpen(v => !v);
    const onOpen = () => setIsBurgerOpen(true);
    const onClose = () => setIsBurgerOpen(false);

    window.addEventListener("feelre:toggle-menu", onToggle as EventListener);
    window.addEventListener("feelre:open-menu", onOpen as EventListener);
    window.addEventListener("feelre:close-menu", onClose as EventListener);

    return () => {
      window.removeEventListener("feelre:toggle-menu", onToggle as EventListener);
      window.removeEventListener("feelre:open-menu", onOpen as EventListener);
      window.removeEventListener("feelre:close-menu", onClose as EventListener);
    };
  }, []);

  // блокируем прокрутку страницы когда меню открыто
  useEffect(() => {
    const el = document.documentElement;
    if (isBurgerOpen) el.style.overflow = "hidden";
    else el.style.overflow = "";
    return () => { el.style.overflow = ""; };
  }, [isBurgerOpen]);

  return (
    <>
      {children}
      <BurgerMenu open={isBurgerOpen} onClose={() => setIsBurgerOpen(false)} />
    </>
  );
}
