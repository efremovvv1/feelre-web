// src/data/regions.ts
export type Region = { code: string; name: string; flag: string };

export const REGIONS: Region[] = [
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "AT", name: "Austria",  flag: "🇦🇹" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  // добавим при необходимости
];
