const BASE = process.env.MELHORENVIO_SANDBOX === "true"
  ? "https://sandbox.melhorenvio.com.br/api/v2"
  : "https://melhorenvio.com.br/api/v2";

const TOKEN = () => process.env.MELHORENVIO_TOKEN;

export type QuoteInput = {
  fromCep: string;
  toCep: string;
  items: Array<{ weightG: number; lengthCm: number; widthCm: number; heightCm: number; insuranceCents?: number; qty: number }>;
};

export type Quote = {
  carrier: string;
  service: string;
  serviceId: number;
  priceCents: number;
  deliveryDays: number;
};

export async function quoteShipping(input: QuoteInput): Promise<Quote[]> {
  const token = TOKEN();
  if (!token) {
    // graceful fallback (dev) — flat rate
    const subtotal = input.items.reduce((a, i) => a + (i.insuranceCents ?? 0) * i.qty, 0);
    const base = subtotal > 50000 ? 0 : 2490;
    return [
      { carrier: "Correios", service: "PAC", serviceId: 1, priceCents: base, deliveryDays: 8 },
      { carrier: "Correios", service: "SEDEX", serviceId: 2, priceCents: base + 1500, deliveryDays: 3 },
    ];
  }
  const res = await fetch(`${BASE}/me/shipment/calculate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "NEX Sports (pedidos@nexsportts.com.br)",
    },
    body: JSON.stringify({
      from: { postal_code: input.fromCep.replace(/\D/g, "") },
      to: { postal_code: input.toCep.replace(/\D/g, "") },
      products: input.items.map((i, idx) => ({
        id: String(idx + 1),
        width: i.widthCm, height: i.heightCm, length: i.lengthCm,
        weight: i.weightG / 1000,
        insurance_value: ((i.insuranceCents ?? 0) / 100) || 1,
        quantity: i.qty,
      })),
    }),
  });
  if (!res.ok) throw new Error(`MelhorEnvio HTTP ${res.status}`);
  const data: any[] = await res.json();
  return data
    .filter((s) => !s.error && s.price)
    .map((s) => ({
      carrier: s.company?.name ?? "Transportadora",
      service: s.name,
      serviceId: s.id,
      priceCents: Math.round(parseFloat(s.price) * 100),
      deliveryDays: s.delivery_time,
    }));
}
