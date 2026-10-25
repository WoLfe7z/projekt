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
