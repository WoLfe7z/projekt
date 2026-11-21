
import { describe, expect, it } from "vitest";
import { prevediNapako } from "./napake";

describe("Prevajanje napak", () => {
  it("prevede napako za obstoječega uporabnika", () => {
    expect(prevediNapako({ code: "USER_ALREADY_EXISTS" }))
      .toBe("Račun s tem e-poštnim naslovom že obstaja.");
  });

  it("prevede napako za že uporabljen e-poštni naslov", () => {
    expect(prevediNapako({
      code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
    })).toBe("Račun s tem e-poštnim naslovom že obstaja.");
  });

  it("prevede napačno geslo ali e-pošto", () => {
    expect(prevediNapako({ code: "INVALID_EMAIL_OR_PASSWORD" }))
      .toBe("Napačna e-pošta ali geslo.");
  });

  it("prevede napako za prekratko geslo", () => {
    expect(prevediNapako({ code: "PASSWORD_TOO_SHORT" }))
      .toBe("Geslo mora imeti najmanj 8 znakov.");
  });

  it("prevede neveljaven e-poštni naslov", () => {
    expect(prevediNapako({ code: "INVALID_EMAIL" }))
      .toBe("Vnesi veljaven e-poštni naslov.");
  });

  it("prepozna blokiran račun", () => {
    expect(prevediNapako({ status: 403 }))
      .toBe("Račun je blokiran.");
  });

  it("za neznano napako vrne splošno sporočilo", () => {
    expect(prevediNapako({ code: "UNKNOWN_ERROR" }))
      .toBe("Nekaj je šlo narobe. Poskusi znova.");
  });

  it("status 403 ima prednost pred kodo napake", () => {
    expect(prevediNapako({
      status: 403,
      code: "INVALID_EMAIL"
    })).toBe("Račun je blokiran.");
  });
});
