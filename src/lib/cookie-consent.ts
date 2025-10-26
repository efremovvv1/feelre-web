// src/lib/cookie-consent.ts
export type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

const KEY = "feelre:consent:v1";

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function write(c: Consent) {
  localStorage.setItem(KEY, JSON.stringify(c));
  // одно событие на весь проект, если где-то нужно отреагировать
  window.dispatchEvent(new CustomEvent("feelre:consent-updated", { detail: c }));
}

export const CookieConsentStorage = { read, write, key: KEY };
