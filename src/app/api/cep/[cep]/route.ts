import { NextResponse } from "next/server";
import { lookupCep } from "@/lib/shipping/cep";

export const runtime = "edge";

export async function GET(_: Request, { params }: { params: Promise<{ cep: string }> }) {
  const { cep } = await params;
  const r = await lookupCep(cep);
  if (!r) return NextResponse.json({ error: "CEP não encontrado" }, { status: 404 });
  return NextResponse.json(r, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
