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
