import Link from "next/link";
import OdjavaGumb from "./OdjavaGumb";

const POVEZAVE = [
  { href: "/mostvo", naziv: "Moje moštvo" },
  { href: "/postava", naziv: "Postava" },
];

export default function Glava({ ime, aktivna }: { ime: string; aktivna: string }) {
  return (
    <header className="bg-trava text-kreda">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-6 py-4 md:px-12">
        <Link href="/mostvo" className="font-display text-2xl font-bold tracking-wide">
          PrvihXI
        </Link>
        <nav aria-label="Glavna navigacija" className="order-last flex w-full gap-6 sm:order-none sm:w-auto">
          {POVEZAVE.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              aria-current={aktivna === p.href ? "page" : undefined}
              className={`border-b-2 pb-0.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kreda ${
                aktivna === p.href ? "border-kreda text-kreda" : "border-transparent text-kreda/75 hover:text-kreda"
              }`}
            >
              {p.naziv}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-5">
          <span className="text-sm text-kreda/80">{ime}</span>
          <OdjavaGumb />
        </div>
      </div>
    </header>
  );
}
