# Next.js kot skupno ogrodje za frontend in backend

## Kontekst in opis problema

PrvihXI ima en sam odjemalec, spletni vmesnik za menedžerje, urednike in administratorja. Projekt razvija ena oseba, zato je pomembno, da je čim manj ločenih delov, ki jih je treba vzdrževati, zaganjati in usklajevati. Odločiti se je bilo treba, ali naj bosta vmesnik in strežniška logika ločeni aplikaciji ali del enega ogrodja.

## Obravnavane možnosti

* Next.js (App Router) kot full-stack ogrodje
* React SPA + ločen REST API (NestJS)
* React SPA + ločen REST API (Express)

## Odločitev

Izbrana možnost: »Next.js kot full-stack ogrodje«, ker v enem projektu pokrije upodabljanje strani in strežniško logiko. Ločen REST API bi imel smisel šele, ko bi obstajal drug odjemalec (npr. mobilna aplikacija), ki pa je izven obsega projekta. Z enim ogrodjem odpade usklajevanje dveh strežnikov, nastavljanje CORS in podvajanje tipov med frontendom in backendom.

### Posledice

* Dobro, ker se celoten projekt zažene z enim ukazom in uporablja en jezik (TypeScript).
* Dobro, ker ni treba vzdrževati pogodbe (končnih točk) med dvema aplikacijama.
* Slabo, ker je ločitev med vmesnikom in strežniško logiko manj očitna kot pri dveh aplikacijah, zato jo je treba zagotoviti s strukturo kode (glej ADR-0003).
* Slabo, ker bi dodajanje mobilne aplikacije v prihodnosti zahtevalo dodaten API.

## Dodatne informacije

Povezano: ADR-0002 (Server Actions), ADR-0003 (poslovna logika v `backend/`).
