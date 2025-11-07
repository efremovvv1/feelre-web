// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LANG, LANG_COOKIE, SUPPORTED_LANGS } from "@/modules/web-ui/i18n/config";

export function middleware(req: NextRequest) {
  // 1) Не трогаем API, статику и служебные пути
  const p = req.nextUrl.pathname;
  if (p.startsWith("/api") || p.startsWith("/_next")) {
    return NextResponse.next();
  }

  // 2) Остальное — как было
  const res = NextResponse.next();
  const current = req.cookies.get(LANG_COOKIE)?.value;
  const isSupported =
    current && (SUPPORTED_LANGS as readonly string[]).includes(current);

  if (!isSupported) {
    res.cookies.set({
      name: LANG_COOKIE,
      value: DEFAULT_LANG,
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}

// 3) Матчер: явно исключаем api + статику
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};