'use client';
import { useT } from '@/i18n/Provider';
import type { Lang } from '@/i18n/config';

const NAMES: Record<Lang, string> = {
  en: 'English 🇬🇧',
  ru: 'Русский 🇷🇺',
  uk: 'Українська 🇺🇦',
  de: 'Deutsch 🇩🇪'
};

export default function LangSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useT();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      className={className ?? 'm-input w-full border border-neutral-200 bg-white'}
      aria-label="Language"
    >
      {Object.entries(NAMES).map(([code, label]) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}