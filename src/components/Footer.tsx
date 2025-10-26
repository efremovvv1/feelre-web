// src/components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

function openPanel(panel: "about" | "faq") {
  document
    .querySelector("#chat-box")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.dispatchEvent(new CustomEvent("feelre:open-panel", { detail: { panel } }));
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="w-full mt-8 md:mt-10">
      <div className="w-full bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] text-white">
        <div
          className="
            mx-auto max-w-[1200px]
            px-4 md:px-8 lg:px-10
            py-6 md:py-10
          "
        >
          {/* верхняя часть */}
          {/* верхняя сетка: 5 колонок на десктопе, одна колонка на мобайле */}
<div className="grid gap-6 text-center md:text-left md:grid-cols-5">
  {/* Бренд */}
  <div>
    <div className="text-[22px] md:text-[28px] font-bold tracking-wide leading-none">FEELRE —</div>
    <div className="mt-1 md:mt-2 text-[14px] md:text-[16px] opacity-95">Buy what you really feel.</div>
  </div>

  {/* Company */}
  <nav>
    <div className="text-[13px] md:text-[15px] font-semibold uppercase tracking-wide opacity-80">Company</div>
    <div className="mt-2 md:mt-3 flex flex-col items-center md:items-start gap-1.5 md:gap-2">
      <button className="text-[14px] md:text-[16px] hover:opacity-90" onClick={() => openPanel("about")}>About</button>
      <button className="text-[14px] md:text-[16px] hover:opacity-90" onClick={() => openPanel("faq")}>FAQ</button>
    </div>
  </nav>

  {/* Legal */}
  <nav>
    <div className="text-[13px] md:text-[15px] font-semibold uppercase tracking-wide opacity-80">Legal</div>
    <div className="mt-2 md:mt-3 flex flex-col items-center md:items-start gap-1.5 md:gap-2">
      <button className="text-[14px] md:text-[16px] hover:opacity-90" onClick={() => window.dispatchEvent(new CustomEvent("feelre:open-impressum"))}>Impressum</button>
      <button className="text-[14px] md:text-[16px] hover:opacity-90" onClick={() => window.dispatchEvent(new CustomEvent("feelre:open-cookies"))}>Cookie Settings</button>
    </div>
  </nav>

  {/* Policies */}
  <nav>
    <div className="text-[13px] md:text-[15px] font-semibold uppercase tracking-wide opacity-80">Policies</div>
    <div className="mt-2 md:mt-3 flex flex-col items-center md:items-start gap-1.5 md:gap-2">
      <Link href="/privacy" className="text-[14px] md:text-[16px] hover:opacity-90">Privacy Policy</Link>
      <Link href="/terms" className="text-[14px] md:text-[16px] hover:opacity-90">Terms of Service</Link>
    </div>
  </nav>

  {/* Контакты — теперь ПЯТАЯ колонка на десктопе */}
  <div className="text-center md:text-right">
    <a href="mailto:hello@feerly.com" className="inline-block text-[14px] md:text-[16px] hover:opacity-90">
      hello@feerly.com
    </a>
    <div className="mt-3 flex items-center justify-center md:justify-end gap-2.5 md:gap-3">
      <a aria-label="Instagram" href="#" className="relative h-6 w-6 md:h-7 md:w-7 shrink-0">
        <Image src="/icons/instagram.png" alt="" fill className="object-contain" sizes="28px" />
      </a>
      <a aria-label="TikTok" href="#" className="relative h-6 w-6 md:h-7 md:w-7 shrink-0">
        <Image src="/icons/tiktok.png" alt="" fill className="object-contain" sizes="28px" />
      </a>
      <a aria-label="X" href="#" className="relative h-6 w-6 md:h-7 md:w-7 shrink-0">
        <Image src="/icons/twitter.png" alt="" fill className="object-contain" sizes="28px" />
      </a>
    </div>
  </div>
</div>


          {/* разделитель и низ */}
          <div className="mt-6 md:mt-8 h-px w-full bg-white/20" />

          <div
            className="
              mt-4 md:mt-5
              flex flex-col-reverse md:flex-row
              items-center md:items-start
              gap-2 md:gap-0
              text-center md:text-left
              md:justify-between
            "
          >
            <div className="text-[12px] md:text-[13px] opacity-80">
              © {year} FEELRE. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] md:text-[13px] opacity-90">
              <button onClick={() => openPanel("about")} className="hover:opacity-90">
                About
              </button>
              <button onClick={() => openPanel("faq")} className="hover:opacity-90">
                FAQ
              </button>
              <Link href="/privacy" className="hover:opacity-90">
                Privacy
              </Link>
              <Link href="/terms" className="hover:opacity-90">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
