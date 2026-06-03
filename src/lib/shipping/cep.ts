import { cepDigits } from "../validators/br";

export type ViaCepAddress = {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

export async function lookupCep(rawCep: string): Promise<ViaCepAddress | null> {
  const cep = cepDigits(rawCep);
  if (cep.length !== 8) return null;
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) return null;
  const d = await res.json();
  if (d.erro) return null;
  return {
    cep: d.cep,
    street: d.logradouro,
    neighborhood: d.bairro,
    city: d.localidade,
    state: d.uf,
  };
}
