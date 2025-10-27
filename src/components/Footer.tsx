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

  const linkCls = "text-[14px] md:text-[16px] hover:opacity-90 transition-opacity";

  return (
    <footer id="site-footer" className="w-full mt-8 md:mt-10">
      <div className="w-full text-white bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6]">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8 lg:px-10 py-8 md:py-10">
          {/* ===== верх ===== */}
          <div className="grid gap-8 md:gap-6 text-center md:text-left md:grid-cols-12 items-start">
            {/* Brand (3/12) */}
            <div className="md:col-span-3">
              <div className="mt-5 text-[22px] md:text-[28px] font-bold tracking-wide leading-none">FEELRE —</div>
              <div className="text-[14px] md:text-[16px] opacity-95">
                Buy what you really feel.
              </div>
            </div>

            {/* Company (2/12) */}
            <nav className="md:col-span-2">
              <div className="text-[13px] md:text-[15px] font-semibold uppercase tracking-wide opacity-80">
                Company
              </div>
              <div className="mt-3 flex flex-col md:items-start items-center space-y-2">
                <button className={linkCls} onClick={() => openPanel("about")}>About</button>
                <button className={linkCls} onClick={() => openPanel("faq")}>FAQ</button>
              </div>
            </nav>

            {/* Legal (2/12) */}
            <nav className="md:col-span-2">
              <div className="text-[13px] md:text-[15px] font-semibold uppercase tracking-wide opacity-80">
                Legal
              </div>
              <div className="mt-3 flex flex-col md:items-start items-center space-y-2">
                <button className={linkCls}
                        onClick={() => window.dispatchEvent(new CustomEvent("feelre:open-impressum"))}>
                  Impressum
                </button>
                <button className={linkCls}
                        onClick={() => window.dispatchEvent(new CustomEvent("feelre:open-cookies"))}>
                  Cookie Settings
                </button>
              </div>
            </nav>

            {/* Policies (2/12) */}
            <nav className="md:col-span-2">
              <div className="text-[13px] md:text-[15px] font-semibold uppercase tracking-wide opacity-80">
                Policies
              </div>
              <div className="mt-3 flex flex-col md:items-start items-center space-y-2">
                <Link href="/privacy" className={linkCls}>Privacy Policy</Link>
                <Link href="/terms" className={linkCls}>Terms of Service</Link>
              </div>
            </nav>

            {/* Contacts (3/12) */}
            <div className="md:col-span-3 text-center md:text-right">
              <a href="mailto:hello@feerly.com" className="inline-block text-[14px] md:text-[18px] hover:opacity-90">
                hello@feerly.com
              </a>
              <div className="mt-4 flex items-center justify-center md:justify-end gap-5">
                <a aria-label="Instagram" href="#" className="relative h-10 w-10 shrink-0">
                  <Image src="/icons/instagram.png" alt="" fill sizes="38px" className="object-contain" />
                </a>
                <a aria-label="TikTok" href="#" className="relative h-10 w-10 shrink-0">
                  <Image src="/icons/tiktok.png" alt="" fill sizes="28px" className="object-contain" />
                </a>
                <a aria-label="X" href="#" className="relative h-9  w-9 shrink-0">
                  <Image src="/icons/twitter.png" alt="" fill sizes="28px" className="object-contain" />
                </a>
              </div>
            </div>
          </div>

          {/* ===== разделитель ===== */}
          <div className="mt-8 h-px w-full bg-white/20" />

          {/* ===== низ ===== */}
          <div className="mt-5 grid md:grid-cols-12 items-center">
            <div className="order-2 md:order-1 md:col-span-3 text-center md:text-left text-[12px] md:text-[13px] opacity-80">
              © {year} FEELRE. All rights reserved.
            </div>

            <div className="order-1 md:order-2 md:col-span-9">
              <div className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-2 text-[12px] md:text-[13px] opacity-90">
                <button onClick={() => openPanel("about")} className="hover:opacity-90">About</button>
                <button onClick={() => openPanel("faq")} className="hover:opacity-90">FAQ</button>
                <Link href="/privacy" className="hover:opacity-90">Privacy</Link>
                <Link href="/terms" className="hover:opacity-90">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
