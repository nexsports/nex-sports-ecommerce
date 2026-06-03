import { z } from "zod";

export const cepDigits = (v: string) => v.replace(/\D/g, "");
export const cpfDigits = (v: string) => v.replace(/\D/g, "");

export const cepSchema = z
  .string()
  .transform(cepDigits)
  .refine((v) => v.length === 8, "CEP inválido");

export function isValidCpf(input: string): boolean {
  const cpf = cpfDigits(input);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(cpf[i]) * (10 - i);
  let d1 = (s * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(cpf[9])) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(cpf[i]) * (11 - i);
  let d2 = (s * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(cpf[10]);
}

export const cpfSchema = z
  .string()
  .transform(cpfDigits)
  .refine(isValidCpf, "CPF inválido");

export const phoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((v) => v.length === 10 || v.length === 11, "Telefone inválido");

export const ufSchema = z
  .string()
  .length(2)
  .toUpperCase()
  .refine(
    (v) =>
      [
        "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
        "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
      ].includes(v),
    "UF inválida",
  );

export const addressSchema = z.object({
  recipient: z.string().min(3).max(120),
  cep: cepSchema,
  street: z.string().min(2).max(200),
  number: z.string().min(1).max(20),
  complement: z.string().max(100).optional(),
  neighborhood: z.string().min(2).max(120),
  city: z.string().min(2).max(120),
  state: ufSchema,
});

export const checkoutCustomerSchema = z.object({
  name: z.string().min(3).max(120),
  email: z.string().email(),
  cpf: cpfSchema,
  phone: phoneSchema,
});

export const checkoutPayloadSchema = z.object({
  customer: checkoutCustomerSchema,
  shipping: addressSchema,
  billing: addressSchema.optional(),
  shippingService: z.object({
    carrier: z.string(),
    service: z.string(),
    priceCents: z.number().int().nonnegative(),
    deliveryDays: z.number().int().positive(),
  }),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["pix", "credit_card", "boleto"]),
  cardToken: z.string().optional(),
  installments: z.number().int().min(1).max(12).default(1),
});

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
