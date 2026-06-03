const MP_BASE = "https://api.mercadopago.com";

const ACCESS = () => process.env.MP_ACCESS_TOKEN;

export type MPPreferenceItem = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number; // BRL
  currency_id: "BRL";
  picture_url?: string;
};

export type CreatePreferenceInput = {
  orderCode: string;
  customer: { name: string; email: string; cpf: string; phone?: string };
  items: MPPreferenceItem[];
  shippingCents: number;
  discountCents: number;
  backUrls: { success: string; failure: string; pending: string };
  notificationUrl: string;
  externalReference: string;
};

export async function createPreference(input: CreatePreferenceInput): Promise<{ id: string; init_point: string }> {
  const token = ACCESS();
  if (!token) throw new Error("MP_ACCESS_TOKEN not configured");
  const body = {
    items: input.items,
    payer: {
      email: input.customer.email,
      name: input.customer.name,
      identification: { type: "CPF", number: input.customer.cpf },
    },
    shipments: {
      mode: "not_specified",
      cost: input.shippingCents / 100,
    },
    back_urls: input.backUrls,
    auto_return: "approved",
    notification_url: input.notificationUrl,
    external_reference: input.externalReference,
    metadata: { order_code: input.orderCode },
    statement_descriptor: "NEXSPORTS",
  };
  const res = await fetch(`${MP_BASE}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`MP create preference failed ${res.status}: ${txt}`);
  }
  const d = await res.json();
  return { id: d.id, init_point: d.init_point };
}

export async function getPayment(paymentId: string): Promise<any> {
  const token = ACCESS();
  if (!token) throw new Error("MP_ACCESS_TOKEN not configured");
  const res = await fetch(`${MP_BASE}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`MP get payment failed ${res.status}`);
  return res.json();
}

export function mapMpStatus(status: string): "pending" | "approved" | "rejected" | "refunded" {
  switch (status) {
    case "approved":
    case "authorized":
      return "approved";
    case "rejected":
    case "cancelled":
      return "rejected";
    case "refunded":
    case "charged_back":
      return "refunded";
    default:
      return "pending";
  }
}
