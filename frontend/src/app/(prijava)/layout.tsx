import Igrisce from "@/components/Igrisce";

export default function PrijavaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] md:grid-cols-2 md:grid-rows-1">
      <div className="trava h-3 md:hidden" />

      <aside className="trava hidden items-center justify-center p-8 md:sticky md:top-0 md:flex md:h-screen lg:p-10">
        <Igrisce />
      </aside>

      <main className="flex flex-col px-6 py-6 md:px-12 md:py-10 lg:px-16">
        <div>
          <p className="font-display text-2xl font-bold tracking-wide text-trava">PrvihXI</p>
          <p className="mt-1 max-w-xs text-sm text-siva">
            Fantasy nogomet za Prvo slovensko ligo.
          </p>
        </div>

        <div className="flex flex-1 items-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
