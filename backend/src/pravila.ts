export const PRAVILA = {
  proracun: 100, // v mio
  steviloIgralcev: 15,
  najvecIzKluba: 3,
  imeNajmanj: 3, // znakov
  imeNajvec: 30,
};

export type Pozicija = "VR" | "OB" | "VE" | "NA";

// koliko igralcev na posamezni poziciji mora imeti moštvo
export const SESTAVA: Record<Pozicija, number> = {
  VR: 2,
  OB: 5,
  VE: 5,
  NA: 3,
};

export const IMENA_POZICIJ: Record<Pozicija, string> = {
  VR: "Vratarji",
  OB: "Branilci",
  VE: "Vezisti",
  NA: "Napadalci",
};

// kar potrebujemo o izbranem igralcu, da preverimo pravila
export type IzbraniIgralec = {
  id: string;
  pozicija: Pozicija;
  cena: number;
  klub: string;
};

export function sestejCene(igralci: IzbraniIgralec[]): number {
  let vsota = 0;
  for (const igralec of igralci) {
    vsota += igralec.cena;
  }
  return Math.round(vsota * 10) / 10;
}

export function zapisiMio(znesek: number): string {
  return znesek.toFixed(1).replace(".", ",");
}

// Preveri ime moštva in vrne napako ali null, če je ime v redu.
export function preveriImeMostva(ime: string): string | null {
  const dolzina = ime.trim().length;
  if (dolzina < PRAVILA.imeNajmanj || dolzina > PRAVILA.imeNajvec)
    return `Ime moštva mora imeti od ${PRAVILA.imeNajmanj} do ${PRAVILA.imeNajvec} znakov.`;
  return null;
}

// Preveri izbrane igralce in vrne seznam napak. Prazen seznam pomeni, da je moštvo veljavno.
export function preveriMostvo(igralci: IzbraniIgralec[]): string[] {
  const napake: string[] = [];

  // 1) vsak igralec je lahko izbran samo enkrat
  const ids = igralci.map((igralec) => igralec.id);
  if (new Set(ids).size !== ids.length)
    napake.push("Isti igralec je izbran večkrat.");

  // 2) skupno število igralcev
  if (igralci.length !== PRAVILA.steviloIgralcev)
    napake.push(`Moštvo mora imeti ${PRAVILA.steviloIgralcev} igralcev (izbranih: ${igralci.length}).`);

  // 3) število igralcev na vsaki poziciji
  for (const pozicija of Object.keys(SESTAVA) as Pozicija[]) {
    const izbranih = igralci.filter((igralec) => igralec.pozicija === pozicija).length;
    if (izbranih !== SESTAVA[pozicija])
      napake.push(`${IMENA_POZICIJ[pozicija]}: potrebnih ${SESTAVA[pozicija]}, izbranih ${izbranih}.`);
  }

  // 4) proračun
  const vsota = sestejCene(igralci);
  if (vsota > PRAVILA.proracun)
    napake.push(`Vsota cen (${zapisiMio(vsota)} mio) presega proračun ${zapisiMio(PRAVILA.proracun)} mio.`);

  // 5) največ 3 igralci iz istega kluba
  const poKlubih: Record<string, number> = {};
  for (const igralec of igralci) {
    poKlubih[igralec.klub] = (poKlubih[igralec.klub] ?? 0) + 1;
  }
  for (const klub in poKlubih) {
    if (poKlubih[klub] > PRAVILA.najvecIzKluba)
      napake.push(`Največ ${PRAVILA.najvecIzKluba} igralci iz istega kluba (${klub}: ${poKlubih[klub]}).`);
  }

  return napake;
}
