import Link from "next/link";

export default function NiDostopa() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-5xl leading-none font-bold">Ni dostopa</h1>
      <p className="mt-4 text-siva">
        Ta stran je namenjena drugi vlogi.{" "}
        <Link href="/" className="font-medium text-trava underline underline-offset-2">
          Nazaj na začetno stran
        </Link>
        .
      </p>
    </div>
  );
}
