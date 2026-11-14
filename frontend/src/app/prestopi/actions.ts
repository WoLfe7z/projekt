"use server";
import { revalidatePath } from "next/cache";
import { izvediPrestopVBazi } from "backend/prestop-baza";
import { zahtevajUporabnika } from "@/lib/seja";

export async function izvediPrestop(venId: string, noterId: string): Promise<{ napake: string[]; brezplacen?: boolean }> {
  const uporabnik = await zahtevajUporabnika();

  if (uporabnik.vloga !== "menedzer")
    return { napake: ["Prestope lahko opravlja samo menedžer."] };

  if (typeof venId !== "string" || typeof noterId !== "string")
    return { napake: ["Napačni podatki."] };

  const rezultat = await izvediPrestopVBazi(uporabnik.id, venId, noterId);

  if (rezultat.napake.length === 0) {
    revalidatePath("/mostvo");
    revalidatePath("/postava");
    revalidatePath("/prestopi");
  }

  return rezultat;
}
