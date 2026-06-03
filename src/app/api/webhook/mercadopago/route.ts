import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPayment, mapMpStatus } from "@/lib/payments/mercadopago";
import { emailOrderPaid } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/resend";
import crypto from "node:crypto";

export const runtime = "nodejs";

function verifySignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // dev mode
  const sigHeader = req.headers.get("x-signature");
  const reqId = req.headers.get("x-request-id");
  if (!sigHeader || !reqId) return false;
  const ts = sigHeader.match(/ts=([^,]+)/)?.[1];
  const v1 = sigHeader.match(/v1=([^,]+)/)?.[1];
  const dataId = new URL(req.url).searchParams.get("data.id");
  if (!ts || !v1 || !dataId) return false;
  const manifest = `id:${dataId};request-id:${reqId};ts:${ts};`;
  const hmac = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  return hmac === v1;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  if (!verifySignature(req, rawBody)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }
  const body = JSON.parse(rawBody || "{}");
  if (body.type !== "payment") return NextResponse.json({ ok: true });

  const paymentId = String(body.data?.id ?? "");
  if (!paymentId) return NextResponse.json({ ok: true });

  try {
    const payment = await getPayment(paymentId);
    const orderCode = payment.metadata?.order_code ?? payment.external_reference;
    if (!orderCode) return NextResponse.json({ ok: true });

    const [order] = await db.select().from(s.orders).where(eq(s.orders.code, orderCode)).limit(1);
    if (!order) return NextResponse.json({ ok: true });

    const ps = mapMpStatus(payment.status);
    await db.update(s.orders)
      .set({
        paymentStatus: ps,
        paymentId: paymentId,
        paymentRaw: payment,
        status: ps === "approved" ? "paid" : order.status,
        updatedAt: new Date(),
      })
      .where(eq(s.orders.id, order.id));

    await db.insert(s.orderEvents).values({
      orderId: order.id,
      type: `mp.${payment.status}`,
      payload: { paymentId, status: payment.status, statusDetail: payment.status_detail },
    });

    if (ps === "approved") {
      const items = (await db.select().from(s.orderItems).where(eq(s.orderItems.orderId, order.id))).map((i) => ({
        title: (i.snapshot as any)?.title ?? "Produto",
        qty: i.qty,
        priceCents: i.unitPrice,
      }));
      const tpl = emailOrderPaid({
        code: order.code,
        customerName: order.customerName,
        items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        discount: order.discount,
        total: order.total,
      });
      await sendEmail({ to: order.customerEmail, ...tpl });
    }
  } catch (e) {
    console.error("[webhook mp]", e);
    return NextResponse.json({ ok: false, error: "processing error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "mercadopago" });
}
