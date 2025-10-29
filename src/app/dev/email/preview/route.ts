// src/app/api/auth/forgot/route.ts
import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/mailer";
import React from "react";
import PasswordResetEmail from "@/emails/PasswordResetEmail";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type GenerateLinkData = {
  properties?: { action_link?: string | null } | null;
  action_link?: string | null;
};

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // 1️⃣ Получаем профиль, чтобы достать nickname
    const { data: profile} = await supabaseAdmin
      .from("profiles")
      .select("nickname")
      .ilike("email", email) // email хранится в profiles?
      .maybeSingle();

    const nickname = profile?.nickname ?? null;

    const origin =
      req.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000";

    const redirectTo = `${origin}/auth/reset`;

    // 2️⃣ Генерируем ссылку на восстановление
    const { data: linkData, error: linkErr } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email,
        options: { redirectTo },
      });

    if (linkErr) {
      return NextResponse.json({ error: linkErr.message }, { status: 400 });
    }

    const data = linkData as GenerateLinkData;
    const resetUrl = data.properties?.action_link ?? data.action_link ?? null;
    if (!resetUrl) {
      return NextResponse.json({ error: "No reset url" }, { status: 500 });
    }

    // 3️⃣ Передаём имя в письмо
    await sendEmail({
      to: email,
      subject: "Reset your FEELRE password",
      react: React.createElement(PasswordResetEmail, {
        resetUrl,
        nickname,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}