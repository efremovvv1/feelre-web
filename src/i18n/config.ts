// src/i18n/config.ts
export const SUPPORTED_LANGS = ['en', 'ru', 'de', 'uk'] as const;
export type Lang = typeof SUPPORTED_LANGS[number];

export const DEFAULT_LANG: Lang = 'en';

// единые ключи для client/server
export const LANG_COOKIE = 'feelre_lang';
export const LANG_STORAGE_KEY = 'feelre_lang';

// (опционально, удобные лейблы)
export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  ru: 'Русский',
  de: 'Deutsch',
  uk: 'Українська',
};