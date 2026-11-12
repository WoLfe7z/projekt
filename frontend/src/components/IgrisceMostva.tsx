// Igrišče s 15 mesti moštva: spodaj vratarja, nato branilci, vezisti in na vrhu napadalci.
// Prazna mesta so črtkani krogi. Če je podana funkcija odstrani, s klikom na igralca odstraniš igralca.
import { SESTAVA, zapisiMio, type Pozicija } from "backend";

export type IgralecNaIgriscu = {
  id: string;
  ime: string;
  priimek: string;
  kratica: string;
  cena: number;
  pozicija: Pozicija;
};

// vrstni red vrstic od vrha navzdol
const VRSTICE: Pozicija[] = ["NA", "VE", "OB", "VR"];

type Props = {
  igralci: IgralecNaIgriscu[];
  odstrani?: (id: string) => void;
};

export default function IgrisceMostva({ igralci, odstrani }: Props) {
  return (
    <div className="trava relative overflow-hidden rounded-md px-2 py-5">
      {/* črte igrišča (polovica igrišča z našim golom spodaj) */}
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

      <div className="relative flex flex-col gap-4">
        {VRSTICE.map((pozicija) => {
          const naPoziciji = igralci.filter((i) => i.pozicija === pozicija);
          const prazna = SESTAVA[pozicija] - naPoziciji.length;

          return (
            <ul key={pozicija} className="flex justify-center gap-1" aria-label={pozicija}>
              {naPoziciji.map((igralec) => (
                <li key={igralec.id} className="w-[19%] max-w-16">
                  <Mesto igralec={igralec} odstrani={odstrani} />
                </li>
              ))}
              {Array.from({ length: Math.max(prazna, 0) }).map((_, i) => (
                <li key={`prazno-${i}`} className="w-[19%] max-w-16">
                  <div className="flex flex-col items-center">
                    <span className="flex size-10 items-center justify-center rounded-full border-2 border-dashed border-kreda/45 font-display text-sm font-semibold text-kreda/60">
                      {pozicija}
                    </span>
                    <span className="sr-only">prazno mesto</span>
                  </div>
                </li>
              ))}
            </ul>
          );
        })}
      </div>
    </div>
  );
}

function Mesto({ igralec, odstrani }: { igralec: IgralecNaIgriscu; odstrani?: (id: string) => void }) {
  const vsebina = (
    <>
      <span className="flex size-10 items-center justify-center rounded-full bg-kreda font-display text-sm font-bold text-trava-temna shadow-[0_2px_0_var(--color-trava-temna)] group-hover:bg-white">
        {igralec.kratica}
      </span>
      <span className="mt-1 max-w-full truncate rounded-sm bg-trava-temna/85 px-1 text-xs leading-5 text-kreda">
        {igralec.priimek}
      </span>
      <span className="text-[11px] leading-4 text-kreda/75 tabular-nums">{zapisiMio(igralec.cena)}</span>
    </>
  );

  if (!odstrani) return <div className="flex flex-col items-center">{vsebina}</div>;

  return (
    <button
      type="button"
      onClick={() => odstrani(igralec.id)}
      title="Odstrani iz moštva"
      aria-label={`Odstrani ${igralec.ime} ${igralec.priimek}`}
      className="group flex w-full flex-col items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kreda"
    >
      {vsebina}
    </button>
  );
}
