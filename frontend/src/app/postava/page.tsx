import type { Metadata } from "next";
import Link from "next/link";
import { jeRokPotekel } from "backend";
import { naloziPostavo } from "backend/postava-baza";
import { zahtevajUporabnika } from "@/lib/seja";
import Glava from "@/components/Glava";
import UrejanjePostave from "./UrejanjePostave";

export const metadata: Metadata = { title: "Postava | PrvihXI" };

export default async function PostavaStran({ searchParams }: { searchParams: Promise<{ krog?: string }> }) {
  const uporabnik = await zahtevajUporabnika();
  const { krog: krogIzNaslova } = await searchParams;
  const stevilka = krogIzNaslova ? Number(krogIzNaslova) : undefined;

  let vsebina;

  if (uporabnik.vloga !== "menedzer") {
    vsebina = <Sporocilo naslov="Postava">Postavo lahko ureja samo menedžer.</Sporocilo>;
  } else {
    const podatki = await naloziPostavo(uporabnik.id, stevilka);

    if (!podatki) {
      vsebina = (
        <Sporocilo naslov="Postava">
          Najprej sestavi moštvo na strani{" "}
          <Link href="/mostvo" className="font-medium text-trava underline underline-offset-2">
            Moje moštvo
          </Link>
          .
        </Sporocilo>
      );
    } else if (!podatki.krog) {
      vsebina = <Sporocilo naslov="Postava">Razpored krogov še ni objavljen.</Sporocilo>;
    } else {
      const { krog, krogi, igralci, shranjena } = podatki;
      const prejsnji = krogi.find((k) => k.stevilka === krog.stevilka - 1);
      const naslednji = krogi.find((k) => k.stevilka === krog.stevilka + 1);

      vsebina = (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-display text-5xl leading-none font-bold">Postava za {krog.stevilka}. krog</h1>
            <nav aria-label="Krogi" className="flex gap-4 text-sm font-medium">
              {prejsnji && (
                <Link href={`/postava?krog=${prejsnji.stevilka}`} className="text-trava hover:underline">
                  ← {prejsnji.stevilka}. krog
                </Link>
              )}
              {naslednji && (
                <Link href={`/postava?krog=${naslednji.stevilka}`} className="text-trava hover:underline">
                  {naslednji.stevilka}. krog →
                </Link>
              )}
            </nav>
          </div>
          <div className="mt-8">
            <UrejanjePostave
              key={`${krog.id}-${jeRokPotekel(krog.rok)}`}
              krogId={krog.id}
              rok={krog.rok.toISOString()}
              zacetniIgralci={igralci}
              shranjena={shranjena}
              samoZaBranje={jeRokPotekel(krog.rok)}
            />
          </div>
        </>
      );
    }
  }

  return (
    <>
      <Glava ime={uporabnik.name} aktivna="/postava" />
      <main className="mx-auto max-w-6xl px-6 py-10 md:px-12">{vsebina}</main>
    </>
  );
}

function Sporocilo({ naslov, children }: { naslov: string; children: React.ReactNode }) {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-5xl leading-none font-bold">{naslov}</h1>
      <p className="mt-4 text-siva">{children}</p>
    </div>
  );
}
