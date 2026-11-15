import { redirect } from "next/navigation";
import { privzetaTekma } from "backend/tekma-baza";
import { zahtevajUporabnika } from "@/lib/seja";
import Glava from "@/components/Glava";
import NiDostopa from "@/components/NiDostopa";

export default async function TekmeStran() {
  const uporabnik = await zahtevajUporabnika();

  if (uporabnik.vloga === "urednik") {
    const tekma = await privzetaTekma();
    if (tekma)
      redirect(`/urednik/tekme/${tekma.id}`);
  }

  return (
    <>
      <Glava ime={uporabnik.name} vloga={uporabnik.vloga} aktivna="/urednik/tekme" />
      <main className="mx-auto max-w-6xl px-6 py-10 md:px-12">
        {uporabnik.vloga === "urednik" ? (
          <div className="max-w-xl">
            <h1 className="font-display text-5xl leading-none font-bold">Tekme</h1>
            <p className="mt-4 text-siva">Razpored krogov še ni objavljen.</p>
          </div>
        ) : (
          <NiDostopa />
        )}
      </main>
    </>
  );
}
