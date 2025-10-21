// src/components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

function openPanel(panel: "about" | "faq") {
  document.querySelector("#chat-box")?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.dispatchEvent(new CustomEvent("feelre:open-panel", { detail: { panel } }));
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="w-full mt-10">
      <div className="w-full bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] text-white">
        {/* компактная высота футера */}
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10 py-8 lg:py-10">
          {/* верхняя сетка: 5 колонок на десктопе */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            {/* Бренд */}
            <div className="text-center md:text-left">
              <div className="text-[28px] font-bold tracking-wide leading-none">FEELRE —</div>
              <div className="mt-2 text-[16px]/[1.5] opacity-95">Buy what you really feel.</div>
            </div>

            {/* Company */}
            <nav className="text-center">
              <div className="text-[15px] font-semibold uppercase tracking-wide opacity-80">Company</div>
              <div className="mt-3 flex flex-col items-center gap-2">
                <button className="text-[16px] hover:opacity-90 transition-opacity" onClick={() => openPanel("about")}>
                  About
                </button>
                <button className="text-[16px] hover:opacity-90 transition-opacity" onClick={() => openPanel("faq")}>
                  FAQ
                </button>
              </div>
            </nav>

            {/* Legal (Impressum/Cookies) */}
            <nav className="text-center">
              <div className="text-[15px] font-semibold uppercase tracking-wide opacity-80">Legal</div>
              <div className="mt-3 flex flex-col items-center gap-2">
                <button
                className="text-left hover:opacity-80"
                onClick={() => window.dispatchEvent(new CustomEvent("feelre:open-impressum"))}
                >
                Impressum
                </button>
                <button
                className="text-left hover:opacity-80"
                onClick={() => window.dispatchEvent(new CustomEvent("feelre:open-cookies"))}
                >
                Cookie Settings
                </button>
              </div>
            </nav>

            {/* Policies — отдельная колонка */}
            <nav className="text-center">
              <div className="text-[15px] font-semibold uppercase tracking-wide opacity-80">Policies</div>
              <div className="mt-3 flex flex-col items-center gap-2">
                <Link href="/privacy" className="text-[16px] hover:opacity-90 transition-opacity">Privacy Policy</Link>
                <Link href="/terms" className="text-[16px] hover:opacity-90 transition-opacity">Terms of Service</Link>
              </div>
            </nav>

            {/* Контакты и соцсети */}
            <div className="text-center md:text-right">
              <a href="mailto:hello@feerly.com" className="inline-block text-[16px] hover:opacity-90 transition-opacity">
                hello@feerly.com
              </a>

              {/* Соцсети: одинаковый размер и без фона */}
              <div className="mt-4 flex items-center justify-center md:justify-end gap-3">
                {/* Каждый значок — фиксированный бокс 28x28, картинка object-contain */}
                <a href="#" aria-label="Instagram" className="relative h-7 w-7 shrink-0">
                  <Image src="/icons/instagram.png" alt="" fill className="object-contain" sizes="28px" />
                </a>
                <a href="#" aria-label="TikTok" className="relative h-7 w-7 shrink-0">
                  <Image src="/icons/tiktok.png" alt="" fill className="object-contain" sizes="28px" />
                </a>
                <a href="#" aria-label="X" className="relative h-7 w-7 shrink-0">
                  <Image src="/icons/twitter.png" alt="" fill className="object-contain" sizes="28px" />
                </a>
              </div>
            </div>
          </div>

          {/* разделитель и нижняя строка */}
          <div className="mt-8 h-px w-full bg-white/20" />
          <div className="mt-4 flex flex-col-reverse items-center gap-2 text-center md:flex-row md:justify-between">
            <div className="text-[13px] opacity-80">© {year} FEELRE. All rights reserved.</div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] opacity-90">
              <button onClick={() => openPanel("about")} className="hover:opacity-90">About</button>
              <button onClick={() => openPanel("faq")} className="hover:opacity-90">FAQ</button>
              <Link href="/privacy" className="hover:opacity-90">Privacy</Link>
              <Link href="/terms" className="hover:opacity-90">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
