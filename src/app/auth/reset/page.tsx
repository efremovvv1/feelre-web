// src/app/auth/reset/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SetHeaderTitle from "@/components/SetHeaderTitle";

/** простая оценка «силы» пароля */
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
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [busy, setBusy] = useState(false);         // сабмит
  const [bootBusy, setBootBusy] = useState(true);  // инициализация страницы
  const [ok, setOk] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [recoveryReady, setRecoveryReady] = useState(false);

  // 1) При заходе по ссылке из письма вытаскиваем сессию восстановления
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // Вариант 1 (новый): redirect вида /auth/reset?code=...
        const url = new URL(window.location.href);
        const urlCode = url.searchParams.get("code");

        if (urlCode) {
          const { error } = await supabase.auth.exchangeCodeForSession(urlCode);
          if (error) throw error;
          if (!cancelled) setRecoveryReady(true);
          return;
        }

        // Вариант 2 (старый): во фрагменте #type=recovery&access_token=...&refresh_token=...
        // Пример: https://app/reset#type=recovery&access_token=...&refresh_token=...
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

        // Если ни один вариант не сработал — возможно ссылка устарела/неверна
        if (!cancelled) {
          setMsg(
            "The reset link is invalid or has expired. Please request a new one."
          );
        }
      } catch (e) {
        if (!cancelled) {
          setMsg(
            e instanceof Error ? e.message : "Failed to prepare recovery session."
          );
        }
      } finally {
        if (!cancelled) setBootBusy(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Валидация
  const strength = useMemo(() => scorePassword(pw), [pw]);
  const matches = pw === pw2;
  const valid = pw.length >= 8 && matches && strength >= 3;

  // 3) Смена пароля
  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setMsg(null);

    if (!recoveryReady) {
      setMsg(
        "Recovery session is not ready. Please open the link from your email again."
      );
      return;
    }

    if (!valid) {
      setMsg(
        "Passwords must match, be at least 8 characters and reasonably strong."
      );
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
      <SetHeaderTitle title="Reset Password" hideMenu />

      <section className="grid place-items-center min-h-[calc(100svh-260px)] md:min-h-[calc(100svh-320px)] py-6 md:py-10">
        <div className="w-[min(520px,92%)] overflow-hidden rounded-3xl border border-black/10 bg-white/95 shadow-[0_15px_60px_rgba(0,0,0,0.08)]">
          <div className="md:hidden rounded-t-3xl bg-gradient-to-b from-[#EEE7FF] to-white px-5 py-5 text-center">
            <h1 className="text-[20px] font-extrabold tracking-[-0.01em]">
              Reset Password
            </h1>
            <p className="mt-1 text-[13px] text-neutral-600">
              Create a new password for your account.
            </p>
          </div>

          <form onSubmit={submit} className="px-5 md:px-6 pb-6 pt-4">
            {/* Статусы и блоки */}
            {bootBusy && (
              <div className="rounded-xl bg-neutral-50 px-4 py-3 text-neutral-700">
                Preparing recovery session…
              </div>
            )}

            {!bootBusy && ok && (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">
                Password updated. You can now{" "}
                <Link
                  href="/auth/sign-in"
                  className="underline underline-offset-2"
                >
                  sign in
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
                    The recovery session is not active. Use the link from the
                    password reset email to open this page.
                  </div>
                )}

                {/* New password */}
                <label className="mb-1 block text-[12px] md:text-[13px] text-neutral-600">
                  New password
                </label>
                <div className="relative mb-3">
                  <input
                    type={show1 ? "text" : "password"}
                    autoComplete="new-password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[#9E73FA]"
                  />
                  <button
                    type="button"
                    aria-label={show1 ? "Hide password" : "Show password"}
                    onClick={() => setShow1((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[12px] text-neutral-500 hover:bg-neutral-100"
                  >
                    {show1 ? "Hide" : "Show"}
                  </button>
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
                    {strength <= 1 && "Very weak"}
                    {strength === 2 && "Weak"}
                    {strength === 3 && "Okay"}
                    {strength === 4 && "Strong"}
                    {strength === 5 && "Very strong"}
                  </div>
                </div>

                {/* Repeat */}
                <label className="mb-1 block text-[12px] md:text-[13px] text-neutral-600">
                  Re-type new password
                </label>
                <div className="relative mb-5">
                  <input
                    type={show2 ? "text" : "password"}
                    autoComplete="new-password"
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[#9E73FA] ${
                      pw2.length > 0 && pw !== pw2
                        ? "border-red-300"
                        : "border-neutral-300"
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={show2 ? "Hide password" : "Show password"}
                    onClick={() => setShow2((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[12px] text-neutral-500 hover:bg-neutral-100"
                  >
                    {show2 ? "Hide" : "Show"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!recoveryReady || !valid || busy}
                  className="h-11 w-full rounded-2xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] text-[15px] font-semibold text-white transition disabled:opacity-60"
                >
                  {busy ? "Saving…" : "Reset Password"}
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}