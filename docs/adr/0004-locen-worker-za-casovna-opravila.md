# Ločen worker za časovna opravila

## Kontekst in opis problema

Nekatera opravila se morajo izvajati ob določenem času, ne glede na to, ali je kdo prijavljen: med tekmami vsakih 5 minut uvoz statistike iz API-Football in enkrat na uro preverjanje, komu je treba poslati e-poštni opomnik pred rokom kroga. Next.js nima vgrajenega načina za periodična opravila. Odločiti se je bilo treba, kje bodo ta opravila tekla.

## Obravnavane možnosti

* Ločen proces Node.js z `node-cron`
* `setInterval` znotraj procesa Next.js
* Zunanji cron (npr. GitHub Actions), ki kliče zaščiteno pot v aplikaciji

## Odločitev

Izbrana možnost: »Ločen proces Node.js z `node-cron`«, ker opravila tečejo neodvisno od zahtevkov uporabnikov in uporabljajo isto poslovno logiko iz `backend/`. `setInterval` v procesu Next.js ni zanesljiv (ob ponovnem zagonu ali več instancah se opravila podvojijo ali izgubijo). Zunanji cron je odvisen od zunanje storitve, ki je lokalno ni.

### Posledice

* Dobro, ker uvoz statistike in pošiljanje e-pošte ne upočasnjujeta odzivov aplikacije.
* Dobro, ker so vsa časovna opravila na enem mestu in jih je mogoče zagnati tudi ročno med razvojem.
* Dobro, ker gre za en preprost proces brez dodatnih storitev (brez zunanjega crona).
* Slabo, ker je treba med razvojem poleg aplikacije zagnati še en proces (`pnpm worker`).
* Slabo, ker `node-cron` ne hrani stanja: če worker ne teče, se zamujeno opravilo ne izvede za nazaj.
