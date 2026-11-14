import { prisma } from "./db";
import { jeRokPotekel, preveriRok } from "./krog";
import { jeBrezplacen, preveriPrestop, proracunPoPrestopu } from "./prestop";
import type { IzbraniIgralec } from "./pravila";

export async function odprtKrog() {
  const krogi = await prisma.krog.findMany({ orderBy: { stevilka: "asc" } });
  return krogi.find((k) => !jeRokPotekel(k.rok)) ?? null;
}

export async function izvediPrestopVBazi(
  uporabnikId: string,
  venId: string,
  noterId: string
): Promise<{ napake: string[]; brezplacen?: boolean }> {
  const mostvo = await prisma.mostvo.findUnique({
    where: { uporabnikId },
    include: { nogometasi: { include: { nogometas: { include: { klub: true } } } } },
  });
  if (!mostvo)
    return { napake: ["Najprej sestavi moštvo."] };

  const krog = await odprtKrog();
  if (!krog)
    return { napake: ["Rok za ta krog je potekel."] };

  const noter = await prisma.nogometas.findUnique({ where: { id: noterId }, include: { klub: true } });
  if (!noter)
    return { napake: ["Izbrani igralec ne obstaja."] };

  const igralci: IzbraniIgralec[] = mostvo.nogometasi.map((mn) => ({
    id: mn.nogometas.id,
    pozicija: mn.nogometas.pozicija,
    cena: Number(mn.nogometas.cena),
    klub: mn.nogometas.klub.naziv,
  }));
  const ven = igralci.find((i) => i.id === venId) ?? { id: venId, pozicija: noter.pozicija, cena: 0, klub: "" };
  const prihaja: IzbraniIgralec = { id: noter.id, pozicija: noter.pozicija, cena: Number(noter.cena), klub: noter.klub.naziv };

  const preostanek = Number(mostvo.proracun);
  const napake = preveriPrestop(igralci, preostanek, ven, prihaja);
  if (napake.length > 0)
    return { napake };

  return prisma.$transaction(async (tx) => {
    // rok preverimo še enkrat, ker se je lahko iztekel med preverjanjem
    const napakaRoka = preveriRok(krog.rok);
    if (napakaRoka)
      return { napake: [napakaRoka] };

    const opravljenih = await tx.prestop.count({ where: { mostvoId: mostvo.id, krogId: krog.id } });
    const brezplacen = jeBrezplacen(opravljenih);

    await tx.mostvoNogometas.delete({ where: { mostvoId_nogometasId: { mostvoId: mostvo.id, nogometasId: venId } } });
    await tx.mostvoNogometas.create({ data: { mostvoId: mostvo.id, nogometasId: noterId } });
    await tx.mostvo.update({
      where: { id: mostvo.id },
      data: { proracun: proracunPoPrestopu(preostanek, ven, prihaja) },
    });

    // če postava odprtega kroga še ni shranjena, jo prepišemo iz zadnjega kroga, da lahko novi igralec zasede mesto odhajajočega
    const imaPostavo = (await tx.postava.count({ where: { mostvoId: mostvo.id, krogId: krog.id } })) > 0;
    if (!imaPostavo) {
      const zadnja = await tx.postava.findFirst({
        where: { mostvoId: mostvo.id, krog: { stevilka: { lt: krog.stevilka } } },
        orderBy: { krog: { stevilka: "desc" } },
      });
      if (zadnja) {
        const prejsnja = await tx.postava.findMany({ where: { mostvoId: mostvo.id, krogId: zadnja.krogId } });
        if (prejsnja.length === igralci.length && prejsnja.every((p) => igralci.some((i) => i.id === p.nogometasId)))
          await tx.postava.createMany({
            data: prejsnja.map((p) => ({
              mostvoId: mostvo.id,
              krogId: krog.id,
              nogometasId: p.nogometasId,
              mesto: p.mesto,
              kapetan: p.kapetan,
            })),
          });
      }
    }

    await tx.postava.updateMany({
      where: { mostvoId: mostvo.id, krogId: krog.id, nogometasId: venId },
      data: { nogometasId: noterId },
    });

    await tx.prestop.create({
      data: { mostvoId: mostvo.id, krogId: krog.id, venId, noterId, brezplacen },
    });

    return { napake: [], brezplacen };
  });
}
