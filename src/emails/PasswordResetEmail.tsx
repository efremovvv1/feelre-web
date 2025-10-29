/* eslint-disable @next/next/no-head-element */
/* src/emails/PasswordResetEmail.tsx */
import * as React from "react";

type Props = {
  nickname?: string;
  resetUrl: string;
};

export default function PasswordResetEmail({ nickname, resetUrl }: Props) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </head>

      <body style={styles.body}>
        {/* Внешняя обёртка на 100% ширины — убирает «непонятный» верхний отступ в Gmail */}
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={styles.wrapper}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: "28px 12px" }}>
                {/* Карточка */}
                <table role="presentation" width={640} cellPadding={0} cellSpacing={0} style={styles.card}>
                  <tbody>
                    {/* Шапка с градиентом */}
                    <tr>
                      <td style={styles.header}>
                        <div style={styles.brand}>FEELRE</div>
                        <div style={styles.subbrand}>Smart shopping assistant</div>
                      </td>
                    </tr>

                    {/* Контент */}
                    <tr>
                      <td style={{ padding: "28px" }}>
                        <h1 style={styles.h1}>Reset password</h1>

                        <p style={styles.p}>
                          {nickname ? `Hi, ${nickname}! ` : "Hi! "}
                          Click the button below to set a new password for your account.
                        </p>

                        {/* CTA */}
                        <div style={{ height: 14 }} />
                        <a
                          href={resetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.button}
                        >
                          Reset my password
                        </a>

                        {/* Fallback-ссылка */}
                        <div style={{ height: 18 }} />
                        <div style={styles.noteBox}>
                          <p style={{ ...styles.p, margin: 0, color: "#495065" }}>
                            If the button doesn’t work, copy this link into your browser:
                          </p>
                          <p style={styles.linkText}>{resetUrl}</p>
                        </div>

                        <p style={{ ...styles.p, color: "#666", marginTop: 18 }}>
                          If you didn’t request this, you can safely ignore this email.
                        </p>

                        <hr style={styles.hr} />

                        <p style={{ ...styles.p, color: "#666", margin: 0 }}>
                          Need help? Email us at{" "}
                          <a href="mailto:hello@feelre.com" style={styles.linkInline}>
                            hello@feelre.com
                          </a>.
                        </p>
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
    background: "#F5F6FB",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji"',
  },
  wrapper: { width: "100%" },
  card: {
    width: "100%",
    background: "#FFFFFF",
    borderRadius: 20,
    border: "1px solid #ECEFF3",
    boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  header: {
    padding: "24px 28px",
    background:
      "linear-gradient(90deg, #B974FF 0%, #9E73FA 50%, #6B66F6 100%)",
    color: "#fff",
  },
  brand: {
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1,
  },
  subbrand: {
    marginTop: 6,
    fontSize: 13,
    opacity: 0.85,
    lineHeight: 1,
  },
  h1: {
    margin: "0 0 8px",
    fontSize: 28,
    lineHeight: "32px",
    letterSpacing: "-0.2px",
    color: "#171717",
    fontWeight: 800,
  },
  p: {
    margin: 0,
    fontSize: 15,
    lineHeight: "24px",
    color: "#444",
  },
  button: {
    display: "inline-block",
    padding: "12px 18px",
    fontSize: 15,
    fontWeight: 700,
    textDecoration: "none",
    color: "#fff",
    borderRadius: 12,
    backgroundColor: "#6B66F6", // fallback
    backgroundImage: "linear-gradient(90deg, #B974FF 0%, #9E73FA 50%, #6B66F6 100%)",
    boxShadow: "0 6px 18px rgba(111, 97, 249, 0.24)",
  },
  noteBox: {
    background: "#F1F3FA",
    borderRadius: 12,
    padding: "14px 16px",
  },
  linkText: {
    margin: "8px 0 0",
    fontSize: 14,
    lineHeight: "20px",
    color: "#6B66F6",
    wordBreak: "break-word",
  },
  hr: {
    border: 0,
    borderTop: "1px solid #E7E9F2",
    margin: "22px 0",
  },
  linkInline: { color: "#6B66F6", textDecoration: "none" },
  footer: { margin: "12px 0 0", fontSize: 12, color: "#9AA1B2" },
};