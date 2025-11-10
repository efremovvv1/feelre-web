"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import AboutCard from "./AboutCard";
import FaqCard from "./FaqCard";
import { sendToAgent, type FeelsResponse, type Recommendations } from "@/modules/agent/core/feels-client";
import type { Product as UiProduct } from "@/modules/web-ui/components/products/ProductCard";
import type { Signals } from "@/modules/agent/contracts";

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
type RecItem = Recommendations["items"][number];

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
 if (m) {
  const cur = /€|eur|евро/i.test(m[3]) ? "€" : "$";
  // храним в стабильном виде, чтобы KeywordDock красиво переводил
  out.add(`${m[1]}_${cur}`); // пример: "100_€"
}

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

function buildKeywords(payload: string, mem?: Signals | undefined): string[] {
  const fromText = extractKeywords(payload);

  const fromMem: string[] = [];
  if (mem?.recipient_profile?.relation) fromMem.push(mem.recipient_profile.relation);
  if (mem?.gift_context?.occasion)      fromMem.push(mem.gift_context.occasion);
  if (mem?.gift_context?.vibe?.length)  fromMem.push(mem.gift_context.vibe[0]);
  if (typeof mem?.constraints?.budget_max === "number" && mem.currency) {
    const cur = /eur/i.test(mem.currency) ? "€" : "$";
    fromMem.push(`${Math.round(mem.constraints.budget_max)}_${cur}`);
  }
  if (mem?.recipient_profile?.interests?.length) fromMem.push(...mem.recipient_profile.interests);

  // нормализация под KeywordDock
  return Array.from(new Set([...fromText, ...fromMem]))
    .map(k => k.trim().toLowerCase().replace(/\s+/g, "_"));
}

// ===== Канон и гигиена ключей (dedup, синонимы, лимиты) =====
const KEY_WHITELIST = new Set<string>([
  // relation
  "sister","mother","father","girlfriend","boyfriend","friend","brother","wife","husband","colleague",
  // occasion
  "birthday","new_year",
  // interests/vibe
  "gaming","cooking","swimming","yoga","coffee","travel","reading","eco","minimal","cozy",
  // спец-формы идут отдельной проверкой (см. canon)
]);

const SYNONYM_MAP: Record<string,string> = {
  // ru → канон
  "брат":"brother","сестра":"sister","мама":"mother","папа":"father","девушка":"girlfriend","парень":"boyfriend",
  "жена":"wife","муж":"husband","коллега":"colleague",
  "день_рождения":"birthday","др":"birthday","новый_год":"new_year","новыйгод":"new_year",
  "игры":"gaming","компьютерные_игры":"gaming","игровой":"gaming",
  "готовка":"cooking","плавание":"swimming","йога":"yoga","кофе":"coffee",
  "путешествия":"travel","чтение":"reading","эко":"eco","минимализм":"minimal","уютный":"cozy",
};

function canon(raw: string): string {
  const x = raw.trim().toLowerCase().replace(/\s+/g, "_");

  // Бюджет: "40 €", "40€", "40_eur", "40_евро" -> "40_€"
  const money = x.match(/^(\d+)[\s_]*([€$]|eur|usd|евро|доллар)$/i);
  if (money) {
    const cur = /(€|eur|евро)/i.test(money[2]) ? "€" : "$";
    return `${money[1]}_${cur}`;
  }

  // Возраст: "22 years" | "22 года" | "22 лет" -> "22_years"
  const age = x.match(/^(\d+)\s*(год|года|лет|years?)$/i);
  if (age) return `${age[1]}_years`;

  return SYNONYM_MAP[x] ?? x;
}

// Приоритеты, чтобы показывать важное и ограничить число чипсов
function kwScore(k: string): number {
  if (["sister","mother","father","girlfriend","boyfriend","friend","brother","wife","husband","colleague"].includes(k)) return 100;
  if (["birthday","new_year"].includes(k)) return 90;
  if (["gaming","cooking","swimming","yoga","coffee","travel","reading","eco","minimal","cozy"].includes(k)) return 80;
  if (/^\d+_(€|\$)$/.test(k)) return 60;  // бюджет
  if (/^\d+_years$/.test(k)) return 50;   // возраст
  return 10;
}

function tidyKeywords(all: string[], limit = 6): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const raw of all) {
    const k = canon(raw);

    // пропускаем всё, что не в вайтлисте, кроме спец-числовых форм
    const isNumeric = /^\d+_(€|\$)$/.test(k) || /^\d+_years$/.test(k);
    if (!isNumeric && !KEY_WHITELIST.has(k)) continue;

    if (!seen.has(k)) {
      seen.add(k);
      out.push(k);
    }
  }

  out.sort((a, b) => kwScore(b) - kwScore(a));
  return out.slice(0, limit);
}


export default function ChatShell() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { kind: "bubble", id: "hello", role: "assistant", text: "Привет! Кому ищем подарок и на какой бюджет?" }
  ]);
  const [panel, setPanel] = useState<Panel>("about");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [memory, setMemory] = useState<Signals | undefined>(undefined);

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
      const resp: FeelsResponse = await sendToAgent(payload, memory);
      // сразу после const resp = await sendToAgent(...)
      if ("memory" in resp && resp.memory) {
      setMemory(resp.memory);
      }
      if (resp.type === "chat") {
        // короткая фраза + чипсы в чате
        setMessages((prev) => [
          ...prev,
          {
            kind: "bubble",
            id: crypto.randomUUID(),
            role: "assistant",
            text: resp.message,
            chips: resp.suggested_replies,
          }
        ]);
} else {
  const recs = (resp as Recommendations).items.map(toUiProduct);

  setMessages(prev => [
    ...prev,
    { kind: "bubble", 
      id: crypto.randomUUID(), 
      role: "assistant", 
      text: "Готово! Показал идеи ниже 👇" }
  ]);

  

  window.dispatchEvent(new CustomEvent("feelre:products", {
    detail: { products: recs, header: resp.message ?? "" }
  }));

  // 2.5) отправляем keywords всегда
  const kwRaw = [
    ...extractKeywords(payload),                           // из текста
    ...buildKeywords(payload, "memory" in resp ? resp.memory : undefined), // из памяти
  ];
  const kw = tidyKeywords(kwRaw, 6); // 6 — удобный лимит для UX
  if (kw.length) {
    window.dispatchEvent(new CustomEvent("feelre:keywords", { detail: { keywords: kw } }));
  }

  // скроллим к товарам только если пришли рекомендации
  if (resp.type === "recommendations") {
    window.dispatchEvent(new CustomEvent("feelre:scroll-products"));
  }
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