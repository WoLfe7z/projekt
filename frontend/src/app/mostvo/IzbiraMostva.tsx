"use client";
// Izbira 15 nogometašev: levo seznam vseh igralcev, desno igrišče z izbranimi, proračun in shranjevanje.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IMENA_POZICIJ, PRAVILA, SESTAVA, preveriMostvo, sestejCene, zapisiMio, type Pozicija } from "backend";
import { ustvariMostvo } from "./actions";
import Napaka from "@/components/Napaka";
import IgrisceMostva from "@/components/IgrisceMostva";

export type Igralec = {
  id: string;
  ime: string;
  priimek: string;
  pozicija: Pozicija;
  cena: number;
  klub: string; // naziv kluba
  kratica: string; // kratica kluba, npr. OLI
};

const POZICIJE: Pozicija[] = ["VR", "OB", "VE", "NA"];

export default function IzbiraMostva({ igralci, klubi }: { igralci: Igralec[]; klubi: string[] }) {
  const router = useRouter();
  const [izbraniIds, setIzbraniIds] = useState<string[]>([]);
  const [filterPozicija, setFilterPozicija] = useState<Pozicija | "">("");
  const [filterKlub, setFilterKlub] = useState("");
  const [iskanje, setIskanje] = useState("");
  const [ime, setIme] = useState("");
  const [napake, setNapake] = useState<string[]>([]);
  const [shranjujem, setShranjujem] = useState(false);

  const izbrani = igralci.filter((i) => izbraniIds.includes(i.id));
  const porabljeno = sestejCene(izbrani);
  const preostanek = Math.round((PRAVILA.proracun - porabljeno) * 10) / 10;
  const prekoracen = porabljeno > PRAVILA.proracun;

  // pravila preverimo že v brskalniku, da vemo, ali gumb Shrani omogočiti
  const lahkoShranim = preveriMostvo(izbrani).length === 0 && ime.trim().length >= PRAVILA.imeNajmanj;

  function steviloNaPoziciji(pozicija: Pozicija) {
    return izbrani.filter((i) => i.pozicija === pozicija).length;
  }

  function steviloIzKluba(klub: string) {
    return izbrani.filter((i) => i.klub === klub).length;
  }

  // vrne razlog, zakaj igralca ni mogoče dodati (ali null, če ga lahko dodamo)
  function zakajNeMorem(igralec: Igralec): string | null {
    if (steviloIzKluba(igralec.klub) >= PRAVILA.najvecIzKluba)
      return `Največ ${PRAVILA.najvecIzKluba} igralci iz istega kluba`;
    if (steviloNaPoziciji(igralec.pozicija) >= SESTAVA[igralec.pozicija])
      return "Pozicija je zapolnjena";
    return null;
  }

  function dodaj(id: string) {
    setIzbraniIds([...izbraniIds, id]);
    setNapake([]);
  }

  function odstrani(id: string) {
    setIzbraniIds(izbraniIds.filter((x) => x !== id));
    setNapake([]);
  }

  async function shrani(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShranjujem(true);
    const rezultat = await ustvariMostvo(ime, izbraniIds);
    setShranjujem(false);

    if (rezultat.napake.length > 0) {
      setNapake(rezultat.napake);
      return;
    }
    router.refresh();
  }

  const iskanoBesedilo = iskanje.trim().toLowerCase();
  const prikazani = igralci.filter(
    (i) =>
      (filterPozicija === "" || i.pozicija === filterPozicija) &&
      (filterKlub === "" || i.klub === filterKlub) &&
      (iskanoBesedilo === "" || `${i.ime} ${i.priimek}`.toLowerCase().includes(iskanoBesedilo))
  );

  // koliko proračuna je porabljenega (za merilnik), največ 100 %
  const odstotek = Math.min((porabljeno / PRAVILA.proracun) * 100, 100);

  return (
    <div className="grid gap-10 pb-20 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:pb-0">
      {/* levo: seznam igralcev */}
      <section aria-labelledby="naslov-seznam">
        <h2 id="naslov-seznam" className="sr-only">
          Seznam nogometašev
        </h2>

        {/* filter po poziciji: gumbi s številom izbranih */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Pozicija">
          <FilterGumb aktiven={filterPozicija === ""} onClick={() => setFilterPozicija("")}>
            Vsi
          </FilterGumb>
          {POZICIJE.map((p) => (
            <FilterGumb key={p} aktiven={filterPozicija === p} onClick={() => setFilterPozicija(p)}>
              {IMENA_POZICIJ[p]}{" "}
              <span className={`tabular-nums ${filterPozicija === p ? "text-kreda/75" : "text-siva"}`}>
                {steviloNaPoziciji(p)}/{SESTAVA[p]}
              </span>
            </FilterGumb>
          ))}
        </div>

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
        </div>

        <table className="mt-5 w-full text-left text-sm">
          <caption className="sr-only">Nogometaši, razvrščeni po ceni</caption>
          <thead className="border-b-2 border-crnilo text-siva">
            <tr>
              <th className="py-2 pr-3 font-medium">Igralec</th>
              <th className="hidden py-2 pr-3 font-medium sm:table-cell">Klub</th>
              <th className="py-2 pr-3 font-medium">Poz.</th>
              <th className="py-2 pr-3 text-right font-medium">Cena</th>
              <th className="py-2">
                <span className="sr-only">Dejanje</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {prikazani.map((igralec) => {
              const jeIzbran = izbraniIds.includes(igralec.id);
              const razlog = jeIzbran ? null : zakajNeMorem(igralec);

              return (
                <tr
                  key={igralec.id}
                  className={`border-b border-rob ${jeIzbran ? "bg-trava/8" : ""} ${razlog ? "text-siva" : ""}`}
                >
                  <td className="py-2 pr-3">
                    <span className="block leading-tight">
                      {igralec.ime} <span className="font-semibold">{igralec.priimek}</span>
                    </span>
                    {razlog && <span className="block text-xs leading-tight text-siva">{razlog}</span>}
                    <span className="block text-xs text-siva sm:hidden">{igralec.klub}</span>
                  </td>
                  <td className="hidden py-2 pr-3 sm:table-cell">{igralec.klub}</td>
                  <td className="py-2 pr-3">
                    <span className="font-display font-semibold">{igralec.pozicija}</span>
                  </td>
                  <td className="py-2 pr-3 text-right font-medium tabular-nums">{zapisiMio(igralec.cena)}</td>
                  <td className="w-10 py-2 text-right">
                    {jeIzbran ? (
                      <button
                        type="button"
                        onClick={() => odstrani(igralec.id)}
                        aria-label={`Odstrani ${igralec.ime} ${igralec.priimek}`}
                        title="Odstrani iz moštva"
                        className="size-8 rounded-full bg-trava text-lg leading-none text-white hover:bg-trava-temna focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        −
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => dodaj(igralec.id)}
                        disabled={razlog !== null}
                        aria-label={`Dodaj ${igralec.ime} ${igralec.priimek}`}
                        title={razlog ?? "Dodaj v moštvo"}
                        className="size-8 rounded-full border border-trava text-lg leading-none text-trava hover:bg-trava hover:text-white focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:border-rob disabled:text-rob disabled:hover:bg-transparent"
                      >
                        +
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {prikazani.length === 0 && (
          <p className="py-6 text-sm text-siva">Noben igralec ne ustreza iskanju. Spremeni filtre.</p>
        )}
      </section>

      {/* desno: proračun, igrišče in shranjevanje */}
      <aside id="mostvo" className="scroll-mt-6 lg:sticky lg:top-6">
        <div aria-live="polite" className="mb-3">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-siva">{prekoracen ? "Prekoračeno za" : "Preostanek"}</p>
            <p className="text-sm text-siva tabular-nums">
              {izbrani.length}/{PRAVILA.steviloIgralcev} igralcev
            </p>
          </div>
          <p
            className={`font-display text-4xl leading-none font-bold tabular-nums ${prekoracen ? "text-napaka" : ""}`}
          >
            {zapisiMio(Math.abs(preostanek))} mio
          </p>
          {/* merilnik porabljenega proračuna */}
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-kreda"
            role="meter"
            aria-label="Porabljen proračun"
            aria-valuemin={0}
            aria-valuemax={PRAVILA.proracun}
            aria-valuenow={Math.min(porabljeno, PRAVILA.proracun)}
            aria-valuetext={`${zapisiMio(porabljeno)} od ${zapisiMio(PRAVILA.proracun)} mio`}
          >
            <div
              className={`h-full rounded-full ${prekoracen ? "bg-napaka" : "bg-trava"}`}
              style={{ width: `${odstotek}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-siva tabular-nums">
            Porabljeno {zapisiMio(porabljeno)} od {zapisiMio(PRAVILA.proracun)} mio
          </p>
        </div>

        <IgrisceMostva igralci={izbrani} odstrani={odstrani} />
        {izbrani.length > 0 && <p className="mt-2 text-xs text-siva">Klikni igralca na igrišču, da ga odstraniš.</p>}

        <form onSubmit={shrani} className="mt-5 space-y-3">
          {napake.length > 0 && (
            <div className="space-y-2">
              {napake.map((n) => (
                <Napaka key={n} besedilo={n} />
              ))}
            </div>
          )}
          <div>
            <label htmlFor="ime" className="block text-sm font-medium">
              Ime moštva
            </label>
            <input
              id="ime"
              value={ime}
              onChange={(e) => setIme(e.target.value)}
              required
              minLength={PRAVILA.imeNajmanj}
              maxLength={PRAVILA.imeNajvec}
              placeholder="npr. Zmaji iz Šiške"
              aria-describedby="ime-namig"
              className="mt-1.5 block h-11 w-full rounded-md border border-rob bg-white px-3 text-base outline-none focus:border-trava focus:ring-[3px] focus:ring-trava/35"
            />
            <p id="ime-namig" className="mt-1.5 text-sm text-siva">
              Od {PRAVILA.imeNajmanj} do {PRAVILA.imeNajvec} znakov.
            </p>
          </div>
          <button
            type="submit"
            disabled={!lahkoShranim || shranjujem}
            className="h-12 w-full rounded-md bg-trava font-display text-lg font-semibold tracking-wide text-white hover:bg-trava-temna focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-rob disabled:text-siva"
          >
            {shranjujem ? "Shranjujem …" : "Shrani moštvo"}
          </button>
          {!lahkoShranim && (
            <p className="text-sm text-siva">
              {prekoracen
                ? "Moštvo je predrago. Zamenjaj katerega od dražjih igralcev."
                : izbrani.length < PRAVILA.steviloIgralcev
                  ? `Izbranih je ${izbrani.length} od ${PRAVILA.steviloIgralcev} igralcev.`
                  : "Vpiši ime moštva."}
            </p>
          )}
        </form>
      </aside>

      {/* na telefonu je igrišče daleč pod seznamom, zato proračun pokažemo še v spodnji vrstici */}
      <div className="fixed inset-x-0 bottom-0 flex items-center justify-between bg-trava-temna px-5 py-3 text-kreda lg:hidden">
        <p className="text-sm tabular-nums">
          {izbrani.length}/{PRAVILA.steviloIgralcev} igralcev,{" "}
          <span className={`font-semibold ${prekoracen ? "text-red-200" : ""}`}>
            {prekoracen ? `${zapisiMio(-preostanek)} mio preveč` : `${zapisiMio(preostanek)} mio ostane`}
          </span>
        </p>
        <a href="#mostvo" className="text-sm font-medium underline underline-offset-2">
          Na igrišče
        </a>
      </div>
    </div>
  );
}

// gumb za filter po poziciji
function FilterGumb({
  aktiven,
  onClick,
  children,
}: {
  aktiven: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktiven}
      className={`h-9 rounded-full px-3.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none ${
        aktiven ? "bg-trava text-white" : "border border-rob bg-white hover:border-trava"
      }`}
    >
      {children}
    </button>
  );
}
