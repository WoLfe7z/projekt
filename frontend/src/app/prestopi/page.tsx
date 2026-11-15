import type { Metadata } from "next";
import Link from "next/link";
import { naloziPrestope } from "backend/prestop-baza";
import { zahtevajUporabnika } from "@/lib/seja";
import Glava from "@/components/Glava";
import IzbiraPrestopa from "./IzbiraPrestopa";

export const metadata: Metadata = { title: "Prestopi | PrvihXI" };

export default async function PrestopiStran() {
  const uporabnik = await zahtevajUporabnika();
  const podatki = uporabnik.vloga === "menedzer" ? await naloziPrestope(uporabnik.id) : null;

  let vsebina;

  if (uporabnik.vloga !== "menedzer") {
    vsebina = <Sporocilo>Prestope lahko opravlja samo menedžer.</Sporocilo>;
  } else if (!podatki) {
    vsebina = (
      <Sporocilo>
        Najprej sestavi moštvo na strani{" "}
        <Link href="/mostvo" className="font-medium text-trava underline underline-offset-2">
          Moje moštvo
        </Link>
        .
      </Sporocilo>
    );
  } else if (!podatki.krog) {
    vsebina = <Sporocilo>Rok za prestope je potekel. Prestopi bodo spet mogoči, ko bo objavljen naslednji krog.</Sporocilo>;
  } else {
    const { krog, preostanek, mojiIgralci, ostaliIgralci, prestopi } = podatki;

    vsebina = (
      <>
        <h1 className="font-display text-5xl leading-none font-bold">Prestopi za {krog.stevilka}. krog</h1>
        <p className="mt-3 max-w-xl text-siva">
          Prvi prestop v krogu je brezplačen, vsak naslednji stane 4 točke. Novi igralec prevzame mesto
          odhajajočega v postavi.
        </p>

        {prestopi.length > 0 && (
          <section aria-labelledby="naslov-opravljeni" className="mt-6">
            <h2 id="naslov-opravljeni" className="text-sm font-medium text-siva">
              Opravljeni prestopi v tem krogu
            </h2>
            <ul className="mt-1 space-y-1 text-sm">
              {prestopi.map((p) => (
                <li key={p.id}>
                  {p.ven} odšel, {p.noter} prišel{" "}
                  <span className={p.brezplacen ? "text-siva" : "font-medium text-napaka"}>
                    {p.brezplacen ? "(brezplačno)" : "(−4 točke)"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-8">
          <IzbiraPrestopa
            rok={krog.rok.toISOString()}
            preostanek={preostanek}
            mojiIgralci={mojiIgralci}
            ostaliIgralci={ostaliIgralci}
            opravljenih={prestopi.length}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Glava ime={uporabnik.name} vloga={uporabnik.vloga} aktivna="/prestopi" />
      <main className="mx-auto max-w-6xl px-6 py-10 md:px-12">{vsebina}</main>
    </>
  );
}

function Sporocilo({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-5xl leading-none font-bold">Prestopi</h1>
      <p className="mt-4 text-siva">{children}</p>
    </div>
  );
}
