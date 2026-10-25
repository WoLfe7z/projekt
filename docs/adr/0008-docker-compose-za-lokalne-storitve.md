# Docker Compose za bazo in e-pošto v lokalnem razvoju

## Kontekst in opis problema

Za lokalni razvoj potrebujemo PostgreSQL in strežnik za e-pošto, s katerim lahko preizkusimo opomnike brez pošiljanja pravih sporočil. Okolje naj bo enako na vsakem računalniku in naj se zažene z enim ukazom. Odločiti se je bilo treba, kako bodo te storitve tekle med razvojem.

## Obravnavane možnosti

* Docker Compose za PostgreSQL in Mailpit, aplikacija lokalno s `pnpm dev`
* Vse v Dockerju, tudi Next.js aplikacija in worker
* PostgreSQL nameščen neposredno na računalnik (Homebrew), e-pošta prek pravega SMTP

## Odločitev

Izbrana možnost: »Docker Compose za PostgreSQL in Mailpit, aplikacija lokalno«, ker storitvi z ustaljeno različico tečeta v vsebnikih, Next.js pa teče neposredno na računalniku, kjer je hitro osveževanje kode ob spremembah najzanesljivejše. Lokalna namestitev PostgreSQL vodi do različnih različic in nastavitev, pravi SMTP pa bi med testiranjem pošiljal prava sporočila.

### Posledice

* Dobro, ker se celotno okolje za bazo in e-pošto zažene z `docker compose up -d`.
* Dobro, ker Mailpit prestreže vso e-pošto in jo prikaže v brskalniku.
* Slabo, ker mora biti nameščen in zagnan Docker Desktop.
* Slabo, ker okolje ni povsem enako produkcijskemu, saj aplikacija lokalno ne teče v vsebniku.
