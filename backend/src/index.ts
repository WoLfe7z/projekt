// Vse, kar frontend uvozi iz "backend" (brez baze, zato je varno tudi v brskalniku).
import { PRAVILA } from "./pravila";

export * from "./pravila";

export function opisPravil(): string {
  return `Moštvo ima ${PRAVILA.steviloIgralcev} igralcev, proračun je ${PRAVILA.proracun} mio, iz istega kluba so lahko največ ${PRAVILA.najvecIzKluba} igralci.`;
}
