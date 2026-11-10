"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function OdjavaGumb() {
  const router = useRouter();

  async function odjava() {
    await authClient.signOut();
    router.push("/prijava");
    router.refresh();
  }

  return (
    <button onClick={odjava} className="text-sm font-medium text-kreda/90 underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kreda">
      Odjava
    </button>
  );
}
