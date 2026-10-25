# Better Auth s sejami v bazi za avtentikacijo

## Kontekst in opis problema

Uporabniki se prijavljajo z e-pošto in geslom, sistem pa pozna tri vloge (menedžer, urednik, administrator). Administrator mora imeti možnost uporabnika blokirati, blokada pa mora začeti veljati takoj. Lastna implementacija prijave (zgoščevanje gesel, seje, omejevanje poskusov) je varnostno tvegana. Odločiti se je bilo treba, kako bo urejena avtentikacija.

## Obravnavane možnosti

* Better Auth s sejami v bazi
* Auth.js (NextAuth)
* Zunanja storitev (Clerk, Auth0)
* Lastna implementacija z JWT

## Odločitev

Izbrana možnost: »Better Auth s sejami v bazi«, ker podpira prijavo z e-pošto in geslom, deluje s Prismo in omogoča dodatno polje za vlogo uporabnika. Seje so shranjene v bazi, zato ob blokadi uporabnika izbrišemo njegove seje in je takoj odjavljen, kar pri JWT brez dodatne logike ni mogoče. Auth.js se vzdržuje le še z varnostnimi popravki, zunanje storitve pa so plačljive in dodajo odvisnost od tretje strani.

### Posledice

* Dobro, ker gesel in sej ne implementiramo sami.
* Dobro, ker blokada uporabnika začne veljati takoj.
* Slabo, ker vsak zahtevek preveri sejo v bazi, kar pomeni dodatno poizvedbo.
* Slabo, ker je treba vlogo uporabnika preverjati v vsaki Server Action posebej (ADR-0002).
