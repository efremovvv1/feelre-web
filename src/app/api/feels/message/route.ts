// src/app/api/feels/message/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  MessageRequestSchema,
  SignalsSchema,
  ChatReplySchema,
  RecommendationsSchema,
  type Signals
} from "@/modules/agent/contracts";
import { SYSTEM_PROMPT, SIGNALS_EXTRACTION_INSTRUCTIONS } from "@/modules/agent/core/prompts";
import { rankTop8 } from "@/modules/agent/core/rank";

export const runtime = "nodejs";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/** Эвристики: выцепляем relation/occasion/бюджет/валюту прямо из текста */
function heuristicsFromText(t: string): Partial<Signals> {
  const text = t.toLowerCase();

  // relation (родство)
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
    "брат": "brother"
  };
  let relation: string | undefined;
  for (const key of Object.keys(relationMap)) {
    if (text.includes(key)) { relation = relationMap[key]; break; }
  }

  // occasion
  let occasion: string | undefined = undefined;
    if (/д(?:е|)?нь(?:\s|-)?рожд|(?:\bдр\b)|birthday/i.test(t)) occasion = "birthday";
    if (/(новый\s*год|новогод|new\s*year|silvester)/i.test(t)) occasion = "new_year";

  // бюджет + валюта (примеры: "до 80€", "100 евро", "за 50 usd", "100 $")
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

  return {
    recipient_profile: relation ? { relation, interests: [], dislikes: [] } as Signals["recipient_profile"] : undefined,
    gift_context: { occasion, vibe: [], style: [] } as Signals["gift_context"],
    constraints: { budget_max: budgetMax } as Signals["constraints"],
    currency
  };
}

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
    const { message, locale } = parsed.data;

    // 1) Извлекаем сигналы LLM
    const signals = await extractSignals(message, locale);

    // 2) Подмешиваем эвристики, если LLM что-то пропустил
    const h = heuristicsFromText(message);

    if (h.recipient_profile?.relation && !signals.recipient_profile.relation) {
      signals.recipient_profile.relation = h.recipient_profile.relation;
      signals.missing_slots = signals.missing_slots.filter(s => s !== "recipient_profile.relation");
      signals.confidence = Math.max(signals.confidence, 0.6);
    }
    if (h.gift_context?.occasion && !signals.gift_context.occasion) {
      signals.gift_context.occasion = h.gift_context.occasion;
    }
    if (typeof h.constraints?.budget_max === "number" && signals.constraints.budget_max == null) {
      signals.constraints.budget_max = h.constraints.budget_max;
      signals.missing_slots = signals.missing_slots.filter(s => s !== "constraints.budget_max");
      signals.confidence = Math.max(signals.confidence, 0.6);
    }
    if (h.currency && !signals.currency) {
      signals.currency = h.currency;
    }

    // 3) Мягкий фоллоуап (спрашиваем только если совсем мало данных)
    const needFollowUp = signals.confidence < 0.45 || (signals.missing_slots?.length ?? 0) > 2;
    if (needFollowUp) {
      return NextResponse.json(
        ChatReplySchema.parse({
          type: "chat",
          message: friendlyFollowUp(signals),
          suggested_replies: suggestButtons(signals)
        })
      );
    }

    // 4) Рекомендации
    const items = rankTop8(signals);
    if (items.length === 0) {
      return NextResponse.json(
        ChatReplySchema.parse({
          type: "chat",
          message: "Похожих идей не вижу. Выбери направление: для дома, для хобби или сертификат?",
          suggested_replies: ["Для дома", "Для хобби", "Сертификат до 50 €"]
        })
      );
    }

    return NextResponse.json(
      RecommendationsSchema.parse({
        type: "recommendations",
        context: {
          recipient: signals.recipient_profile.relation,
          occasion: signals.gift_context.occasion,
          vibe: signals.gift_context.vibe,
          budget: {
            min: signals.constraints.budget_min ?? null,
            max: signals.constraints.budget_max ?? null
          }
        },
        items,
        diversity_tags: Array.from(new Set(items.flatMap(i => i.badges || []))).slice(0, 4),
        message: shortHeader(signals)
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

function shortHeader(s: Signals): string {
  const v = s.gift_context.vibe?.[0];
  const budget = s.constraints.budget_max ? `до ${s.constraints.budget_max} €` : "";
  const who = s.recipient_profile.relation || "получателя";
  return [`Идеи ${budget}`.trim(), v ? `• ${v}` : "", `• для ${who}`]
    .filter(Boolean)
    .join(" ");
}

function friendlyFollowUp(s: Signals): string {
  const options = suggestButtons(s).slice(0, 3).join(" / ");
  return `Расскажи чуть точнее: для кого и на какой бюджет? Например: ${options}`;
}

function suggestButtons(s: Signals): string[] {
  const vibe = s.gift_context.vibe?.[0] || "уютный";
  return [`Для дома, ${vibe}`, `Для хобби, ${vibe}`, `Сертификат до 50 €`];
}

/** LLM → строгая валидация Signals (fallback при кривом JSON) */
async function extractSignals(userText: string, locale?: string): Promise<Signals> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `${userText}\n\n${SIGNALS_EXTRACTION_INSTRUCTIONS}` }
    ]
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  let parsedJson: unknown;
  try { parsedJson = JSON.parse(raw); } catch { parsedJson = {}; }

  const enriched: Record<string, unknown> =
    typeof parsedJson === "object" && parsedJson !== null
      ? { ...(parsedJson as Record<string, unknown>) }
      : {};

  if (locale && !("locale" in enriched)) enriched.locale = locale;
  if (!("currency" in enriched))
    enriched.currency = process.env.FEELRE_DEFAULT_CURRENCY || "EUR";

  const validated = SignalsSchema.safeParse(enriched);
  if (validated.success) return validated.data;

  return {
    recipient_profile: { interests: [], dislikes: [] },
    gift_context: { vibe: [], style: [] },
    constraints: {},
    locale: locale || "ru-RU",
    currency: "EUR",
    confidence: 0.4,
    missing_slots: ["recipient_profile.relation", "constraints.budget_max"]
  };
}