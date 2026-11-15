"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { POLJA, preveriNastop, preveriRezultat, type NapakeNastopa, type PoljeStatistike } from "backend";
import type { NastopIgralca } from "backend/tekma-baza";
import Napaka from "@/components/Napaka";
import { zapisiRok } from "@/components/Odstevanje";
import { shraniStatistiko } from "../actions";

type Vrednosti = Record<string, Record<PoljeStatistike, string>>;

type Props = {
  tekmaId: string;
  domaciNaziv: string;
  gostjeNaziv: string;
  zacetniGoliDomaci: number | null;
  zacetniGoliGostje: number | null;
  zacetniDomaci: NastopIgralca[];
  zacetniGostje: NastopIgralca[];
  potrjena: boolean;
  zacetek: string;
};

// prazno polje je NaN, da ga preverjanje označi kot napako
function vStevilo(vrednost: string): number {
  return vrednost.trim() === "" ? NaN : Number(vrednost);
}

function vVrednosti(igralci: NastopIgralca[]): Vrednosti {
  const vrednosti: Vrednosti = {};
  for (const i of igralci) {
    vrednosti[i.nogometasId] = Object.fromEntries(POLJA.map(({ polje }) => [polje, String(i[polje])])) as Record<
      PoljeStatistike,
      string
    >;
  }
  return vrednosti;
}

export default function VnosStatistike(props: Props) {
  const { tekmaId, domaciNaziv, gostjeNaziv, zacetniDomaci, zacetniGostje, potrjena, zacetek } = props;
  const router = useRouter();
  const [goliDomaci, setGoliDomaci] = useState(props.zacetniGoliDomaci === null ? "" : String(props.zacetniGoliDomaci));
  const [goliGostje, setGoliGostje] = useState(props.zacetniGoliGostje === null ? "" : String(props.zacetniGoliGostje));
  const [vrednosti, setVrednosti] = useState<Vrednosti>(() => vVrednosti([...zacetniDomaci, ...zacetniGostje]));
  const [napakeStreznika, setNapakeStreznika] = useState<string[]>([]);
  const [sporocilo, setSporocilo] = useState("");
  const [shranjujem, setShranjujem] = useState(false);

  function statistika(id: string) {
    const v = vrednosti[id];
    return {
      minute: vStevilo(v.minute),
      goli: vStevilo(v.goli),
      asistence: vStevilo(v.asistence),
      avtogoli: vStevilo(v.avtogoli),
      rumeni: vStevilo(v.rumeni),
      rdeci: vStevilo(v.rdeci),
    };
  }

  const napakePolj: Record<string, NapakeNastopa> = {};
  for (const id of Object.keys(vrednosti)) {
    const napake = preveriNastop(statistika(id));
    if (Object.keys(napake).length > 0)
      napakePolj[id] = napake;
  }
  const napakaRezultata = preveriRezultat(vStevilo(goliDomaci), vStevilo(goliGostje));
  const rezultatPrazen = goliDomaci === "" && goliGostje === "";
  const oznaciRezultat = napakaRezultata !== null && !rezultatPrazen;
  const imaNapake = napakaRezultata !== null || Object.keys(napakePolj).length > 0;

  function spremeni(id: string, polje: PoljeStatistike, vrednost: string) {
    setVrednosti({ ...vrednosti, [id]: { ...vrednosti[id], [polje]: vrednost } });
    setSporocilo("");
    setNapakeStreznika([]);
  }

  async function shrani() {
    setShranjujem(true);
    const rezultat = await shraniStatistiko(
      tekmaId,
      vStevilo(goliDomaci),
      vStevilo(goliGostje),
      Object.keys(vrednosti).map((id) => ({ nogometasId: id, ...statistika(id) }))
    );
    setShranjujem(false);

    if (rezultat.napake.length > 0) {
      setNapakeStreznika(rezultat.napake);
      return;
    }
    setSporocilo("Statistika je shranjena kot osnutek.");
    router.refresh();
  }

  const poljeRezultata =
    "h-14 w-16 rounded-md border bg-white text-center font-display text-4xl font-bold outline-none focus:border-trava focus:ring-[3px] focus:ring-trava/35 disabled:bg-kreda";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="font-display text-4xl font-bold">{domaciNaziv}</h1>
        <label className="sr-only" htmlFor="goli-domaci">
          Goli {domaciNaziv}
        </label>
        <input
          id="goli-domaci"
          type="number"
          inputMode="numeric"
          min={0}
          value={goliDomaci}
          onChange={(e) => setGoliDomaci(e.target.value)}
          disabled={potrjena}
          aria-invalid={oznaciRezultat || undefined}
          className={`${poljeRezultata} ${oznaciRezultat ? "border-napaka" : "border-rob"}`}
        />
        <span className="font-display text-4xl font-bold" aria-hidden="true">
          :
        </span>
        <label className="sr-only" htmlFor="goli-gostje">
          Goli {gostjeNaziv}
        </label>
        <input
          id="goli-gostje"
          type="number"
          inputMode="numeric"
          min={0}
          value={goliGostje}
          onChange={(e) => setGoliGostje(e.target.value)}
          disabled={potrjena}
          aria-invalid={oznaciRezultat || undefined}
          className={`${poljeRezultata} ${oznaciRezultat ? "border-napaka" : "border-rob"}`}
        />
        <p className="font-display text-4xl font-bold">{gostjeNaziv}</p>
      </div>
      <p className="mt-2 text-sm text-siva">
        {zapisiRok(new Date(zacetek))}
        {rezultatPrazen && !potrjena && <span className="ml-2">Vpiši rezultat tekme.</span>}
        {oznaciRezultat && <span className="ml-2 text-napaka">{napakaRezultata}</span>}
      </p>

      <TabelaKluba
        naziv={domaciNaziv}
        igralci={zacetniDomaci}
        vrednosti={vrednosti}
        napakePolj={napakePolj}
        onSpremeni={spremeni}
        samoZaBranje={potrjena}
      />
      <TabelaKluba
        naziv={gostjeNaziv}
        igralci={zacetniGostje}
        vrednosti={vrednosti}
        napakePolj={napakePolj}
        onSpremeni={spremeni}
        samoZaBranje={potrjena}
      />

      <div className="mt-8 max-w-xl space-y-3">
        {potrjena ? (
          <p className="rounded-md bg-kreda p-3 text-sm">Tekma je potrjena, statistike ni več mogoče spreminjati.</p>
        ) : (
          <>
            {napakeStreznika.map((n) => (
              <Napaka key={n} besedilo={n} />
            ))}
            {Object.keys(napakePolj).length > 0 && (
              <p className="text-sm text-napaka">Popravi rdeče označena polja, nato shrani statistiko.</p>
            )}
            {sporocilo && (
              <p role="status" className="text-sm font-medium text-trava">
                {sporocilo}
              </p>
            )}
            <button
              type="button"
              onClick={shrani}
              disabled={imaNapake || shranjujem}
              className="h-12 rounded-md bg-trava px-8 font-display text-lg font-semibold tracking-wide text-white hover:bg-trava-temna focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-rob disabled:text-siva"
            >
              {shranjujem ? "Shranjujem …" : "Shrani osnutek"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TabelaKluba({
  naziv,
  igralci,
  vrednosti,
  napakePolj,
  onSpremeni,
  samoZaBranje,
}: {
  naziv: string;
  igralci: NastopIgralca[];
  vrednosti: Vrednosti;
  napakePolj: Record<string, NapakeNastopa>;
  onSpremeni: (id: string, polje: PoljeStatistike, vrednost: string) => void;
  samoZaBranje: boolean;
}) {
  const napakeKluba = igralci.flatMap((i) =>
    POLJA.filter(({ polje }) => napakePolj[i.nogometasId]?.[polje]).map(
      ({ polje, ime }) => `${i.priimek}, ${ime.toLowerCase()}: ${napakePolj[i.nogometasId][polje]}`
    )
  );

  return (
    <section className="mt-8" aria-label={`Statistika: ${naziv}`}>
      <h2 className="font-display text-2xl font-semibold">{naziv}</h2>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b-2 border-crnilo text-siva">
            <tr>
              <th className="py-2 pr-3 font-medium">Igralec</th>
              {POLJA.map(({ polje, ime, kratko }) => (
                <th key={polje} className="px-1 py-2 text-center font-medium">
                  <abbr title={ime} className="no-underline">
                    {kratko}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {igralci.map((i) => (
              <tr key={i.nogometasId} className="border-b border-rob">
                <td className="py-1.5 pr-3">
                  {i.ime} <span className="font-semibold">{i.priimek}</span>{" "}
                  <span className="text-xs text-siva">{i.pozicija}</span>
                </td>
                {POLJA.map(({ polje, ime, najvec }) => {
                  const napaka = napakePolj[i.nogometasId]?.[polje];
                  return (
                    <td key={polje} className="px-1 py-1.5 text-center">
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={najvec}
                        value={vrednosti[i.nogometasId][polje]}
                        onChange={(e) => onSpremeni(i.nogometasId, polje, e.target.value)}
                        disabled={samoZaBranje}
                        aria-label={`${i.priimek}, ${ime.toLowerCase()}`}
                        aria-invalid={napaka ? true : undefined}
                        title={napaka}
                        className={`h-9 w-14 rounded border text-center tabular-nums outline-none focus:border-trava focus:ring-[3px] focus:ring-trava/35 disabled:bg-kreda ${
                          napaka ? "border-2 border-napaka bg-napaka/5" : "border-rob bg-white"
                        }`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {napakeKluba.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-sm text-napaka">
          {napakeKluba.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
