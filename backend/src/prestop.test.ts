import { describe, expect, it } from "vitest";
import { jeBrezplacen, kazenZaPrestope, preveriPrestop, proracunPoPrestopu } from "./prestop";
import type { IzbraniIgralec, Pozicija } from "./pravila";

function igralec(id: string, pozicija: Pozicija, cena: number, klub: string): IzbraniIgralec {
  return { id, pozicija, cena, klub };
}

// 2/5/5/3, Olimpija ima že 3 igralce, skupaj 90,0 mio
const mostvo: IzbraniIgralec[] = [
  igralec("vr1", "VR", 6, "Olimpija"),
  igralec("vr2", "VR", 6, "Maribor"),
  igralec("ob1", "OB", 6, "Olimpija"),
  igralec("ob2", "OB", 6, "Maribor"),
  igralec("ob3", "OB", 6, "Celje"),
  igralec("ob4", "OB", 6, "Koper"),
  igralec("ob5", "OB", 6, "Mura"),
  igralec("ve1", "VE", 6, "Olimpija"),
  igralec("ve2", "VE", 6, "Maribor"),
  igralec("ve3", "VE", 6, "Celje"),
  igralec("ve4", "VE", 6, "Koper"),
  igralec("ve5", "VE", 6, "Mura"),
  igralec("na1", "NA", 6, "Celje"),
  igralec("na2", "NA", 6, "Koper"),
  igralec("na3", "NA", 6, "Mura"),
];
const preostanek = 10;
const ven = mostvo[4]; // ob3, Celje, 6,0

describe("veljaven prestop", () => {
  it("branilec za branilca drugega kluba nima napak", () => {
    expect(preveriPrestop(mostvo, preostanek, ven, igralec("novi", "OB", 9, "Bravo"))).toEqual([]);
  });

  it("izračuna proračun po prestopu", () => {
    expect(proracunPoPrestopu(preostanek, ven, igralec("novi", "OB", 9, "Bravo"))).toBe(7);
    expect(proracunPoPrestopu(preostanek, ven, igralec("novi", "OB", 4.5, "Bravo"))).toBe(11.5);
  });
});

describe("ista pozicija, igralec še ni v moštvu", () => {
  it("zavrne zamenjavo branilca z vezistom", () => {
    expect(preveriPrestop(mostvo, preostanek, ven, igralec("novi", "VE", 6, "Bravo"))).toEqual([
      "Igralca lahko zamenjaš samo z igralcem iste pozicije (OB).",
    ]);
  });

  it("zavrne igralca, ki je že v moštvu", () => {
    expect(preveriPrestop(mostvo, preostanek, ven, mostvo[5])).toContain("Ta igralec je že v tvojem moštvu.");
  });

  it("zavrne odhajajočega igralca, ki ni v moštvu", () => {
    const tuj = igralec("tuj", "OB", 6, "Bravo");
    expect(preveriPrestop(mostvo, preostanek, tuj, igralec("novi", "OB", 6, "Radomlje"))).toEqual([
      "Igralec, ki odhaja, ni v tvojem moštvu.",
    ]);
  });
});

describe("proračun ne pade pod 0", () => {
  it("dovoli prestop, ki porabi ves proračun", () => {
    expect(preveriPrestop(mostvo, preostanek, ven, igralec("novi", "OB", 16, "Bravo"))).toEqual([]);
  });

  it("zavrne prestop, ki bi proračun spravil pod 0", () => {
    expect(preveriPrestop(mostvo, preostanek, ven, igralec("novi", "OB", 16.5, "Bravo"))).toEqual([
      "Za ta prestop ti manjka 0,5 mio.",
    ]);
  });
});

describe("največ 3 iz kluba", () => {
  it("zavrne četrtega igralca Olimpije", () => {
    expect(preveriPrestop(mostvo, preostanek, ven, igralec("novi", "OB", 6, "Olimpija"))).toEqual([
      "Največ 3 igralci iz istega kluba (Olimpija).",
    ]);
  });

  it("dovoli igralca Olimpije, če odhaja igralec Olimpije", () => {
    expect(preveriPrestop(mostvo, preostanek, mostvo[2], igralec("novi", "OB", 6, "Olimpija"))).toEqual([]);
  });
});

describe("brezplačni prestopi in kazen", () => {
  it("prvi prestop v krogu je brezplačen, drugi ne", () => {
    expect(jeBrezplacen(0)).toBe(true);
    expect(jeBrezplacen(1)).toBe(false);
    expect(jeBrezplacen(2)).toBe(false);
  });

  it("vsak prestop po prvem stane 4 točke", () => {
    expect(kazenZaPrestope(0)).toBe(0);
    expect(kazenZaPrestope(1)).toBe(0);
    expect(kazenZaPrestope(2)).toBe(4);
    expect(kazenZaPrestope(4)).toBe(12);
  });
});
