// src/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";   // ⬅️ добавили

const montserrat700 = Montserrat({ subsets: ["latin"], weight: ["700"] });
const DEFAULT_TITLE = "Ready to help you with a purchase.";

export default function Header() {
  const [title, setTitle] = useState<string>(DEFAULT_TITLE);
  const pathname = usePathname();                 // ⬅️ текущий путь
  const isAuth = pathname?.startsWith("/auth");   // ⬅️ страницы входа/регистрации

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { title?: string | null };
      setTitle(detail?.title || DEFAULT_TITLE);
    };
    window.addEventListener("feelre:set-header-title", handler);
    return () => window.removeEventListener("feelre:set-header-title", handler);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="w-full bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6]">
        <div className="h-[2px] w-full bg-[#27A4FF]/80" />

        <div className="relative h-[64px] md:h-[100px] pt-[env(safe-area-inset-top)] md:pt-0">
          {/* ЛОГО: на МОБИЛЕ центр только на /auth/*, на md+ — всегда слева */}
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
            {/* Контейнер задаёт размер логотипа на всех брейкпоинтах */}
            <div className="relative w-[160px] h-[48px] md:w-[220px] md:h-[68px]">
              <Image
                src="/images/brand/feelre_logo.png"
                alt="FEELRE"
                fill                    // <-- вместо width/height
                priority
                sizes="(min-width:768px) 220px, 160px"
                className="object-contain"
              />
            </div>
          </Link>


          {/* Заголовок — виден только на десктопе */}
          <h1
            className={[
              montserrat700.className,
              "hidden md:block",
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-[min(850px,calc(100vw-240px))] text-white text-center leading-tight",
              "text-[clamp(20px,4vw,32px)] drop-shadow-[0_3px_8px_rgba(0,0,0,0.25)] px-4",
            ].join(" ")}
            style={{ wordBreak: "break-word" }}
          >
            {title}
          </h1>

          {/* Бургер: на /auth/* скрываем полностью */}
          {!isAuth && (
            <button
              aria-label="Open menu"
              className="absolute right-3 md:right-[35px] top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 md:w-[54px] md:h-[54px] rounded-2xl bg-white/20 hover:bg-white/25 transition"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("feelre:toggle-menu"));
              }}
            >
              <div className="space-y-[5px] md:space-y-[6px]">
                <span className="block h-[3px] md:h-[4px] w-[26px] md:w-[32px] rounded-full bg-white" />
                <span className="block h-[3px] md:h-[4px] w-[26px] md:w-[32px] rounded-full bg-white" />
                <span className="block h-[3px] md:h-[4px] w-[26px] md:w-[32px] rounded-full bg-white" />
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
