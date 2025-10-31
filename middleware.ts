import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_LANG, LANG_COOKIE, SUPPORTED_LANGS } from '@/i18n/config'

export function middleware(req: NextRequest) {
  // просто пропускаем запрос дальше
  const res = NextResponse.next()

  // при первом заходе выставим язык по умолчанию, если куки нет/битая
  const current = req.cookies.get(LANG_COOKIE)?.value
  const isSupported = current && (SUPPORTED_LANGS as readonly string[]).includes(current)

  if (!isSupported) {
    res.cookies.set({
      name: LANG_COOKIE,
      value: DEFAULT_LANG,
      path: '/',
      maxAge: 60 * 60 * 24 * 365,     // 1 год
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  }

  return res
}

export const config = {
  // исключим статику, картинки и фавикон
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)'],
}