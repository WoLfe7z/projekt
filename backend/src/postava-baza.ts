import { prisma } from "./db";
import { preveriRok } from "./krog";
import { preveriPostavo, type IgralecVPostavi } from "./postava";

export type MestoVPostavi = {
  nogometasId: string;
  mesto: number;
  kapetan: boolean;
};

export async function shraniPostavoKroga(
  uporabnikId: string,
  krogId: string,
  postava: MestoVPostavi[]
): Promise<string[]> {
  const mostvo = await prisma.mostvo.findUnique({
    where: { uporabnikId },
    include: { nogometasi: { include: { nogometas: true } } },
  });
  if (!mostvo)
    return ["Najprej sestavi moštvo."];

  const krog = await prisma.krog.findUnique({ where: { id: krogId } });
  if (!krog)
    return ["Krog ne obstaja."];

  const napakaRoka = preveriRok(krog.rok);
  if (napakaRoka)
    return [napakaRoka];

  // pozicije vzamemo iz baze in hkrati preverimo, da so vsi igralci iz menedžerjevega moštva
  const igralci: IgralecVPostavi[] = [];
  for (const p of postava) {
    const vMostvu = mostvo.nogometasi.find((mn) => mn.nogometasId === p.nogometasId);
    if (!vMostvu)
      return ["V postavi je igralec, ki ni v tvojem moštvu."];
    igralci.push({ id: p.nogometasId, pozicija: vMostvu.nogometas.pozicija, mesto: p.mesto, kapetan: p.kapetan });
  }

  const napake = preveriPostavo(igralci);
  if (napake.length > 0)
    return napake;

  await prisma.$transaction([
    prisma.postava.deleteMany({ where: { mostvoId: mostvo.id, krogId } }),
    prisma.postava.createMany({
      data: postava.map((p) => ({
        mostvoId: mostvo.id,
        krogId,
        nogometasId: p.nogometasId,
        mesto: p.mesto,
        kapetan: p.kapetan,
      })),
    }),
  ]);

  return [];
}
