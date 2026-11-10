"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { prevediNapako } from "@/lib/napake";
import Polje from "@/components/Polje";
import Gumb from "@/components/Gumb";
import Napaka from "@/components/Napaka";

export default function RegistracijaObrazec() {
  const router = useRouter();
  const [napaka, setNapaka] = useState("");
  const [nalaganje, setNalaganje] = useState(false);

  async function registracija(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNapaka("");
    setNalaganje(true);

    const podatki = new FormData(e.currentTarget);
    const { error } = await authClient.signUp.email({
      name: String(podatki.get("ime")),
      email: String(podatki.get("email")),
      password: String(podatki.get("geslo")),
    });

    if (error) {
      setNapaka(prevediNapako(error));
      setNalaganje(false);
      return;
    }

    router.push("/mostvo");
    router.refresh();
  }

  return (
    <form onSubmit={registracija} className="space-y-5">
      {napaka && <Napaka besedilo={napaka} />}
      <Polje ime="ime" oznaka="Ime" autoComplete="name" namig="Tako te bodo videli ostali člani lige." />
      <Polje ime="email" oznaka="E-pošta" tip="email" autoComplete="email" />
      <Polje
        ime="geslo"
        oznaka="Geslo"
        tip="password"
        autoComplete="new-password"
        minLength={8}
        namig="Najmanj 8 znakov."
      />
      <Gumb disabled={nalaganje}>{nalaganje ? "Ustvarjam račun …" : "Ustvari račun"}</Gumb>
      <p className="text-sm text-siva">
        Že imaš račun?{" "}
        <Link href="/prijava" className="font-medium text-trava underline underline-offset-2">
          Prijavi se
        </Link>
      </p>
    </form>
  );
}
