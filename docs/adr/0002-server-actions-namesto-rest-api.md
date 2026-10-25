# Server Actions za spremembe podatkov namesto REST API-ja

## Kontekst in opis problema

Večina akcij v aplikaciji so obrazci: shranjevanje postave, prestop, vnos in potrditev statistike, ustvarjanje lige. Vsaka akcija mora na strežniku preveriti pravila igre in zapisati podatke v bazo. Odločiti se je bilo treba, kako bo vmesnik klical strežniško logiko.

## Obravnavane možnosti

* Server Actions (strežniške funkcije v Next.js)
* REST končne točke prek Next.js Route Handlers

## Odločitev

Izbrana možnost: Server Actions. Ker obrazec neposredno pokliče strežniško funkcijo, tipi pa so preverjeni od obrazca do strežnika. Za aplikacijo z enim odjemalcem bi REST končne točke pomenile dodatno kodo (poti, serializacija, `fetch` klici, ročno usklajeni tipi) brez prave koristi.

### Posledice

* Dobro, ker je za vsako akcijo ena funkcija namesto para končna točka + klic na odjemalcu.
* Dobro, ker so napake v podatkih med obrazcem in strežnikom vidne že pri prevajanju (TypeScript).
* Slabo, ker so Server Actions javno dosegljive kot zahtevki POST, zato mora vsaka akcija sama preveriti prijavo in vlogo uporabnika.
* Slabo, ker drugi odjemalci (npr. mobilna aplikacija) Server Actions ne morejo uporabljati.

## Dodatne informacije

Povezano: ADR-0001, ADR-0007 (preverjanje seje in vloge).
