// src/components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import T from "@/i18n/T";

function openPanel(panel: "about" | "faq") {
  document.querySelector("#chat-box")?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.dispatchEvent(new CustomEvent("feelre:open-panel", { detail: { panel } }));
}

export default function Footer() {
  const year = new Date().getFullYear();
  const linkCls =
    "text-[13px] md:text-[15px] tb:text-sm leading-tight hover:opacity-90 transition-opacity break-words hyphens-auto";

  return (
    <footer id="site-footer" className="w-full mt-8 md:mt-10">
      <div className="w-full text-white bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6]">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8 xl:px-10 py-10">
  {/* ===== ВЕРХ ===== */}
  {/* ===== ВЕРХ ===== */}
<div
  className="
    gap-y-14 md:gap-y-16 xl:gap-y-0
    text-center
    xl:grid xl:grid-cols-12 xl:gap-x-8 xl:text-left
    items-start
  "
>
    {/* Brand */}
    <div className="xl:col-start-1 xl:col-span-3 mb-6 md:mb-8 xl:mb-0">
      <div className="mt-1 text-[22px] md:text-[26px] font-bold leading-none">FEELRE —</div>
      <p className="text-[14px] md:text-[16px] opacity-95 leading-snug max-w-[34rem] mx-auto xl:mx-0">
        <T path="footer.brandSlogan" />
      </p>
    </div>

    {/* Company */}
    <nav className="xl:col-start-4 xl:col-span-2 mb-6 md:mb-8 xl:mb-0">
      <div className="text-[12px] md:text-[14px] font-semibold uppercase tracking-wide opacity-80 leading-tight">
        <T path="footer.sections.company" />
      </div>
      <div className="mt-3 flex flex-col items-center xl:items-start space-y-2">
        <button className={linkCls} onClick={() => openPanel('about')}>
          <T path="footer.links.about" />
        </button>
        <button className={linkCls} onClick={() => openPanel('faq')}>
          <T path="footer.links.faq" />
        </button>
      </div>
    </nav>

    {/* Legal */}
    <nav className="xl:col-start-6 xl:col-span-3 mb-6 md:mb-8 xl:mb-0">
      <div className="text-[12px] md:text-[14px] font-semibold uppercase tracking-wide opacity-80 leading-tight">
        <T path="footer.sections.legal" />
      </div>
      <div className="mt-3 flex flex-col items-center xl:items-start space-y-2">
        <button className={linkCls} onClick={() => window.dispatchEvent(new CustomEvent('feelre:open-impressum'))}>
          <T path="footer.links.impressum" />
        </button>
        <button className={linkCls} onClick={() => window.dispatchEvent(new CustomEvent('feelre:open-cookies'))}>
          <T path="footer.links.cookies" />
        </button>
      </div>
    </nav>

    {/* Policies */}
    <nav className="xl:col-start-9 xl:col-span-2 mb-6 md:mb-8 xl:mb-0">
      <div className="text-[12px] md:text-[14px] font-semibold uppercase tracking-wide opacity-80 leading-tight">
        <T path="footer.sections.policies" />
      </div>
      <div className="mt-3 flex flex-col items-center xl:items-start space-y-2">
        <Link href="/privacy" className={linkCls}><T path="footer.links.privacy" /></Link>
        <Link href="/terms" className={linkCls}><T path="footer.links.terms" /></Link>
      </div>
    </nav>

    {/* Contacts — ЖЁСТКО в колонках 11–12 */}
    <div
      className="
          xl:col-start-11 xl:col-span-2
    flex flex-col gap-4
    items-center xl:items-end
    text-center xl:text-right
    min-w-0
    mb-6 md:mb-8 xl:mb-0
      "
    >
      <a
        href="mailto:hello@feelre.com"
        className="inline-block text-[14px] md:text-[18px] hover:opacity-90 whitespace-nowrap"
      >
        hello@feelre.com
      </a>

      <div className="flex items-center justify-center xl:justify-end gap-4 shrink-0">
        <a aria-label="Instagram" href="#" className="relative h-9 w-9 md:h-10 md:w-10">
          <Image src="/icons/instagram.png" alt="" fill sizes="40px" className="object-contain" />
        </a>
        <a aria-label="TikTok" href="#" className="relative h-9 w-9 md:h-10 md:w-10">
          <Image src="/icons/tiktok.png" alt="" fill sizes="40px" className="object-contain" />
        </a>
        <a aria-label="X" href="#" className="relative h-8 w-8 md:h-9 md:w-9">
          <Image src="/icons/twitter.png" alt="" fill sizes="36px" className="object-contain" />
        </a>
      </div>
    </div>
  </div>

          {/* ===== разделитель ===== */}
          <div className="mt-7 md:mt-8 h-px w-full bg-white/20" />

          {/* ===== НИЗ ===== */}
<div className="mt-5 grid grid-cols-1 xl:grid-cols-12 items-center gap-3">
  <div className="order-2 xl:order-1 xl:col-span-5 text-center xl:text-left text-[12px] md:text-[13px] opacity-80">
    © {year} FEELRE. <T path="footer.copyright" />
  </div>

  <div className="order-1 xl:order-2 xl:col-span-7">
    <div className="flex flex-wrap justify-center xl:justify-end gap-x-4 gap-y-2 text-[12px] md:text-[13px] opacity-90 leading-tight">
      <button onClick={() => openPanel("about")} className="hover:opacity-90"><T path="footer.links.about" /></button>
      <button onClick={() => openPanel("faq")} className="hover:opacity-90"><T path="footer.links.faq" /></button>
      <Link href="/privacy" className="hover:opacity-90"><T path="footer.links.privacy" /></Link>
      <Link href="/terms" className="hover:opacity-90"><T path="footer.links.terms" /></Link>
    </div>
  </div>
</div>
        </div>
      </div>
    </footer>
  );
}