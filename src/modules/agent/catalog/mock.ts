import type { ProductProvider } from "./provider";
import type { CatalogItem } from "./types";
import type { Signals } from "@/modules/agent/contracts";

const DATA: CatalogItem[] = [
  { id:"sku_game_mouse", title:"Игровая мышь, RGB",
    image:"/mock/game-mouse.jpg", price:{ value:28, currency:"EUR" },
    tags:["gaming","hobby","electronics","budget_0_30"]
  },
  { id:"sku_sketchbook", title:"Скетчбук A5, плотная бумага",
    image:"/mock/sketchbook.jpg", price:{ value:12, currency:"EUR" },
    tags:["drawing","hobby","art","budget_0_30","cozy"]
  },
  { id:"sku_candle_home", title:"Арома-свеча «Ваниль»",
    image:"/mock/candle.jpg", price:{ value:14, currency:"EUR" },
    tags:["home","cozy","budget_0_30"]
  },
  // добавь ещё карточек с разными интересами/ценами
];

function priceBucket(v: number) {
  if (v <= 30) return "budget_0_30";
  if (v <= 50) return "budget_31_50";
  if (v <=100) return "budget_51_100";
  return "budget_100_plus";
}

export const MockProvider: ProductProvider = {
  name: "mock",
  async search(signals: Signals, opts) {
    const limit = opts?.limit ?? 40;
    const interests = new Set((signals.recipient_profile.interests ?? []).map(s => s.toLowerCase()));
    const budgetMax = signals.constraints.budget_max ?? 99999;

    let pool = DATA.filter(d => d.price.value <= budgetMax);

    if (interests.size) {
      pool = pool.filter(d => [...interests].some(x => d.tags.includes(x)));
    }

    if (!interests.size && signals.gift_context?.vibe?.length) {
      const vibe = signals.gift_context.vibe.map(v => v.toLowerCase());
      pool = pool.filter(d => d.tags.some(t => vibe.includes(t) || ["home","cozy","minimal","eco"].includes(t)));
    }

    if (!pool.length) {
      const bucket = priceBucket(budgetMax);
      pool = DATA.filter(d => d.tags.includes(bucket));
    }

    // простое сортирование: матч интересов → близость к бюджету → рейтинг
    pool.sort((a, b) => {
      const aHit = a.tags.some(t => interests.has(t));
      const bHit = b.tags.some(t => interests.has(t));
      if (aHit !== bHit) return aHit ? -1 : 1;

      const want = signals.constraints.budget_max ?? a.price.value;
      const diffA = Math.abs(want - a.price.value);
      const diffB = Math.abs(want - b.price.value);
      if (diffA !== diffB) return diffA - diffB;

      return (b.rating ?? 0) - (a.rating ?? 0);
    });

    // лёгкий diversity: не более 3 из одной главной категории
    const seen: Record<string, number> = {};
    const pick: CatalogItem[] = [];
    for (const it of pool) {
      const main = it.tags.find(t =>
        ["gaming","drawing","cooking","coffee","yoga","reading","travel","home","eco","minimal"].includes(t)
      ) ?? "other";
      seen[main] = (seen[main] ?? 0) + 1;
      if (seen[main] <= 3) pick.push(it);
      if (pick.length >= limit) break;
    }
    return pick;
  }
};

// удобная обёртка
export async function searchMockCatalog(signals: Signals, limit = 40) {
  return MockProvider.search(signals, { limit });
}