# Prisma za dostop do baze in migracije

## Kontekst in opis problema

Aplikacija in worker morata brati in pisati podatke v PostgreSQL, shema baze pa se bo med razvojem spreminjala. Poizvedbe naj bodo tipsko varne, da napake v imenih polj ali tipih odkrijemo že pri pisanju kode, spremembe sheme pa morajo biti zapisane v repozitoriju. Odločiti se je bilo treba, kako bo koda dostopala do baze.

## Obravnavane možnosti

* Prisma ORM s Prisma Migrate
* Drizzle ORM
* Čisti SQL (knjižnica `pg`)

## Odločitev

Izbrana možnost: Prisma ORM s Prisma Migrate. Ker ima shemo na enem mestu (`schema.prisma`), iz nje generira tipe za TypeScript in migracije, podpira transakcije in ima uradno podporo v Better Auth. Drizzle je enakovredna izbira, a ima manj gradiva za začetnike. Čisti SQL bi pomenil več ponavljajoče se kode in ročno usklajevanje tipov.

### Posledice

* Dobro, ker so poizvedbe tipsko varne in samodejno usklajene s shemo.
* Dobro, ker je zgodovina sprememb sheme shranjena kot migracije v repozitoriju.
* Slabo, ker je za zahtevnejše poizvedbe (npr. lestvice) včasih treba uporabiti čisti SQL.
* Slabo, ker je treba Prisma Client ponovno generirati po vsaki spremembi sheme.
