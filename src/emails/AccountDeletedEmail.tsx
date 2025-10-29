/* src/emails/AccountDeletedEmail.tsx */
/* eslint-disable @next/next/no-head-element */
import * as React from "react";

type Props = {
  nickname?: string | null;
  supportEmail?: string; // по умолчанию hello@feelre.com
};

export default function AccountDeletedEmail({
  nickname,
  supportEmail = "hello@feelre.com",
}: Props) {
  const name = nickname?.trim();
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </head>
      <body style={styles.body}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={styles.wrapper}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: "28px 12px" }}>
                <table role="presentation" width={640} cellPadding={0} cellSpacing={0} style={styles.card}>
                  <tbody>
                    {/* шапка-градient как в остальных письмах */}
                    <tr>
                      <td style={styles.header}>
                        <div style={styles.brand}>FEELRE</div>
                        <div style={styles.subtitle}>Smart shopping assistant</div>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "28px" }}>
                        <h1 style={styles.h1}>Account deleted</h1>
                        <p style={styles.p}>
                          {name ? `Hi, ${name}!` : "Hi!"} This is a confirmation that your FEELRE account was
                          permanently deleted. We’re sorry to see you go.
                        </p>
                        <div style={{ height: 12 }} />
                        <p style={{ ...styles.p, color: "#6b7280" }}>
                          If you didn’t perform this action, please contact us immediately at{" "}
                          <a href={`mailto:${supportEmail}`} style={styles.link}>{supportEmail}</a>.
                        </p>

                        <div style={{ height: 24 }} />
                        <hr style={styles.hr} />
                        <p style={styles.footer}>
                          © {new Date().getFullYear()} FEELRE. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    margin: 0,
    background: "#f6f7fb",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji"',
  },
  wrapper: { width: "100%" },
  card: {
    width: "100%",
    background: "#fff",
    borderRadius: 20,
    border: "1px solid #eceff3",
    overflow: "hidden",
    boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
  },
  header: {
    background:
      "linear-gradient(90deg, #B974FF 0%, #9E73FA 50%, #6B66F6 100%)",
    padding: "22px 28px",
  },
  brand: {
    color: "#fff",
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: "rgba(255,255,255,.85)",
    fontSize: 13,
    marginTop: 2,
  },
  h1: {
    margin: "8px 0 10px",
    fontSize: 26,
    lineHeight: "30px",
    letterSpacing: "-0.2px",
    color: "#16181b",
    fontWeight: 800,
  },
  p: {
    margin: 0,
    fontSize: 15,
    lineHeight: "22px",
    color: "#1f2937",
  },
  link: {
    color: "#6B66F6",
    textDecoration: "none",
    fontWeight: 600,
  },
  hr: {
    border: 0,
    borderTop: "1px solid #e7e9f2",
    margin: "24px 0 10px",
  },
  footer: {
    margin: 0,
    fontSize: 12,
    lineHeight: "18px",
    color: "#6b7280",
    textAlign: "left",
  },
};