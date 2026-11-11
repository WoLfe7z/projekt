// Testi za pravila sestave moštva. Zaženeš z: pnpm test
import { describe, expect, it } from "vitest";
import { preveriMostvo, sestejCene, type IzbraniIgralec, type Pozicija } from "./pravila";

// pomožna funkcija za hitro ustvarjanje igralca
function igralec(id: string, pozicija: Pozicija, cena: number, klub: string): IzbraniIgralec {
  return { id, pozicija, cena, klub };
}

// veljavno moštvo: 2 VR, 5 OB, 5 VE, 3 NA, iz 5 klubov po 3 igralci, skupaj 90,0 mio
function veljavnoMostvo(): IzbraniIgralec[] {
  return [
    igralec("1", "VR", 6, "Olimpija"),
    igralec("2", "VR", 6, "Maribor"),
    igralec("3", "OB", 6, "Olimpija"),
    igralec("4", "OB", 6, "Maribor"),
    igralec("5", "OB", 6, "Celje"),
    igralec("6", "OB", 6, "Koper"),
    igralec("7", "OB", 6, "Mura"),
    igralec("8", "VE", 6, "Olimpija"),
    igralec("9", "VE", 6, "Maribor"),
    igralec("10", "VE", 6, "Celje"),
    igralec("11", "VE", 6, "Koper"),
    igralec("12", "VE", 6, "Mura"),
    igralec("13", "NA", 6, "Celje"),
    igralec("14", "NA", 6, "Koper"),
    igralec("15", "NA", 6, "Mura"),
  ];
}

describe("veljavno moštvo", () => {
  it("nima napak", () => {
    expect(preveriMostvo(veljavnoMostvo())).toEqual([]);
  });
});

describe("število igralcev in pozicije (2/5/5/3)", () => {
  it("zavrne moštvo s 14 igralci", () => {
    const mostvo = veljavnoMostvo().slice(0, 14); // brez zadnjega napadalca
    const napake = preveriMostvo(mostvo);
    expect(napake).toContain("Moštvo mora imeti 15 igralcev (izbranih: 14).");
    expect(napake).toContain("Napadalci: potrebnih 3, izbranih 2.");
  });

  it("zavrne moštvo s 16 igralci", () => {
    const mostvo = [...veljavnoMostvo(), igralec("16", "OB", 4, "Bravo")];
    const napake = preveriMostvo(mostvo);
    expect(napake).toContain("Moštvo mora imeti 15 igralcev (izbranih: 16).");
    expect(napake).toContain("Branilci: potrebnih 5, izbranih 6.");
  });

  it("zavrne 15 igralcev z napačno razporeditvijo (3 VR, 4 OB)", () => {
    const mostvo = veljavnoMostvo();
    mostvo[2] = igralec("3", "VR", 6, "Olimpija"); // branilec postane vratar
    const napake = preveriMostvo(mostvo);
    expect(napake).toEqual(["Vratarji: potrebnih 2, izbranih 3.", "Branilci: potrebnih 5, izbranih 4."]);
  });

  it("zavrne prazno moštvo", () => {
    const napake = preveriMostvo([]);
    expect(napake).toContain("Moštvo mora imeti 15 igralcev (izbranih: 0).");
    expect(napake).toContain("Vratarji: potrebnih 2, izbranih 0.");
  });

  it("zavrne istega igralca dvakrat", () => {
    const mostvo = veljavnoMostvo();
    mostvo[1] = igralec("1", "VR", 6, "Olimpija"); // drugi vratar ima isti id kot prvi
    expect(preveriMostvo(mostvo)).toContain("Isti igralec je izbran večkrat.");
  });
});

describe("proračun (največ 100,0 mio)", () => {
  it("dovoli natanko 100,0 mio", () => {
    const mostvo = veljavnoMostvo();
    mostvo[0].cena = 16; // 90 + 10 = 100
    expect(sestejCene(mostvo)).toBe(100);
    expect(preveriMostvo(mostvo)).toEqual([]);
  });

  it("zavrne 100,5 mio", () => {
    const mostvo = veljavnoMostvo();
    mostvo[0].cena = 16.5; // 90 + 10,5 = 100,5
    expect(preveriMostvo(mostvo)).toEqual(["Vsota cen (100,5 mio) presega proračun 100,0 mio."]);
  });

  it("pravilno sešteje decimalne cene", () => {
    const mostvo = veljavnoMostvo();
    // 15 x 6,7 = 100,5, pri seštevanju decimalnih števil v JS pride do majhne napake
    for (const i of mostvo) i.cena = 6.7;
    expect(sestejCene(mostvo)).toBe(100.5);

    // 10 x 6,7 + 5 x 6,6 = 100,0, kar mora biti dovoljeno
    for (let i = 10; i < 15; i++) mostvo[i].cena = 6.6;
    expect(sestejCene(mostvo)).toBe(100);
    expect(preveriMostvo(mostvo)).toEqual([]);
  });
});

describe("največ 3 igralci iz istega kluba", () => {
  it("dovoli 3 igralce iz istega kluba", () => {
    const mostvo = veljavnoMostvo(); // Olimpija ima že 3 igralce
    const izOlimpije = mostvo.filter((i) => i.klub === "Olimpija").length;
    expect(izOlimpije).toBe(3);
    expect(preveriMostvo(mostvo)).toEqual([]);
  });

  it("zavrne 4 igralce iz istega kluba", () => {
    const mostvo = veljavnoMostvo();
    mostvo[4].klub = "Olimpija"; // branilec iz Celja postane iz Olimpije
    expect(preveriMostvo(mostvo)).toEqual(["Največ 3 igralci iz istega kluba (Olimpija: 4)."]);
  });

  it("javi vsak klub, ki ima preveč igralcev", () => {
    const mostvo = veljavnoMostvo();
    mostvo[4].klub = "Olimpija";
    mostvo[5].klub = "Maribor";
    expect(preveriMostvo(mostvo)).toEqual([
      "Največ 3 igralci iz istega kluba (Olimpija: 4).",
      "Največ 3 igralci iz istega kluba (Maribor: 4).",
    ]);
  });
});

describe("več napak hkrati", () => {
  it("vrne vse napake naenkrat", () => {
    const mostvo = veljavnoMostvo();
    mostvo[2] = igralec("3", "VR", 30, "Olimpija"); // tretji vratar in predrag
    mostvo[4].klub = "Olimpija"; // četrti iz Olimpije
    expect(preveriMostvo(mostvo)).toEqual([
      "Vratarji: potrebnih 2, izbranih 3.",
      "Branilci: potrebnih 5, izbranih 4.",
      "Vsota cen (114,0 mio) presega proračun 100,0 mio.",
      "Največ 3 igralci iz istega kluba (Olimpija: 4).",
    ]);
  });
});
