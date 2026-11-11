# PrvihXI

Spletna fantasy nogometna igra za slovensko Prvo ligo z zasebnimi ligami med prijatelji.

Menedžer v okviru proračuna sestavi moštvo iz resničnih nogometašev Prve lige, pred vsakim krogom izbere postavo in kapetana ter zbira točke glede na nastope igralcev na resničnih tekmah. Statistika tekem se med tekmo samodejno uvaža iz zunanjega API-ja, urednik jo po tekmi preveri in potrdi, sistem pa obračuna krog in posodobi lestvice zasebnih lig.

## Tehnologije

| Področje | Tehnologije |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Backend | Next.js Server Actions, Node.js, TypeScript, worker z `node-cron` |
| Podatkovna baza | PostgreSQL, Prisma ORM |
| Avtentikacija | Better Auth (e-pošta in geslo, seje v bazi) |
| Zunanje storitve | API-Football, SMTP (lokalno Mailpit) |
| Lokalni razvoj | Docker Desktop, Node.js, pnpm, Git in GitHub |

## Struktura repozitorija

```
projekt/
├── frontend/   # Next.js aplikacija (uporabniški vmesnik in Server Actions)
├── backend/    # poslovna logika, dostop do baze (Prisma) in worker
└── docs/       # dokumentacija projekta
```

## Lokalni zagon

### Predpogoji

- [Node.js](https://nodejs.org) 20.9 ali novejši (priporočen je 24 LTS)
- [pnpm](https://pnpm.io): `npm install -g pnpm` ali `brew install pnpm`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), ki mora med razvojem teči
- Git

### Prvi zagon

```bash
# 1. kloniraj repozitorij
git clone https://github.com/WoLfe7z/projekt.git
cd projekt

# 2. nastavitve okolja (v .env zamenjaj BETTER_AUTH_SECRET)
cp .env.example .env

# 3. zaženi bazo PostgreSQL in Mailpit
docker compose up -d

# 4. namesti odvisnosti
pnpm install

# 5. ustvari tabele v bazi in Prisma Client
pnpm db:migrate

# 6. dodaj testne uporabnike
pnpm db:seed

# 7. zaženi aplikacijo
pnpm dev
```

Aplikacija teče na http://localhost:3000, Mailpit (testna e-pošta) na http://localhost:8025.

### Testni uporabniki

Ustvari jih ukaz `pnpm db:seed`. Vsi imajo geslo `geslo1234` in so namenjeni samo lokalnemu razvoju.

| E-pošta | Vloga |
|---|---|
| `menedzer@prvihxi.si` | menedžer |
| `urednik@prvihxi.si` | urednik statistike |
| `admin@prvihxi.si` | administrator |

### Uporabni ukazi

| Ukaz | Kaj naredi |
|---|---|
| `pnpm dev` | zažene aplikacijo v razvojnem načinu |
| `pnpm db:migrate` | uporabi nove migracije (ob spremembi `schema.prisma` ustvari novo) |
| `pnpm db:generate` | ponovno ustvari Prisma Client |
| `pnpm db:seed` | doda testne uporabnike (ponovni zagon ne ustvari dvojnikov) |
| `pnpm db:studio` | odpre pregled baze v brskalniku |
| `docker compose down` | ustavi bazo in Mailpit (podatki ostanejo) |

### Pogoste težave

- **`Module not found: Can't resolve './generated/prisma/client'`**: Prisma Client še ni ustvarjen. Poženi `pnpm db:generate`.
- **Napaka pri povezavi z bazo (`ECONNREFUSED` ali `Can't reach database server`)**: Docker Desktop ne teče ali baza ni zagnana. Poženi `docker compose up -d`.
- **`zsh: command not found: pnpm`**: pnpm ni nameščen. Namesti ga z `npm install -g pnpm` ali `brew install pnpm` (pri Homebrew bo morda treba najprej potrditi licenco Xcode: `sudo xcodebuild -license accept`).

## Dokumentacija

- [01 – Zasnova rešitve](docs/01-zasnova-resitve.md)
- [02 – Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
- [03 – Podatkovni model](docs/03-podatkovni-model.md)
- [04 – Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
- [05 – Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
- [06 – Wireframes](docs/06-wireframes.md)
- [Arhitekturne odločitve (ADR)](docs/adr/)

## Način dela

Razvoj poteka po strategiji GitHub Flow: vsaka sprememba nastane v svoji veji in se v `main` združi prek pull requesta. Veja `main` je zaščitena.
