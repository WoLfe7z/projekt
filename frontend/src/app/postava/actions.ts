"use server";
import { revalidatePath } from "next/cache";
import { shraniPostavoKroga, type MestoVPostavi } from "backend/postava-baza";
import { zahtevajUporabnika } from "@/lib/seja";

function jePravilnoMesto(p: unknown): p is MestoVPostavi {
  if (typeof p !== "object" || p === null)
    return false;
  const m = p as MestoVPostavi;
  return typeof m.nogometasId === "string" && Number.isInteger(m.mesto) && typeof m.kapetan === "boolean";
}

export async function shraniPostavo(krogId: string, postava: MestoVPostavi[]): Promise<{ napake: string[] }> {
  const uporabnik = await zahtevajUporabnika();

  if (uporabnik.vloga !== "menedzer")
    return { napake: ["Postavo lahko shrani samo menedžer."] };

  if (typeof krogId !== "string" || !Array.isArray(postava) || !postava.every(jePravilnoMesto))
    return { napake: ["Napačni podatki."] };

  const napake = await shraniPostavoKroga(uporabnik.id, krogId, postava);

  if (napake.length === 0)
    revalidatePath("/postava");

  return { napake };
}
