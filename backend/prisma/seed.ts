// Testni podatki: uporabniki, klubi Prve lige, nogometaši in razpored krogov.
// Zaženeš z: pnpm db:seed (ne ustvari dvojnikov)
import { config } from "dotenv";
config({ path: "../.env" });

import { auth } from "../src/auth";
import { prisma } from "../src/db";
import { izracunajRok } from "../src/krog";
import type { Pozicija } from "../src/generated/prisma/client";

const geslo = "geslo1234";

const uporabniki = [
  { name: "Testni menedžer", email: "menedzer@prvihxi.si", vloga: "menedzer" },
  { name: "Testni urednik", email: "urednik@prvihxi.si", vloga: "urednik" },
  { name: "Testni admin", email: "admin@prvihxi.si", vloga: "admin" },
] as const;

// moc = koliko dražji so igralci tega kluba (močnejši klubi imajo dražje igralce)
const klubi = [
  { naziv: "Olimpija", kratica: "OLI", moc: 2.5 },
  { naziv: "Maribor", kratica: "MAR", moc: 2.5 },
  { naziv: "Celje", kratica: "CEL", moc: 2 },
  { naziv: "Koper", kratica: "KOP", moc: 1.5 },
  { naziv: "Mura", kratica: "MUR", moc: 1 },
  { naziv: "Bravo", kratica: "BRA", moc: 1 },
  { naziv: "Domžale", kratica: "DOM", moc: 0.5 },
  { naziv: "Radomlje", kratica: "RAD", moc: 0.5 },
  { naziv: "Primorje", kratica: "PRI", moc: 0 },
  { naziv: "Aluminij", kratica: "ALU", moc: 0 },
];

// dodatki = koliko je vsak igralec dražji od osnovne cene (prvi je zvezda, zadnji so rezerve)
const pozicije: { pozicija: Pozicija; osnovnaCena: number; dodatki: number[] }[] = [
  { pozicija: "VR", osnovnaCena: 4.0, dodatki: [1.5, 0] },
  { pozicija: "OB", osnovnaCena: 4.0, dodatki: [4, 2, 1, 0.5, 0, 0] },
  { pozicija: "VE", osnovnaCena: 4.5, dodatki: [5, 2.5, 1, 0.5, 0, 0] },
  { pozicija: "NA", osnovnaCena: 5.0, dodatki: [5.5, 2.5, 1, 0] },
];

// izmišljena imena
const imena = [
  "Luka", "Jan", "Nejc", "Žan", "Tim", "Anže", "Matic", "Rok", "Gal", "Jaka", "Tilen", "Blaž",
  "Nik", "Miha", "Aljaž", "Domen", "Klemen", "Urban", "Vid", "Lovro", "Žiga", "Marko", "Filip", "Tadej",
];
const priimki = [
  "Kranjc", "Zupan", "Kos", "Vidmar", "Golob", "Turk", "Bizjak", "Kralj", "Hribar", "Rozman",
  "Petek", "Kolar", "Logar", "Kunej", "Mlakar", "Jereb", "Pirc", "Furlan", "Dolenc", "Hrovat",
  "Kavčič", "Rupnik", "Sever", "Zorko", "Erjavec", "Lešnik", "Majcen", "Bertoncelj", "Breznik", "Jamnik",
  "Rebernik", "Kovačič", "Tomažič", "Pavlin", "Gorjup", "Lah", "Kerin", "Ambrož", "Debeljak", "Šuštar",
  "Medved", "Štrukelj", "Novljan", "Zalokar", "Volk",
];

async function ustvariUporabnike() {
  for (const u of uporabniki) {
    const obstaja = await prisma.user.findUnique({ where: { email: u.email } });
    if (!obstaja)
      await auth.api.signUpEmail({ body: { name: u.name, email: u.email, password: geslo } });
    
    // vloge ni mogoče nastaviti ob registraciji, zato jo nastavimo posebej
    await prisma.user.update({ where: { email: u.email }, data: { vloga: u.vloga } });
    console.log(`${obstaja ? "obstaja" : "ustvarjen"}: ${u.email} (${u.vloga})`);
  }
}

async function ustvariKlubeInNogometase() {
  let stevec = 0; // za izbiro imena in priimka

  for (const k of klubi) {
    const klub = await prisma.klub.upsert({
      where: { naziv: k.naziv },
      update: { kratica: k.kratica },
      create: { naziv: k.naziv, kratica: k.kratica },
    });

    const zeImaIgralce = await prisma.nogometas.count({ where: { klubId: klub.id } });
    if (zeImaIgralce > 0) {
      stevec += 18;
      console.log(`obstaja: ${k.naziv} (${zeImaIgralce} igralcev)`);
      continue;
    }

    const nogometasi = [];
    for (const p of pozicije) {
      for (const dodatek of p.dodatki) {
        // malo razlike med igralci (0, 0.5 ali 1 mio)
        const razlika = (stevec % 3) * 0.5;
        let cena = p.osnovnaCena + k.moc + dodatek + razlika;
        if (cena < 4) cena = 4;
        if (cena > 15) cena = 15;

        nogometasi.push({
          klubId: klub.id,
          ime: imena[stevec % imena.length],
          priimek: priimki[stevec % priimki.length],
          pozicija: p.pozicija,
          cena: cena,
        });
        stevec++;
      }
    }

    await prisma.nogometas.createMany({ data: nogometasi });
    console.log(`ustvarjen: ${k.naziv} (${nogometasi.length} igralcev)`);
  }
}

// Razpored: vsak klub igra z vsakim enkrat, 9 krogov po 5 tekem.
const STEVILO_KROGOV = 9;

const URE_TEKEM = [
  { dan: 0, ura: 15, minute: 0 },
  { dan: 0, ura: 17, minute: 30 },
  { dan: 0, ura: 20, minute: 0 },
  { dan: 1, ura: 15, minute: 0 },
  { dan: 1, ura: 17, minute: 30 },
];

// sobota prejšnjega vikenda (če je danes sobota, je to sobota pred tednom)
function sobotaPrvegaKroga(): Date {
  const danes = new Date();
  const doNaslednjeSobote = (6 - danes.getDay() + 7) % 7 || 7;
  return new Date(danes.getFullYear(), danes.getMonth(), danes.getDate() + doNaslednjeSobote - 7);
}

// pari za vse kroge po "krožni" metodi: prvi klub stoji, ostali se vsak krog zavrtijo za eno mesto
function pariKrogov(klubIds: string[]): [string, string][][] {
  const vrsta = [...klubIds];
  const krogi: [string, string][][] = [];

  for (let k = 0; k < vrsta.length - 1; k++) {
    const pari: [string, string][] = [];
    for (let i = 0; i < vrsta.length / 2; i++) {
      const a = vrsta[i];
      const b = vrsta[vrsta.length - 1 - i];
      // izmenično doma in v gosteh, da en klub ne igra vedno doma
      pari.push(k % 2 === 0 ? [a, b] : [b, a]);
    }
    krogi.push(pari);
    // zavrtimo vse razen prvega
    vrsta.splice(1, 0, vrsta.pop()!);
  }
  return krogi;
}

async function ustvariKroge() {
  if ((await prisma.krog.count()) > 0) {
    console.log("obstaja: razpored krogov");
    return;
  }

  const klubIds = (await prisma.klub.findMany({ orderBy: { naziv: "asc" } })).map((k) => k.id);
  const vsiPari = pariKrogov(klubIds);
  const prvaSobota = sobotaPrvegaKroga();

  for (let k = 0; k < STEVILO_KROGOV; k++) {
    const tekme = vsiPari[k].map(([domaciId, gostjeId], i) => {
      const cas = URE_TEKEM[i];
      const zacetek = new Date(prvaSobota);
      zacetek.setDate(prvaSobota.getDate() + k * 7 + cas.dan);
      zacetek.setHours(cas.ura, cas.minute, 0, 0);
      return { domaciId, gostjeId, zacetek };
    });

    await prisma.krog.create({
      data: {
        stevilka: k + 1,
        rok: izracunajRok(tekme.map((t) => t.zacetek)),
        tekme: { create: tekme },
      },
    });
  }
  console.log(`ustvarjen: razpored (${STEVILO_KROGOV} krogov, prvi ${prvaSobota.toLocaleDateString("sl-SI")})`);
}

async function main() {
  await ustvariUporabnike();
  await ustvariKlubeInNogometase();
  await ustvariKroge();
}

main()
  .catch((napaka) => {
    console.error(napaka);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
