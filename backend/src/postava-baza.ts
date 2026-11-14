import { prisma } from "./db";
import { jeRokPotekel, preveriRok } from "./krog";
import { preveriPostavo, privzetaPostava, type IgralecVPostavi } from "./postava";
import type { Pozicija } from "./pravila";

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

export type IgralecNaPostavi = IgralecVPostavi & {
  ime: string;
  priimek: string;
  kratica: string;
  cena: number;
  poskodovan: boolean;
};

export async function naloziPostavo(uporabnikId: string, stevilkaKroga?: number) {
  const mostvo = await prisma.mostvo.findUnique({
    where: { uporabnikId },
    include: { nogometasi: { include: { nogometas: { include: { klub: true } } } } },
  });
  if (!mostvo)
    return null;

  const krogi = await prisma.krog.findMany({ orderBy: { stevilka: "asc" } });

  // brez izbranega kroga pokažemo prvi krog, ki se še ni zaklenil
  const krog =
    stevilkaKroga !== undefined
      ? krogi.find((k) => k.stevilka === stevilkaKroga)
      : (krogi.find((k) => !jeRokPotekel(k.rok)) ?? krogi.at(-1));
  if (!krog)
    return { mostvo, krogi, krog: null, igralci: [], shranjena: false };

  const nogometasi = mostvo.nogometasi.map((mn) => mn.nogometas);
  const vMostvu = (id: string) => nogometasi.some((n) => n.id === id);

  // če postava kroga še ni shranjena, vzamemo zadnjo shranjeno postavo (če so vsi igralci še v moštvu) ali privzeto
  const shranjena = await prisma.postava.findMany({ where: { mostvoId: mostvo.id, krogId: krog.id } });
  let postava: { id: string; mesto: number; kapetan: boolean }[] = shranjena.map((p) => ({
    id: p.nogometasId,
    mesto: p.mesto,
    kapetan: p.kapetan,
  }));

  if (!postava.every((p) => vMostvu(p.id)))
    postava = [];

  if (postava.length === 0) {
    const prejsnjiKrog = await prisma.postava.findFirst({
      where: { mostvoId: mostvo.id, krog: { stevilka: { lt: krog.stevilka } } },
      orderBy: { krog: { stevilka: "desc" } },
    });
    const prejsnja = prejsnjiKrog
      ? await prisma.postava.findMany({ where: { mostvoId: mostvo.id, krogId: prejsnjiKrog.krogId } })
      : [];

    if (prejsnja.length === nogometasi.length && prejsnja.every((p) => vMostvu(p.nogometasId)))
      postava = prejsnja.map((p) => ({ id: p.nogometasId, mesto: p.mesto, kapetan: p.kapetan }));
    else
      postava = privzetaPostava(nogometasi.map((n) => ({ id: n.id, pozicija: n.pozicija, cena: Number(n.cena) })));
  }

  const igralci: IgralecNaPostavi[] = postava.map((p) => {
    const n = nogometasi.find((x) => x.id === p.id)!;
    return {
      id: n.id,
      pozicija: n.pozicija as Pozicija,
      mesto: p.mesto,
      kapetan: p.kapetan,
      ime: n.ime,
      priimek: n.priimek,
      kratica: n.klub.kratica,
      cena: Number(n.cena),
      poskodovan: n.status !== "na_voljo",
    };
  });

  return { mostvo, krogi, krog, igralci, shranjena: shranjena.length > 0 };
}
