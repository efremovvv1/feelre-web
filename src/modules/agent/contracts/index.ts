// ai - FULL Stack не трогать !

import { z } from "zod";

/** ----- Signals (память агента) ----- */
export const SignalsSchema = z.object({
  recipient_profile: z.object({
    relation: z.string().optional(),
    age_range: z.string().optional(),
    interests: z.array(z.string()).default([]),
    dislikes: z.array(z.string()).default([]),
    gender: z.string().optional()
  }).default({ interests: [], dislikes: [] }),

  gift_context: z.object({
    occasion: z.string().optional(),
    date: z.string().optional(),
    vibe: z.array(z.string()).default([]),
    style: z.array(z.string()).default([]),
    sentiment: z.string().optional()
  }).default({ vibe: [], style: [] }),

  constraints: z.object({
    budget_min: z.number().nullable().optional(),
    budget_max: z.number().nullable().optional(),
    shipping_deadline: z.string().optional(),
    sustainability: z.boolean().optional(),
    brand_blacklist: z.array(z.string()).optional(),
    brand_whitelist: z.array(z.string()).optional()
  }).default({}),

  locale: z.string().default(process.env.FEELRE_DEFAULT_LOCALE || "ru-RU"),
  currency: z.string().default(process.env.FEELRE_DEFAULT_CURRENCY || "EUR"),

  confidence: z.number().min(0).max(1).default(0.7),
  missing_slots: z.array(z.string()).default([])
});

export type Signals = z.infer<typeof SignalsSchema>;

/** Частичная память, которую клиент присылает серверу вместе с текстом */
export const KnownSignalsSchema = SignalsSchema.partial(); // достаточно для наших целей
export type KnownSignals = z.infer<typeof KnownSignalsSchema>;

/** ----- Chat reply ----- */
export const ChatReplySchema = z.object({
  type: z.literal("chat"),
  message: z.string(),
  suggested_replies: z.array(z.string()).optional(),
  /** актуальная «память» после мерджа на сервере */
  memory: SignalsSchema.optional(),
});
export type ChatReply = z.infer<typeof ChatReplySchema>;

/** ----- Item / Recommendations ----- */
export const ItemSchema = z.object({
  product_id: z.string(),
  title: z.string(),
  price: z.object({ value: z.number(), currency: z.string() }),
  image: z.string().optional(),
  badges: z.array(z.string()).optional(),
  why: z.string().optional(),
  match_score: z.number().optional(),
  deep_link: z.string().optional()
});
export type Item = z.infer<typeof ItemSchema>;

export const RecommendationsSchema = z.object({
  type: z.literal("recommendations"),
  context: z.object({
    recipient: z.string().optional(),
    occasion: z.string().optional(),
    vibe: z.array(z.string()).optional(),
    budget: z.object({
      min: z.number().nullable().optional(),
      max: z.number().nullable().optional()
    }).optional()
  }),
  items: z.array(ItemSchema).max(8),
  diversity_tags: z.array(z.string()).optional(),
  fallback: z.any().nullable().optional(),
  message: z.string().optional(),
  /** тоже возвращаем актуальную «память», чтобы клиент её сохранил */
  memory: SignalsSchema.optional(),
});
export type RecommendationsReply = z.infer<typeof RecommendationsSchema>;

/** ----- Message request (к серверу) ----- */
export const MessageRequestSchema = z.object({
  user_id: z.string().optional(),
  session_id: z.string().optional(),
  locale: z.string().optional(),
  message: z.string(),
  /** Новое поле: частичная память от клиента */
  known: KnownSignalsSchema.optional(),
});
export type MessageRequest = z.infer<typeof MessageRequestSchema>;

/** Объединённый ответ */
export type FeelsResponse = ChatReply | RecommendationsReply;