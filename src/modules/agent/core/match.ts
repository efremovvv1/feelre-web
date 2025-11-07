import catalog from "@/modules/web-ui/data/products.sample.json";
import type { Signals } from "@/modules/agent/contracts";
import type { Product } from "@/modules/shared/types/product";

const norm = (s: string) => s.toLowerCase();

interface Scored {
  p: Product;
  score: number;
}

export function retrieveCandidates(signals: Signals): Product[] {
  const { constraints, gift_context, recipient_profile } = signals;
  const min = constraints.budget_min ?? 0;
  const max = constraints.budget_max ?? Number.POSITIVE_INFINITY;

  const vibe = new Set((gift_context.vibe || []).map(norm));
  const interests = new Set((recipient_profile.interests || []).map(norm));
  const style = new Set((gift_context.style || []).map(norm));

  const scored: Scored[] = (catalog as Product[])
    .map((p) => {
      if (p.price < min || p.price > max) return null;

      const title = norm(p.title);
      const tags = (p.tags || []).map(norm);

      let score = 0;
      for (const v of vibe) if (tags.includes(v)) score += 1;
      for (const i of interests) if (tags.includes(i) || title.includes(i)) score += 1;
      for (const st of style) if (tags.includes(st)) score += 0.5;

      if (typeof p.rating === "number") {
        score += Math.min(0.5, (p.rating - 4.0) * 0.2);
      }

      return { p, score } as Scored | null;
    })
    .filter((x): x is Scored => x !== null);

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.p).slice(0, 24);
}