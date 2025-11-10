export type Money = { value: number; currency: string };

export type CatalogItem = {
  id: string;
  title: string;
  image?: string;
  price: Money;
  tags: string[];          // gaming, drawing, home, cozy, minimal, eco, hobby...
  shop?: string;           // "Mock Store", "eBay" и т.п.
  deep_link?: string;      // при подключении аффилиейт
  rating?: number;         // 0..5
  reviewsCount?: number;
};