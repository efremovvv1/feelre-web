"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import SetHeaderTitle from "@/components/SetHeaderTitle";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setMsg(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    setLoading(false);
    if (error) return setMsg(error.message);
    setMsg("Reset link sent. Check your inbox.");
  };

  return (
    <main className="content px-4">
      <SetHeaderTitle title="Forgot Password?" />

      {/* Центрирование карточки */}
      <section className="min-h-[70vh] grid place-items-center py-10">
        <div className="w-[min(640px,92%)] rounded-3xl border border-black/10 bg-white/90 p-6 shadow-[0_22px_80px_-24px_rgba(0,0,0,.30)]">
          <h2 className="mb-4 text-center text-[20px] font-semibold">
            Receive reset password email
          </h2>

          {msg && (
            <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">
              {msg}
            </div>
          )}

          <label className="mb-1 block text-[13px] text-neutral-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
            className="mb-4 w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none transition focus:border-[#9E73FA] focus:ring-4 focus:ring-[#B974FF]/20"
          />

          <button
            onClick={send}
            disabled={loading || !email}
            className="h-11 w-full rounded-xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] text-white transition disabled:opacity-60 hover:brightness-[1.03]"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </div>
      </section>
    </main>
  );
}
