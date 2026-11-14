"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IMENA_POZICIJ,
  KAZEN_ZA_PRESTOP,
  jeBrezplacen,
  preveriPrestop,
  proracunPoPrestopu,
  zapisiMio,
  type Pozicija,
} from "backend";
import type { IgralecZaPrestop } from "backend/prestop-baza";
import Napaka from "@/components/Napaka";
import Odstevanje, { zapisiRok } from "@/components/Odstevanje";
import { izvediPrestop } from "./actions";

const POZICIJE: Pozicija[] = ["VR", "OB", "VE", "NA"];
const CENE = Array.from({ length: 23 }, (_, i) => 4 + i * 0.5);

type Props = {
  rok: string;
  preostanek: number;
  mojiIgralci: IgralecZaPrestop[];
  ostaliIgralci: IgralecZaPrestop[];
  opravljenih: number;
};

export default function IzbiraPrestopa({ rok, preostanek, mojiIgralci, ostaliIgralci, opravljenih }: Props) {
  const router = useRouter();
  const [venId, setVenId] = useState<string | null>(null);
  const [noterId, setNoterId] = useState<string | null>(null);
  const [filterKlub, setFilterKlub] = useState("");
  const [najvecCena, setNajvecCena] = useState("");
  const [iskanje, setIskanje] = useState("");
  const [napake, setNapake] = useState<string[]>([]);
  const [sporocilo, setSporocilo] = useState("");
  const [izvajam, setIzvajam] = useState(false);

  const ven = mojiIgralci.find((i) => i.id === venId);
  const noter = ostaliIgralci.find((i) => i.id === noterId);
  const brezplacen = jeBrezplacen(opravljenih);
  const klubi = [...new Set(ostaliIgralci.map((i) => i.klub))].sort();

  const iskano = iskanje.trim().toLowerCase();
  const prikazani = ven
    ? ostaliIgralci.filter(
        (i) =>
          i.pozicija === ven.pozicija &&
          (filterKlub === "" || i.klub === filterKlub) &&
          (najvecCena === "" || i.cena <= Number(najvecCena)) &&
          (iskano === "" || `${i.ime} ${i.priimek}`.toLowerCase().includes(iskano))
      )
    : [];

  function izberiVen(id: string) {
    setVenId(id === venId ? null : id);
    setNoterId(null);
    setNapake([]);
    setSporocilo("");
  }

  function preklici() {
    setVenId(null);
    setNoterId(null);
    setNapake([]);
  }

  async function potrdi() {
    if (!ven || !noter) return;
    setIzvajam(true);
    const rezultat = await izvediPrestop(ven.id, noter.id);
    setIzvajam(false);

    if (rezultat.napake.length > 0) {
      setNapake(rezultat.napake);
      return;
    }
    setSporocilo(`Prestop opravljen: ${ven.priimek} odhaja, ${noter.priimek} prihaja.`);
    setVenId(null);
    setNoterId(null);
    router.refresh();
  }

  return (
    <div className="grid gap-10 pb-20 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:pb-0">
      <div>
        <section aria-labelledby="naslov-ven">
          <h2 id="naslov-ven" className="font-display text-2xl font-semibold">
            Kdo odhaja?
          </h2>
          <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {POZICIJE.map((p) => (
              <div key={p}>
                <p className="text-sm font-medium text-siva">{IMENA_POZICIJ[p]}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {mojiIgralci
                    .filter((i) => i.pozicija === p)
                    .map((i) => (
                      <button
                        key={i.id}
                        type="button"
                        onClick={() => izberiVen(i.id)}
                        aria-pressed={venId === i.id}
                        className={`h-9 rounded-full px-3 text-sm focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none ${
                          venId === i.id
                            ? "bg-crnilo text-kreda"
                            : "border border-rob bg-white hover:border-trava"
                        }`}
                      >
                        {i.poskodovan && <span className="mr-1 font-bold text-napaka">!</span>}
                        {i.priimek} <span className={venId === i.id ? "text-kreda/70" : "text-siva"}>{i.kratica}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="naslov-noter" className="mt-10">
          <h2 id="naslov-noter" className="font-display text-2xl font-semibold">
            {ven ? `Kdo prihaja namesto igralca ${ven.priimek}?` : "Kdo prihaja?"}
          </h2>

          {!ven ? (
            <p className="mt-3 text-siva">Najprej zgoraj izberi igralca, ki odhaja. Nato boš videl igralce iste pozicije.</p>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap gap-2">
                <label className="min-w-48 flex-1">
                  <span className="sr-only">Išči igralca</span>
                  <input
                    type="search"
                    value={iskanje}
                    onChange={(e) => setIskanje(e.target.value)}
                    placeholder="Išči po imenu ali priimku"
                    className="block h-10 w-full rounded-md border border-rob bg-white px-3 outline-none focus:border-trava focus:ring-[3px] focus:ring-trava/35"
                  />
                </label>
                <label>
                  <span className="sr-only">Klub</span>
                  <select
                    value={filterKlub}
                    onChange={(e) => setFilterKlub(e.target.value)}
                    className="block h-10 rounded-md border border-rob bg-white px-2 outline-none focus:border-trava focus:ring-[3px] focus:ring-trava/35"
                  >
                    <option value="">Vsi klubi</option>
                    {klubi.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="sr-only">Največja cena</span>
                  <select
                    value={najvecCena}
                    onChange={(e) => setNajvecCena(e.target.value)}
                    className="block h-10 rounded-md border border-rob bg-white px-2 outline-none focus:border-trava focus:ring-[3px] focus:ring-trava/35"
                  >
                    <option value="">Katerakoli cena</option>
                    {CENE.map((c) => (
                      <option key={c} value={c}>
                        do {zapisiMio(c)} mio
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <table className="mt-5 w-full text-left text-sm">
                <caption className="sr-only">Igralci, ki lahko pridejo namesto igralca {ven.priimek}</caption>
                <thead className="border-b-2 border-crnilo text-siva">
                  <tr>
                    <th className="py-2 pr-3 font-medium">Igralec</th>
                    <th className="hidden py-2 pr-3 font-medium sm:table-cell">Klub</th>
                    <th className="py-2 pr-3 text-right font-medium">Cena</th>
                    <th className="py-2">
                      <span className="sr-only">Dejanje</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prikazani.map((i) => {
                    const razlog = preveriPrestop(mojiIgralci, preostanek, ven, i)[0];
                    const izbran = noterId === i.id;

                    return (
                      <tr key={i.id} className={`border-b border-rob ${izbran ? "bg-trava/8" : ""} ${razlog ? "text-siva" : ""}`}>
                        <td className="py-2 pr-3">
                          <span className="block leading-tight">
                            {i.poskodovan && <span className="mr-1 font-bold text-napaka">!</span>}
                            {i.ime} <span className="font-semibold">{i.priimek}</span>
                          </span>
                          {razlog && <span className="block text-xs leading-tight">{razlog}</span>}
                          <span className="block text-xs text-siva sm:hidden">{i.klub}</span>
                        </td>
                        <td className="hidden py-2 pr-3 sm:table-cell">{i.klub}</td>
                        <td className="py-2 pr-3 text-right font-medium tabular-nums">{zapisiMio(i.cena)}</td>
                        <td className="w-24 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => setNoterId(izbran ? null : i.id)}
                            disabled={!!razlog}
                            aria-pressed={izbran}
                            aria-label={`${izbran ? "Odznači" : "Izberi"} ${i.ime} ${i.priimek}`}
                            className={`h-8 rounded-full px-3 text-xs font-medium focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:border-rob disabled:text-rob ${
                              izbran ? "bg-trava text-white" : "border border-trava text-trava hover:bg-trava hover:text-white disabled:hover:bg-transparent"
                            }`}
                          >
                            {izbran ? "Izbran" : "Izberi"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {prikazani.length === 0 && (
                <p className="py-6 text-sm text-siva">Noben igralec ne ustreza filtrom. Spremeni filtre.</p>
              )}
            </>
          )}
        </section>
      </div>

      <aside id="povzetek" className="scroll-mt-6 space-y-5 lg:sticky lg:top-6">
        <div className="border-y border-rob py-4">
          <p className="text-sm text-siva">Rok za prestope</p>
          <p className="font-display text-2xl font-semibold">{zapisiRok(new Date(rok))}</p>
          <p className="text-sm">
            <Odstevanje rok={rok} />
          </p>
        </div>

        <dl className="space-y-2">
          <div className="flex justify-between gap-4">
            <dt className="text-siva">Ven</dt>
            <dd className="text-right font-medium">{ven ? `${ven.priimek} (${zapisiMio(ven.cena)})` : "–"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-siva">Noter</dt>
            <dd className="text-right font-medium">{noter ? `${noter.priimek} (${zapisiMio(noter.cena)})` : "–"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-rob pt-2">
            <dt className="text-siva">Proračun po prestopu</dt>
            <dd className="text-right font-display text-xl font-semibold tabular-nums">
              {ven && noter ? zapisiMio(proracunPoPrestopu(preostanek, ven, noter)) : zapisiMio(preostanek)} mio
            </dd>
          </div>
        </dl>

        <p className="text-sm">
          Prosti prestopi v tem krogu: <span className="font-semibold">{brezplacen ? 1 : 0}</span>
        </p>

        {!brezplacen && (
          <p className="rounded-md border border-napaka/40 bg-napaka/5 p-3 text-sm font-medium text-napaka">
            Ta prestop stane {KAZEN_ZA_PRESTOP} točke.
          </p>
        )}

        {napake.map((n) => (
          <Napaka key={n} besedilo={n} />
        ))}
        {sporocilo && (
          <p role="status" className="text-sm font-medium text-trava">
            {sporocilo}
          </p>
        )}

        <div className="space-y-2">
          <button
            type="button"
            onClick={potrdi}
            disabled={!ven || !noter || izvajam}
            className="h-12 w-full rounded-md bg-trava font-display text-lg font-semibold tracking-wide text-white hover:bg-trava-temna focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-rob disabled:text-siva"
          >
            {izvajam ? "Izvajam …" : brezplacen ? "Potrdi prestop" : `Potrdi prestop (−${KAZEN_ZA_PRESTOP} točke)`}
          </button>
          <button
            type="button"
            onClick={preklici}
            disabled={!ven}
            className="h-11 w-full rounded-md border border-rob font-medium hover:border-trava focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-siva disabled:hover:border-rob"
          >
            Prekliči
          </button>
        </div>
      </aside>

      {/* na telefonu je povzetek pod dolgim seznamom, zato izbiro pokažemo še v spodnji vrstici */}
      {ven && (
        <div className="fixed inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-trava-temna px-5 py-3 text-kreda lg:hidden">
          <p className="truncate text-sm">
            {ven.priimek} ven{noter ? `, ${noter.priimek} noter` : ", izberi igralca"}
          </p>
          {noter && (
            <a href="#povzetek" className="shrink-0 text-sm font-medium underline underline-offset-2">
              Na potrditev
            </a>
          )}
        </div>
      )}
    </div>
  );
}
