# PostgreSQL kot podatkovna baza

## Kontekst in opis problema

Podatki so močno povezani: klub &rarr; nogometaš &rarr; nastop na tekmi &rarr; točke &rarr; postave moštev &rarr; lige. Prestop mora hkrati spremeniti moštvo, proračun in postavo, obračun kroga pa točke vseh moštev in lestvice. Če se tak zapis izvede le delno, so točke napačne. Odločiti se je bilo treba, katera podatkovna baza najbolje podpira takšne podatke in operacije.

## Obravnavane možnosti

* PostgreSQL (relacijska baza)
* MySQL (relacijska baza)
* MongoDB (dokumentna baza)

## Odločitev

Izbrana možnost: »PostgreSQL«, ker relacijski model z tujimi ključi, unikatnimi omejitvami in transakcijami neposredno podpira pravila, ki jih aplikacija potrebuje (en nastop nogometaša na tekmo, en rezultat moštva na krog, prestop v eni transakciji). MongoDB bi zahteval podvajanje podatkov med dokumenti in šibkejše zagotavljanje konsistentnosti. MySQL bi bil enakovreden, PostgreSQL pa ima boljšo podporo za preverjanja (`CHECK`) in je privzeta izbira pri Prismi in večini ponudnikov gostovanja.

### Posledice

* Dobro, ker baza sama prepreči nekonsistentne podatke (npr. dvojni nastop ali negativen proračun).
* Dobro, ker se prestop in obračun kroga izvedeta v celoti ali pa sploh ne.
* Slabo, ker je treba spremembe sheme izvajati z migracijami.
* Slabo, ker mora za lokalni razvoj teči ločen strežnik baze (rešeno z Dockerjem, ADR-0008).

## Dodatne informacije

Podatkovni model je opisan v `03-podatkovni-model.md`.
