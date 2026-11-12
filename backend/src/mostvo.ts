// Shranjevanje moštva v bazo (US-02). Kliče ga Server Action ustvariMostvo v frontend/.
import { prisma } from "./db";
import { Prisma } from "./generated/prisma/client";
import { PRAVILA, preveriImeMostva, preveriMostvo, sestejCene, type IzbraniIgralec } from "./pravila";

// Ustvari moštvo za uporabnika. Vrne seznam napak.
export async function shraniMostvo(uporabnikId: string, ime: string, nogometasIds: string[]): Promise<string[]> {
  const napake: string[] = [];

  // 1) ime moštva
  const napakaImena = preveriImeMostva(ime);
  if (napakaImena)
    napake.push(napakaImena);

  // 2) vsak menedžer ima lahko le eno moštvo
  const obstojece = await prisma.mostvo.findUnique({ where: { uporabnikId } });
  if (obstojece)
    return ["Moštvo že imaš."];

  // 3) izbrane igralce preberemo iz baze, da ne zaupamo cenam in pozicijam iz brskalnika
  const izBaze = await prisma.nogometas.findMany({
    where: { id: { in: nogometasIds } },
    include: { klub: true },
  });

  const igralci: IzbraniIgralec[] = [];
  for (const id of nogometasIds) {
    const n = izBaze.find((nogometas) => nogometas.id === id);
    if (!n) {
      napake.push("Izbran je igralec, ki ne obstaja.");
      continue;
    }
    igralci.push({ id: n.id, pozicija: n.pozicija, cena: Number(n.cena), klub: n.klub.naziv });
  }

  // 4) pravila sestave (2/5/5/3, proračun, 3 iz kluba)
  napake.push(...preveriMostvo(igralci));

  if (napake.length > 0)
    return napake;

  // 5) zapis moštva in vseh 15 igralcev v eni transakciji (če kaj spodleti, se ne shrani nič)
  const preostanek = Math.round((PRAVILA.proracun - sestejCene(igralci)) * 10) / 10;
  try {
    await prisma.$transaction(async (tx) => {
      const mostvo = await tx.mostvo.create({
        data: { uporabnikId, ime: ime.trim(), proracun: preostanek },
      });
      await tx.mostvoNogometas.createMany({
        data: nogometasIds.map((nogometasId) => ({ mostvoId: mostvo.id, nogometasId })),
      });
    });
  } catch (napaka) {
    // P2002 = kršena unikatnost (npr. dvakrat hkrati kliknjen gumb Shrani)
    if (napaka instanceof Prisma.PrismaClientKnownRequestError && napaka.code === "P2002")
      return ["Moštvo že imaš."];
    throw napaka;
  }

  return [];
}
