// src/app/auth/forgot/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SetHeaderTitle from "@/components/SetHeaderTitle";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    setMsg(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    setLoading(false);
    if (error) return setMsg(error.message);
    setMsg("Reset link sent. Check your inbox.");
  }

  return (
    <main className="content flex-1 px-4">
      {/* заголовок в хедере (десктоп). На мобиле свой заголовок прямо в карточке */}
      <SetHeaderTitle title="Forgot Password?" />

      {/* Вертикальное центрирование: вычитаем примерную высоту шапки + футера */}
      <section
        className="
          grid place-items-center
          min-h-[calc(100svh-260px)] md:min-h-[calc(100svh-320px)]
          py-6 md:py-10
        "
      >
        <div
          className="
            w-[min(520px,92%)]
            rounded-3xl border border-black/10 bg-white/90
            p-5 md:p-6
            shadow-[0_22px_80px_-24px_rgba(0,0,0,.30)]
          "
        >
          {/* Заголовок/описание — только на мобиле */}
          <div className="mb-3 text-center md:hidden">
            <h1 className="text-[20px] font-extrabold tracking-[-0.01em]">
              Forgot Password?
            </h1>
            <p className="mt-1 text-[13px] text-neutral-600">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          {msg && (
            <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">
              {msg}
            </div>
          )}

          <label className="mb-1 block text-[13px] text-neutral-600">
            E-mail address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
            className="
              mb-4 w-full rounded-2xl border border-neutral-300 bg-white
              px-4 py-3 text-[15px] outline-none transition
              focus:border-[#9E73FA] focus:ring-4 focus:ring-[#B974FF]/20
            "
          />

          <button
            onClick={send}
            disabled={loading || !email}
            className="
              h-11 w-full rounded-2xl
              bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6]
              text-white text-[15px] font-semibold
              transition hover:brightness-[1.03] disabled:opacity-60
            "
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>

          <p className="mt-3 text-center text-[13px] text-neutral-600">
            Remembered your password?{" "}
            <Link
              href="/auth/sign-in"
              className="font-semibold text-[#6B66F6] underline-offset-4 hover:underline"
            >
              Back to Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
