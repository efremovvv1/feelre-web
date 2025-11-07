export type ChatReply = {
  type: "chat";
  message: string;
  suggested_replies?: string[];
};

export type RecItem = {
  product_id: string;
  title: string;
  price: { value: number; currency: string };
  image?: string;
  badges?: string[];
  why?: string;
  deep_link?: string;
  match_score?: number;
};

export type RecsReply = {
  type: "recommendations";
  message?: string;
  items: RecItem[];
};

export type FeelsResponse = ChatReply | RecsReply;

export async function sendToAgent(message: string): Promise<FeelsResponse> {
  const res = await fetch("/api/feels/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });
  if (!res.ok) throw new Error(`FEELRE API error: ${res.status}`);
  return res.json();
}