"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import SetHeaderTitle from "@/components/SetHeaderTitle";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const valid = password.length >= 8 && password === password2;

  const submit = async () => {
    setMsg(null);
    if (!valid) return setMsg("Passwords must match and be at least 8 characters.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setMsg(error.message);
    setOk(true);
  };

  return (
    <main className="content px-4">
      <SetHeaderTitle title="Reset Password" />

      {/* Центрирование карточки */}
      <section className="min-h-[70vh] grid place-items-center py-10">
        <div className="w-[min(640px,92%)] rounded-3xl border border-black/10 bg-white/90 p-6 shadow-[0_22px_80px_-24px_rgba(0,0,0,.30)]">
          <h2 className="mb-4 text-center text-[20px] font-semibold">Create a new password</h2>

          {ok ? (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">
              Password updated. You can close this page and sign in.
            </div>
          ) : (
            <>
              {msg && (
                <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-red-700">
                  {msg}
                </div>
              )}

              <label className="mb-1 block text-[13px] text-neutral-600">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mb-3 w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none transition focus:border-[#9E73FA] focus:ring-4 focus:ring-[#B974FF]/20"
              />

              <label className="mb-1 block text-[13px] text-neutral-600">Re-type new password</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="••••••••"
                className="mb-5 w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none transition focus:border-[#9E73FA] focus:ring-4 focus:ring-[#B974FF]/20"
              />

              <button
                onClick={submit}
                disabled={!valid}
                className="h-11 w-full rounded-xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] text-white transition disabled:opacity-100 hover:brightness-[1.03]"
              >
                Reset Password
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
