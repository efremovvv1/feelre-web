// src/app/auth/sign-up/route.ts
import { NextResponse } from "next/server";
import React from "react";
import supabaseAdmin from "@/modules/shared/supabase/admin";
import { sendEmail } from "@/modules/shared/email/mailer";
import WelcomeVerifyEmail from "@/modules/web-ui/emails/WelcomeVerifyEmail";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type GenerateLinkData = {
  properties?: { action_link?: string | null } | null;
  action_link?: string | null;
};

export async function POST(req: Request) {
  try {
    const {
      email,
      password,
      nickname,
      country,
      newsletter,
      tosAccepted,
      privacyAccepted,
    } = await req.json();

    if (!email || !password || !nickname) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1) Создаём пользователя (если уже есть — продолжим)
    const { data: createData, error: createErr } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          nickname,
          country: country || null,
          newsletter: !!newsletter,
        },
        email_confirm: false,
      });

    if (createErr && !/already registered/i.test(createErr.message)) {
      return NextResponse.json({ error: createErr.message }, { status: 400 });
    }

    // 1.1) Получаем userId (из createUser либо — на случай "already registered" — по email)
   // 1.1) Получаем userId (из createUser либо — по email, если уже зарегистрирован)
      let userId = createData?.user?.id ?? null;

      if (!userId) {
        const { data: listData, error: listErr } =
          await supabaseAdmin.auth.admin.listUsers();
        if (listErr) {
          return NextResponse.json({ error: listErr.message }, { status: 400 });
        }

        const found = listData?.users?.find(
          (u) => (u.email || "").toLowerCase() === String(email).toLowerCase()
        );
        userId = found?.id ?? null;
      }

    // 1.2) Сохраняем согласия и настройки в profiles
    if (userId) {
      await supabaseAdmin
        .from("profiles")
        .upsert({
          id: userId,
          nickname,
          country: country || null,
          newsletter: !!newsletter,
          tos_accepted_at: tosAccepted ? new Date().toISOString() : null,
          privacy_accepted_at: privacyAccepted ? new Date().toISOString() : null,
        })
        .select("id")
        .maybeSingle();
    }

    // 2) Генерируем ссылку подтверждения
    const { data: linkData, error: linkErr } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "signup",
        email,
        password,
        options: {
          data: { nickname, country: country || null, newsletter: !!newsletter },
        },
      });

    if (linkErr) {
      return NextResponse.json({ error: linkErr.message }, { status: 400 });
    }

    const data = linkData as GenerateLinkData;
    const verifyUrl = data.properties?.action_link ?? data.action_link ?? null;
    if (!verifyUrl) {
      return NextResponse.json({ error: "No verify url" }, { status: 500 });
    }

    // 3) Письмо
    const react = React.createElement(WelcomeVerifyEmail, {
      nickname,
      verifyUrl,
    });

    await sendEmail({
      to: email,
      subject: "Welcome to FEELRE — confirm your email",
      react,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}