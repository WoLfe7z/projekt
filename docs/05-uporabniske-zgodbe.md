# 05 – Uporabniške zgodbe

Za vsako od 15 funkcionalnosti iz dokumenta `02-funkcionalnosti-in-obseg.md` je napisana ena uporabniška zgodba. Zgodbe US-01 do US-07 sestavljajo MVP.

## Pregled

| Oznaka | Zgodba | Funkcionalnost | Vloga | MVP |
|---|---|---|---|---|
| US-01 | Registracija in prijava | 1 – Prijava, registracija in vloge | menedžer | Da |
| US-02 | Sestavljanje moštva | 2 – Sestavljanje moštva z omejitvami | menedžer | Da |
| US-03 | Postava in kapetan | 3 – Postava kroga in zaklep ob roku | menedžer | Da |
| US-04 | Prestop igralca | 4 – Prestopi s kaznijo | menedžer | Da |
| US-05 | Vnos in potrditev statistike | 5 – Vnos statistike in izračun točk | urednik | Da |
| US-06 | Obračun kroga | 6 – Obračun kroga | menedžer | Da |
| US-07 | Zasebna liga in lestvica | 7 – Zasebne lige in lestvica | menedžer | Da |
| US-08 | Iskanje nogometašev | 8 – Seznam in statistika nogometašev | menedžer | |
| US-09 | Status nogometaša | 9 – Status nogometašev | urednik | |
| US-10 | Začasne točke med krogom | 10 – Začasne točke med krogom | menedžer | |
| US-11 | Popravek statistike | 11 – Popravek statistike | urednik | |
| US-12 | Priprava sezone | 12 – Upravljanje klubov, nogometašev in razporeda | administrator | |
| US-13 | Upravljanje uporabnikov | 13 – Upravljanje uporabnikov | administrator | |
| US-14 | Sprotne točke iz API-ja | 14 – Samodejni uvoz statistike in sprotne točke | menedžer | |
| US-15 | E-poštni opomnik pred rokom | 15 – E-poštni opomniki pred rokom | menedžer | |

---

## US-01 – Registracija in prijava

- **Funkcionalnost:** 1 – Prijava, registracija in vloge (MVP)
- **Vloga:** menedžer

Kot navijač želim ustvariti račun z e-pošto in geslom in se prijaviti, da lahko sestavim svoje moštvo in tekmujem s prijatelji.

**Acceptance criteria:**
- Registracija zahteva ime, e-poštni naslov in geslo z najmanj 8 znaki. Če e-pošta že obstaja, sistem prikaže »Račun s tem e-poštnim naslovom že obstaja«.
- Nov račun ima vedno vlogo *menedžer*. Vloge med registracijo ni mogoče izbrati.
- Ob napačni e-pošti ali geslu sistem prikaže splošno sporočilo »Napačna e-pošta ali geslo« (ne pove, kateri podatek je napačen).
- Po uspešni prijavi je uporabnik preusmerjen na stran *Moje moštvo*, po odjavi pa na stran za prijavo.
- Blokiran uporabnik se ne more prijaviti in vidi sporočilo »Račun je blokiran«.

---

## US-02 – Sestavljanje moštva

- **Funkcionalnost:** 2 – Sestavljanje moštva z omejitvami (MVP)
- **Vloga:** menedžer

Kot menedžer želim pred začetkom sezone izbrati 15 nogometašev v okviru proračuna, da dobim moštvo, s katerim zbiram točke.

**Acceptance criteria:**
- Moštva ni mogoče shraniti, dokler nima natanko 2 vratarjev, 5 branilcev, 5 vezistov in 3 napadalcev (skupaj 15).
- Med izbiro sistem sproti prikazuje porabljen in preostali proračun. Če vsota cen preseže 100,0 mio, je gumb *Shrani moštvo* onemogočen.
- Ko so v moštvu že 3 igralci istega kluba, so ostali igralci tega kluba na seznamu onemogočeni z namigom »Največ 3 igralci iz istega kluba«.
- Moštvo mora imeti ime dolžine 3–30 znakov. Vsak menedžer ima lahko le eno moštvo.
- Strežnik vsa pravila ponovno preveri ob shranjevanju in neveljavno zahtevo zavrne s seznamom napak.

---

## US-03 – Postava in kapetan

- **Funkcionalnost:** 3 – Postava kroga in zaklep ob roku (MVP)
- **Vloga:** menedžer

Kot menedžer želim pred vsakim krogom izbrati 11 začetnih igralcev, kapetana in vrstni red klopi, da zame igrajo igralci, ki jim najbolj zaupam.

**Acceptance criteria:**
- Postavo je mogoče shraniti le v veljavni formaciji: 1 vratar, 3–5 branilcev, 2–5 vezistov, 1–3 napadalci (skupaj 11). Pri neveljavni formaciji sistem prikaže, katera pozicija krši pravilo.
- Kapetan mora biti eden od 11 začetnih igralcev. Na igrišču je označen z oznako »C«.
- Klop ima 4 mesta: prvo je vedno rezervni vratar, ostala tri določajo vrstni red samodejnih menjav.
- Stran prikazuje rok kroga (datum in ura) in odštevanje do roka.
- Po roku (1 ura pred prvo tekmo kroga) je postava samo za branje. Strežnik vsako spremembo zavrne s sporočilom »Rok za ta krog je potekel«.

---

## US-04 – Prestop igralca

- **Funkcionalnost:** 4 – Prestopi s kaznijo (MVP)
- **Vloga:** menedžer

Kot menedžer želim pred krogom zamenjati igralca v moštvu z drugim igralcem, da lahko nadomestim poškodovane ali slabe igralce.

**Acceptance criteria:**
- Igralca je mogoče zamenjati le z igralcem iste pozicije, ki še ni v moštvu.
- Prestop je zavrnjen, če bi preostali proračun padel pod 0 ali bi bili v moštvu več kot 3 igralci istega kluba.
- Prvi prestop v krogu je brezplačen. Pred potrditvijo vsakega naslednjega prestopa sistem prikaže opozorilo »Ta prestop stane 4 točke«.
- Po prestopu novi igralec zasede mesto odhajajočega igralca v postavi za odprt krog, proračun pa se posodobi.
- Po roku kroga prestopov ni mogoče opravljati.

---

## US-05 – Vnos in potrditev statistike

- **Funkcionalnost:** 5 – Vnos statistike in izračun točk (MVP)
- **Vloga:** urednik statistike

Kot urednik želim vnesti ali preveriti statistiko tekme in jo potrditi, da sistem iz nje izračuna točke nogometašev.

**Acceptance criteria:**
- Obrazec prikaže rezultat in vse nogometaše obeh klubov s polji: minute (0–120), goli, asistence, avtogoli, rumeni in rdeči karton. Napačna vrednost je označena ob polju.
- Tekme ni mogoče potrditi, če se vsota golov igralcev kluba in avtogolov nasprotnikov ne ujema z rezultatom kluba. Sistem prikaže, pri katerem klubu je razlika.
- Ob potrditvi se vsakemu nogometašu izračunajo točke po tabeli točkovanja (npr. gol napadalca 4, 60+ minut 2, rumeni karton -1), čista mreža pa se doda samodejno.
- Po potrditvi ima tekma stanje *Potrjena*.
- Do obrazca dostopa le uporabnik z vlogo urednik. Ostali vidijo sporočilo »Ni dostopa«.

---

## US-06 – Obračun kroga

- **Funkcionalnost:** 6 – Obračun kroga (MVP)
- **Vloga:** menedžer

Kot menedžer želim, da se točke mojega moštva po krogu izračunajo samodejno po pravilih igre, da mi jih ni treba seštevati ročno in so izračunane enako za vse.

**Acceptance criteria:**
- Obračun se izvede samodejno, ko je potrjena zadnja tekma kroga. Krog nato preide v stanje *Obračunan*.
- Začetnega igralca z 0 minutami zamenja prvi igralec s klopi, ki je igral, če formacija ostane veljavna. Vratarja lahko zamenja le rezervni vratar.
- Točke kapetana se podvojijo. Če kapetan ni igral, se ne podvoji nič.
- Za vsak plačljiv prestop v krogu se odštejejo 4 točke.
- V pregledu kroga menedžer vidi točke vsakega igralca, oznako igralcev, ki so vstopili z menjavo, kazenske točke in skupni rezultat kroga.

---

## US-07 – Zasebna liga in lestvica

- **Funkcionalnost:** 7 – Zasebne lige in lestvica (MVP)
- **Vloga:** menedžer

Kot menedžer želim ustvariti zasebno ligo ali se ji pridružiti s kodo in videti njeno lestvico, da lahko tekmujem s prijatelji in vem, kako se uvrščam.

**Acceptance criteria:**
- Ob ustvarjanju lige (ime dolžine 3–40 znakov) sistem generira unikatno kodo povabila iz 8 znakov, ustvarjalec pa postane prvi član.
- Ob vnosu neobstoječe kode sistem prikaže »Liga s to kodo ne obstaja«, ob kodi lige, v kateri je že član, pa »Si že član te lige«.
- Lestvica prikazuje mesto, ime moštva, menedžerja, točke zadnjega kroga in skupne točke, razvrščeno po skupnih točkah padajoče.
- Pri enakem številu točk je višje moštvo z manj kazenskimi točkami. Lastno moštvo je na lestvici poudarjeno.
- Lestvico lige lahko odpre le član te lige. Ostali vidijo sporočilo »Ni dostopa«.

---

## US-08 – Iskanje nogometašev

- **Funkcionalnost:** 8 – Seznam in statistika nogometašev
- **Vloga:** menedžer

Kot menedžer želim iskati in primerjati nogometaše po poziciji, klubu, ceni in točkah, da se lažje odločim, koga izbrati.

**Acceptance criteria:**
- Seznam je mogoče filtrirati po poziciji, klubu in najvišji ceni ter iskati po priimku (vsaj 2 znaka).
- Za vsakega nogometaša so prikazani ime, klub, pozicija, cena, skupne točke in forma (povprečje točk zadnjih 5 krogov).
- Seznam je mogoče razvrstiti po ceni, skupnih točkah ali formi s klikom na glavo stolpca.
- Stran prikazuje največ 25 nogometašev in ima ostranjevanje.
- Če iskanju ne ustreza noben nogometaš, se prikaže »Ni zadetkov« in gumb *Počisti filtre*.

---

## US-09 – Status nogometaša

- **Funkcionalnost:** 9 – Status nogometašev
- **Vloga:** urednik statistike

Kot urednik želim nogometašu nastaviti status poškodovan ali kaznovan, da menedžerji pravočasno vedo, da igralec verjetno ne bo igral.

**Acceptance criteria:**
- Urednik lahko izbere status *na voljo*, *poškodovan* ali *kaznovan* in doda opombo (do 100 znakov).
- Nogometaš s statusom poškodovan ali kaznovan ima na seznamu nogometašev in na igrišču postave opozorilno oznako, opomba pa se prikaže ob prehodu z miško.
- Če ima menedžer takega igralca v začetni postavi, se na strani *Postava* prikaže opozorilo z imenom igralca.

---

## US-10 – Začasne točke med krogom

- **Funkcionalnost:** 10 – Začasne točke med krogom
- **Vloga:** menedžer

Kot menedžer želim med krogom videti točke, ki jih je moje moštvo že zbralo, in začasno lestvico lige, da mi ni treba čakati na konec kroga.

**Acceptance criteria:**
- Stran *Pregled kroga* prikazuje točke vsakega igralca v postavi za tekme, ki so v teku ali že odigrane.
- Igralci, katerih tekma se še ni začela, so označeni z »še ni odigrano«.
- Začasne točke upoštevajo kapetana, samodejne menjave pa se izvedejo šele ob obračunu kroga.
- Lestvica lige je do obračuna kroga označena z »Začasno«.

---

## US-11 – Popravek statistike

- **Funkcionalnost:** 11 – Popravek statistike
- **Vloga:** urednik statistike

Kot urednik želim popraviti napako v že potrjeni tekmi, da imajo menedžerji pravilne točke.

**Acceptance criteria:**
- Urednik lahko potrjeno tekmo z gumbom *Popravi* ponovno odpre za urejanje. Tekma preide v stanje *V vnosu*.
- Ob ponovni potrditvi veljajo ista pravila preverjanja kot pri prvi potrditvi (US-05).
- Če je bil krog že obračunan, sistem po popravku znova obračuna krog in posodobi lestvice.
- Ob tekmi sta prikazana čas zadnjega popravka in ime urednika, ki ga je opravil.

---

## US-12 – Priprava sezone

- **Funkcionalnost:** 12 – Upravljanje klubov, nogometašev in razporeda
- **Vloga:** administrator

Kot administrator želim vnesti klube, nogometaše in razpored krogov s tekmami, da lahko menedžerji začnejo igrati.

**Acceptance criteria:**
- Nogometaš mora imeti ime, priimek, klub, pozicijo (VR, OB, VE, NA) in ceno med 4,0 in 15,0 mio.
- Tekma mora imeti dva različna kluba in čas začetka. Rok kroga se izračuna samodejno kot 1 ura pred začetkom prve tekme kroga.
- Nogometašu in tekmi je mogoče vnesti `zunanji_id` (ID v API-Football), ki je unikaten.
- Nogometaša, ki je v moštvu katerega koli menedžerja, ni mogoče izbrisati. Spremeni se mu lahko le status ali klub.

---

## US-13 – Upravljanje uporabnikov

- **Funkcionalnost:** 13 – Upravljanje uporabnikov
- **Vloga:** administrator

Kot administrator želim dodeliti vlogo urednika in blokirati uporabnike, da statistiko potrjujejo le zaupanja vredne osebe in lahko odstranim zlorabe.

**Acceptance criteria:**
- Administrator vidi seznam uporabnikov z imenom, e-pošto, vlogo in stanjem (aktiven ali blokiran) ter lahko išče po e-pošti.
- Vlogo urednika lahko dodeli le uporabniku, ki nima moštva. Sicer sistem prikaže »Uporabnik ima moštvo in ne more biti urednik«.
- Ob blokadi se vse seje uporabnika takoj izbrišejo in uporabnik je odjavljen.
- Administrator ne more blokirati samega sebe.

---

## US-14 – Sprotne točke iz API-ja

- **Funkcionalnost:** 14 – Samodejni uvoz statistike in sprotne točke
- **Vloga:** menedžer

Kot menedžer želim, da se točke mojih igralcev med tekmo samodejno posodabljajo, da lahko moštvo spremljam sproti in ne čakam na urednika.

**Acceptance criteria:**
- Med tekmo sistem vsakih 5 minut uvozi statistiko iz API-Football in posodobi točke nogometašev te tekme.
- Na strani *Pregled kroga* je prikazan čas zadnje posodobitve (npr. »Posodobljeno ob 18:35«).
- Uvoz tekme ne potrdi. Tekma ostane v stanju *V vnosu*, dokler je urednik ne potrdi (US-05).
- Nogometaši brez `zunanji_id` se ne posodobijo in so uredniku prikazani na seznamu »Nepovezani igralci«.
- Če API ni dosegljiv, ostanejo prikazane zadnje uvožene točke, uvoz pa se ponovi ob naslednjem intervalu.

---

## US-15 – E-poštni opomnik pred rokom

- **Funkcionalnost:** 15 – E-poštni opomniki pred rokom
- **Vloga:** menedžer

Kot menedžer želim dan pred rokom prejeti e-poštni opomnik, če moja postava ni urejena, da ne izgubim točk zaradi pozabljene ali neveljavne postave.

**Acceptance criteria:**
- Opomnik dobi menedžer, ki 24 ur pred rokom kroga postave za ta krog še ni shranil ali ima v začetni postavi poškodovanega ali kaznovanega igralca.
- E-pošta vsebuje številko kroga, datum in uro roka, imena problematičnih igralcev in povezavo na stran *Postava*.
- Menedžer za isti krog prejme največ en opomnik.
- Menedžer z urejeno postavo brez poškodovanih ali kaznovanih igralcev opomnika ne prejme.
