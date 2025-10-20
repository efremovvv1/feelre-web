"use client";

type Props = {
  onBack: () => void;
};

export default function FaqCard({ onBack }: Props) {
  const blocks = [
    {
      title: "What can I ask for?",
      text:
        "You don’t need to name a product. Just tell me what you feel or want:\n" +
        "• “I want to surprise my mom with something cozy.”\n" +
        "• “I feel bored, need something inspiring.”\n\n" +
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
        "• “Birthday idea for mom who loves cooking.”\n\n" +
        "Once you send it, I’ll instantly suggest ideas that match your tone and budget.",
    },
  ];

  return (
    <div
      className="
        relative mt-4 rounded-[16px] border border-black/5 bg-white/90
        shadow-[0_24px_60px_-24px_rgba(0,0,0,.25)] backdrop-blur
        px-6 pt-4 pb-5
      "
    >
      {/* Крестик */}
      <button
        onClick={onBack}
        aria-label="Close FAQ"
        className="
          absolute right-4 top-4 flex h-8 w-8 items-center justify-center
          rounded-full text-[#9aa0aa] hover:bg-black/5 hover:text-black
          transition
        "
      >
        ✕
      </button>

      {/* Заголовок */}
      <div className="mb-3 text-center text-[13px] font-semibold tracking-[.18em] text-[#a0a3ad]">
        FAQ
      </div>

      {/* Сетка карточек */}
      <div className="mx-auto max-w-[980px] grid gap-5 md:grid-cols-2">
        {blocks.map((b, i) => (
          <div
            key={b.title}
            className="
              relative overflow-hidden rounded-[14px] border border-black/10 bg-white
              px-5 py-5 shadow-[0_16px_40px_-18px_rgba(0,0,0,.22)]
              min-h-[240px]
            "
          >
            <div
              aria-hidden
              className="
                pointer-events-none select-none
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                text-[160px] font-black text-black/5 leading-none
              "
            >
              {i + 1}
            </div>
            <div className="relative">
              <div className="mb-2 text-[20px] font-semibold">{b.title}</div>
              <pre className="whitespace-pre-wrap text-[15px] text-[#444954]">
                {b.text}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Подпись */}
      <div className="mx-auto mt-4 max-w-[980px] text-center">
        <div className="rounded-[12px] border border-black/10 bg-white px-5 py-3 text-[14px] text-[#5a5d69] shadow-sm">
          <span className="font-semibold text-[#6c59ff]">Feelre</span> — not just
          search. It’s a conversation about what you truly want.
        </div>
      </div>
    </div>
  );
}
