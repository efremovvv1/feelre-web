import type { Lang } from './config';

export async function getDict(lang: Lang) {
  switch (lang) {
    case 'ru':
      return (await import('./dictionaries/ru.json')).default;
     case 'uk':
      return (await import('./dictionaries/uk.json')).default;
     case 'de':
      return (await import('./dictionaries/de.json')).default;
    default:
      return (await import('./dictionaries/en.json')).default;
  }
}
