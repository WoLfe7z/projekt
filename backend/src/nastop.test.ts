import { describe, expect, it } from "vitest";
import { PRAZEN_NASTOP, preveriNastop, preveriRezultat } from "./nastop";

describe("veljaven nastop", () => {
  it("nastop brez igranja nima napak", () => {
    expect(preveriNastop(PRAZEN_NASTOP)).toEqual({});
  });

  it("90 minut, gol, asistenca in rumeni karton nima napak", () => {
    expect(preveriNastop({ ...PRAZEN_NASTOP, minute: 90, goli: 1, asistence: 1, rumeni: 1 })).toEqual({});
  });

  it("dovoli 120 minut (podaljški)", () => {
    expect(preveriNastop({ ...PRAZEN_NASTOP, minute: 120 })).toEqual({});
  });
});

describe("napačne vrednosti so označene ob polju", () => {
  it("minute nad 120", () => {
    expect(preveriNastop({ ...PRAZEN_NASTOP, minute: 121 })).toEqual({ minute: "Vpiši celo število od 0 do 120." });
  });

  it("negativni goli", () => {
    expect(preveriNastop({ ...PRAZEN_NASTOP, minute: 90, goli: -1 })).toEqual({ goli: "Vpiši celo število od 0 do 10." });
  });

  it("decimalno število asistenc", () => {
    expect(preveriNastop({ ...PRAZEN_NASTOP, minute: 90, asistence: 1.5 })).toEqual({
      asistence: "Vpiši celo število od 0 do 10.",
    });
  });

  it("dva rumena in dva rdeča kartona", () => {
    expect(preveriNastop({ ...PRAZEN_NASTOP, minute: 90, rumeni: 2, rdeci: 2 })).toEqual({
      rumeni: "Vpiši celo število od 0 do 1.",
      rdeci: "Vpiši celo število od 0 do 1.",
    });
  });

  it("prazno polje (NaN)", () => {
    expect(preveriNastop({ ...PRAZEN_NASTOP, minute: NaN })).toEqual({ minute: "Vpiši celo število od 0 do 120." });
  });
});

describe("igralec, ki ni igral", () => {
  it("ne more imeti gola, asistence ali avtogola", () => {
    expect(preveriNastop({ ...PRAZEN_NASTOP, goli: 1, asistence: 1, avtogoli: 1 })).toEqual({
      goli: "Igralec, ki ni igral, ne more imeti golov ali asistenc.",
      asistence: "Igralec, ki ni igral, ne more imeti golov ali asistenc.",
      avtogoli: "Igralec, ki ni igral, ne more imeti golov ali asistenc.",
    });
  });

  it("lahko dobi karton na klopi", () => {
    expect(preveriNastop({ ...PRAZEN_NASTOP, rumeni: 1 })).toEqual({});
  });
});

describe("rezultat tekme", () => {
  it("2 : 1 je veljaven", () => {
    expect(preveriRezultat(2, 1)).toBeNull();
  });

  it("negativen ali prevelik rezultat je napaka", () => {
    expect(preveriRezultat(-1, 0)).toBe("Rezultat mora biti celo število od 0 do 20.");
    expect(preveriRezultat(0, 21)).toBe("Rezultat mora biti celo število od 0 do 20.");
  });
});
