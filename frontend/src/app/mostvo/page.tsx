import type { Metadata } from "next";
import { zahtevajUporabnika } from "@/lib/seja";
import OdjavaGumb from "@/components/OdjavaGumb";

export const metadata: Metadata = { title: "Moje moštvo | PrvihXI" };

export default async function MostvoStran() {
  const uporabnik = await zahtevajUporabnika();

  return (
    <>
      <header className="flex items-center justify-between bg-trava px-6 py-4 text-kreda md:px-12">
        <p className="font-display text-2xl font-bold tracking-wide">PrvihXI</p>
        <div className="flex items-center gap-5">
          <span className="text-sm text-kreda/80">{uporabnik.name}</span>
          <OdjavaGumb />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-display text-4xl font-semibold">Moje moštvo</h1>
      </main>
    </>
  );
}
