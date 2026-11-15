export type Statistika = {
  minute: number;
  goli: number;
  asistence: number;
  avtogoli: number;
  rumeni: number;
  rdeci: number;
};

export type PoljeStatistike = keyof Statistika;
export type NapakeNastopa = Partial<Record<PoljeStatistike, string>>;

export const POLJA: { polje: PoljeStatistike; ime: string; kratko: string; najvec: number }[] = [
  { polje: "minute", ime: "Minute", kratko: "Min", najvec: 120 },
  { polje: "goli", ime: "Goli", kratko: "G", najvec: 10 },
  { polje: "asistence", ime: "Asistence", kratko: "A", najvec: 10 },
  { polje: "avtogoli", ime: "Avtogoli", kratko: "AG", najvec: 5 },
  { polje: "rumeni", ime: "Rumeni karton", kratko: "RuK", najvec: 1 },
  { polje: "rdeci", ime: "Rdeči karton", kratko: "RdK", najvec: 1 },
];

export const NAJVEC_GOLOV_NA_TEKMI = 20;

export const PRAZEN_NASTOP: Statistika = { minute: 0, goli: 0, asistence: 0, avtogoli: 0, rumeni: 0, rdeci: 0 };

export function jePravilnoStevilo(vrednost: number, najvec: number): boolean {
  return Number.isInteger(vrednost) && vrednost >= 0 && vrednost <= najvec;
}

export function preveriNastop(statistika: Statistika): NapakeNastopa {
  const napake: NapakeNastopa = {};

  for (const { polje, najvec } of POLJA) {
    if (!jePravilnoStevilo(statistika[polje], najvec))
      napake[polje] = `Vpiši celo število od 0 do ${najvec}.`;
  }

  if (statistika.minute === 0) {
    for (const polje of ["goli", "asistence", "avtogoli"] as const) {
      if (!napake[polje] && statistika[polje] > 0)
        napake[polje] = "Igralec, ki ni igral, ne more imeti golov ali asistenc.";
    }
  }

  return napake;
}

export function preveriRezultat(goliDomaci: number, goliGostje: number): string | null {
  if (!jePravilnoStevilo(goliDomaci, NAJVEC_GOLOV_NA_TEKMI) || !jePravilnoStevilo(goliGostje, NAJVEC_GOLOV_NA_TEKMI))
    return `Rezultat mora biti celo število od 0 do ${NAJVEC_GOLOV_NA_TEKMI}.`;
  return null;
}
