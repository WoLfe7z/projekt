import { PRAVILA, zapisiMio, type IzbraniIgralec } from "./pravila";

export const BREZPLACNIH_PRESTOPOV = 1;
export const KAZEN_ZA_PRESTOP = 4;

export function proracunPoPrestopu(preostanek: number, ven: IzbraniIgralec, noter: IzbraniIgralec): number {
  return Math.round((preostanek + ven.cena - noter.cena) * 10) / 10;
}

export function preveriPrestop(
  mostvo: IzbraniIgralec[],
  preostanek: number,
  ven: IzbraniIgralec,
  noter: IzbraniIgralec
): string[] {
  const napake: string[] = [];

  if (!mostvo.some((i) => i.id === ven.id))
    napake.push("Igralec, ki odhaja, ni v tvojem moštvu.");

  if (mostvo.some((i) => i.id === noter.id))
    napake.push("Ta igralec je že v tvojem moštvu.");

  if (ven.pozicija !== noter.pozicija)
    napake.push(`Igralca lahko zamenjaš samo z igralcem iste pozicije (${ven.pozicija}).`);

  const nov = proracunPoPrestopu(preostanek, ven, noter);
  if (nov < 0)
    napake.push(`Za ta prestop ti manjka ${zapisiMio(-nov)} mio.`);

  const izKluba = mostvo.filter((i) => i.id !== ven.id && i.klub === noter.klub).length + 1;
  if (izKluba > PRAVILA.najvecIzKluba)
    napake.push(`Največ ${PRAVILA.najvecIzKluba} igralci iz istega kluba (${noter.klub}).`);

  return napake;
}

export function jeBrezplacen(opravljenihVKrogu: number): boolean {
  return opravljenihVKrogu < BREZPLACNIH_PRESTOPOV;
}

export function kazenZaPrestope(steviloPrestopov: number): number {
  return Math.max(0, steviloPrestopov - BREZPLACNIH_PRESTOPOV) * KAZEN_ZA_PRESTOP;
}
