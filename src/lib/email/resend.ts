const RESEND_BASE = "https://api.resend.com";

export type EmailSendInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendEmail(input: EmailSendInput): Promise<{ id: string } | null> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "NEX SPORTS <pedidos@nexsportts.com.br>";
  if (!key) {
    console.warn("[email] RESEND_API_KEY not set — skipping send", input.subject);
    return null;
  }
  const res = await fetch(`${RESEND_BASE}/emails`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo,
    }),
  });
  if (!res.ok) {
    console.error("[email] resend failed", res.status, await res.text());
    return null;
  }
  return res.json();
}
