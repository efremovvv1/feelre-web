/* src/emails/EmailChangedEmail.tsx */
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

type Props = {
  nickname?: string;
  oldEmail: string;
  newEmail: string;
  recipient: "old" | "new"; // кому уходит это конкретное письмо
};

export default function EmailChangedEmail({
  nickname,
  oldEmail,
  newEmail,
  recipient,
}: Props) {
  const name = nickname?.trim();
  const isOld = recipient === "old";

  return (
    <Html>
      <Head />
      <Preview>
        {isOld
          ? "Your FEELRE email was changed"
          : "Your FEELRE email change is confirmed"}
      </Preview>

      <Tailwind>
        <Body className="m-0 bg-[#F5F6FB] font-sans">
          <Container className="mx-auto my-0 w-[640px] max-w-[94%] overflow-hidden rounded-2xl border border-[#ECEFF3] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
            {/* Шапка */}
            <Section className="bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] px-8 py-7">
              <Heading className="m-0 text-[22px] font-extrabold text-white">
                FEELRE
              </Heading>
              <Text className="m-0 text-[13px] leading-[1.6] text-white/80">
                Smart shopping assistant
              </Text>
            </Section>

            {/* Контент */}
            <Section className="px-8 py-9">
              <Heading className="m-0 text-[28px] font-extrabold text-[#171717]">
                Email changed
              </Heading>

              {isOld ? (
                <>
                  <Text className="mt-3 text-[15px] leading-[1.6] text-[#444]">
                    {name ? `Hi, ${name}!` : "Hi!"} This is a confirmation that
                    the email for your FEELRE account was changed from{" "}
                    <b>{oldEmail}</b> to <b>{newEmail}</b>.
                  </Text>
                  <Text className="mt-3 text-[15px] leading-[1.6] text-[#444]">
                    If it wasn’t you, please reset your password immediately and
                    contact support.
                  </Text>
                </>
              ) : (
                <>
                  <Text className="mt-3 text-[15px] leading-[1.6] text-[#444]">
                    {name ? `Hi, ${name}!` : "Hi!"} This email address{" "}
                    <b>{newEmail}</b> is now linked to your FEELRE account.
                  </Text>
                  <Text className="mt-3 text-[15px] leading-[1.6] text-[#444]">
                    If you did not request this, please reset your password and
                    contact support.
                  </Text>
                </>
              )}

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