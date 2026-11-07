// Osnovna pravila igre (docs/02-funkcionalnosti-in-obseg.md).
export const PRAVILA = {
  proracun: 100, // v mil
  steviloIgralcev: 15,
  najvecIzKluba: 3,
};

export function opisPravil(): string {
  return `Moštvo ima ${PRAVILA.steviloIgralcev} igralcev, proračun je ${PRAVILA.proracun} mio, iz istega kluba so lahko največ ${PRAVILA.najvecIzKluba} igralci.`;
}
