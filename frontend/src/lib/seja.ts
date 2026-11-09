import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "backend/auth";

type Vloga = "menedzer" | "urednik" | "admin";

export async function zahtevajUporabnika() {
  const seja = await auth.api.getSession({ headers: await headers() });

  if (!seja || seja.user.jeBlokiran)
    redirect("/prijava");

  return seja.user;
}

// vrne uporabnika, če ima zahtevano vlogo, sicer vrže napako
export async function zahtevajVlogo(vloga: Vloga) {
  const uporabnik = await zahtevajUporabnika();

  if (uporabnik.vloga !== vloga)
    throw new Error("Ni dostopa");

  return uporabnik;
}
