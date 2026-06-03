import { formatBRL } from "../utils/format";

type OrderEmailData = {
  code: string;
  customerName: string;
  items: Array<{ title: string; qty: number; priceCents: number }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  trackingCode?: string;
  trackingUrl?: string;
};

const wrap = (inner: string, preheader: string) => `
<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>NEX SPORTS</title></head>
<body style="margin:0;padding:0;background:#0A0F1E;font-family:-apple-system,BlinkMacSystemFont,Inter,sans-serif;color:#F8FAFC;">
  <div style="display:none;max-height:0;overflow:hidden">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:24px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#0F172A;border-radius:16px;overflow:hidden">
        <tr><td style="padding:32px 28px 12px;text-align:left">
          <span style="font-size:28px;font-weight:900;background:linear-gradient(90deg,#3B82F6,#22D3EE);-webkit-background-clip:text;background-clip:text;color:transparent">NEX SPORTS</span>
        </td></tr>
        <tr><td style="padding:0 28px 24px;color:#F8FAFC">${inner}</td></tr>
        <tr><td style="padding:20px 28px;border-top:1px solid #1E293B;color:#94A3B8;font-size:12px;text-align:center">
          © ${new Date().getFullYear()} NEX SPORTS · <a href="https://nexsportts.com.br" style="color:#22D3EE">nexsportts.com.br</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

const itemsTable = (items: OrderEmailData["items"]) =>
  `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0">
    ${items
      .map(
        (i) => `<tr><td style="padding:8px 0;border-bottom:1px solid #1E293B;color:#F8FAFC">${i.qty}× ${i.title}</td>
        <td align="right" style="padding:8px 0;border-bottom:1px solid #1E293B;color:#F8FAFC">${formatBRL(i.priceCents * i.qty)}</td></tr>`,
      )
      .join("")}
  </table>`;

const totals = (d: OrderEmailData) => `
  <table width="100%" cellpadding="4" cellspacing="0" style="border-collapse:collapse;margin-top:8px;color:#94A3B8">
    <tr><td>Subtotal</td><td align="right">${formatBRL(d.subtotal)}</td></tr>
    ${d.discount > 0 ? `<tr><td>Desconto</td><td align="right">- ${formatBRL(d.discount)}</td></tr>` : ""}
    <tr><td>Frete</td><td align="right">${d.shipping === 0 ? "Grátis" : formatBRL(d.shipping)}</td></tr>
    <tr><td style="padding-top:12px;color:#F8FAFC;font-weight:700">Total</td>
        <td align="right" style="padding-top:12px;color:#22D3EE;font-weight:700">${formatBRL(d.total)}</td></tr>
  </table>`;

export const emailOrderConfirmed = (d: OrderEmailData) => ({
  subject: `Pedido ${d.code} recebido!`,
  html: wrap(
    `<h1 style="font-size:24px;margin:0 0 8px">Recebemos seu pedido</h1>
     <p style="color:#94A3B8;margin:0 0 16px">Olá ${d.customerName.split(" ")[0]}, seu pedido <b>${d.code}</b> foi criado. Estamos aguardando a confirmação do pagamento.</p>
     ${itemsTable(d.items)}${totals(d)}`,
    `Pedido ${d.code} recebido — aguardando pagamento`,
  ),
});

export const emailOrderPaid = (d: OrderEmailData) => ({
  subject: `Pagamento aprovado · pedido ${d.code}`,
  html: wrap(
    `<h1 style="font-size:24px;margin:0 0 8px">Pagamento aprovado ✓</h1>
     <p style="color:#94A3B8;margin:0 0 16px">Recebemos o pagamento do pedido <b>${d.code}</b>. Vamos preparar tudo pra você!</p>
     ${itemsTable(d.items)}${totals(d)}`,
    `Pagamento aprovado · ${d.code}`,
  ),
});

export const emailOrderShipped = (d: OrderEmailData) => ({
  subject: `Seu pedido ${d.code} foi enviado!`,
  html: wrap(
    `<h1 style="font-size:24px;margin:0 0 8px">A caminho 🚀</h1>
     <p style="color:#94A3B8;margin:0 0 16px">Pedido <b>${d.code}</b> despachado.</p>
     ${d.trackingCode ? `<p>Código de rastreio: <b>${d.trackingCode}</b></p>
     ${d.trackingUrl ? `<p><a href="${d.trackingUrl}" style="display:inline-block;background:#3B82F6;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none">Rastrear pedido</a></p>` : ""}` : ""}`,
    `Pedido ${d.code} enviado`,
  ),
});

export const emailOrderDelivered = (d: OrderEmailData) => ({
  subject: `Entregue ✓ · pedido ${d.code}`,
  html: wrap(
    `<h1 style="font-size:24px;margin:0 0 8px">Pedido entregue 🎉</h1>
     <p style="color:#94A3B8">Aproveite seus produtos NEX! Conta pra gente nas redes @nexsports.</p>`,
    `Pedido ${d.code} entregue`,
  ),
});
