// src/modules/agent/core/feels-client.ts
import { z } from "zod";
import type { Signals } from "@/modules/agent/contracts";
import {
  ChatReplySchema,
  RecommendationsSchema,
} from "@/modules/agent/contracts";

// Выводим типы из схем
export type ChatReply = z.infer<typeof ChatReplySchema>;
export type Recommendations = z.infer<typeof RecommendationsSchema>;

// Ответ агента + опциональная память
export type FeelsResponse = (ChatReply | Recommendations) & { memory?: Signals };

// Можно отправлять известные сигналы (частичные)
type Payload = {
  message: string;
  locale?: string;
  known?: Partial<Signals>;
};

export async function sendToAgent(
  message: string,
  known?: Partial<Signals>
): Promise<FeelsResponse> {
  const payload: Payload = { message, known };
  const res = await fetch("/api/feels/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}