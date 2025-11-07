'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  type Lang,
  LANG_STORAGE_KEY,
  LANG_COOKIE,
} from './config';

// словари
import en from './dictionaries/en.json';
import ru from './dictionaries/ru.json';
import uk from './dictionaries/uk.json';
import de from './dictionaries/de.json';

// сопоставление язык → словарь
const DICTS: Record<Lang, Record<string, unknown>> = { en, ru, uk, de };

// переменные для {{placeholder}}
export type Vars = Record<string, string | number | boolean>;

// безопасный доступ "a.b.c"
function get(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// интерполяция {{var}}
function interpolate(str: string, vars?: Vars): string {
  return str.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(vars?.[k] ?? ''));
}

// type guard
function isLang(v: unknown): v is Lang {
  return typeof v === 'string' && (SUPPORTED_LANGS as readonly string[]).includes(v);
}

type TFn = (path: string, vars?: Vars) => string;
type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFn;
};

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({
  initialLang,
  children,
}: {
  initialLang?: Lang;
  children: React.ReactNode;
}) {
  // порядок источников: localStorage → cookie → initialLang → DEFAULT_LANG
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const fromLs = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(fromLs)) return fromLs;

      const m = document.cookie.match(
        new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=([^;]+)`)
      );
      const fromCookie = m?.[1];
      if (isLang(fromCookie)) return fromCookie;
    }
    return initialLang ?? DEFAULT_LANG;
  });

  const setLang = useCallback((l: Lang) => {
    if (!isLang(l)) return;
    setLangState(l);
  }, []);

  // синхронизируем localStorage и cookie + рассылаем событие
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.dispatchEvent(new CustomEvent('feelre:lang', { detail: { lang } }));
  }, [lang]);

  const t: TFn = useCallback(
    (path: string, vars?: Vars) => {
      const dict = DICTS[lang];
      const value = get(dict, path);
      if (typeof value === 'string') return interpolate(value, vars);
      return path; // fallback, если ключ не найден
    },
    [lang]
  );

  const value = useMemo<I18nCtx>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT(): I18nCtx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used inside I18nProvider');
  return ctx;
}