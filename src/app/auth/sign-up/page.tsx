// src/app/auth/sign-up/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SetHeaderTitle from "@/components/SetHeaderTitle";

type Status = { type: "idle" | "loading" | "ok" | "error"; msg?: string };

export default function SignUpPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const [status, setStatus] = useState<Status>({ type: "idle" });

  const validate = () => {
    if (!nickname.trim()) return "Please enter a nickname.";
    if (!email.includes("@")) return "Please enter a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== password2) return "Passwords do not match.";
    if (!acceptPrivacy || !acceptTerms)
      return "Please accept Terms of Service and Privacy Policy.";
    return null;
  };

  const register = async () => {
    const problem = validate();
    if (problem) {
      setStatus({ type: "error", msg: problem });
      return;
    }
    setStatus({ type: "loading" });

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname, country: country || null, newsletter },
        // emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) {
      setStatus({ type: "error", msg: error.message });
      return;
    }
    setStatus({
      type: "ok",
      msg:
        "We’ve sent a confirmation email. Please check your inbox and confirm the address.",
    });
  };

  const oauth = async (provider: "google" | "apple") => {
    setStatus({ type: "loading" });
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) setStatus({ type: "error", msg: error.message });
  };

  return (
    <main className="content mx-auto max-w-[1100px] px-4 py-10">
      <SetHeaderTitle title="Create an Account" />

      <div className="mx-auto w-[min(720px,92%)] rounded-2xl border border-black/10 bg-white/90 p-6 shadow-[0_18px_60px_-20px_rgba(0,0,0,.25)]">
        {status.type === "error" && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-red-700">{status.msg}</div>
        )}
        {status.type === "ok" && (
          <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">{status.msg}</div>
        )}

        <div className="grid gap-4">
          <Field label="Nickname">
            <input
              className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname"
            />
          </Field>

          <Field label="E-mail">
            <input
              className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
            />
          </Field>

          <Field label="Country (optional)">
            <input
              className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Germany"
            />
          </Field>

          <Field label="Password">
            <input
              className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </Field>

          <Field label="Repeat Password">
            <input
              className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="••••••"
            />
          </Field>

          {/* agreements */}
          <label className="flex items-start gap-3 text-[14px]">
            <input
              type="checkbox"
              className="mt-1"
              checked={acceptPrivacy}
              onChange={(e) => setAcceptPrivacy(e.target.checked)}
            />
            <span>
              I accept the{" "}
              <Link href="/privacy" className="text-[#5b54f2] underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <label className="flex items-start gap-3 text-[14px]">
            <input
              type="checkbox"
              className="mt-1"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span>
              I accept the{" "}
              <Link href="/terms" className="text-[#5b54f2] underline">
                Terms of Service
              </Link>
              .
            </span>
          </label>

          <label className="flex items-start gap-3 text-[14px]">
            <input
              type="checkbox"
              className="mt-1"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
            />
            <span>I agree to receive FEELRE news and updates (optional).</span>
          </label>

          {/* register button */}
          <button
            onClick={register}
            disabled={status.type === "loading"}
            className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] text-white disabled:opacity-60"
          >
            {status.type === "loading" ? "Please wait…" : "Register"}
          </button>

          {/* divider */}
          <div className="my-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center text-sm text-neutral-500">
            <span className="h-px w-full bg-neutral-200" />
            <span>Or register with</span>
            <span className="h-px w-full bg-neutral-200" />
          </div>

          {/* OAuth buttons with icons */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SocialBtn onClick={() => oauth("google")}>
              <GoogleIcon />
              Google
            </SocialBtn>

            <SocialBtn onClick={() => oauth("apple")}>
              <AppleIcon />
              Apple
            </SocialBtn>
          </div>

          <div className="mt-2 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-[#5b54f2] underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[13px] text-neutral-600">{label}</div>
      {children}
    </label>
  );
}

function SocialBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 text-[15px] font-medium transition hover:bg-neutral-50"
    >
      {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.2 29.3 35 24 35c-7.2 0-13-5.8-13-13S16.8 9 24 9c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.5 3.3 29.6 1 24 1 10.7 1 0 11.7 0 25s10.7 24 24 24 24-10.7 24-24c0-1.6-.2-3.1-.4-4.5z" />
      <path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.5 16.1 18.9 13 24 13c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.5 3.3 29.6 1 24 1 15 1 7.6 6.2 4.1 14.1z" />
      <path fill="#4CAF50" d="M24 49c5.2 0 10-1.8 13.7-4.9l-6.3-5.2C29.2 40.2 26.7 41 24 41c-5.3 0-9.7-2.8-12.1-7l-6.6 5C7.6 43.8 15 49 24 49z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3C34.7 31.2 29.3 35 24 35c-5.3 0-9.7-2.8-12.1-7l-6.6 5C7.6 43.8 15 49 24 49c12.3 0 22-9.7 22-22 0-1.6-.2-3.1-.4-4.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 17" aria-hidden>
      <path
        d="M9.3 1.5c.7-.8 1.9-1.4 2.9-1.5.1 1-.3 2.1-1 2.9-.6.8-1.8 1.4-2.9 1.3-.1-1 .3-2.1 1-2.7zM12.8 13.5c-.5 1.1-1.3 2.2-2.3 2.2-.9 0-1.2-.6-2.3-.6s-1.5.6-2.3.6c-1 0-1.8-1.1-2.3-2.2C2.5 12.1 2 10 3.1 8.5 3.8 7.6 4.9 7 6 7c.9 0 1.7.6 2.3.6.6 0 1.6-.7 2.7-.6.5 0 2 .1 2.9 1.5-.1.1-1.7.9-1.1 3z"
        fill="currentColor"
      />
    </svg>
  );
}
