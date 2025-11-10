// src/app/api/feels/message/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  MessageRequestSchema,
  SignalsSchema,
  ChatReplySchema,
  RecommendationsSchema,
  type Signals,
  type KnownSignals,
} from "@/modules/agent/contracts";
import {
  SYSTEM_PROMPT,
  SIGNALS_EXTRACTION_INSTRUCTIONS,
} from "@/modules/agent/core/prompts";
import { searchMockCatalog } from "@/modules/agent/catalog/mock";
import { rankTop8FromPool } from "@/modules/agent/core/rank";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const DEF_LOCALE = process.env.FEELRE_DEFAULT_LOCALE || "ru-RU";
const DEF_CURRENCY = process.env.FEELRE_DEFAULT_CURRENCY || "EUR";

/* ---------------------- Евристики из текста ---------------------- */
function heuristicsFromText(t: string): Partial<Signals> {
  const text = t.toLowerCase();

  // relation
  const relationMap: Record<string, string> = {
    "сест": "sister",
    "мам": "mother",
    "пап": "father",
    "девуш": "girlfriend",
    "парн": "boyfriend",
    "жена": "wife",
    "муж": "husband",
    "коллег": "colleague",
    "друг": "friend",
    "подруг": "friend",
    "брат": "brother",
  };
  let relation: string | undefined;
  for (const key of Object.keys(relationMap)) {
    if (text.includes(key)) {
      relation = relationMap[key];
      break;
    }
  }

  // occasion
  let occasion: string | undefined;
  if (/д(?:е|)?нь(?:\s|-)?рожд|(?:\bдр\b)|birthday/i.test(t)) occasion = "birthday";
  if (/(новый\s*год|новогод|new\s*year|silvester)/i.test(t)) occasion = "new_year";

  // бюджет + валюта
  const m = t.match(/(\d{1,5})(?:[.,](\d{1,2}))?\s*(€|eur|евро|\$|usd|доллар)/i);
  let budgetMax: number | undefined;
  let currency: string | undefined;
  if (m) {
    const int = parseInt(m[1], 10);
    const frac = m[2] ? parseInt(m[2], 10) / 100 : 0;
    budgetMax = int + frac;
    const curRaw = m[3].toLowerCase();
    if (["€", "eur", "евро"].includes(curRaw)) currency = "EUR";
    if (["$", "usd", "доллар"].includes(curRaw)) currency = "USD";
  }

  // интересы
  const interests: string[] = [];
  if (/(компьютерн|видеоигр|игр|gaming|game)/i.test(t)) interests.push("gaming");
  if (/(рисован|скетч|drawing|art)/i.test(t)) interests.push("drawing");
  if (/(готовк|кулин|cooking|cook)/i.test(t)) interests.push("cooking");
  if (/(кофе|coffee)/i.test(t)) interests.push("coffee");
  if (/(йог|yoga)/i.test(t)) interests.push("yoga");

  return {
    recipient_profile: relation
      ? { relation, interests, dislikes: [] }
      : { interests, dislikes: [] },
    gift_context: { occasion, vibe: [], style: [] },
    constraints: { budget_max: budgetMax },
    currency,
    confidence: 0.55,
  };
}

/* ----------- LLM → Partial<Signals> (строгая валидация) ----------- */
async function extractSignalsLLM(
  userText: string,
  locale?: string
): Promise<Partial<Signals>> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `${userText}\n\n${SIGNALS_EXTRACTION_INSTRUCTIONS}` },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  const enriched: Record<string, unknown> =
    typeof parsed === "object" && parsed !== null
      ? { ...(parsed as Record<string, unknown>) }
      : {};
  if (locale && !("locale" in enriched)) enriched.locale = locale;
  if (!("currency" in enriched)) enriched.currency = DEF_CURRENCY;

  const v = SignalsSchema.safeParse(enriched);
  return v.success ? v.data : {};
}

/* ------------- Мягкий merge: known → heur → llm ------------- */
function mergeSignals(
  known: Partial<Signals> = {},
  heur: Partial<Signals> = {},
  llm: Partial<Signals> = {}
): Signals {
  const base: Signals = {
    recipient_profile: { relation: undefined, interests: [], dislikes: [] },
    gift_context: { occasion: undefined, vibe: [], style: [] },
    constraints: {},
    locale: DEF_LOCALE,           // важно: строка, не undefined
    currency: DEF_CURRENCY,
    confidence: 0.5,
    missing_slots: [],
  };

  const pick = (x?: Partial<Signals>) => ({
    recipient_profile: {
      relation: x?.recipient_profile?.relation,
      interests: x?.recipient_profile?.interests ?? [],
      dislikes: x?.recipient_profile?.dislikes ?? [],
    },
    gift_context: {
      occasion: x?.gift_context?.occasion,
      vibe: x?.gift_context?.vibe ?? [],
      style: x?.gift_context?.style ?? [],
    },
    constraints: {
      budget_min: x?.constraints?.budget_min ?? null,
      budget_max: x?.constraints?.budget_max ?? null,
    },
    locale: x?.locale,
    currency: x?.currency,
    confidence: x?.confidence ?? 0,
  });

  const K = pick(known);
  const H = pick(heur);
  const L = pick(llm);

  const merged: Signals = {
    ...base,
    recipient_profile: {
      relation: L.recipient_profile.relation ?? H.recipient_profile.relation ?? K.recipient_profile.relation,
      interests: Array.from(new Set([
        ...K.recipient_profile.interests,
        ...H.recipient_profile.interests,
        ...L.recipient_profile.interests,
      ])),
      dislikes: Array.from(new Set([
        ...K.recipient_profile.dislikes,
        ...H.recipient_profile.dislikes,
        ...L.recipient_profile.dislikes,
      ])),
    },
    gift_context: {
      occasion: L.gift_context.occasion ?? H.gift_context.occasion ?? K.gift_context.occasion,
      vibe: Array.from(new Set([
        ...K.gift_context.vibe,
        ...H.gift_context.vibe,
        ...L.gift_context.vibe,
      ])),
      style: Array.from(new Set([
        ...K.gift_context.style,
        ...H.gift_context.style,
        ...L.gift_context.style,
      ])),
    },
    constraints: {
      budget_min: L.constraints.budget_min ?? H.constraints.budget_min ?? K.constraints.budget_min ?? null,
      budget_max: L.constraints.budget_max ?? H.constraints.budget_max ?? K.constraints.budget_max ?? null,
    },
    locale: L.locale ?? H.locale ?? K.locale ?? base.locale,
    currency: L.currency ?? H.currency ?? K.currency ?? base.currency,
    confidence: Math.max(base.confidence, K.confidence, H.confidence, L.confidence),
    missing_slots: [],
  };

  const miss: string[] = [];
  if (!merged.recipient_profile.relation) miss.push("recipient_profile.relation");
  if (merged.constraints.budget_max == null) miss.push("constraints.budget_max");
  if (!merged.gift_context.occasion) miss.push("gift_context.occasion");
  merged.missing_slots = miss;

  return merged;
}

/* ------------------------------- POST ------------------------------- */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = MessageRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Bad request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, locale, known } = parsed.data as {
      message: string; locale?: string; known?: KnownSignals;
    };

    // known (память клиента) → эвристики → LLM → merge
    const heur = heuristicsFromText(message);
    const llm  = await extractSignalsLLM(message, locale);
    const mem  = mergeSignals(known, heur, llm);

    // Если не хватает ключевых слотов — задаём ровно то, чего не хватает
    const needRelation = !mem.recipient_profile.relation;
    const needBudget   = mem.constraints.budget_max == null;
    const needOccasion = !mem.gift_context.occasion;

    if (needRelation || needBudget || needOccasion) {
      const parts: string[] = [];
      if (needRelation) parts.push("для кого подарок (сестра, брат, мама)?");
      if (needBudget)   parts.push("какой бюджет (например: до 30 €, 40–60 €)?");
      if (needOccasion) parts.push("по какому поводу?");

      const msg =
        parts.length === 1
          ? `Уточни, пожалуйста: ${parts[0]}`
          : `Почти готово. Уточни, пожалуйста: ${parts.slice(0, -1).join(", ")} и ${parts.at(-1)}`;

      return NextResponse.json(
        ChatReplySchema.parse({
          type: "chat",
          message: msg,
          suggested_replies: [],
          memory: mem,
        })
      );
    }

    // Рекомендации (мок-каталог → ранжирование)
    const pool   = await searchMockCatalog(mem, 40);
    const picked = rankTop8FromPool(pool);

    const items = picked.map((it) => ({
      product_id: it.id,
      title: it.title,
      image: it.image || "",
      price: { value: it.price.value, currency: it.price.currency },
      deep_link: it.deep_link || "",
      badges: it.tags.slice(0, 3),
    }));

    if (items.length === 0) {
      return NextResponse.json(
        ChatReplySchema.parse({
          type: "chat",
          message: "Похожих идей не вижу. Можешь уточнить интересы или стиль?",
          suggested_replies: [],
          memory: mem,
        })
      );
    }

    return NextResponse.json(
      RecommendationsSchema.parse({
        type: "recommendations",
        context: {
          recipient: mem.recipient_profile.relation,
          occasion: mem.gift_context.occasion,
          vibe: mem.gift_context.vibe,
          budget: {
            min: mem.constraints.budget_min ?? null,
            max: mem.constraints.budget_max ?? null,
          },
        },
        items,
        diversity_tags: Array.from(new Set(items.flatMap((i) => i.badges || []))).slice(0, 4),
        message: "",     // ничего лишнего в чате
        memory: mem,     // возвращаем актуальную «память»
      })
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal error", details: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}