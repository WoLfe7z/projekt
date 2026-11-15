import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "backend/auth";

// Domača stran: vsako vlogo pošlje na njeno začetno stran
export default async function Domov() {
  const seja = await auth.api.getSession({ headers: await headers() });
  if (!seja)
    redirect("/prijava");
  redirect(seja.user.vloga === "urednik" ? "/urednik/tekme" : "/mostvo");
}
