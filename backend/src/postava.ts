import { IMENA_POZICIJ, PRAVILA, type Pozicija } from "./pravila";

export const ZACETNIH = 11;
export const PRVO_MESTO_NA_KLOPI = ZACETNIH + 1;

export const FORMACIJA: Record<Pozicija, { najmanj: number; najvec: number }> = {
  VR: { najmanj: 1, najvec: 1 },
  OB: { najmanj: 3, najvec: 5 },
  VE: { najmanj: 2, najvec: 5 },
  NA: { najmanj: 1, najvec: 3 },
};

export type IgralecVPostavi = {
  id: string;
  pozicija: Pozicija;
  mesto: number;
  kapetan: boolean;
};

export function jeZacetni(mesto: number): boolean {
  return mesto >= 1 && mesto <= ZACETNIH;
}

export function preveriFormacijo(zacetni: IgralecVPostavi[]): string[] {
  const napake: string[] = [];

  for (const pozicija of Object.keys(FORMACIJA) as Pozicija[]) {
    const { najmanj, najvec } = FORMACIJA[pozicija];
    const stevilo = zacetni.filter((i) => i.pozicija === pozicija).length;

    if (stevilo < najmanj || stevilo > najvec) {
      const dovoljeno = najmanj === najvec ? `natanko ${najmanj}` : `od ${najmanj} do ${najvec}`;
      napake.push(`${IMENA_POZICIJ[pozicija]} v začetni postavi: dovoljeno ${dovoljeno}, izbranih ${stevilo}.`);
    }
  }

  return napake;
}

export function preveriPostavo(igralci: IgralecVPostavi[]): string[] {
  const napake: string[] = [];

  if (igralci.length !== PRAVILA.steviloIgralcev)
    napake.push(`Postava mora imeti ${PRAVILA.steviloIgralcev} igralcev (izbranih: ${igralci.length}).`);

  if (new Set(igralci.map((i) => i.id)).size !== igralci.length)
    napake.push("Isti igralec je v postavi večkrat.");

  // vsako mesto od 1 do 15 mora biti zasedeno natanko enkrat
  const mesta = igralci.map((i) => i.mesto);
  for (let mesto = 1; mesto <= PRAVILA.steviloIgralcev; mesto++) {
    const kolikokrat = mesta.filter((m) => m === mesto).length;
    if (kolikokrat !== 1) {
      napake.push("Vsako mesto od 1 do 15 mora biti zasedeno z enim igralcem.");
      break;
    }
  }

  const zacetni = igralci.filter((i) => jeZacetni(i.mesto));
  napake.push(...preveriFormacijo(zacetni));

  const kapetani = igralci.filter((i) => i.kapetan);
  if (kapetani.length !== 1)
    napake.push("Izberi natanko enega kapetana.");
  else if (!jeZacetni(kapetani[0].mesto))
    napake.push("Kapetan mora biti v začetni postavi.");

  const prviNaKlopi = igralci.find((i) => i.mesto === PRVO_MESTO_NA_KLOPI);
  if (prviNaKlopi && prviNaKlopi.pozicija !== "VR")
    napake.push("Prvo mesto na klopi je rezervirano za vratarja.");

  return napake;
}

export function opisFormacije(igralci: IgralecVPostavi[]): string {
  const zacetni = igralci.filter((i) => jeZacetni(i.mesto));
  const stevilo = (pozicija: Pozicija) => zacetni.filter((i) => i.pozicija === pozicija).length;
  return `${stevilo("OB")}-${stevilo("VE")}-${stevilo("NA")}`;
}

// 4-4-2 iz najdražjih igralcev na vsaki poziciji, na klopi ostanejo najcenejši (najprej vratar), kapetan je najdražji začetni
export function privzetaPostava(igralci: { id: string; pozicija: Pozicija; cena: number }[]): IgralecVPostavi[] {
  const po = (pozicija: Pozicija) => igralci.filter((i) => i.pozicija === pozicija).sort((a, b) => b.cena - a.cena);
  const [vr, ob, ve, na] = [po("VR"), po("OB"), po("VE"), po("NA")];

  const zacetni = [vr[0], ...ob.slice(0, 4), ...ve.slice(0, 4), ...na.slice(0, 2)];
  const klop = [vr[1], ob[4], ve[4], na[2]];
  const kapetan = [...zacetni].sort((a, b) => b.cena - a.cena)[0];

  return [...zacetni, ...klop].map((i, indeks) => ({
    id: i.id,
    pozicija: i.pozicija,
    mesto: indeks + 1,
    kapetan: i.id === kapetan.id,
  }));
}
