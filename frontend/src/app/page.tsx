import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "backend/auth";

// Domača stran
export default async function Domov() {
  const seja = await auth.api.getSession({ headers: await headers() });
  redirect(seja ? "/mostvo" : "/prijava");
}
