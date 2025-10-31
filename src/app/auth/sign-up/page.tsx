"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SetHeaderTitle from "@/components/SetHeaderTitle";
import PasswordInput from "@/components/ui/PasswordInput";
import { useT } from "@/i18n/Provider";
import T from "@/i18n/T";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "ok"; msg: string }
  | { type: "error"; msg: string };

/* — password score 0..5 — */
function getPasswordScore(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 5);
}

export default function SignUpPage() {
  const { t } = useT();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const [status, setStatus] = useState<Status>({ type: "idle" });

  const score = useMemo(() => getPasswordScore(password), [password]);

  const validate = (): string | null => {
    if (!nickname.trim()) return t("auth.signup.errors.nicknameRequired");
    if (!/^\S+@\S+\.\S+$/.test(email)) return t("auth.signup.errors.invalidEmail");
    if (password.length < 6) return t("auth.signup.errors.passwordTooShort");
    if (password !== password2) return t("auth.signup.errors.passwordsMismatch");
    if (!acceptPrivacy || !acceptTerms) return t("auth.signup.errors.mustAccept");
    return null;
  };

  const register = async () => {
    const problem = validate();
    if (problem) {
      setStatus({ type: "error", msg: problem });
      return;
    }

    setStatus({ type: "loading" });

    try {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nickname,
          country,
          newsletter,
          tosAccepted: acceptTerms,
          privacyAccepted: acceptPrivacy,
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setStatus({ type: "error", msg: data?.error || "Registration failed" });
        return;
      }

      setStatus({ type: "ok", msg: t("auth.signup.emailSent") });
    } catch (e) {
      setStatus({
        type: "error",
        msg: e instanceof Error ? e.message : "Unexpected error. Please try again.",
      });
    }
  };

  const oauth = async (provider: "google") => {
    setStatus({ type: "loading" });
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) setStatus({ type: "error", msg: error.message });
  };

  return (
    <main className="content mx-auto max-w-[480px] px-4 py-6 md:py-10">
      <SetHeaderTitle title={t("auth.signup.title")} hideMenu />

      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white/95 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        {/* Mobile header */}
        <div className="md:hidden rounded-t-3xl bg-gradient-to-b from-[#EEE7FF] to-white px-5 py-6 text-center">
          <h1 className="text-[19px] font-extrabold tracking-[-0.01em]">
            <T path="auth.signup.title" />
          </h1>
          <p className="mt-1 text-[13px] text-neutral-600">
            <T path="auth.signup.subtitle" />
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
            <Field label={t("auth.signup.nickname")}>
              <input
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[#9E73FA]"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t("auth.signup.nickname")}
              />
            </Field>

            <Field label="E-mail">
              <input
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[#9E73FA]"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                autoComplete="email"
              />
            </Field>

            <Field label={t("auth.signup.country")}>
              <input
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[#9E73FA]"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Germany"
              />
            </Field>

            <Field label={t("auth.signup.password")}>
              <div className="relative">
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  placeholder={t("auth.signup.password")}
                  autoComplete="new-password"
                  inputClassName="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[#9E73FA]"
                />

                {/* Strength bar */}
                <div className="mt-2 mb-1">
                  <div className="h-2 w-full rounded-full bg-neutral-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] transition-all"
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[12px] text-neutral-500">
                    <T path="auth.signup.strength" />:{" "}
                    <span className="font-medium">
                      {score <= 2 && t("auth.signup.weak")}
                      {score === 3 && t("auth.signup.ok")}
                      {score === 4 && t("auth.signup.strong")}
                      {score === 5 && t("auth.signup.veryStrong")}
                    </span>
                  </div>
                </div>
              </div>
            </Field>

            <Field label={t("auth.signup.repeatPassword")}>
              <PasswordInput
                value={password2}
                onChange={setPassword2}
                placeholder={t("auth.signup.repeatPassword")}
                autoComplete="new-password"
                inputClassName="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[#9E73FA]"
              />
            </Field>

            {/* Agreements */}
            <Checkbox
              checked={acceptPrivacy}
              onChange={setAcceptPrivacy}
              label={
                <span
                  dangerouslySetInnerHTML={{
                    __html: t("auth.signup.agreements.privacy"),
                  }}
                />
              }
            />
            <Checkbox
              checked={acceptTerms}
              onChange={setAcceptTerms}
              label={
                <span
                  dangerouslySetInnerHTML={{
                    __html: t("auth.signup.agreements.terms"),
                  }}
                />
              }
            />
            <Checkbox
              checked={newsletter}
              onChange={setNewsletter}
              label={
                <span
                  dangerouslySetInnerHTML={{
                    __html: t("auth.signup.agreements.newsletter"),
                  }}
                />
              }
            />

            {/* Register */}
            <button
              onClick={register}
              disabled={status.type === "loading"}
              className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] text-[15px] font-semibold text-white transition disabled:opacity-60"
            >
              {status.type === "loading" ? t("common.loading") : t("auth.signup.register")}
            </button>

            {/* Divider */}
            <div className="my-3 flex items-center justify-center gap-3 text-[12px] text-neutral-500">
              <span className="h-px w-full bg-neutral-200" />
              <span className="whitespace-nowrap">
                <T path="auth.signup.orWith" />
              </span>
              <span className="h-px w-full bg-neutral-200" />
            </div>

            {/* OAuth */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <SocialBtn onClick={() => oauth("google")}>
                <GoogleIcon /> Google
              </SocialBtn>
            </div>

            <div className="mt-2 text-center text-[13px]">
              <T path="auth.signup.haveAccount" />{" "}
              <Link
                href="/auth/sign-in"
                className="font-semibold text-[#6B66F6] underline-offset-4 hover:underline"
              >
                <T path="auth.signup.signIn" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* — UI helpers — */
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

function SocialBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 text-[14px] font-medium transition hover:bg-neutral-50"
    >
      {children}
    </button>
  );
}

/* icons (как были) */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.2 29.3 35 24 35c-7.2 0-13-5.8-13-13S16.8 9 24 9c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.5 3.3 29.6 1 24 1 15 1 7.6 6.2 4.1 14.1z" />
      <path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.5 16.1 18.9 13 24 13c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.5 3.3 29.6 1 24 1 15 1 7.6 6.2 4.1 14.1z" />
      <path fill="#4CAF50" d="M24 49c5.2 0 10-1.8 13.7-4.9l-6.3-5.2C29.2 40.2 26.7 41 24 41c-5.3 0-9.7-2.8-12.1-7l-6.6 5C7.6 43.8 15 49 24 49z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3C34.7 31.2 29.3 35 24 35c-5.3 0-9.7-2.8-12.1-7l-6.6 5C7.6 43.8 15 49 24 49c12.3 0 22-9.7 22-22 0-1.6-.2-3.1-.4-4.5z" />
    </svg>
  );
}

