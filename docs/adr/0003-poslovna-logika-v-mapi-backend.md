# Poslovna logika in dostop do baze v ločeni mapi `backend/`

## Kontekst in opis problema

Pravila igre (proračun, formacija, rok kroga, prestopi), izračun točk in obračun kroga potrebujeta dva dela sistema: Next.js aplikacija (ob akcijah uporabnikov) in worker (ob uvozu statistike). Repozitorij mora po predlogi predmeta imeti mapi `frontend/` in `backend/`. Odločiti se je bilo treba, kje bo poslovna logika, da je ne podvajamo in da ni pomešana s komponentami vmesnika.

## Obravnavane možnosti

* Poslovna logika, Prisma in worker v `backend/`, Next.js aplikacija v `frontend/`
* Vse v Next.js aplikaciji, logika neposredno v Server Actions
* Logika v Next.js aplikaciji, worker jo kopira oziroma kliče prek HTTP

## Odločitev

Izbrana možnost: Poslovna logika, Prisma in worker v `backend/`, ker jo tako lahko uvozita tako Server Actions v `frontend/` kot worker, ne da bi jo podvajali ali klicali prek omrežja. Server Actions ostanejo tanek sloj, ki preveri uporabnika in pokliče funkcijo iz `backend/`. Struktura se hkrati ujema z zahtevano strukturo repozitorija.

### Posledice

* Dobro, ker so pravila igre in točkovanje na enem mestu in jih je mogoče testirati brez vmesnika.
* Dobro, ker worker in aplikacija uporabljata isto kodo, zato se točke vedno računajo enako.
* Slabo, ker je treba nastaviti pnpm workspace, da `frontend/` lahko uvozi kodo iz `backend/`.
* Slabo, ker morajo razvijalci paziti, da v komponente ne pišejo poslovne logike.
