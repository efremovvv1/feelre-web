"use client";

type Props = {
  onGoFaq: () => void;
  onClose: () => void; // ✅ новый пропс для крестика
};

export default function AboutCard({ onGoFaq, onClose }: Props) {
  return (
    <div
      className="
        relative
        rounded-[16px] border border-black/5 bg-white/90
        shadow-[0_24px_60px_-24px_rgba(0,0,0,.25)] backdrop-blur
        px-6 py-8
      "
    >
      {/* Крестик */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="
          absolute right-4 top-4 flex h-8 w-8 items-center justify-center
          rounded-full text-[#9aa0aa] hover:bg-black/5 hover:text-black
          transition
        "
      >
        ✕
      </button>

      {/* Заголовок */}
      <div className="text-center text-[13px] font-semibold tracking-[.18em] text-[#a0a3ad] mb-4">
        ABOUT US
      </div>

      {/* Контент */}
      <div className="text-center">
        <div className="text-[32px] leading-tight tracking-[-.01em] font-bold">
          <span className="mr-2">👋</span> Hi, I’m{" "}
          <span className="text-[#6c59ff]">FEELRE</span> — your personal AI
          shopping assistant.
        </div>

        <p className="mt-4 text-[18px] text-[#4a4d57]">
          I can help you find gifts or any products you want in seconds. Just
          tell me your vibe, a budget, or the person you’re shopping for — and
          I’ll suggest great options.
        </p>

        <div className="mt-6 text-center text-[#9aa0aa]">
          Want to learn more?
          <button
            onClick={onGoFaq}
            className="ml-3 rounded-full bg-black text-white px-4 py-2 text-[14px] hover:opacity-90"
          >
            Go to FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
