import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "backend/auth";
import PrijavaObrazec from "./PrijavaObrazec";

export const metadata: Metadata = { title: "Prijava | PrvihXI" };

export default async function PrijavaStran() {
  // prijavljen uporabnik nima kaj iskati na prijavi
  const seja = await auth.api.getSession({ headers: await headers() });
  if (seja && !seja.user.jeBlokiran)
    redirect("/mostvo");

  return (
    <>
      <h1 className="font-display text-4xl font-semibold">Prijava</h1>
      <p className="mt-2 mb-8 text-siva">Prijavi se in uredi postavo za naslednji krog.</p>
      <PrijavaObrazec />
    </>
  );
}
