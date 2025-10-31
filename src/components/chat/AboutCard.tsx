// src/components/AboutCard.tsx
"use client";

import T from "@/i18n/T";

type Props = {
  onGoFaq: () => void;
  onClose: () => void;
};

export default function AboutCard({ onGoFaq, onClose }: Props) {
  return (
    <div
      className="
        relative
        m-card
        border border-black/5
        bg-white/90
        shadow-[0_18px_50px_-20px_rgba(0,0,0,.25)]
        backdrop-blur
        text-center
      "
    >
      {/* Кнопка-крестик */}
      <button
        onClick={onClose}
        aria-label={<T path="about.closeAria" /> as unknown as string}
        className="
          absolute right-3 top-3 md:right-4 md:top-4
          flex h-7 w-7 md:h-8 md:w-8 items-center justify-center
          rounded-full text-[#9aa0aa]
          hover:bg-black/5 hover:text-black
          transition
        "
      >
        ✕
      </button>

      {/* Маленький заголовок */}
      <div className="text-[12px] md:text-[13px] font-semibold tracking-[.18em] text-[#a0a3ad] mb-2 md:mb-3">
        <T path="about.sectionTitleSmall" />
      </div>

      {/* Основной контент */}
      <div>
        <h2
          className="
            m-h1
            text-neutral-900
            font-bold
            leading-[1.15]
            tracking-tight
          "
        >
          <span className="mr-2">👋</span>
          <span className="mr-1">
            <T path="about.hiPrefix" />
          </span>
          <span className="text-[#6c59ff]">
            <T path="about.brand" />
          </span>{" "}
          <T path="about.hiTail" />
        </h2>

        <p className="m-body mt-3 md:mt-4 text-[#4a4d57]">
          <T path="about.body" />
        </p>

        <div className="mt-5 md:mt-6 text-[#9aa0aa] text-[14px] md:text-[15px]">
          <span className="inline-block">
            <T path="about.more.prefix" />
          </span>
          <button
            onClick={onGoFaq}
            className="
              ml-2 md:ml-3
              m-btn
              bg-neutral-900 text-white
              text-[13px] md:text-[14px]
              font-medium
              hover:opacity-90
            "
          >
            <T path="about.more.cta" />
          </button>
        </div>
      </div>
    </div>
  );
}