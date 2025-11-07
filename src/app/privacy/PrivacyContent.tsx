// src/app/privacy/PrivacyContent.tsx  (client)
"use client";

import LegalShell from "@/modules/web-ui/components/legal/LegalShell";
import T from "@/modules/web-ui/i18n/T";
import THtml from "@/modules/web-ui/i18n/THtml";

export default function PrivacyContent() {
  return (
    <LegalShell updatedAt="October 2025">
      {/* Заголовок */}
      <h2 className="text-xl font-bold mb-4">
        <T path="legal.privacy.title" />
      </h2>

      {/* Вступление (нужен <strong>FEELRE</strong>) */}
      <THtml path="legal.privacy.intro" as="p" className="mb-6 text-neutral-700 leading-relaxed" />

      {/* 1. What We Collect */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.privacy.collectTitle" />
      </h3>
      <ul className="list-disc ml-6 space-y-1 text-neutral-700">
        <li>
          <strong><T path="legal.privacy.collectItems.accountLabel" />:</strong>{" "}
          <T path="legal.privacy.collectItems.accountDesc" />
        </li>
        <li>
          <strong><T path="legal.privacy.collectItems.usageLabel" />:</strong>{" "}
          <T path="legal.privacy.collectItems.usageDesc" />
        </li>
        <li>
          <strong><T path="legal.privacy.collectItems.techLabel" />:</strong>{" "}
          <T path="legal.privacy.collectItems.techDesc" />
        </li>
      </ul>

      {/* 2. How We Use Your Data */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.privacy.useTitle" />
      </h3>
      <ul className="list-disc ml-6 space-y-1 text-neutral-700">
        <li>
          <strong><T path="legal.privacy.useItems.improveLabel" />:</strong>{" "}
          <T path="legal.privacy.useItems.improveDesc" />
        </li>
        <li>
          <strong><T path="legal.privacy.useItems.personalizeLabel" />:</strong>{" "}
          <T path="legal.privacy.useItems.personalizeDesc" />
        </li>
        <li>
          <strong><T path="legal.privacy.useItems.securityLabel" />:</strong>{" "}
          <T path="legal.privacy.useItems.securityDesc" />
        </li>
      </ul>

      {/* 3. Data Sharing (нужен HTML для <strong>FEELRE</strong>) */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.privacy.shareTitle" />
      </h3>
      <THtml path="legal.privacy.shareText" as="p" className="text-neutral-700 leading-relaxed" />

      {/* 4. Cookies */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.privacy.cookiesTitle" />
      </h3>
      <p className="text-neutral-700 leading-relaxed">
        <THtml path="legal.privacy.cookiesText" />
      </p>

      {/* 5. Data Retention */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.privacy.retentionTitle" />
      </h3>
      <p className="text-neutral-700 leading-relaxed">
        <T path="legal.privacy.retentionText" />
      </p>

      {/* 6. Your Rights */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.privacy.rightsTitle" />
      </h3>
      <p className="text-neutral-700 leading-relaxed">
        <T path="legal.privacy.rightsText" />{" "}
        <a href="mailto:hello@feelre.com" className="text-[#6B66F6] hover:underline">
          <T path="legal.privacy.contactEmail" />
        </a>.
      </p>

      {/* 7. Updates */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.privacy.updatesTitle" />
      </h3>
      <p className="text-neutral-700 leading-relaxed">
        <T path="legal.privacy.updatesText" />
      </p>

      {/* 8. Contact */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.privacy.contactTitle" />
      </h3>
      <p className="text-neutral-700 leading-relaxed">
        <T path="legal.privacy.contactText" />{" "}
        <a href="mailto:hello@feelre.com" className="text-[#6B66F6] hover:underline">
          <T path="legal.privacy.contactEmail" />
        </a>.
      </p>
    </LegalShell>
  );
}
