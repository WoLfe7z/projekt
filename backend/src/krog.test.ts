// Testi za rok kroga. Zaženeš z: pnpm test
import { describe, expect, it } from "vitest";
import { izracunajRok } from "./krog";

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
