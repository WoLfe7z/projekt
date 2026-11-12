"use server";
// Server Action za shranjevanje moštva. Samo preveri uporabnika, vse ostalo naredi backend (ADR-0003).
import { revalidatePath } from "next/cache";
import { shraniMostvo } from "backend/mostvo";
import { zahtevajUporabnika } from "@/lib/seja";

// napake je prazen seznam, če je bilo moštvo shranjeno
export async function ustvariMostvo(ime: string, nogometasIds: string[]): Promise<{ napake: string[] }> {
  // neprijavljenega uporabnika preusmeri na /prijava
  const uporabnik = await zahtevajUporabnika();

  if (uporabnik.vloga !== "menedzer")
    return { napake: ["Moštvo lahko sestavi samo menedžer."] };

  // Server Action lahko kdorkoli pokliče z drugačnimi podatki, zato preverimo tipe
  if (typeof ime !== "string" || !Array.isArray(nogometasIds) || nogometasIds.some((id) => typeof id !== "string"))
    return { napake: ["Napačni podatki."] };

  const napake = await shraniMostvo(uporabnik.id, ime, nogometasIds);

  if (napake.length === 0)
    revalidatePath("/mostvo");

  return { napake };
}
