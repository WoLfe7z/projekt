# 03 – Podatkovni model

Podatkovni model je relacijski. Podatki so močno povezani (klub &rarr; nogometaš &rarr; nastop na tekmi &rarr; točke &rarr; postave moštev &rarr; lige), prestopi in obračun kroga pa morajo spremeniti več tabel hkrati v eni transakciji. Imena tabel in polj so zapisana brez šumnikov (snake_case).

## 1. Pregled entitet

| Entiteta | Opis |
|---|---|
| `uporabnik` | uporabnik sistema (menedžer, urednik ali administrator), vloga je polje v tabeli |
| `klub` | klub Prve lige |
| `nogometas` | resnični nogometaš s pozicijo, ceno in statusom |
| `krog` | krog sezone z rokom za spremembe |
| `tekma` | tekma dveh klubov v krogu z rezultatom |
| `nastop` | statistika nogometaša na eni tekmi in izračunane točke |
| `mostvo` | fantasy moštvo menedžerja |
| `mostvo_nogometas` | vmesna tabela: 15 nogometašev v moštvu |
| `postava` | postava moštva za posamezen krog (en zapis na igralca) |
| `prestop` | zamenjava igralca v moštvu |
| `rezultat_kroga` | točke moštva v posameznem krogu |
| `liga` | zasebna liga s kodo povabila |
| `clanstvo` | vmesna tabela: moštva v ligi |

## 2. Diagram (ER)

```mermaid
erDiagram
    UPORABNIK {
        uuid id PK
        string email UK
        string vloga
    }
    KLUB {
        uuid id PK
        string naziv
    }
    NOGOMETAS {
        uuid id PK
        uuid klub_id FK
        string pozicija
        decimal cena
        int zunanji_id
    }
    KROG {
        uuid id PK
        int stevilka UK
        timestamp rok
        bool obracunan
    }
    TEKMA {
        uuid id PK
        uuid krog_id FK
        uuid domaci_id FK
        uuid gostje_id FK
        string status
        int zunanji_id
    }
    NASTOP {
        uuid id PK
        uuid tekma_id FK
        uuid nogometas_id FK
        int minute
        int tocke
    }
    MOSTVO {
        uuid id PK
        uuid uporabnik_id FK
        string ime
        decimal proracun
    }
    MOSTVO_NOGOMETAS {
        uuid mostvo_id PK, FK
        uuid nogometas_id PK, FK
    }
    POSTAVA {
        uuid id PK
        uuid mostvo_id FK
        uuid krog_id FK
        uuid nogometas_id FK
        int mesto
        bool kapetan
    }
    PRESTOP {
        uuid id PK
        uuid mostvo_id FK
        uuid krog_id FK
        uuid ven_id FK
        uuid noter_id FK
    }
    REZULTAT_KROGA {
        uuid id PK
        uuid mostvo_id FK
        uuid krog_id FK
        int tocke
    }
    LIGA {
        uuid id PK
        uuid ustvaril_id FK
        string koda UK
    }
    CLANSTVO {
        uuid liga_id PK, FK
        uuid mostvo_id PK, FK
    }

    KLUB ||--o{ NOGOMETAS : "ima"
    KROG ||--o{ TEKMA : "vsebuje"
    KLUB ||--o{ TEKMA : "igra"
    TEKMA ||--o{ NASTOP : "ima"
    NOGOMETAS ||--o{ NASTOP : "nastopi"
    UPORABNIK ||--o| MOSTVO : "vodi"
    MOSTVO ||--|{ MOSTVO_NOGOMETAS : "ima igralce"
    NOGOMETAS ||--o{ MOSTVO_NOGOMETAS : "je v"
    MOSTVO ||--o{ POSTAVA : "postavi"
    KROG ||--o{ POSTAVA : "za krog"
    NOGOMETAS ||--o{ POSTAVA : "je v postavi"
    MOSTVO ||--o{ PRESTOP : "opravi"
    MOSTVO ||--o{ REZULTAT_KROGA : "doseže"
    KROG ||--o{ REZULTAT_KROGA : "ima"
    UPORABNIK ||--o{ LIGA : "ustvari"
    LIGA ||--o{ CLANSTVO : "ima"
    MOSTVO ||--o{ CLANSTVO : "je član"
```

## 3. Povezave med entitetami

- **Klub &rarr; Nogometaš: 1:N** (klub ima več nogometašev).
- **Krog &rarr; Tekma: 1:N** in **Klub &rarr; Tekma: 1:N** (tekma ima domači in gostujoči klub).
- **Tekma &harr; Nogometaš: N:M** prek `nastop` (statistika nogometaša na tekmi).
- **Uporabnik &rarr; Moštvo: 1:0..1** (menedžer ima eno moštvo, urednik in administrator nobenega).
- **Moštvo &harr; Nogometaš: N:M** prek `mostvo_nogometas` (moštvo ima 15 igralcev, igralec je lahko v več moštvih).
- **Moštvo &rarr; Postava: 1:N** (za vsak krog 15 zapisov, en na igralca).
- **Moštvo &rarr; Prestop: 1:N** in **Moštvo &rarr; Rezultat kroga: 1:N**.
- **Liga &harr; Moštvo: N:M** prek `clanstvo` (moštvo je lahko v več ligah).

## 4. Opis entitet in glavnih polj

### `uporabnik`

| Polje | Tip | Opis |
|---|---|---|
| `id` | UUID, PK | |
| `email` | VARCHAR, unikaten | uporablja se za prijavo |
| `ime` | VARCHAR | prikazno ime |
| `vloga` | ENUM (`menedzer`, `urednik`, `admin`) | določa pravice |
| `je_blokiran` | BOOLEAN | |

Gesla in seje hrani knjižnica Better Auth v svojih tabelah (`account`, `session`).

### `nogometas`

| Polje | Tip | Opis |
|---|---|---|
| `id` | UUID, PK | |
| `klub_id` | UUID, FK &rarr; `klub` | |
| `ime`, `priimek` | VARCHAR | |
| `pozicija` | ENUM (`VR`, `OB`, `VE`, `NA`) | vratar, branilec, vezist, napadalec |
| `cena` | NUMERIC(4,1) | v mio, npr. 7,5 |
| `status` | ENUM (`na_voljo`, `poskodovan`, `kaznovan`) | |
| `zunanji_id` | INT, unikaten, NULL | ID nogometaša v zunanjem API-ju (za samodejni uvoz statistike) |

### `krog` in `tekma`

| Polje | Tip | Opis |
|---|---|---|
| `krog.stevilka` | INT, unikaten | 1–36 |
| `krog.rok` | TIMESTAMP | rok za spremembe postav |
| `krog.obracunan` | BOOLEAN | `true`, ko je obračun izveden |
| `tekma.krog_id` | UUID, FK &rarr; `krog` | |
| `tekma.domaci_id`, `tekma.gostje_id` | UUID, FK &rarr; `klub` | |
| `tekma.goli_domaci`, `tekma.goli_gostje` | INT, NULL | prazno, dokler ni vneseno |
| `tekma.status` | ENUM (`napovedana`, `v_vnosu`, `potrjena`) | |
| `tekma.zunanji_id` | INT, unikaten, NULL | ID tekme v zunanjem API-ju |

### `nastop`

| Polje | Tip | Opis |
|---|---|---|
| `tekma_id` | UUID, FK &rarr; `tekma` | |
| `nogometas_id` | UUID, FK &rarr; `nogometas` | |
| `minute` | INT | 0–120 |
| `goli`, `asistence`, `avtogoli` | INT | |
| `rumeni`, `rdeci` | INT | |
| `tocke` | INT | izračuna sistem ob potrditvi tekme |

### `mostvo`

| Polje | Tip | Opis |
|---|---|---|
| `uporabnik_id` | UUID, FK &rarr; `uporabnik`, unikaten | |
| `ime` | VARCHAR | |
| `proracun` | NUMERIC(4,1) | preostanek proračuna |
| `skupne_tocke` | INT | vsota vseh rezultatov krogov |

### `postava`

| Polje | Tip | Opis |
|---|---|---|
| `mostvo_id`, `krog_id`, `nogometas_id` | UUID, FK | |
| `mesto` | INT | 1–11 začetna postava, 12–15 klop po vrstnem redu menjav |
| `kapetan` | BOOLEAN | |
| `tocke` | INT, NULL | izpolni obračun (po menjavah in kapetanu) |

### `prestop`, `rezultat_kroga`, `liga`, `clanstvo`

| Polje | Tip | Opis |
|---|---|---|
| `prestop.ven_id`, `prestop.noter_id` | UUID, FK → `nogometas` | igralec ven in igralec noter |
| `prestop.brezplacen` | BOOLEAN | `false` pomeni −4 točke ob obračunu |
| `rezultat_kroga.tocke` | INT | točke moštva v krogu (po kazni) |
| `rezultat_kroga.kazen` | INT | kazenske točke za prestope |
| `liga.ime` | VARCHAR | |
| `liga.koda` | VARCHAR, unikaten | koda povabila, 8 znakov |
| `liga.ustvaril_id` | UUID, FK → `uporabnik` | ustvarjalec lige |
| `clanstvo.liga_id`, `clanstvo.mostvo_id` | UUID, FK | sestavljeni ključ |

## 5. Omejitve

- **En nastop nogometaša na tekmo:** unikatna omejitev na (`tekma_id`, `nogometas_id`).
- **Ena postava na igralca v krogu:** unikatni omejitvi na (`mostvo_id`, `krog_id`, `nogometas_id`) in (`mostvo_id`, `krog_id`, `mesto`).
- **En rezultat moštva na krog:** unikatna omejitev na (`mostvo_id`, `krog_id`).
- **Preverjanje vrednosti:** `minute` med 0 in 120, `proracun` ≥ 0, `mesto` med 1 in 15.
- **Pravila v aplikaciji:** razmerje 2/5/5/3, največ 3 iz kluba, veljavna formacija in rok kroga preverja strežnik.
- **Transakcije:** prestop (moštvo, proračun, postava) in obračun kroga se izvedeta v eni transakciji.
