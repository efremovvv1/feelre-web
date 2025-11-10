"use client";
import { useEffect, useState } from "react";
import { useT } from "@/modules/web-ui/i18n/Provider";

type Chip = { value: string };

function normalizeKey(v: string) {
  return v.trim().toLowerCase().replace(/\s+/g, "_"); // "New Year" -> "new_year"
}

function labelFor(value: string, lang2: string): string {
  const map: Record<string, Record<string, string>> = {
    ru: {
      sister:"сестра", mother:"мама", father:"папа", girlfriend:"девушка",
      boyfriend:"парень", friend:"друг", brother:"брат", wife:"жена",
      husband:"муж", colleague:"коллега",
      birthday:"день рождения", new_year:"новый год",
      cooking:"готовка", swimming:"плавание", yoga:"йога",
      coffee:"кофе", travel:"путешествия", reading:"чтение",
      gaming:"игры", eco:"эко", minimal:"минимализм", cozy:"уютный"
    },
    de: {
      sister:"Schwester", mother:"Mutter", father:"Vater", girlfriend:"Freundin",
      boyfriend:"Freund", friend:"Freund", brother:"Bruder", wife:"Ehefrau",
      husband:"Ehemann", colleague:"Kollege",
      birthday:"Geburtstag", new_year:"Neujahr",
      cooking:"Kochen", swimming:"Schwimmen", yoga:"Yoga",
      coffee:"Kaffee", travel:"Reisen", reading:"Lesen",
      gaming:"Gaming", eco:"Eco", minimal:"Minimal", cozy:"Gemütlich"
    },
    en: {
      sister:"sister", mother:"mother", father:"father", girlfriend:"girlfriend",
      boyfriend:"boyfriend", friend:"friend", brother:"brother", wife:"wife",
      husband:"husband", colleague:"colleague",
      birthday:"birthday", new_year:"new year",
      cooking:"cooking", swimming:"swimming", yoga:"yoga",
      coffee:"coffee", travel:"travel", reading:"reading",
      gaming:"gaming", eco:"eco", minimal:"minimal", cozy:"cozy"
    }
  };
  const dict = map[lang2] ?? map.en;
  return dict[value] ?? value;
}

function pretty(value: string, lang: string): string {
  // деньги: 40_€  ->  "40 €"
  const mMoney = value.match(/^(\d+)_([€$])$/);
  if (mMoney) return `${mMoney[1]} ${mMoney[2]}`;

  // возраст: 22_years -> "22 года" / "22 Jahre" / "22 years"
  const mAge = value.match(/^(\d+)_years$/);
  if (mAge) {
    const n = Number(mAge[1]);
    if (lang === "ru") {
      const form = (n % 10 === 1 && n % 100 !== 11) ? "год"
                 : ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) ? "года"
                 : "лет";
      return `${n} ${form}`;
    }
    if (lang === "de") return `${n} Jahre`;
    return `${n} years`;
  }

  // всё остальное через словарь переводов
  return labelFor(value, lang);
}

export default function KeywordDock() {
  const [chips, setChips] = useState<Chip[]>([]);
  useT();

  // надёжный выбор языка
  const lang =
    (typeof document !== "undefined" && document.documentElement.getAttribute("lang")?.slice(0, 2)) ||
    (typeof navigator !== "undefined" && navigator.language?.slice(0, 2)) ||
    "en";

  useEffect(() => {
    const onKw = (e: Event) => {
      const detail = (e as CustomEvent<{ keywords: string[] }>).detail;
      if (!detail?.keywords?.length) return;

      setChips(prev => {
        const set = new Set(prev.map(c => c.value));
        for (const raw of detail.keywords) set.add(normalizeKey(raw));
        return Array.from(set).map(v => ({ value: v }));
      });
    };
    window.addEventListener("feelre:keywords", onKw as EventListener);
    return () => window.removeEventListener("feelre:keywords", onKw as EventListener);
  }, []);

  const remove = (idx: number) => setChips(arr => arr.filter((_, i) => i !== idx));
  if (!chips.length) return null;

  return (
    <div className="w-full py-3">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex flex-wrap justify-center gap-3 rounded-[14px] border border-black/5 bg-white/70 backdrop-blur shadow-[0_10px_30px_-14px_rgba(0,0,0,.18)] px-3 py-2">
          {chips.map((c, i) => {
            const key = normalizeKey(c.value);
            return (
              <span
                key={`${key}-${i}`}
                className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-3 py-1.5 text-[13px] leading-none shadow-[0_6px_16px_-10px_rgba(0,0,0,.25)]"
              >
                {pretty(key, lang)}
                <button
                  aria-label="remove keyword"
                  onClick={() => remove(i)}
                  className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-[#f2f3f7] hover:bg-[#e8e9f1] text-[#9094a2]"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}