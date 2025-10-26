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
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
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
    <main className="content mx-auto max-w-[480px] px-4 py-6 md:py-10">
      {/* десктопный заголовок + скрыть бургер */}
      <SetHeaderTitle title="👋 Say Hi to FEELRE" hideMenu />

      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white/95 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        {/* Заголовок карточки (только мобайл) */}
        <div className="md:hidden rounded-t-3xl bg-gradient-to-b from-[#EEE7FF] to-white px-5 py-6 text-center">
          <h1 className="text-[19px] font-extrabold tracking-[-0.01em]">
            👋 Say hi to <span className="text-[#6B66F6]">FEELRE</span>
          </h1>
          <p className="mt-1 text-[13px] text-neutral-600">
            Create your account and start exploring.
          </p>
        </div>

        <div className="px-5 md:px-6 pb-6 pt-4">
          {status.type === "error" && (
            <div className="mb-3 rounded-xl bg-red-50 px-4 py-2.5 text-[13px] text-red-700">
              {status.msg}
            </div>
          )}
          {status.type === "ok" && (
            <div className="mb-3 rounded-xl bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-800">
              {status.msg}
            </div>
          )}

          <div className="grid gap-3">
            <Field label="Nickname">
              <input
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[#9E73FA]"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Your nickname"
              />
            </Field>

            <Field label="E-mail">
              <input
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[#9E73FA]"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
              />
            </Field>

            <Field label="Country (optional)">
              <input
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[#9E73FA]"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Germany"
              />
            </Field>

            <Field label="Password">
              <input
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[#9E73FA]"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
              />
            </Field>

            <Field label="Repeat Password">
              <input
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[#9E73FA]"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="••••••"
              />
            </Field>

            {/* Agreements */}
            <Checkbox
              checked={acceptPrivacy}
              onChange={setAcceptPrivacy}
              label={
                <>
                  I accept the{" "}
                  <Link href="/privacy" className="text-[#5b54f2] underline">
                    Privacy Policy
                  </Link>
                  .
                </>
              }
            />
            <Checkbox
              checked={acceptTerms}
              onChange={setAcceptTerms}
              label={
                <>
                  I accept the{" "}
                  <Link href="/terms" className="text-[#5b54f2] underline">
                    Terms of Service
                  </Link>
                  .
                </>
              }
            />
            <Checkbox
              checked={newsletter}
              onChange={setNewsletter}
              label={<>I agree to receive FEELRE updates (optional).</>}
            />

            {/* register */}
            <button
              onClick={register}
              disabled={status.type === "loading"}
              className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] text-[15px] font-semibold text-white transition disabled:opacity-60"
            >
              {status.type === "loading" ? "Please wait…" : "Register"}
            </button>

            {/* divider */}
            <div className="my-3 flex items-center justify-center gap-3 text-[12px] text-neutral-500">
              <span className="h-px w-full bg-neutral-200" />
              <span className="whitespace-nowrap">Or register with</span>
              <span className="h-px w-full bg-neutral-200" />
            </div>

            {/* OAuth */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <SocialBtn onClick={() => oauth("google")}>
                <GoogleIcon />
                Google
              </SocialBtn>
              <SocialBtn onClick={() => oauth("apple")}>
                <AppleIcon />
                Apple
              </SocialBtn>
            </div>

            <div className="mt-2 text-center text-[13px]">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="font-semibold text-[#6B66F6] underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* UI helpers */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[12px] text-neutral-600">{label}</div>
      {children}
    </label>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-2 text-[13px] leading-tight">
      <input
        type="checkbox"
        className="mt-0.5 accent-[#9E73FA]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
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
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 text-[14px] font-medium transition hover:bg-neutral-50"
    >
      {children}
    </button>
  );
}

/* icons */
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
