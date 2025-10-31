// src/components/FaqCard.tsx
"use client";

import { useT } from "@/i18n/Provider";

type Props = { onBack: () => void };

export default function FaqCard({ onBack }: Props) {
  const { t } = useT();

  // Тексты берём из словаря
  const items = [0, 1, 2, 3].map((i) => ({
    title: t(`faq.items.${i}.title`),
    text: t(`faq.items.${i}.text`),
  }));

  return (
    <div
      className="
        relative mt-4 rounded-[16px] border border-black/5 bg-white/90
        shadow-[0_24px_60px_-24px_rgba(0,0,0,.25)] backdrop-blur
        px-4 pt-3 pb-4 sm:px-6 sm:pt-4 sm:pb-5
      "
    >
      {/* Close */}
      <button
        onClick={onBack}
        aria-label={t("faq.closeAria")}
        className="
          absolute right-3 top-3 sm:right-4 sm:top-4 grid h-8 w-8 place-items-center
          rounded-full text-[#9aa0aa] hover:bg-black/5 hover:text-black transition
        "
      >
        ✕
      </button>

      {/* Title */}
      <div className="mb-3 text-center text-[12px] sm:text-[13px] font-semibold tracking-[.18em] text-[#a0a3ad]">
        {t("faq.sectionTitleSmall")}
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-[980px] grid gap-4 sm:gap-5 md:grid-cols-2">
        {items.map((b, i) => (
          <div
            key={b.title}
            className="
              relative overflow-hidden rounded-[14px] border border-black/10 bg-white
              px-4 py-4 sm:px-5 sm:py-5
              shadow-[0_12px_32px_-16px_rgba(0,0,0,.18)]
            "
          >
            {/* big index watermark */}
            <div
              aria-hidden
              className="
                pointer-events-none select-none
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                text-[80px] sm:text-[110px] md:text-[140px] xl:text-[160px]
                font-black text-black/5 leading-none z-0
              "
            >
              {i + 1}
            </div>

            {/* content */}
            <div className="relative z-10">
              <div className="mb-2 text-[18px] sm:text-[20px] font-semibold leading-snug">
                {b.title}
              </div>
              <p
                className="
                  whitespace-pre-line text-[14px] sm:text-[15px]
                  leading-6 sm:leading-7 text-[#444954]
                "
                style={{
                  fontFamily:
                    "var(--font-mont, Montserrat), ui-sans-serif, system-ui",
                }}
              >
                {b.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mx-auto mt-4 max-w-[980px] text-center">
        <div
          className="
            rounded-[12px] border border-black/10 bg-white
            px-4 py-3 sm:px-5 text-[13px] sm:text-[14px] text-[#5a5d69] shadow-sm
          "
          style={{
            fontFamily:
              "var(--font-mont, Montserrat), ui-sans-serif, system-ui",
          }}
        >
          <span className="font-semibold text-[#6c59ff]">{t("brand")}</span>{" "}
          — {t("faq.footerNote")}
        </div>
      </div>
    </div>
  );
}