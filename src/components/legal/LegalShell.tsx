// src/components/legal/LegalShell.tsx
"use client";

import Link from "next/link";
import { Montserrat } from "next/font/google";
import T from "@/i18n/T";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mont",
  display: "swap",
});

type LegalShellProps = {
  updatedAt?: string;
  children: React.ReactNode;
};

export default function LegalShell({ updatedAt, children }: LegalShellProps) {
  return (
    <section className={`${montserrat.variable} w-full grow font-[var(--font-mont)]`}>
      <div className="mx-auto max-w-[880px] px-4 pt-8 pb-16">
        {/* Кнопка возврата */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block rounded-xl bg-[#EEE9FF] px-5 py-2 text-[#5b54f2] text-[15px] font-medium hover:opacity-90 transition"
          >
            <T path="legal.backButton" />
          </Link>
        </div>

        {/* Сам документ */}
        <article className="mx-auto max-w-[880px] rounded-2xl bg-white/95 p-8 md:p-10 shadow-[0_15px_60px_rgba(0,0,0,0.10)] ring-1 ring-black/5">
          {updatedAt && (
            <p className="mb-6 text-sm text-neutral-600 tracking-wide">
              <span className="font-medium text-neutral-700">
                <T path="legal.updatedLabel" />:
              </span>{" "}
              {updatedAt}
            </p>
          )}

          <div className="space-y-5 text-neutral-800 leading-[1.85] text-[15.5px]">
            <div
              className="
                [&>h2]:text-[26px] [&>h2]:font-semibold [&>h2]:mb-6 [&>h2]:text-[#151515]
                [&>h3]:text-[18px] [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-[#252525]
                [&>p]:my-3 [&>ul]:my-3 [&>li]:my-1.5
                [&>ul]:pl-6 [&>ul>li]:list-disc marker:text-neutral-400
                [&>a]:text-[#5b54f2] [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:opacity-80
                [&>strong]:font-semibold
              "
            >
              {children}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
