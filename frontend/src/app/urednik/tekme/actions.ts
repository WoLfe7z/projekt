"use server";
import { revalidatePath } from "next/cache";
import { POLJA } from "backend";
import { shraniStatistikoTekme, type VnosNastopa } from "backend/tekma-baza";
import { zahtevajUporabnika } from "@/lib/seja";

function jePravilenVnos(n: unknown): n is VnosNastopa {
  if (typeof n !== "object" || n === null)
    return false;
  const v = n as Record<string, unknown>;
  return typeof v.nogometasId === "string" && POLJA.every(({ polje }) => typeof v[polje] === "number");
}

export async function shraniStatistiko(
  tekmaId: string,
  goliDomaci: number,
  goliGostje: number,
  nastopi: VnosNastopa[]
) {
  const uporabnik = await zahtevajUporabnika();

  if (uporabnik.vloga !== "urednik")
    return { napake: ["Ni dostopa"], napakePolj: {} };

  if (
    typeof tekmaId !== "string" ||
    typeof goliDomaci !== "number" ||
    typeof goliGostje !== "number" ||
    !Array.isArray(nastopi) ||
    !nastopi.every(jePravilenVnos)
  )
    return { napake: ["Napačni podatki."], napakePolj: {} };

  const rezultat = await shraniStatistikoTekme(tekmaId, goliDomaci, goliGostje, nastopi);

  if (rezultat.napake.length === 0)
    revalidatePath(`/urednik/tekme/${tekmaId}`);

  return rezultat;
}
