// src/app/auth/reset/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SetHeaderTitle from "@/components/SetHeaderTitle";
import PasswordInput from "@/components/ui/PasswordInput";
import { useT } from "@/i18n/Provider";

/** простая оценка «силы» пароля (0..5) */
function scorePassword(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 5);
}

export default function ResetPasswordPage() {
  const { t } = useT();

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const [busy, setBusy] = useState(false);
  const [bootBusy, setBootBusy] = useState(true);
  const [ok, setOk] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [recoveryReady, setRecoveryReady] = useState(false);

  // 1) Подтягиваем recovery-сессию из ссылки
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const url = new URL(window.location.href);
        const urlCode = url.searchParams.get("code");

        if (urlCode) {
          const { error } = await supabase.auth.exchangeCodeForSession(urlCode);
          if (error) throw error;
          if (!cancelled) setRecoveryReady(true);
          return;
        }

        // старый формат: #type=recovery&access_token=...&refresh_token=...
        const hash = window.location.hash.replace(/^#/, "");
        const params = new URLSearchParams(hash);
        const type = params.get("type");
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (type === "recovery" && access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) throw error;
          if (!cancelled) setRecoveryReady(true);
          return;
        }

        if (!cancelled) setMsg(t("auth.reset.invalidLink"));
      } catch {
        if (!cancelled) setMsg(t("auth.reset.prepareFailed"));
      } finally {
        if (!cancelled) setBootBusy(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [t]);

  // 2) Валидация
  const strength = useMemo(() => scorePassword(pw), [pw]);
  const matches = pw === pw2;
  const valid = pw.length >= 8 && matches && strength >= 3;

  // 3) Смена пароля (без аргумента — никаких warning'ов)
  async function submit() {
    setMsg(null);

    if (!recoveryReady) {
      setMsg(t("auth.reset.sessionInactive"));
      return;
    }

    if (!valid) {
      setMsg(t("auth.reset.invalidNew"));
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);

    if (error) {
      setMsg(error.message);
      return;
    }
    setOk(true);
  }

  return (
    <main className="content flex-1 px-4">
      <SetHeaderTitle title={t("auth.reset.title")} hideMenu />

      <section className="grid place-items-center min-h-[calc(100svh-260px)] md:min-h-[calc(100svh-320px)] py-6 md:py-10">
        <div className="w-[min(520px,92%)] overflow-hidden rounded-3xl border border-black/10 bg-white/95 shadow-[0_15px_60px_rgba(0,0,0,0.08)]">
          <div className="md:hidden rounded-t-3xl bg-gradient-to-b from-[#EEE7FF] to-white px-5 py-5 text-center">
            <h1 className="text-[20px] font-extrabold tracking-[-0.01em]">
              {t("auth.reset.title")}
            </h1>
            <p className="mt-1 text-[13px] text-neutral-600">
              {t("auth.reset.subtitle")}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="px-5 md:px-6 pb-6 pt-4"
          >
            {/* Статусы и блоки */}
            {bootBusy && (
              <div className="rounded-xl bg-neutral-50 px-4 py-3 text-neutral-700">
                {t("auth.reset.preparing")}
              </div>
            )}

            {!bootBusy && ok && (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">
                {t("auth.reset.done")}{" "}
                <Link href="/auth/sign-in" className="underline underline-offset-2">
                  {t("auth.signup.signIn")}
                </Link>
                .
              </div>
            )}

            {!bootBusy && !ok && (
              <>
                {msg && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] md:text-[14px] text-red-700">
                    {msg}
                  </div>
                )}

                {!recoveryReady && (
                  <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-amber-900">
                    {t("auth.reset.sessionInactive")}
                  </div>
                )}

                {/* New password */}
                <label className="mb-1 block text-[12px] md:text-[13px] text-neutral-600">
                  {t("auth.reset.new")}
                </label>
                <div className="mb-3">
                  <PasswordInput
                    value={pw}
                    onChange={setPw}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    inputClassName="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[#9E73FA]"
                  />
                </div>

                {/* Strength bar */}
                <div className="mb-4">
                  <div className="h-2 w-full rounded-full bg-neutral-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] transition-all"
                      style={{ width: `${(strength / 5) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[12px] text-neutral-500">
                    {strength <= 1 && t("auth.signup.weak")}
                    {strength === 2 && t("auth.signup.weak")}
                    {strength === 3 && t("auth.signup.ok")}
                    {strength === 4 && t("auth.signup.strong")}
                    {strength === 5 && t("auth.signup.veryStrong")}
                  </div>
                </div>

                {/* Repeat */}
                <label className="mb-1 block text-[12px] md:text-[13px] text-neutral-600">
                  {t("auth.reset.repeat")}
                </label>
                <div className="mb-5">
                  <PasswordInput
                    value={pw2}
                    onChange={setPw2}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    inputClassName={[
                      "w-full rounded-2xl border bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[#9E73FA]",
                      pw2.length > 0 && pw !== pw2 ? "border-red-300" : "border-neutral-300",
                    ].join(" ")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!recoveryReady || !valid || busy}
                  className="h-11 w-full rounded-2xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] text-[15px] font-semibold text-white transition disabled:opacity-60"
                >
                  {busy ? t("common.loading") : t("auth.reset.save")}
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}