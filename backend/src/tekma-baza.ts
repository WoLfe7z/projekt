import { prisma } from "./db";
import { PRAZEN_NASTOP, preveriNastop, preveriRezultat, type NapakeNastopa, type Statistika } from "./nastop";
import type { Pozicija } from "./pravila";

const VRSTNI_RED: Pozicija[] = ["VR", "OB", "VE", "NA"];

export type NastopIgralca = Statistika & {
  nogometasId: string;
  ime: string;
  priimek: string;
  pozicija: Pozicija;
};

// tekma, ki jo urednik vidi prvo: prva tekma zadnjega kroga, ki se je že začel
export async function privzetaTekma() {
  const krogi = await prisma.krog.findMany({
    orderBy: { stevilka: "asc" },
    include: { tekme: { orderBy: { zacetek: "asc" } } },
  });
  const zaceti = krogi.filter((k) => k.rok <= new Date());
  const krog = zaceti.at(-1) ?? krogi[0];
  return krog?.tekme[0] ?? null;
}

export async function naloziTekmo(tekmaId: string) {
  const tekma = await prisma.tekma.findUnique({
    where: { id: tekmaId },
    include: { krog: true, domaci: true, gostje: true, nastopi: true },
  });
  if (!tekma)
    return null;

  const tekmeKroga = await prisma.tekma.findMany({
    where: { krogId: tekma.krogId },
    include: { domaci: true, gostje: true },
    orderBy: { zacetek: "asc" },
  });
  const krogi = await prisma.krog.findMany({
    orderBy: { stevilka: "asc" },
    include: { tekme: { orderBy: { zacetek: "asc" }, take: 1 } },
  });

  const igralciKluba = async (klubId: string): Promise<NastopIgralca[]> => {
    const igralci = await prisma.nogometas.findMany({ where: { klubId }, orderBy: { priimek: "asc" } });
    return igralci
      .sort((a, b) => VRSTNI_RED.indexOf(a.pozicija) - VRSTNI_RED.indexOf(b.pozicija))
      .map((n) => {
        const nastop = tekma.nastopi.find((x) => x.nogometasId === n.id);
        return {
          nogometasId: n.id,
          ime: n.ime,
          priimek: n.priimek,
          pozicija: n.pozicija,
          minute: nastop?.minute ?? PRAZEN_NASTOP.minute,
          goli: nastop?.goli ?? 0,
          asistence: nastop?.asistence ?? 0,
          avtogoli: nastop?.avtogoli ?? 0,
          rumeni: nastop?.rumeni ?? 0,
          rdeci: nastop?.rdeci ?? 0,
        };
      });
  };

  return {
    tekma,
    domaci: await igralciKluba(tekma.domaciId),
    gostje: await igralciKluba(tekma.gostjeId),
    tekmeKroga: tekmeKroga.map((t) => ({
      id: t.id,
      domaci: t.domaci.naziv,
      gostje: t.gostje.naziv,
      status: t.status,
    })),
    krogi: krogi.map((k) => ({ stevilka: k.stevilka, prvaTekmaId: k.tekme[0]?.id })),
  };
}

export type VnosNastopa = Statistika & { nogometasId: string };

export async function shraniStatistikoTekme(
  tekmaId: string,
  goliDomaci: number,
  goliGostje: number,
  nastopi: VnosNastopa[]
): Promise<{ napake: string[]; napakePolj: Record<string, NapakeNastopa> }> {
  const tekma = await prisma.tekma.findUnique({ where: { id: tekmaId } });
  if (!tekma)
    return { napake: ["Tekma ne obstaja."], napakePolj: {} };
  if (tekma.status === "potrjena")
    return { napake: ["Tekma je že potrjena, statistike ni več mogoče spreminjati."], napakePolj: {} };

  const napake: string[] = [];
  const napakaRezultata = preveriRezultat(goliDomaci, goliGostje);
  if (napakaRezultata)
    napake.push(napakaRezultata);

  const igralci = await prisma.nogometas.findMany({
    where: { klubId: { in: [tekma.domaciId, tekma.gostjeId] } },
    select: { id: true },
  });
  const dovoljeni = new Set(igralci.map((i) => i.id));
  if (nastopi.some((n) => !dovoljeni.has(n.nogometasId)))
    napake.push("Statistika vsebuje igralca, ki ne igra za nobenega od klubov.");

  const napakePolj: Record<string, NapakeNastopa> = {};
  for (const n of nastopi) {
    const napakeNastopa = preveriNastop(n);
    if (Object.keys(napakeNastopa).length > 0)
      napakePolj[n.nogometasId] = napakeNastopa;
  }
  if (Object.keys(napakePolj).length > 0)
    napake.push("Nekatere vrednosti so napačne. Popravi označena polja.");

  if (napake.length > 0)
    return { napake, napakePolj };

  await prisma.$transaction([
    prisma.tekma.update({ where: { id: tekmaId }, data: { goliDomaci, goliGostje, status: "v_vnosu" } }),
    prisma.nastop.deleteMany({ where: { tekmaId } }),
    prisma.nastop.createMany({
      data: nastopi.map((n) => ({
        tekmaId,
        nogometasId: n.nogometasId,
        minute: n.minute,
        goli: n.goli,
        asistence: n.asistence,
        avtogoli: n.avtogoli,
        rumeni: n.rumeni,
        rdeci: n.rdeci,
      })),
    }),
  ]);

  return { napake: [], napakePolj: {} };
}
