/* eslint-disable @next/next/no-head-element */
import * as React from "react";

type Props = {
  nickname: string;
  verifyUrl: string;
};

export default function WelcomeVerifyEmail({ nickname, verifyUrl }: Props) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </head>

      <body style={styles.body}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={styles.wrapper}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: "28px 12px" }}>
                <table role="presentation" width={640} cellPadding={0} cellSpacing={0} style={styles.card}>
                  <tbody>
                    {/* Градиентная шапка */}
                    <tr>
                      <td style={styles.header}>
                        <div style={styles.brand}>FEELRE</div>
                        <div style={styles.subbrand}>Smart shopping assistant</div>
                      </td>
                    </tr>

                    {/* Контент */}
                    <tr>
                      <td style={{ padding: "28px" }}>
                        <h1 style={styles.h1}>
                          Welcome to FEELRE, {nickname}! 🎉
                        </h1>

                        <p style={styles.p}>
                          Please confirm your email to finish setting up your account.
                        </p>

                        <div style={{ height: 14 }} />
                        <a
                          href={verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.button}
                        >
                          Confirm my email
                        </a>

                        <div style={{ height: 18 }} />
                        <div style={styles.noteBox}>
                          <p style={{ ...styles.p, margin: 0, color: "#495065" }}>
                            If the button doesn’t work, copy this link into your browser:
                          </p>
                          <p style={styles.linkText}>{verifyUrl}</p>
                        </div>

                        <p style={{ ...styles.p, marginTop: 18, color: "#666" }}>
                          If you didn’t sign up, just ignore this message.
                        </p>

                        <hr style={styles.hr} />

                        <p style={{ ...styles.p, color: "#666" }}>
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
    background: "#ffffff",
    width: "100%",
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
    margin: "0 0 10px",
    fontSize: 28,
    lineHeight: "34px",
    fontWeight: 800,
    letterSpacing: "-0.2px",
    color: "#171717",
    textAlign: "left",
  },
  p: {
    margin: 0,
    fontSize: 15,
    lineHeight: "24px",
    color: "#444",
    textAlign: "left",
  },
  button: {
    display: "inline-block",
    padding: "12px 18px",
    fontSize: 15,
    fontWeight: 700,
    backgroundImage:
      "linear-gradient(90deg, #B974FF 0%, #9E73FA 50%, #6B66F6 100%)",
    backgroundColor: "#6B66F6",
    color: "#fff",
    borderRadius: 12,
    textDecoration: "none",
    boxShadow: "0 6px 18px rgba(111, 97, 249, 0.24)",
  },
  noteBox: {
    background: "#F1F3FA",
    borderRadius: 12,
    padding: "14px 16px",
    marginTop: 4,
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
    margin: "24px 0",
  },
  linkInline: { color: "#6B66F6", textDecoration: "none" },
  footer: { marginTop: 12, fontSize: 12, color: "#9AA1B2" },
};