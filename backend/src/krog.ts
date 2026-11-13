// Pravila za kroge (US-03).

// rok za spremembe postav je 1 ura pred prvo tekmo kroga
export const URE_PRED_PRVO_TEKMO = 1;

// Iz začetkov vseh tekem kroga izračuna rok za spremembe postav.
export function izracunajRok(zacetkiTekem: Date[]): Date {
  if (zacetkiTekem.length === 0)
    throw new Error("Krog nima nobene tekme.");

  let prva = zacetkiTekem[0];
  for (const zacetek of zacetkiTekem) {
    if (zacetek < prva)
      prva = zacetek;
  }

  return new Date(prva.getTime() - URE_PRED_PRVO_TEKMO * 60 * 60 * 1000);
}

export function jeRokPotekel(rok: Date, zdaj: Date = new Date()): boolean {
  return zdaj >= rok;
}

export function preveriRok(rok: Date, zdaj: Date = new Date()): string | null {
  return jeRokPotekel(rok, zdaj) ? "Rok za ta krog je potekel." : null;
}
