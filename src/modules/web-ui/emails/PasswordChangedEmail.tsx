/* src/emails/PasswordChangedEmail.tsx */
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

export default function PasswordChangedEmail({
  nickname,
}: {
  nickname?: string;
}) {
  const name = nickname?.trim();
  return (
    <Html>
      <Head />
      <Preview>Your FEELRE password was changed</Preview>

      <Tailwind>
        <Body className="m-0 bg-[#F5F6FB] font-sans">
          <Container className="mx-auto my-0 w-[640px] max-w-[94%] overflow-hidden rounded-2xl border border-[#ECEFF3] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)]">

            {/* ✅ Стильная шапка */}
            <Section className="bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] px-8 py-7">
              <Heading className="m-0 text-[22px] font-extrabold text-white">
                FEELRE
              </Heading>
              <Text className="m-0 text-[13px] leading-[1.6] text-white/80">
                Smart shopping assistant
              </Text>
            </Section>

            {/* ✅ Контент */}
            <Section className="px-8 py-9">
              <Heading className="m-0 text-[28px] font-extrabold text-[#171717]">
                Password changed
              </Heading>

              <Text className="mt-3 text-[15px] leading-[1.6] text-[#444]">
                {name ? `Hi, ${name}!` : "Hi!"} This is a confirmation that your
                FEELRE account password was just changed.
              </Text>

              <Text className="mt-3 text-[15px] leading-[1.6] text-[#444]">
                If it wasn’t you, please reset your password immediately.
              </Text>

              <Hr className="my-8 border-t border-[#E7E9F2]" />

              <Text className="m-0 text-[13px] text-[#666]">
                Need help? Email us at{" "}
                <a
                  href="mailto:hello@feelre.com"
                  className="text-[#6B66F6] no-underline font-semibold"
                >
                  hello@feelre.com
                </a>
                .
              </Text>

              <Text className="mt-3 text-[12px] text-[#9AA1B2]">
                © {new Date().getFullYear()} FEELRE. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}