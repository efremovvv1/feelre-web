import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import supabaseAdmin from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type Body = {
  // добавим email, он у вас уже есть в пропсах AccountSettingsPanel
  email: string;
  currentPassword: string;
  newPassword: string;
};

export async function POST(req: Request) {
  try {
    const { email, currentPassword, newPassword } = (await req.json()) as Body;

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password too short" }, { status: 400 });
    }

    // 1) Проверяем текущий пароль обычным (НЕ admin) клиентом, без сохранения сессии
    const supabaseNoPersist = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data: signInData, error: signInError } =
      await supabaseNoPersist.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

    if (signInError || !signInData?.user) {
      return NextResponse.json({ error: "Wrong password" }, { status: 403 });
    }

    // 2) Меняем пароль админ-клиентом (не требует сессии/куков)
    const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(
      signInData.user.id,
      { password: newPassword }
    );

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : typeof e === "string" ? e : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
