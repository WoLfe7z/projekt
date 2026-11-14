import type { Pozicija } from "backend";
import type { IgralecNaPostavi } from "backend/postava-baza";

const VRSTICE: Pozicija[] = ["NA", "VE", "OB", "VR"];
const OZNAKE_KLOPI = ["R", "1.", "2.", "3."];

type Props = {
  igralci: IgralecNaPostavi[];
  izbranId?: string | null;
  onKlik?: (id: string) => void;
};

export default function IgriscePostave({ igralci, izbranId, onKlik }: Props) {
  const poMestu = [...igralci].sort((a, b) => a.mesto - b.mesto);
  const zacetni = poMestu.filter((i) => i.mesto <= 11);
  const klop = poMestu.filter((i) => i.mesto > 11);

  return (
    <div>
      <div className="trava relative overflow-hidden rounded-t-md px-2 py-6">
        <svg
          viewBox="0 0 68 80"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <g fill="none" stroke="var(--color-kreda)" strokeOpacity="0.35" strokeWidth="0.4" vectorEffect="non-scaling-stroke">
            <rect x="1.5" y="1.5" width="65" height="77" />
            <path d="M 24.85 1.5 A 9.15 9.15 0 0 0 43.15 1.5" />
            <rect x="13.84" y="62" width="40.32" height="16.5" />
            <rect x="24.84" y="73" width="18.32" height="5.5" />
          </g>
        </svg>

        <div className="relative flex flex-col gap-6">
          {VRSTICE.map((pozicija) => (
            <ul key={pozicija} className="flex justify-center gap-1" aria-label={`Začetna postava: ${pozicija}`}>
              {zacetni
                .filter((i) => i.pozicija === pozicija)
                .map((i) => (
                  <li key={i.id} className="w-[19%] max-w-20">
                    <Igralec igralec={i} izbran={izbranId === i.id} onKlik={onKlik} naIgriscu />
                  </li>
                ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="rounded-b-md border border-t-0 border-rob bg-kreda px-2 pt-3 pb-4">
        <p className="px-2 text-sm font-medium text-siva">Klop</p>
        <ol className="mt-2 flex justify-center gap-1">
          {klop.map((i, indeks) => (
            <li key={i.id} className="flex w-[22%] max-w-24 flex-col items-center">
              <span className="mb-1 text-xs font-semibold text-siva">{OZNAKE_KLOPI[indeks]}</span>
              <Igralec igralec={i} izbran={izbranId === i.id} onKlik={onKlik} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Igralec({
  igralec,
  izbran,
  onKlik,
  naIgriscu = false,
}: {
  igralec: IgralecNaPostavi;
  izbran: boolean;
  onKlik?: (id: string) => void;
  naIgriscu?: boolean;
}) {
  const vsebina = (
    <>
      <span
        className={`relative flex size-11 items-center justify-center rounded-full font-display text-sm font-bold ${
          naIgriscu
            ? "bg-kreda text-trava-temna shadow-[0_2px_0_var(--color-trava-temna)]"
            : "bg-trava text-kreda shadow-[0_2px_0_var(--color-trava-temna)]"
        } ${izbran ? "ring-4 ring-amber-300" : ""}`}
      >
        {igralec.kratica}
        {igralec.kapetan && (
          <span
            className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-crnilo text-[11px] text-kreda"
            title="Kapetan"
            aria-hidden="true"
          >
            C
          </span>
        )}
        {igralec.poskodovan && (
          <span
            className="absolute -top-1 -left-1 flex size-5 items-center justify-center rounded-full bg-napaka text-[11px] text-white"
            title="Poškodovan ali kaznovan"
            aria-hidden="true"
          >
            !
          </span>
        )}
      </span>
      <span
        className={`mt-1 max-w-full truncate rounded-sm px-1 text-xs leading-5 ${
          naIgriscu ? "bg-trava-temna/85 text-kreda" : "text-crnilo"
        }`}
      >
        {igralec.priimek}
      </span>
      <span className={`text-[11px] leading-4 ${naIgriscu ? "text-kreda/75" : "text-siva"}`}>{igralec.pozicija}</span>
    </>
  );

  const opis = `${igralec.ime} ${igralec.priimek}, ${igralec.pozicija}${igralec.kapetan ? ", kapetan" : ""}${igralec.poskodovan ? ", poškodovan" : ""}`;

  if (!onKlik)
    return (
      <div className="flex flex-col items-center">
        <span className="sr-only">{opis}</span>
        <span aria-hidden="true" className="flex flex-col items-center">
          {vsebina}
        </span>
      </div>
    );

  return (
    <button
      type="button"
      onClick={() => onKlik(igralec.id)}
      aria-pressed={izbran}
      aria-label={opis}
      className="flex w-full flex-col items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
    >
      {vsebina}
    </button>
  );
}
