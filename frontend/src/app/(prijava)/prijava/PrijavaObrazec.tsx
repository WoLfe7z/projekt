"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { prevediNapako } from "@/lib/napake";
import Polje from "@/components/Polje";
import Gumb from "@/components/Gumb";
import Napaka from "@/components/Napaka";

export default function PrijavaObrazec() {
  const router = useRouter();
  const [napaka, setNapaka] = useState("");
  const [nalaganje, setNalaganje] = useState(false);

  async function prijava(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNapaka("");
    setNalaganje(true);

    const podatki = new FormData(e.currentTarget);
    const { error } = await authClient.signIn.email({
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
    <form onSubmit={prijava} className="space-y-5">
      {napaka && <Napaka besedilo={napaka} />}
      <Polje ime="email" oznaka="E-pošta" tip="email" autoComplete="email" />
      <Polje ime="geslo" oznaka="Geslo" tip="password" autoComplete="current-password" />
      <Gumb disabled={nalaganje}>{nalaganje ? "Prijavljam …" : "Prijava"}</Gumb>
      <p className="text-sm text-siva">
        Še nimaš računa?{" "}
        <Link href="/registracija" className="font-medium text-trava underline underline-offset-2">
          Ustvari račun
        </Link>
      </p>
    </form>
  );
}
