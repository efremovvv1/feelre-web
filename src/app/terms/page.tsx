// src/app/terms/page.tsx  ← БЕЗ "use client"
import SetHeaderTitleI18n from "@/modules/web-ui/components/SetHeaderTitleI18n";
import TermsContent from "./terms-content";

export const metadata = {
  title: "Terms of Service — FEELRE",
  description: "Terms for using FEELRE.",
};

export default function TermsPage() {
  return (
    <>
      <SetHeaderTitleI18n path="legal.terms.title" />
      <TermsContent />
    </>
  );
}
