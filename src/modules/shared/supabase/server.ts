// src/lib/supabase-server.ts
import { cookies as nextCookies } from "next/headers";
import {
  createServerClient,
  type CookieOptionsWithName, // <-- тип опций, которого ждёт @supabase/ssr
} from "@supabase/ssr";

/**
 * SSR Supabase-клиент с корректной работой cookie в Next 15.
 * Ваша версия @supabase/ssr ожидает интерфейс cookies: { get/set/remove }.
 */
export async function getServerSupabase() {
  const store = await nextCookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return store.get(name)?.value;
        },
        set(name: string, value: string, options?: CookieOptionsWithName) {
          // next/headers .set принимает объект формата ResponseCookie
          // Поля из CookieOptionsWithName можно пробросить как есть
          store.set({
            name,
            value,
            path: options?.path,
            domain: options?.domain,
            httpOnly: options?.httpOnly,
            secure: options?.secure,
            sameSite: options?.sameSite, // у Supabase это 'lax' | 'strict' | 'none' | undefined — подмножество Next
            expires: options?.expires,
            maxAge: options?.maxAge,
          });
        },
        remove(name: string, options?: CookieOptionsWithName) {
          // В Next удаление — это set с пустым value и (обычно) maxAge=0/истёкшим expires.
          // Делаем «мягкое» удаление: пустое значение + пробрасываем контекст пути/домена.
          store.set({
            name,
            value: "",
            path: options?.path,
            domain: options?.domain,
            httpOnly: options?.httpOnly,
            secure: options?.secure,
            sameSite: options?.sameSite,
            expires: options?.expires,
            maxAge: 0,
          });
        },
      },
    }
  );
}
