# 07 – Pregled projekta

## 1. Pregled MVP funkcionalnosti

PrvihXI je spletna aplikacija za fantazijsko nogometno igro, v kateri uporabniki sestavljajo moštva, določajo postave, izvajajo prestope in zbirajo točke na podlagi rezultatov nogometnih tekem.

V dokumentaciji je opredeljenih sedem MVP funkcionalnosti:

| Oznaka | Funkcionalnost | Ugotovitve |
|---|---|---|
| US-01 | Registracija in prijava | Prijava uporabnikov deluje. |
| US-02 | Sestavljanje moštva | Sestavljanje in shranjevanje moštva delujeta. |
| US-03 | Postava in kapetan | Urejanje postave in izbira kapetana delujeta. |
| US-04 | Prestopi igralcev | Izvajanje prestopov deluje. |
| US-05 | Vnos statistike in izračun točk | Vnos in shranjevanje statistike delujeta, končne potrditve tekme nisem preverila. |
| US-06 | Obračun kroga | Funkcionalnosti nisem preverila. |
| US-07 | Zasebne lige in lestvica | Funkcionalnosti nisem preverila. |

## 2. Pregled petih uporabniških zgodb

### US-01 – Registracija in prijava

Uspešno sem se prijavila z računi menedžerja, urednika statistike in administratorja. Aplikacija prepozna različne uporabniške vloge in ustrezno omejuje dostop do funkcionalnosti.

**Ocena:** Prijava deluje pravilno.

### US-02 – Sestavljanje moštva

Kot menedžerka sem uspešno izbrala 15 nogometašev in shranila moštvo. Aplikacija med izbiro prikazuje proračun in razdelitev igralcev po igralnih položajih.

**Ocena:** Osnovna funkcionalnost sestavljanja moštva deluje.

### US-03 – Postava in kapetan

Preverila sem možnost urejanja postave in izbire kapetana. Spremembe sem lahko shranila, kapetana pa tudi naknadno zamenjala.

**Ocena:** Urejanje postave in izbira kapetana delujeta.

### US-04 – Prestop igralca

Uspešno sem izvedla prestop igralca. Aplikacija omogoča izbiro igralca za zamenjavo in novega igralca. Prvi prestop v krogu je brezplačen, za naslednje pa se prikaže opozorilo o odbitku štirih točk.

**Ocena:** Osnovna funkcionalnost prestopov deluje.

### US-05 – Vnos in potrditev statistike

Kot urednica statistike sem vnesla rezultat tekme Aluminij – Radomlje (2 : 1) in podatke o igralcu. Statistiko sem uspešno shranila kot osnutek. Ob ponovnem odprtju tekme so bili vneseni podatki ohranjeni.

V uporabniškem vmesniku sem našla možnost »Shrani osnutek«, možnosti za končno potrditev tekme pa nisem našla. Zato nisem mogla preveriti izračuna točk in spremembe stanja tekme v »Potrjena«.

**Ocena:** Vnos in shranjevanje statistike delujeta, celotne uporabniške zgodbe pa nisem mogla potrditi.

## 3. Zaključek

Pri pregledu projekta sem aplikacijo uspešno zagnala v lokalnem okolju in preizkusila funkcionalnosti različnih uporabniških vlog.

Ugotovila sem, da osnovne funkcionalnosti prijave, sestavljanja moštva, urejanja postave, izbire kapetana in prestopov delujejo. Deluje tudi vnos in shranjevanje statistike tekem.

Za popolno potrditev vseh zahtev MVP bi bilo treba dodatno preveriti končno potrditev tekem, samodejni obračun točk, zasebne lige ter preostala pravila in omejitve uporabniških zgodb.