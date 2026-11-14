"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MINUTA = 60 * 1000;
const URA = 60 * MINUTA;
const DAN = 24 * URA;

export function zapisiRok(rok: Date): string {
  return new Intl.DateTimeFormat("sl-SI", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Ljubljana",
  }).format(rok);
}

function zapisiPreostanek(ms: number): string {
  const dni = Math.floor(ms / DAN);
  const ur = Math.floor((ms % DAN) / URA);
  const minut = Math.floor((ms % URA) / MINUTA);
  const sekund = Math.floor((ms % MINUTA) / 1000);

  if (dni > 0) return `${dni} d ${ur} h ${minut} min`;
  if (ur > 0) return `${ur} h ${minut} min`;
  return `${minut} min ${sekund} s`;
}

export default function Odstevanje({ rok }: { rok: string }) {
  const router = useRouter();
  // čas nastavimo šele v brskalniku, da se strežniški in brskalnikov izris ne razlikujeta
  const [zdaj, setZdaj] = useState<number | null>(null);
  const konec = new Date(rok).getTime();

  useEffect(() => {
    setZdaj(Date.now());
    const interval = setInterval(() => setZdaj(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const preostane = zdaj === null ? null : konec - zdaj;
  const potekel = preostane !== null && preostane <= 0;

  // ko rok poteče, strežnik stran ponovno izriše samo za branje
  useEffect(() => {
    if (potekel)
      router.refresh();
  }, [potekel, router]);

  if (preostane === null) return <span>&nbsp;</span>;
  if (potekel) return <span className="font-medium text-napaka">Rok je potekel</span>;
  return <span className="tabular-nums">še {zapisiPreostanek(preostane)}</span>;
}
