"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { jeZacetni, opisFormacije, preveriPostavo } from "backend";
import type { IgralecNaPostavi } from "backend/postava-baza";
import IgriscePostave from "@/components/IgriscePostave";
import Napaka from "@/components/Napaka";
import Odstevanje, { zapisiRok } from "@/components/Odstevanje";
import { shraniPostavo } from "./actions";

function podpis(igralci: IgralecNaPostavi[]): string {
  return igralci.map((i) => `${i.id}:${i.mesto}:${i.kapetan}`).sort().join(",");
}

type Props = {
  krogId: string;
  rok: string;
  zacetniIgralci: IgralecNaPostavi[];
  shranjena: boolean;
  samoZaBranje: boolean;
};

export default function UrejanjePostave({ krogId, rok, zacetniIgralci, shranjena, samoZaBranje }: Props) {
  const router = useRouter();
  const [igralci, setIgralci] = useState(zacetniIgralci);
  const [izbranId, setIzbranId] = useState<string | null>(null);
  const [napakeStreznika, setNapakeStreznika] = useState<string[]>([]);
  const [sporocilo, setSporocilo] = useState("");
  const [shranjujem, setShranjujem] = useState(false);

  const napake = preveriPostavo(igralci);
  const kapetan = igralci.find((i) => i.kapetan);
  const izbran = igralci.find((i) => i.id === izbranId);
  const spremenjena = podpis(igralci) !== podpis(zacetniIgralci);
  const lahkoShranim = !samoZaBranje && napake.length === 0 && (spremenjena || !shranjena) && !shranjujem;

  // prvi klik izbere igralca, drugi klik na drugega igralca zamenja njuni mesti
  function klik(id: string) {
    setSporocilo("");
    setNapakeStreznika([]);

    if (izbranId === null) {
      setIzbranId(id);
      return;
    }
    if (izbranId !== id) {
      const mestoA = igralci.find((i) => i.id === izbranId)!.mesto;
      const mestoB = igralci.find((i) => i.id === id)!.mesto;
      setIgralci(
        igralci.map((i) => {
          if (i.id === izbranId) return { ...i, mesto: mestoB };
          if (i.id === id) return { ...i, mesto: mestoA };
          return i;
        })
      );
    }
    setIzbranId(null);
  }

  function nastaviKapetana(id: string) {
    setIgralci(igralci.map((i) => ({ ...i, kapetan: i.id === id })));
    setIzbranId(null);
    setSporocilo("");
  }

  function ponastavi() {
    setIgralci(zacetniIgralci);
    setIzbranId(null);
    setNapakeStreznika([]);
    setSporocilo("");
  }

  async function shrani() {
    setShranjujem(true);
    const rezultat = await shraniPostavo(
      krogId,
      igralci.map((i) => ({ nogometasId: i.id, mesto: i.mesto, kapetan: i.kapetan }))
    );
    setShranjujem(false);

    if (rezultat.napake.length > 0) {
      setNapakeStreznika(rezultat.napake);
      return;
    }
    setSporocilo("Postava je shranjena.");
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div className="max-w-2xl">
        <IgriscePostave igralci={igralci} izbranId={izbranId} onKlik={samoZaBranje ? undefined : klik} />
        {!samoZaBranje && (
          <p className="mt-3 text-sm text-siva" aria-live="polite">
            {izbran
              ? `Izbran je ${izbran.priimek}. Klikni drugega igralca, da zamenjata mesti, ali ponovno nanj za preklic.`
              : "Klikni igralca, nato drugega, da zamenjata mesti. Tako igralca premakneš tudi na klop ali z nje."}
          </p>
        )}
      </div>

      <aside className="space-y-5 lg:sticky lg:top-6">
        <div className="border-y border-rob py-4">
          <p className="text-sm text-siva">Rok za spremembe</p>
          <p className="font-display text-2xl font-semibold">{zapisiRok(new Date(rok))}</p>
          <p className="text-sm">
            <Odstevanje rok={rok} />
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-y-3">
          <div>
            <dt className="text-sm text-siva">Formacija</dt>
            <dd className="font-display text-2xl font-semibold">{opisFormacije(igralci)}</dd>
          </div>
          <div>
            <dt className="text-sm text-siva">Kapetan</dt>
            <dd className="font-display text-2xl font-semibold">{kapetan ? kapetan.priimek : "ni izbran"}</dd>
          </div>
        </dl>

        {!samoZaBranje && igralci.some((i) => i.poskodovan && jeZacetni(i.mesto)) && (
          <p className="rounded-md border border-napaka/40 bg-napaka/5 p-3 text-sm text-napaka">
            V začetni postavi je poškodovan ali kaznovan igralec. Zamenjaj ga s klopi.
          </p>
        )}

        {samoZaBranje ? (
          <p className="rounded-md bg-kreda p-3 text-sm">
            Rok je potekel, zato je postava samo za branje.
            {!shranjena && " Za ta krog postava ni bila shranjena."}
          </p>
        ) : (
          <>
            {izbran && jeZacetni(izbran.mesto) && !izbran.kapetan && (
              <button
                type="button"
                onClick={() => nastaviKapetana(izbran.id)}
                className="h-11 w-full rounded-md border border-trava font-medium text-trava hover:bg-trava/10 focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Izberi {izbran.priimek} za kapetana
              </button>
            )}

            {[...napake, ...napakeStreznika].length > 0 && (
              <div className="space-y-2">
                {[...new Set([...napake, ...napakeStreznika])].map((n) => (
                  <Napaka key={n} besedilo={n} />
                ))}
              </div>
            )}

            {sporocilo && (
              <p role="status" className="text-sm font-medium text-trava">
                {sporocilo}
              </p>
            )}
            {!shranjena && !sporocilo && <p className="text-sm text-siva">Postava za ta krog še ni shranjena.</p>}

            <div className="space-y-2">
              <button
                type="button"
                onClick={shrani}
                disabled={!lahkoShranim}
                className="h-12 w-full rounded-md bg-trava font-display text-lg font-semibold tracking-wide text-white hover:bg-trava-temna focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-rob disabled:text-siva"
              >
                {shranjujem ? "Shranjujem …" : "Shrani postavo"}
              </button>
              <button
                type="button"
                onClick={ponastavi}
                disabled={!spremenjena}
                className="h-11 w-full rounded-md border border-rob font-medium hover:border-trava focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-siva disabled:hover:border-rob"
              >
                Ponastavi
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
