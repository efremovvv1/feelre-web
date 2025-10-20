import LegalShell from "@/components/legal/LegalShell";
import SetHeaderTitle from "@/components/SetHeaderTitle";

export const metadata = {
  title: "Privacy Policy — FEELRE",
  description: "How FEELRE collects and uses your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <SetHeaderTitle title="Privacy Policy" />
      <LegalShell updatedAt="October 2025">
        <h2>FEELRE – Privacy Policy</h2>

        <p><strong>Your privacy matters to us.</strong> This document explains how we collect and use your information.</p>

        <h3>1. Who We Are</h3>
        <p>
          FEELRE (the “Service”) is operated by its founder, Daniil Yefremov.
          Contact: <a href="mailto:hello@feerly.com">hello@feerly.com</a>
        </p>

        <h3>2. What Data We Collect</h3>
        <ul>
          <li><strong>Basic account information</strong> (nickname, email, country, language).</li>
          <li><strong>Interaction data</strong> (chat messages, preferences).</li>
          <li><strong>Technical data</strong> (browser type, device, approximate region).</li>
        </ul>

        <h3>3. How We Use Your Data</h3>
        <ul>
          <li>To personalize your shopping experience.</li>
          <li>To improve our AI models and recommendations.</li>
          <li>To ensure service security and performance.</li>
        </ul>

        <h3>4. Data Storage &amp; Security</h3>
        <ul>
          <li>Data is securely stored using encrypted databases (e.g., Firebase, AWS).</li>
          <li>We do not sell or share your data with third parties.</li>
        </ul>

        <h3>5. User Rights (GDPR)</h3>
        <p>
          Under GDPR, you can request access, correction, or deletion of your data at any
          time by emailing <a href="mailto:hello@feerly.com">hello@feerly.com</a>.
        </p>

        <h3>6. Cookies</h3>
        <p>
          We may use cookies to improve UX. You can disable them in your browser settings.
        </p>

        <h3>7. Contact</h3>
        <p>
          If you have privacy concerns, email us at <a href="mailto:hello@feerly.com">hello@feerly.com</a>.
        </p>
      </LegalShell>
    </>
  );
}
