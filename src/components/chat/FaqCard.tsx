"use client";

type Props = { onBack: () => void };

export default function FaqCard({ onBack }: Props) {
  const blocks = [
    {
      title: "What can I ask for?",
      text:
        "You don’t need to name a product. Just tell me what you feel or want:\n" +
        "• “I want to surprise my mom with something cozy.”\n" +
        "• “I feel bored, need something inspiring.”\n" +
        "You don’t have to be specific — even one short sentence helps me understand your vibe. " +
        "If you’re unsure, I’ll ask a few quick questions to guide you toward the right ideas.",
    },
    {
      title: "How do FEELRE understand your request?",
      text:
        "I read your message and detect keywords, emotions, and intent. Then I match them " +
        "with products that fit your vibe — from cozy to creative, from practical to inspiring.",
    },
    {
      title: "Where do the products come from?",
      text:
        "Products are coming from trusted marketplaces — starting with Amazon, and soon many more. " +
        "You’ll always see the store and price before visiting a product page.",
    },
    {
      title: "How do I start?",
      text:
        "Just type a message below. Here are a few examples to begin:\n" +
        "• “Gift for my sister, 25, likes yoga. Budget $80.”\n" +
        "• “Something small and cute for a colleague.”\n" +
        "• “Birthday idea for mom who loves cooking.”\n" +
        "Once you send it, I’ll instantly suggest ideas that match your tone and budget.",
    },
  ];

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
        aria-label="Close FAQ"
        className="
          absolute right-3 top-3 sm:right-4 sm:top-4 grid h-8 w-8 place-items-center
          rounded-full text-[#9aa0aa] hover:bg-black/5 hover:text-black transition
        "
      >
        ✕
      </button>

      {/* Title */}
      <div className="mb-3 text-center text-[12px] sm:text-[13px] font-semibold tracking-[.18em] text-[#a0a3ad]">
        FAQ
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-[980px] grid gap-4 sm:gap-5 md:grid-cols-2">
        {blocks.map((b, i) => (
          <div
            key={b.title}
            className="
              relative overflow-hidden rounded-[14px] border border-black/10 bg-white
              px-4 py-4 sm:px-5 sm:py-5
              shadow-[0_12px_32px_-16px_rgba(0,0,0,.18)]
            "
          >
            {/* big index watermark */}
           {/* watermark — ВИДНА и на мобиле */}
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

{/* контент поверх цифры */}
<div className="relative z-10">
  <div className="mb-2 text-[18px] sm:text-[20px] font-semibold leading-snug">
    {b.title}
  </div>
  <p
    className="
      whitespace-pre-line text-[14px] sm:text-[15px]
      leading-6 sm:leading-7 text-[#444954]
    "
    style={{ fontFamily: "var(--font-mont, Montserrat), ui-sans-serif, system-ui" }}
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
          style={{ fontFamily: "var(--font-mont, Montserrat), ui-sans-serif, system-ui" }}
        >
          <span className="font-semibold text-[#6c59ff]">Feelre</span> — not just
          search. It’s a conversation about what you truly want.
        </div>
      </div>
    </div>
  );
}
