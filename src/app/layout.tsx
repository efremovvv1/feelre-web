// src/app/layout.tsx
import './globals.css';
import SiteShell from '@/modules/web-ui/components/SiteShell';
import { montserrat } from '@/modules/web-ui/styles/fonts';
import { cookies } from 'next/headers';
import { I18nProvider } from '@/modules/web-ui/i18n/Provider';
import { DEFAULT_LANG, SUPPORTED_LANGS, type Lang, LANG_COOKIE } from '@/modules/web-ui/i18n/config';

export const metadata = { title: 'FEELRE', description: 'AI shopping assistant' };

function isLang(v: string | undefined): v is Lang {
  return !!v && (SUPPORTED_LANGS as readonly string[]).includes(v);
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const raw = jar.get(LANG_COOKIE)?.value;
  const lang: Lang = isLang(raw) ? raw : DEFAULT_LANG;

  return (
    <html lang={lang}>
      <body className={`${montserrat.variable} min-h-dvh flex flex-col`}>
        <I18nProvider initialLang={lang}>
          <SiteShell>{children}</SiteShell>
        </I18nProvider>
      </body>
    </html>
  );
}