// src/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";
import { useT } from "@/modules/web-ui/i18n/Provider";

const montserrat700 = Montserrat({ subsets: ["latin"], weight: ["700"] });

export default function Header() {
  const { t } = useT();
  const DEFAULT_TITLE = t("header.mainTagline");
  const [title, setTitle] = useState<string>(DEFAULT_TITLE);
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/auth");

  useEffect(() => setTitle(DEFAULT_TITLE), [DEFAULT_TITLE]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { title?: string | null };
      setTitle(detail?.title || DEFAULT_TITLE);
    };
    window.addEventListener("feelre:set-header-title", handler);
    return () => window.removeEventListener("feelre:set-header-title", handler);
  }, [DEFAULT_TITLE]);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="w-full bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6]">
        <div className="h-[2px] w-full bg-[#27A4FF]/80" />

        {/* bar */}
        <div className="relative h-[64px] md:h-[100px] pt-[env(safe-area-inset-top)] md:pt-0 tb:header-bar">
          {/* ЛОГО */}
          <Link
            href="/"
            aria-label="FEELRE — home"
            className={[
              "absolute top-1/2 -translate-y-1/2",
              isAuth
                ? "left-1/2 -translate-x-1/2 md:left-[35px] md:translate-x-0"
                : "left-3 md:left-[35px]",
            ].join(" ")}
          >
            <div className="relative w-[160px] h-[48px] md:w-[220px] md:h-[68px] tb:logo">
              <Image
                src="/images/brand/feelre_logo.png"
                alt="FEELRE"
                fill
                priority
                sizes="(min-width:1024px) 220px, (min-width:768px) 190px, 160px"
                className="object-contain"
              />
            </div>
          </Link>

          {/* Заголовок (desktop + tablet) */}
          <h1
            className={[
              montserrat700.className,
              "hidden md:block",
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-[min(850px,calc(100vw-240px))] text-white text-center leading-tight",
              "text-[clamp(18px,3.6vw,32px)] drop-shadow-[0_3px_8px_rgba(0,0,0,0.25)] px-4",
              "tb:title", // 👉 планшетное ограничение ширины и троеточие
            ].join(" ")}
            style={{ wordBreak: "break-word" }}
          >
            {title}
          </h1>

          {/* Бургер (нет на /auth/*) */}
          {!isAuth && (
            <button
              aria-label="Open menu"
              className="absolute right-3 md:right-[35px] top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 md:w-[54px] md:h-[54px] rounded-2xl bg-white/20 hover:bg-white/25 transition tb:menu-btn"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("feelre:toggle-menu"));
              }}
            >
              <div className="space-y-[5px] md:space-y-[6px]">
                <span className="block h-[3px] md:h-[4px] w-[26px] md:w-[32px] rounded-full bg-white tb:menu-line" />
                <span className="block h-[3px] md:h-[4px] w-[26px] md:w-[32px] rounded-full bg-white tb:menu-line" />
                <span className="block h-[3px] md:h-[4px] w-[26px] md:w-[32px] rounded-full bg-white tb:menu-line" />
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}