// src/lib/mailer.ts
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import type { ReactElement } from "react";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 465,
  secure: true,
  auth: {
    user: "hello@feelre.com",
    pass: process.env.ZOHO_APP_PASSWORD!, // App Password из Zoho
  },
});

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: ReactElement;
}) {
  const html = await render(react, { pretty: true });      // <-- await
  const text = await render(react, { plainText: true });    // <-- await

  await transporter.sendMail({
    from: "FEELRE <hello@feelre.com>",
    to,
    subject,
    html,
    text,
  });
}