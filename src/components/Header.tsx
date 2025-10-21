// src/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";

const montserrat700 = Montserrat({ subsets: ["latin"], weight: ["700"] });
const DEFAULT_TITLE = "Ready to help you with a purchase.";

export default function Header() {
  const [title, setTitle] = useState<string>(DEFAULT_TITLE);
  const pathname = usePathname();

  // рендерим кнопку всегда, но прячем/выключаем на /auth/*
  const isAuth = useMemo(() => pathname?.startsWith("/auth") ?? false, [pathname]);

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

        <div className="relative h-[100px]">
          {/* logo */}
          <Link href="/" className="absolute left-[35px] top-1/2 -translate-y-1/2">
            <Image
              src="/images/brand/feelre_logo.png"
              alt="FEELRE"
              width={220}
              height={68}
              priority
              className="object-contain cursor-pointer transition-transform hover:scale-[1.02]"
            />
          </Link>

          {/* dynamic title */}
          <h1
            className={`
              ${montserrat700.className}
              absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              max-w-[850px] w-[calc(100%-70px-70px)]
              text-white text-[32px] font-bold text-center
              drop-shadow-[0_3px_8px_rgba(0,0,0,0.25)]
            `}
          >
            {title}
          </h1>

          {/* burger: всегда в DOM (чтобы не ломать гидрацию), но на /auth/* невидим и не кликается */}
          <button
            aria-label="Open menu"
            aria-hidden={isAuth}
            tabIndex={isAuth ? -1 : 0}
            disabled={isAuth}
            className={`
              absolute right-[35px] top-1/2 -translate-y-1/2 grid place-items-center
              w-[54px] h-[54px] rounded-2xl transition
              ${isAuth ? "opacity-0 pointer-events-none" : "bg-white/20 hover:bg-white/25"}
            `}
            onClick={() => {
              if (isAuth) return;
              window.dispatchEvent(new CustomEvent("feelre:toggle-menu"));
            }}
          >
            <div className="space-y-[6px]">
              <span className="block h-[4px] w-[32px] rounded-full bg-white" />
              <span className="block h-[4px] w-[32px] rounded-full bg-white" />
              <span className="block h-[4px] w-[32px] rounded-full bg-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
