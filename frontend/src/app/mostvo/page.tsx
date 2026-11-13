import type { Metadata } from "next";
import { prisma } from "backend/db";
import { IMENA_POZICIJ, PRAVILA, zapisiMio, type Pozicija } from "backend";
import { zahtevajUporabnika } from "@/lib/seja";
import Glava from "@/components/Glava";
import IgrisceMostva, { type IgralecNaIgriscu } from "@/components/IgrisceMostva";
import IzbiraMostva, { type Igralec } from "./IzbiraMostva";

export const metadata: Metadata = { title: "Moje moštvo | PrvihXI" };

const POZICIJE: Pozicija[] = ["VR", "OB", "VE", "NA"];

export default async function MostvoStran() {
  const uporabnik = await zahtevajUporabnika();

  const mostvo = await prisma.mostvo.findUnique({
    where: { uporabnikId: uporabnik.id },
    include: { nogometasi: { include: { nogometas: { include: { klub: true } } } } },
  });

  let vsebina;

  if (mostvo) {
    // menedžer že ima moštvo: pokažemo ga na igrišču in v seznamu
    const igralci: IgralecNaIgriscu[] = mostvo.nogometasi
      .map((mn) => ({
        id: mn.nogometas.id,
        ime: mn.nogometas.ime,
        priimek: mn.nogometas.priimek,
        kratica: mn.nogometas.klub.kratica,
        cena: Number(mn.nogometas.cena),
        pozicija: mn.nogometas.pozicija,
      }))
      .sort((a, b) => b.cena - a.cena);
    const preostanek = Number(mostvo.proracun);

    vsebina = (
      <div className="grid gap-10 lg:grid-cols-[400px_minmax(0,1fr)]">
        <div>
          <h1 className="font-display text-5xl leading-none font-bold">{mostvo.ime}</h1>
          <dl className="mt-6 grid grid-cols-3 border-y border-rob py-4">
            <div>
              <dt className="text-sm text-siva">Vrednost moštva</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">
                {zapisiMio(PRAVILA.proracun - preostanek)} mio
              </dd>
            </div>
            <div>
              <dt className="text-sm text-siva">Preostanek</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">{zapisiMio(preostanek)} mio</dd>
            </div>
            <div>
              <dt className="text-sm text-siva">Točke</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">{mostvo.skupneTocke}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <IgrisceMostva igralci={igralci} />
          </div>
        </div>

        <section aria-labelledby="naslov-igralci">
          <h2 id="naslov-igralci" className="font-display text-2xl font-semibold">
            Igralci
          </h2>
          <table className="mt-3 w-full text-left text-sm">
            <caption className="sr-only">Igralci moštva po pozicijah</caption>
            <thead className="border-b-2 border-crnilo text-siva">
              <tr>
                <th className="py-2 pr-3 font-medium">Igralec</th>
                <th className="py-2 pr-3 font-medium">Klub</th>
                <th className="py-2 text-right font-medium">Cena</th>
              </tr>
            </thead>
            {POZICIJE.map((p) => (
              <tbody key={p}>
                <tr>
                  <th colSpan={3} className="pt-4 pb-1 font-display text-base font-semibold text-trava">
                    {IMENA_POZICIJ[p]}
                  </th>
                </tr>
                {igralci
                  .filter((i) => i.pozicija === p)
                  .map((i) => (
                    <tr key={i.id} className="border-b border-rob">
                      <td className="py-2 pr-3">
                        {i.ime} <span className="font-semibold">{i.priimek}</span>
                      </td>
                      <td className="py-2 pr-3">{i.kratica}</td>
                      <td className="py-2 text-right tabular-nums">{zapisiMio(i.cena)}</td>
                    </tr>
                  ))}
              </tbody>
            ))}
          </table>
        </section>
      </div>
    );
  } else if (uporabnik.vloga !== "menedzer") {
    vsebina = (
      <div className="max-w-xl">
        <h1 className="font-display text-5xl leading-none font-bold">Moje moštvo</h1>
        <p className="mt-4 text-siva">
          Moštvo lahko sestavi samo menedžer. Tvoj račun ima vlogo {uporabnik.vloga === "admin" ? "administrator" : "urednik"}.
        </p>
      </div>
    );
  } else {
    // menedžer še nima moštva: izbira 15 igralcev
    const izBaze = await prisma.nogometas.findMany({
      include: { klub: true },
      orderBy: [{ cena: "desc" }, { priimek: "asc" }],
    });

    // Decimal (cena) ne moremo poslati v brskalnik, zato ga pretvorimo v število
    const igralci: Igralec[] = izBaze.map((n) => ({
      id: n.id,
      ime: n.ime,
      priimek: n.priimek,
      pozicija: n.pozicija,
      cena: Number(n.cena),
      klub: n.klub.naziv,
      kratica: n.klub.kratica,
    }));
    const klubi = [...new Set(igralci.map((i) => i.klub))].sort();

    vsebina = (
      <>
        <h1 className="font-display text-5xl leading-none font-bold">Sestavi moštvo</h1>
        <p className="mt-3 max-w-xl text-siva">
          Izberi 2 vratarja, 5 branilcev, 5 vezistov in 3 napadalce za največ 100,0 mio. Iz istega kluba lahko vzameš
          največ 3 igralce.
        </p>
        <div className="mt-8">
          <IzbiraMostva igralci={igralci} klubi={klubi} />
        </div>
      </>
    );
  }

  return (
    <>
      <Glava ime={uporabnik.name} aktivna="/mostvo" />
      <main className="mx-auto max-w-6xl px-6 py-10 md:px-12">{vsebina}</main>
    </>
  );
}
