import type { Signals, Item } from "@/modules/agent/contracts";
import { retrieveCandidates } from "./match";
import type { Product } from "@/modules/shared/types/product";
import type { CatalogItem } from "@/modules/agent/catalog/types";

export function rankTop8(signals: Signals): Item[] {
  const candidates: Product[] = retrieveCandidates(signals);

  const seen = new Set<string>();
  const picked: Product[] = [];

  for (const c of candidates) {
    const tags = c.tags || [];
    const hasNew = tags.some((t) => !seen.has(t));
    if (hasNew || picked.length < 4) {
      tags.forEach((t) => seen.add(t));
      picked.push(c);
    }
    if (picked.length >= 8) break;
  }

  return picked.map<Item>((p) => ({
    product_id: p.id,
    title: p.title,
    price: { value: p.price, currency: p.currency || "EUR" },
    image: p.images?.[0],
    badges: [...(p.tags?.slice(0, 2) || [])],
    why: buildWhy(p, signals),
    match_score: Math.random() * 0.2 + 0.75,
    deep_link: `/product/${p.id}`
  }));
}

export function rankTop8FromPool(pool: CatalogItem[]): CatalogItem[] {
  const arr = [...pool];
  for (let i = 0; i < arr.length - 1; i++) {
    if (Math.random() < 0.12) [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
  }
  return arr.slice(0, 8);
}

function buildWhy(p: Product, s: Signals): string {
  const vibe = s.gift_context.vibe?.[0];
  const interest = s.recipient_profile.interests?.[0];
  const budget = s.constraints.budget_max
    ? `в бюджете до ${s.constraints.budget_max} €`
    : "в твоём бюджете";

  return [vibe ? `${vibe} вайб` : null, interest ? `для "${interest}"` : null, budget]
    .filter(Boolean)
    .join(", ");
}