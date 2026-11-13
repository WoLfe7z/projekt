import { describe, expect, it } from "vitest";
import { preveriPostavo, type IgralecVPostavi } from "./postava";
import type { Pozicija } from "./pravila";

function igralec(id: string, pozicija: Pozicija, mesto: number, kapetan = false): IgralecVPostavi {
  return { id, pozicija, mesto, kapetan };
}

// 4-4-2, na klopi VR, OB, VE, NA; kapetan je napadalec na mestu 11
function veljavnaPostava(): IgralecVPostavi[] {
  return [
    igralec("vr1", "VR", 1),
    igralec("ob1", "OB", 2),
    igralec("ob2", "OB", 3),
    igralec("ob3", "OB", 4),
    igralec("ob4", "OB", 5),
    igralec("ve1", "VE", 6),
    igralec("ve2", "VE", 7),
    igralec("ve3", "VE", 8),
    igralec("ve4", "VE", 9),
    igralec("na1", "NA", 10),
    igralec("na2", "NA", 11, true),
    igralec("vr2", "VR", 12),
    igralec("ob5", "OB", 13),
    igralec("ve5", "VE", 14),
    igralec("na3", "NA", 15),
  ];
}

function zamenjajMesti(postava: IgralecVPostavi[], idA: string, idB: string) {
  const a = postava.find((i) => i.id === idA)!;
  const b = postava.find((i) => i.id === idB)!;
  [a.mesto, b.mesto] = [b.mesto, a.mesto];
}

describe("veljavna postava", () => {
  it("4-4-2 nima napak", () => {
    expect(preveriPostavo(veljavnaPostava())).toEqual([]);
  });

  it("3-5-2 nima napak", () => {
    const postava = veljavnaPostava();
    zamenjajMesti(postava, "ob4", "ve5");
    expect(preveriPostavo(postava)).toEqual([]);
  });

  it("5-2-3 nima napak", () => {
    const postava = veljavnaPostava();
    zamenjajMesti(postava, "ve3", "ob5");
    zamenjajMesti(postava, "ve4", "na3");
    expect(preveriPostavo(postava)).toEqual([]);
  });
});

describe("formacija (1 VR, 3–5 OB, 2–5 VE, 1–3 NA)", () => {
  it("zavrne dva vratarja v začetni postavi", () => {
    const postava = veljavnaPostava();
    zamenjajMesti(postava, "ob1", "vr2");
    expect(preveriPostavo(postava)).toContain("Vratarji v začetni postavi: dovoljeno natanko 1, izbranih 2.");
  });

  it("zavrne začetno postavo brez vratarja", () => {
    const postava = veljavnaPostava();
    zamenjajMesti(postava, "vr1", "ob5");
    expect(preveriPostavo(postava)).toContain("Vratarji v začetni postavi: dovoljeno natanko 1, izbranih 0.");
  });

  it("zavrne samo 2 branilca", () => {
    const postava = veljavnaPostava();
    zamenjajMesti(postava, "ob1", "ve5");
    zamenjajMesti(postava, "ob2", "na3");
    expect(preveriPostavo(postava)).toEqual(["Branilci v začetni postavi: dovoljeno od 3 do 5, izbranih 2."]);
  });

  it("zavrne samo 1 vezista", () => {
    // z največ 5 OB in 3 NA je 1 vezist mogoč le z drugim vratarjem, zato sta napaki dve
    const postava = veljavnaPostava();
    zamenjajMesti(postava, "ve1", "ob5");
    zamenjajMesti(postava, "ve2", "na3");
    zamenjajMesti(postava, "ve3", "vr2");
    expect(preveriPostavo(postava)).toContain("Vezisti v začetni postavi: dovoljeno od 2 do 5, izbranih 1.");
  });

  it("zavrne začetno postavo brez napadalca", () => {
    const postava = veljavnaPostava();
    postava.find((i) => i.id === "na2")!.kapetan = false;
    postava.find((i) => i.id === "vr1")!.kapetan = true;
    zamenjajMesti(postava, "na1", "ob5");
    zamenjajMesti(postava, "na2", "ve5");
    expect(preveriPostavo(postava)).toEqual(["Napadalci v začetni postavi: dovoljeno od 1 do 3, izbranih 0."]);
  });
});

describe("kapetan", () => {
  it("zavrne postavo brez kapetana", () => {
    const postava = veljavnaPostava();
    postava.find((i) => i.id === "na2")!.kapetan = false;
    expect(preveriPostavo(postava)).toEqual(["Izberi natanko enega kapetana."]);
  });

  it("zavrne dva kapetana", () => {
    const postava = veljavnaPostava();
    postava.find((i) => i.id === "na1")!.kapetan = true;
    expect(preveriPostavo(postava)).toEqual(["Izberi natanko enega kapetana."]);
  });

  it("zavrne kapetana na klopi", () => {
    const postava = veljavnaPostava();
    postava.find((i) => i.id === "na2")!.kapetan = false;
    postava.find((i) => i.id === "ob5")!.kapetan = true;
    expect(preveriPostavo(postava)).toEqual(["Kapetan mora biti v začetni postavi."]);
  });
});

describe("klop", () => {
  it("zavrne igralca, ki ni vratar, na prvem mestu klopi", () => {
    const postava = veljavnaPostava();
    zamenjajMesti(postava, "vr2", "ob5");
    expect(preveriPostavo(postava)).toEqual(["Prvo mesto na klopi je rezervirano za vratarja."]);
  });
});

describe("mesta in igralci", () => {
  it("zavrne postavo s 14 igralci", () => {
    const postava = veljavnaPostava().slice(0, 14);
    expect(preveriPostavo(postava)).toContain("Postava mora imeti 15 igralcev (izbranih: 14).");
  });

  it("zavrne dve zasedbi istega mesta", () => {
    const postava = veljavnaPostava();
    postava.find((i) => i.id === "na3")!.mesto = 14;
    expect(preveriPostavo(postava)).toContain("Vsako mesto od 1 do 15 mora biti zasedeno z enim igralcem.");
  });

  it("zavrne istega igralca dvakrat", () => {
    const postava = veljavnaPostava();
    postava[14].id = "na1";
    expect(preveriPostavo(postava)).toContain("Isti igralec je v postavi večkrat.");
  });
});
