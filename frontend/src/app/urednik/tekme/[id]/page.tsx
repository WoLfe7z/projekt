import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { naloziTekmo } from "backend/tekma-baza";
import { zahtevajUporabnika } from "@/lib/seja";
import Glava from "@/components/Glava";
import NiDostopa from "@/components/NiDostopa";
import VnosStatistike from "./VnosStatistike";

export const metadata: Metadata = { title: "Statistika tekme | PrvihXI" };

const STANJA = { napovedana: "napovedana", v_vnosu: "v vnosu", potrjena: "potrjena" } as const;

export default async function TekmaStran({ params }: { params: Promise<{ id: string }> }) {
  const uporabnik = await zahtevajUporabnika();

  if (uporabnik.vloga !== "urednik") {
    return (
      <>
        <Glava ime={uporabnik.name} vloga={uporabnik.vloga} aktivna="/urednik/tekme" />
        <main className="mx-auto max-w-6xl px-6 py-10 md:px-12">
          <NiDostopa />
        </main>
      </>
    );
  }

  const { id } = await params;
  const podatki = await naloziTekmo(id);
  if (!podatki)
    notFound();

  const { tekma, domaci, gostje, tekmeKroga, krogi } = podatki;
  const prejsnji = krogi.find((k) => k.stevilka === tekma.krog.stevilka - 1);
  const naslednji = krogi.find((k) => k.stevilka === tekma.krog.stevilka + 1);

  return (
    <>
      <Glava ime={uporabnik.name} vloga={uporabnik.vloga} aktivna="/urednik/tekme" />
      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:px-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">Tekme {tekma.krog.stevilka}. kroga</h2>
          </div>
          <nav aria-label="Krogi" className="mt-1 flex gap-4 text-sm font-medium">
            {prejsnji?.prvaTekmaId && (
              <Link href={`/urednik/tekme/${prejsnji.prvaTekmaId}`} className="text-trava hover:underline">
                ← {prejsnji.stevilka}. krog
              </Link>
            )}
            {naslednji?.prvaTekmaId && (
              <Link href={`/urednik/tekme/${naslednji.prvaTekmaId}`} className="text-trava hover:underline">
                {naslednji.stevilka}. krog →
              </Link>
            )}
          </nav>
          <ul className="mt-4 space-y-2">
            {tekmeKroga.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/urednik/tekme/${t.id}`}
                  aria-current={t.id === tekma.id ? "page" : undefined}
                  className={`block rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:outline-none ${
                    t.id === tekma.id ? "border-trava bg-trava/10" : "border-rob hover:border-trava"
                  }`}
                >
                  <span className="block font-medium">
                    {t.domaci} – {t.gostje}
                  </span>
                  <span className={`text-xs ${t.status === "potrjena" ? "text-trava" : "text-siva"}`}>
                    {STANJA[t.status]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0">
          <VnosStatistike
            key={tekma.id}
            tekmaId={tekma.id}
            domaciNaziv={tekma.domaci.naziv}
            gostjeNaziv={tekma.gostje.naziv}
            zacetniGoliDomaci={tekma.goliDomaci}
            zacetniGoliGostje={tekma.goliGostje}
            zacetniDomaci={domaci}
            zacetniGostje={gostje}
            potrjena={tekma.status === "potrjena"}
            zacetek={tekma.zacetek.toISOString()}
          />
        </div>
      </main>
    </>
  );
}
