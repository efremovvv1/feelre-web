"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import AboutCard from "./AboutCard";
import FaqCard from "./FaqCard";
import { sendToAgent, type FeelsResponse, type RecsReply, type RecItem } from "@/lib/feels-client";
import type { Product as UiProduct } from "@/components/products/ProductCard";

/* ---------- Типы UI-сообщений ---------- */
type Role = "user" | "assistant";
type Panel = "about" | "faq" | "none";

type BubbleMsg = {
  kind: "bubble";
  id: string;
  role: Role;
  text: string;
  chips?: string[];
};

type ChatMsg = BubbleMsg;

/* ---------- Пузырь ---------- */
type BubbleProps = {
  children: React.ReactNode;
  align?: "left" | "right";
  tone?: "default" | "info";
  chips?: string[];
  onChipClick?: (value: string) => void;
};

function Bubble({ children, align = "left", tone = "default", chips, onChipClick }: BubbleProps) {
  return (
    <div
      className={[
        "max-w-[760px] rounded-[14px] px-5 py-4 text-[15px] leading-[1.4]",
        align === "right" ? "ml-auto" : "",
        tone === "info"
          ? "bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,.18)] border border-black/10"
          : "bg-white/85 backdrop-blur border border-black/5 shadow-sm",
      ].join(" ")}
    >
      <div>{children}</div>

      {chips && chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => onChipClick?.(c)}
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[13px] shadow-[0_6px_16px_-10px_rgba(0,0,0,.25)] hover:bg-neutral-50"
              type="button"
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Маппер API → твой формат карточек (для ProductGrid) ---------- */
function toUiProduct(it: RecItem): UiProduct {
  return {
    id: it.product_id,
    title: it.title,
    image: it.image || "/placeholder.png",
    shop: "",
    delivery: "",
    price: `${it.price.value.toFixed(2)} ${it.price.currency}`,
    priceValue: it.price.value,
    currency: it.price.currency,
    rating: undefined,
    reviewsCount: undefined,
    url: it.deep_link && it.deep_link.startsWith("http") ? it.deep_link : undefined,
  };
}

/* ============================================================ */
function extractKeywords(t: string): string[] {
  const text = t.toLowerCase();
  const out = new Set<string>();

  // relation
  const rels: Array<[string, RegExp]> = [
    ["sister", /сест|sister/i],
    ["mother", /мам|mother/i],
    ["father", /пап|father/i],
    ["girlfriend", /девуш|girlfriend/i],
    ["boyfriend", /парн|boyfriend/i],
    ["friend", /друг|подруг|friend/i],
    ["brother", /брат|brother/i],
    ["wife", /жена|wife/i],
    ["husband", /муж|husband/i],
    ["colleague", /коллег|colleague/i],
  ];
  for (const [label, rx] of rels) if (rx.test(text)) out.add(label);

  // age
  const age = text.match(/(\d{1,2})\s*(год|года|лет|years?)/i);
  if (age) out.add(`${age[1]} years`);

  // occasions
  if (/д(?:е|)?нь(?:\s|-)?рожд|(?:\bдр\b)|birthday/i.test(text)) out.add("birthday");
  if (/(новый\s*год|новогод|new\s*year|silvester)/i.test(text)) out.add("new_year");

  // budget
  const m = text.match(/(\d{1,5})(?:[.,](\d{1,2}))?\s*(€|eur|евро|\$|usd|доллар)/i);
  if (m) out.add(`${m[1]} ${/€|eur|евро/i.test(m[2]) ? "€" : "$"}`);

  // hobbies/interests
  const hobbies: Array<[string, RegExp]> = [
    ["cooking", /(готов|cooking|cook)/i],
    ["swimming", /(плав|swim)/i],
    ["yoga", /йог|yoga/i],
    ["coffee", /(коф|coffee)/i],
    ["travel", /(путеш|travel)/i],
    ["reading", /(чита|read)/i],
    ["gaming", /(игр|gaming|gamer)/i],
    ["eco", /(эко|eco)/i],
    ["minimal", /(миним|minimal)/i],
    ["cozy", /(уют|cozy|cosy)/i],
  ];
  for (const [h, rx] of hobbies) if (rx.test(text)) out.add(h);

  return Array.from(out);
}


export default function ChatShell() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { kind: "bubble", id: "hello", role: "assistant", text: "Привет! Кому ищем подарок и на какой бюджет?" }
  ]);
  const [panel, setPanel] = useState<Panel>("about");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // корень чата для скролла в центр
  const rootRef = useRef<HTMLElement>(null);

  // Прослушка внешних событий (от футера/хедера)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ panel: Panel }>).detail;
      if (detail?.panel) {
        setPanel(detail.panel);
        rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    window.addEventListener("feelre:open-panel", handler as EventListener);
    return () => window.removeEventListener("feelre:open-panel", handler as EventListener);
  }, []);

  // автоскролл к низу чата при новых сообщениях/лоадере
  const streamEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { streamEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(text?: string) {
    const payload = (text ?? input).trim();
    if (!payload || loading) return;

    if (panel !== "none") setPanel("none");

    // 1) добавляем сообщение пользователя
    setMessages((prev) => [
      ...prev,
      { kind: "bubble", id: crypto.randomUUID(), role: "user", text: payload }
    ]);
    setInput("");
    setLoading(true);

    try {
      // 2) запрос к агенту
      const resp: FeelsResponse = await sendToAgent(payload);

      if (resp.type === "chat") {
        // короткая фраза + чипсы в чате
        setMessages((prev) => [
          ...prev,
          {
            kind: "bubble",
            id: crypto.randomUUID(),
            role: "assistant",
            text: resp.message,
            chips: resp.suggested_replies
          }
        ]);
} else {
  const recs = (resp as RecsReply).items.map(toUiProduct);

  setMessages(prev => [
    ...prev,
    { kind: "bubble", id: crypto.randomUUID(), role: "assistant", text: "Готово! Показал идеи ниже 👇" }
  ]);

  window.dispatchEvent(new CustomEvent("feelre:products", {
    detail: { products: recs, header: resp.message ?? "" }
  }));

  // Keywords из пользовательского текста
  const kw = extractKeywords(payload);
  if (kw.length) {
    window.dispatchEvent(new CustomEvent("feelre:keywords", { detail: { keywords: kw } }));
  }

  window.dispatchEvent(new CustomEvent("feelre:scroll-products"));
}
    } catch {
      setMessages((prev) => [
        ...prev,
        { kind: "bubble", id: crypto.randomUUID(), role: "assistant", text: "Ой, что-то с соединением. Попробуешь ещё раз?" }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="chat-box" ref={rootRef} className="w-full flex flex-col items-center">
      {/* коробка чата 1200×615 */}
      <div
        className="
          relative w-full max-w-[1200px] h-[615px]
          rounded-[16px] border border-[#2d69ff]/30
          shadow-[0_18px_50px_-20px_rgba(30,58,138,.35)]
          overflow-hidden
          bg-gradient-to-b from-white/92 to-[#f7f1fb]/85
        "
      >
        {/* скроллируемая зона */}
        <div className="absolute inset-0 overflow-y-auto p-6 pb-28">
          <div className="mx-auto max-w-[980px] space-y-10">
            {/* ABOUT */}
            {panel === "about" && (
              <div className="transition-all duration-300 opacity-100 translate-y-0">
                <AboutCard onGoFaq={() => setPanel("faq")} onClose={() => setPanel("none")} />
              </div>
            )}

            {/* FAQ */}
            {panel === "faq" && (
              <div className="transition-all duration-300 opacity-100 translate-y-0">
                <FaqCard onBack={() => setPanel("about")} />
              </div>
            )}

            {/* Сообщения (только пузырьки) */}
            {messages.map((m) => (
              <Bubble
                key={m.id}
                align={m.role === "user" ? "right" : "left"}
                tone={m.role === "assistant" ? "default" : "info"}
                chips={m.chips}
                onChipClick={(c) => send(c)}
              >
                {m.text}
              </Bubble>
            ))}

            {loading && (
              <div className="max-w-[760px] rounded-[14px] px-5 py-3 text-[14px] text-neutral-600 bg-white/85 border border-black/5 shadow-sm">
                печатает…
              </div>
            )}
            <div ref={streamEndRef} />
          </div>
        </div>

        {/* input */}
        <div className="absolute left-4 right-4 bottom-4">
          <div className="mx-auto max-w-[980px]">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Напиши: «подарок сестре на ДР до 50 €»"
                className="
                  w-full h-[44px] pl-12 pr-12
                  rounded-[12px] border border-black/10
                  bg-white/90 backdrop-blur
                  text-[14px] placeholder:text-[#9aa0aa]
                  shadow-[0_8px_26px_-10px_rgba(0,0,0,.2)]
                  outline-none focus:ring-2 focus:ring-[#6a83ff]/50
                "
                disabled={loading}
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="
                  absolute right-2 top-1/2 -translate-y-1/2
                  grid place-items-center h-8 w-8 rounded-full
                  bg-[#eff1ff] hover:bg-[#e6e8ff] active:scale-[.98]
                  shadow-[inset_0_-1px_0_rgba(0,0,0,.07)]
                  disabled:opacity-50
                "
                aria-label="Send"
              >
                <Image src="/icons/up-arrow.png" alt="" width={30} height={30} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );


  
}