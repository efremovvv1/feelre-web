// src/app/auth/forgot/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import SetHeaderTitle from "@/modules/web-ui/components/SetHeaderTitle";
import { useT } from "@/modules/web-ui/i18n/Provider";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function ForgotPage() {
  const { t } = useT();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  async function send() {
    setMsg(null);

    if (!isValidEmail(email)) {
      setMsg(t("auth.forgotPage.invalidEmail"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || t("auth.forgotPage.failed"));

      setOk(true);
      setMsg(t("auth.forgotPage.sent"));
    } catch (e) {
      setOk(false);
      setMsg(e instanceof Error ? e.message : t("auth.forgotPage.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="content flex-1 px-4">
      {/* десктопный заголовок */}
      <SetHeaderTitle title={t("auth.forgotPage.title")} />

      <section className="grid place-items-center min-h-[calc(100svh-260px)] md:min-h-[calc(100svh-320px)] py-6 md:py-10">
        <div className="w-[min(520px,92%)] rounded-3xl border border-black/10 bg-white/90 p-5 md:p-6 shadow-[0_22px_80px_-24px_rgba(0,0,0,.30)]">
          {/* моб-заголовок */}
          <div className="mb-3 text-center md:hidden">
            <h1 className="text-[20px] font-extrabold tracking-[-0.01em]">
              {t("auth.forgotPage.title")}
            </h1>
            <p className="mt-1 text-[13px] text-neutral-600">
              {t("auth.forgotPage.subtitle")}
            </p>
          </div>

          {msg && (
            <div
              className={`mb-4 rounded-xl px-4 py-3 text-[13px] ${
                ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
              }`}
            >
              {msg}
            </div>
          )}

          <label className="mb-1 block text-[13px] text-neutral-600">
            {t("auth.forgotPage.emailLabel")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.forgotPage.placeholder")}
            className="mb-4 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[#9E73FA] focus:ring-4 focus:ring-[#B974FF]/20"
          />

          <button
            onClick={send}
            disabled={loading || !email}
            className="h-11 w-full rounded-2xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] text-white text-[15px] font-semibold transition hover:brightness-[1.03] disabled:opacity-60"
          >
            {loading ? t("auth.forgotPage.sending") : t("auth.forgotPage.send")}
          </button>

          <p className="mt-3 text-center text-[13px] text-neutral-600">
            {t("auth.forgotPage.remembered")}{" "}
            <Link
              href="/auth/sign-in"
              className="font-semibold text-[#6B66F6] underline-offset-4 hover:underline"
            >
              {t("auth.forgotPage.back")}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}