// Testi za rok kroga. Zaženeš z: pnpm test
import { describe, expect, it } from "vitest";
import { izracunajRok, jeRokPotekel, preveriRok } from "./krog";

describe("rok kroga (1 ura pred prvo tekmo)", () => {
  it("je 1 uro pred edino tekmo", () => {
    const rok = izracunajRok([new Date("2026-11-14T15:00:00Z")]);
    expect(rok).toEqual(new Date("2026-11-14T14:00:00Z"));
  });

  it("upošteva najzgodnejšo tekmo, ne glede na vrstni red", () => {
    const rok = izracunajRok([
      new Date("2026-11-15T17:30:00Z"),
      new Date("2026-11-14T20:00:00Z"),
      new Date("2026-11-14T15:00:00Z"),
      new Date("2026-11-15T15:00:00Z"),
    ]);
    expect(rok).toEqual(new Date("2026-11-14T14:00:00Z"));
  });

  it("deluje tudi čez polnoč", () => {
    const rok = izracunajRok([new Date("2026-11-14T00:30:00Z")]);
    expect(rok).toEqual(new Date("2026-11-13T23:30:00Z"));
  });

  it("vrže napako, če krog nima tekem", () => {
    expect(() => izracunajRok([])).toThrow("Krog nima nobene tekme.");
  });
});

describe("zaklep kroga po roku", () => {
  const rok = new Date("2026-11-14T14:00:00Z");

  it("pred rokom je sprememba dovoljena", () => {
    expect(preveriRok(rok, new Date("2026-11-14T13:59:59Z"))).toBeNull();
  });

  it("ob roku je sprememba zavrnjena", () => {
    expect(preveriRok(rok, new Date("2026-11-14T14:00:00Z"))).toBe("Rok za ta krog je potekel.");
  });

  it("po roku je sprememba zavrnjena", () => {
    expect(preveriRok(rok, new Date("2026-11-15T10:00:00Z"))).toBe("Rok za ta krog je potekel.");
    expect(jeRokPotekel(rok, new Date("2026-11-15T10:00:00Z"))).toBe(true);
  });
});
