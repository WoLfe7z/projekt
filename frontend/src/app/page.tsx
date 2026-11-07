import { PRAVILA, opisPravil } from "backend";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">PrvihXI</h1>
      <p className="mt-2 text-gray-600">Fantasy nogomet za slovensko Prvo ligo.</p>

      <div className="mt-6 rounded border p-4">
        <h2 className="font-semibold">Pravila igre</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Proračun: {PRAVILA.proracun} mio</li>
          <li>Število igralcev v moštvu: {PRAVILA.steviloIgralcev}</li>
          <li>Največ igralcev iz istega kluba: {PRAVILA.najvecIzKluba}</li>
        </ul>
        <p className="mt-3 text-sm text-gray-500">{opisPravil()}</p>
        <p className="mt-1 text-xs text-gray-400">(podatki pridejo iz paketa backend)</p>
      </div>
    </main>
  );
}
