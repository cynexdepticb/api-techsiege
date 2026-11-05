import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type MailResult = { status: "SENT" | "FAILED"; error?: string };

function smtpConfigured() {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASSWORD?.trim());
}

let transporter: Transporter | null = null;
function smtp() {
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: { user: process.env.SMTP_USER!.trim(), pass: process.env.SMTP_PASSWORD!.trim() },
  });
  return transporter;
}

export async function sendMail(input: { to: string; subject: string; html: string; text?: string }): Promise<MailResult> {
  if (!smtpConfigured()) {
    console.info(`[email:dev] to=${input.to} subject="${input.subject}"`);
    return { status: "SENT" };
  }
  try {
    await smtp().sendMail({
      from: process.env.EMAIL_FROM?.trim() || "TechSiege <cynex.depticb@gmail.com>",
      ...input,
    });
    return { status: "SENT" };
  } catch (error) {
    return { status: "FAILED", error: error instanceof Error ? error.message : "SMTP send failed" };
  }
}

function shell(body: string) {
  const html = body.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .split(/\n{2,}/).map((paragraph) => `<p style="margin:0 0 14px;line-height:1.65">${paragraph.replace(/\n/g, "<br>")}</p>`).join("");
  return `<div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#e8ecf1;background:#0a0c10;padding:28px;border:1px solid #202634;border-radius:12px"><p style="margin:0 0 18px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#22d3ee">TechSiege 2026</p>${html}<hr style="border:none;border-top:1px solid #202634;margin:22px 0"><p style="margin:0;font-size:12px;color:#7d8799">Questions? Write to cynex.depticb@gmail.com.</p></div>`;
}

export function acknowledgementEmail(input: { teamName: string; teamCode: string; leaderName: string }) {
  const subject = "TechSiege 2026 — Registration Received";
  const text = `Hi ${input.leaderName},

Thank you for registering for TechSiege 2026. We have received your registration details and payment submission.

Team: ${input.teamName}
Team Code: ${input.teamCode}

Our team is verifying your payment. Once approved, the Ops team will send your final registration confirmation and event instructions.`;
  return { subject, html: shell(text), text };
}
