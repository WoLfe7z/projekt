import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "backend/auth";
import RegistracijaObrazec from "./RegistracijaObrazec";

export const metadata: Metadata = { title: "Registracija | PrvihXI" };

export default async function RegistracijaStran() {
  const seja = await auth.api.getSession({ headers: await headers() });
  if (seja && !seja.user.jeBlokiran)
    redirect("/mostvo");

  return (
    <>
      <h1 className="font-display text-4xl font-semibold">Ustvari račun</h1>
      <p className="mt-2 mb-8 text-siva">Račun potrebuješ za sestavljanje moštva in zasebne lige.</p>
      <RegistracijaObrazec />
    </>
  );
}
