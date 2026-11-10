// Sporočilo o napaki nad obrazcem
export default function Napaka({ besedilo }: { besedilo: string }) {
  return (
    <p role="alert" className="rounded-md border border-napaka/30 bg-napaka/5 px-3 py-2.5 text-sm text-napaka">
      {besedilo}
    </p>
  );
}
