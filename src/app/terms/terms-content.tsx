// src/app/terms/terms-content.tsx
"use client";

import LegalShell from "@/modules/web-ui/components/legal/LegalShell";
import T from "@/modules/web-ui/i18n/T";
import THtml from "@/modules/web-ui/i18n/THtml";

export default function TermsContent() {
  return (
    <LegalShell updatedAt="October 2025">
      {/* Заголовок */}
      <h2 className="text-xl font-bold mb-4">
        <T path="legal.terms.title" />
      </h2>

      {/* Интро (с жирными частями через THtml) */}
      <p className="mb-6 text-neutral-700 leading-relaxed">
        <THtml path="legal.terms.intro" as="span" />
      </p>

      {/* 1. О сервисе */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.terms.serviceTitle" />
      </h3>
      <ul className="list-disc ml-6 space-y-1 text-neutral-700">
        <li><THtml path="legal.terms.serviceItems.0" as="span" /></li>
        <li><THtml path="legal.terms.serviceItems.1" as="span" /></li>
        <li><THtml path="legal.terms.serviceItems.2" as="span" /></li>
      </ul>

      {/* 2. Правила использования */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.terms.useTitle" />
      </h3>
      <ul className="list-disc ml-6 space-y-1 text-neutral-700">
        <li><THtml path="legal.terms.useItems.0" as="span" /></li>
        <li><THtml path="legal.terms.useItems.1" as="span" /></li>
        <li><THtml path="legal.terms.useItems.2" as="span" /></li>
      </ul>

      {/* 3. Данные */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.terms.dataTitle" />
      </h3>
      <p className="text-neutral-700 leading-relaxed">
        <THtml path="legal.terms.dataText" as="span" />
      </p>

      {/* 4. Точность результатов */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.terms.accuracyTitle" />
      </h3>
      <p className="text-neutral-700 leading-relaxed">
        <THtml path="legal.terms.accuracyText" as="span" />
      </p>

      {/* 5. Ограничение ответственности */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.terms.liabilityTitle" />
      </h3>
      <p className="text-neutral-700 leading-relaxed">
        <THtml path="legal.terms.liabilityText" as="span" />
      </p>

      {/* 6. Блокировка/удаление */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.terms.terminationTitle" />
      </h3>
      <p className="text-neutral-700 leading-relaxed">
        <THtml path="legal.terms.terminationText" as="span" />
      </p>

      {/* 7. Изменения условий */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.terms.changesTitle" />
      </h3>
      <p className="text-neutral-700 leading-relaxed">
        <THtml path="legal.terms.changesText" as="span" />
      </p>

      {/* 8. Контакты */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        <T path="legal.terms.contactTitle" />
      </h3>
      <p className="text-neutral-700 leading-relaxed">
        <T path="legal.terms.contactText" />{" "}
        <a href="mailto:hello@feelre.com" className="text-[#6B66F6] hover:underline">
          <T path="legal.terms.contactEmail" />
        </a>.
      </p>
    </LegalShell>
  );
}
