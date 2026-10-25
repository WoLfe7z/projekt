# 01 – Zasnova rešitve

## Ime rešitve

**PrvihXI** – spletna fantasy nogometna igra za slovensko Prvo ligo z zasebnimi ligami med prijatelji.

## Namen rešitve

PrvihXI omogoča, da navijači sestavijo virtualno moštvo iz resničnih nogometašev Prve lige in zbirajo točke glede na njihove nastope na resničnih tekmah. Celoten krog igre poteka samodejno: izbira postave, zaklep ob roku, izračun točk in lestvica. Nihče ne rabi ročno seštevati točk in nihče ne more spreminjati postave po začetku kroga.

## Problem, ki ga rešitev naslavlja

Fantasy igre obstajajo za velike evropske lige, za Prvo ligo pa ne. Skupine prijateljev si zato pomagajo same, kar povzroča težave:

- **Ročno seštevanje točk.** Organizator po vsakem krogu v Excelu sešteva točke za vse udeležence. To je zamudno in polno napak, zato tekmovanje hitro zamre.
- **Spori glede rokov.** Ni jasno, ali je nekdo zamenjal igralca pred začetkom tekme ali po njem.
- **Ni pregleda.** Udeleženci ne vidijo sprotne lestvice ne statistike nogometašev, po kateri bi izbirali igralce.

## Ciljni uporabniki

| Uporabnik | Situacija | Kaj želi doseči |
|---|---|---|
| **Menedžer** | navijač, ki z znanci igra v zasebni ligi; postavo ureja med tednom | sestaviti moštvo, pred vsakim krogom izbrati postavo in kapetana, spremljati točke in lestvico lige |
| **Urednik statistike** | prostovoljec, ki dobro pozna ligo; po vsaki tekmi kroga | preveriti samodejno uvoženo statistiko nogometašev (minute, goli, asistence, kartoni), jo po potrebi popraviti in potrditi tekmo |
| **Administrator** | upravljavec aplikacije | pripraviti sezono (klubi, nogometaši, cene, razpored krogov) in upravljati uporabnike |

## Kratek opis delovanja

1. **Administrator** pred sezono vnese klube, nogometaše s pozicijami in cenami ter razpored krogov in tekem.
2. **Menedžer** v okviru proračuna 100 mio izbere 15 nogometašev (2 vratarja, 5 branilcev, 5 vezistov, 3 napadalce, največ 3 iz istega kluba). Ustvari zasebno ligo ali se s kodo povabila pridruži obstoječi.
3. Pred vsakim krogom menedžer izbere postavo: 11 začetnih igralcev v veljavni formaciji, kapetana in vrstni red klopi. Lahko opravi tudi prestope. Če ima v postavi poškodovanega igralca ali postave še ni shranil, 24 ur pred rokom prejme e-poštni opomnik.
4. Ob roku (1 ura pred prvo tekmo kroga) se postave zaklenejo. Sistem po tem zavrne vsako spremembo.
5. Med tekmo sistem vsakih 5 minut uvozi statistiko iz zunanjega API-ja in sproti posodobi točke. Po tekmi **urednik** statistiko preveri (in jo po potrebi popravi ali vnese ročno) ter potrdi tekmo. Sistem preveri, da se goli igralcev ujemajo z rezultatom.
6. Ko so potrjene vse tekme kroga, sistem obračuna krog: igralca, ki ni igral, zamenja igralec s klopi, kapetan dobi dvojne točke, odštejejo se kazni za dodatne prestope. Lestvice lig se posodobijo.

## Primer uporabe

Luka ustvari ligo »Nova prva liga« in kodo pošlje sošolcem. V četrtek pred 5. krogom vidi, da je njegov napadalec poškodovan, zato ga z brezplačnim prestopom zamenja z drugim napadalcem. Za kapetana izbere vezista Olimpije. V petek ob 19.00 se krog zaklene. Med vikendom Luka med tekmami sproti spremlja točke svojega moštva, urednik pa po vsaki tekmi potrdi statistiko. Lukov branilec ni igral, zato ga samodejno zamenja prvi igralec s klopi. Kapetan je dal gol in dobi dvojne točke. V ponedeljek Luka na lestvici lige »Nova prva liga« vidi, da je napredoval na 3. mesto.