// Vnosno polje
type Props = {
  ime: string;
  oznaka: string;
  tip?: string;
  autoComplete?: string;
  namig?: string;
  minLength?: number;
};

export default function Polje({ ime, oznaka, tip = "text", autoComplete, namig, minLength }: Props) {
  return (
    <div>
      <label htmlFor={ime} className="block text-sm font-medium">
        {oznaka}
      </label>
      <input
        id={ime}
        name={ime}
        type={tip}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        aria-describedby={namig ? `${ime}-namig` : undefined}
        className="mt-1.5 block h-11 w-full rounded-md border border-rob bg-white px-3 text-base outline-none focus:border-trava focus:ring-[3px] focus:ring-trava/35"
      />
      {namig && (
        <p id={`${ime}-namig`} className="mt-1.5 text-sm text-siva">
          {namig}
        </p>
      )}
    </div>
  );
}
