// src/app/api/auth/forgot/route.ts
import { NextResponse } from "next/server";
import supabaseAdmin from "@/modules/shared/supabase/admin";
import { sendEmail } from "@/modules/shared/email/mailer";
import React from "react";
import PasswordResetEmail from "@/modules/web-ui/emails/PasswordResetEmail";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Расширим тип generateLink, чтобы достать и ссылку, и user.id
type GenerateLinkData = {
  properties?: { action_link?: string | null } | null;
  action_link?: string | null;
  user?: { id: string } | null;
};

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Куда вернётся пользователь после клика (твоя страница reset)
    const origin =
      req.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000";
    const redirectTo = `${origin}/auth/reset`;

    // 1) Генерим recovery-ссылку; тут же вернётся user.id
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

    // 2) Если в ответе есть user.id — достанем nickname из profiles
    let nickname: string | undefined;
    const uid = data.user?.id ?? null;

    if (uid) {
      const { data: prof } = await supabaseAdmin
        .from("profiles")
        .select("nickname")
        .eq("id", uid)
        .maybeSingle();

      nickname = prof?.nickname ?? undefined;
    }

    // 3) Отправляем письмо c красивым шаблоном
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