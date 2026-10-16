# Opdracht voor de cloudsessie: Brussels Mobility Link Library

Status: klaar om te starten. Punten met AANNAME zijn niet gecontroleerd.

## Doel
Maak van de bestaande lokale linkbibliotheek (Express-app, nu 1 demolink) een publieke, statische website
met een gecureerde lijst van mobiliteitsdatabronnen voor Brussel, België en Europa, en een kader dat
andere (kleinere) steden kunnen hergebruiken (basis voor het latere "unified ITS package").

## Wat er al is
- `server.js` + `public/index.html`: werkende app met secties/subsecties, linkcontrole (HEAD), notities per link, zoeken.
- `data/links.json`: structuur met 5 secties (Europe, Federal, Brussels, Vlaanderen, Wallonia), bijna leeg.
- README beschrijft de functies en de "future ideas" (Diigo-CSV-import, archivering, HTML-bladwijzers exporteren).

## Te bouwen (voorstel, AANNAME dat dit de gewenste richting is)
1. **Statische versie**: `public/` werkt zonder server en leest `data/links.json` (geen Express nodig voor lezen). Publicatie via GitHub Pages. Lokale bewerking mag via `server.js` blijven bestaan.
2. **GitHub Action** (gratis, geen Claude): wekelijks alle links controleren, `status` en `lastChecked` bijwerken in `links.json` en committen; bij een dode link een issue openen.
3. **Startinhoud**: vul de secties met publieke, officiële bronnen (open-dataportalen, GTFS/GBFS-feeds, statistiek, verkeers- en OV-data van Brussel, Vlaanderen, Wallonië, federaal, EU). Elke link: titel, korte beschrijving, type (portaal, API, bestand), formaat, licentie indien gekend, en wat nog niet gecontroleerd is als AANNAME.
4. **Hergebruik door andere steden**: configuratiebestand voor titel en secties, zodat een stad de lijst kan forken en aanpassen.
5. **Export**: HTML-bladwijzerbestand en CSV genereren uit `links.json`.
6. **Taal**: interface en beschrijvingen in NL, FR en EN, met een taalkeuze op de site en vertalingen per link in `links.json`. Een link zonder vertaling toont de Engelse tekst.

## Niet doen
- Geen backend of database toevoegen.
- Geen persoonlijke bladwijzers of niet-publieke bronnen opnemen.
- Geen ANPR-, camera- of verkeerstellingdata in deze repo.

## Opleveren
Een pull request met: werkende statische site, de Action, een bijgewerkte README (lokaal starten, publiceren, workflow aan- en uitzetten), en een korte lijst van wat niet getest kon worden.

## Beslist door Len (2026-10-10)
- Repo is publiek, naam `brussels-mobility-link-library`.
- Meertalig vanaf het begin: NL, FR en EN (interface en beschrijving per link in drie talen).
- Startinhoud: samengesteld door Claude uit eigen kennis, met AANNAME-label per link tot die gecontroleerd is (de Action controleert enkel of de link bereikbaar is, niet of de beschrijving klopt).

## Voortgang (2026-10-10, lokale sessie) — bouw hierop verder, begin niet opnieuw
Reeds gedaan en gepusht naar `main`:
- Startinhoud: 73 links (wegmobiliteit en parkeren; EU, federaal, Brussel, Vlaanderen, Wallonië, sector, studies), elk met titel en beschrijving in NL, FR en EN. Alle links staan op `"verified": false` (= AANNAME). Op 2026-10-04 is enkel de bereikbaarheid getest; 6 sites blokkeren automatische controle (403) of hadden een certificaatfout.
- Punt 1 (statische site): `public/index.html` leest `data/links.json` zonder server en is dan alleen-lezen. Met `server.js` blijft bewerken mogelijk.
- Punt 2 (Action): `.github/workflows/site.yml`, wekelijks woensdag 06:00 UTC, update status en datum, issue bij dode links, publiceert Pages.
- Punt 4: `public/config.json` (titel, ondertitel, taal).
- Punt 5: `scripts/export.js` (bookmarks.html + links.csv), `scripts/build.js` bouwt `_site/`.
- Punt 6: interface en links in NL/FR/EN met taalknop; vertalingen per link in `links.json`.
- Synchronisatie: de lokale kopie van Len haalt elke donderdag `main` binnen (git pull --rebase), voert zijn eigen paginacontrole uit en pusht wijzigingen terug. Werk dus altijd op een kleine, snelle commit en rebase op `main` voor je pusht.

Nog te doen (voor de cloudsessie):
1. Per link velden `type` (portaal, API, bestand, organisatie, studie), `format` en `license` toevoegen waar gekend; anders leeg laten.
2. Beschrijvingen controleren tegen de site en `verified` op `true` zetten waar het klopt; fouten verbeteren in alle drie de talen.
3. Zes links die niet automatisch bereikbaar zijn nakijken (ITF/OECD x2, UNECE, INRIX, TomTom, ETF-feed).
4. Het lege onderdeel "STIB / MIVB" (openbaar vervoer) is niet ingevuld: Len wil in deze bibliotheek wegvervoer (auto's, logistiek, parkeren), geen fiets, step of MaaS. Vraag Len of openbaar vervoer erbij hoort voor je het invult.
5. Bronnen toevoegen die nu ontbreken: open-dataportalen en feeds met echte datasets (DATEX II, NAP Belgium, Vlaamse en Waalse verkeersdata), naburige landen.
6. De Action en GitHub Pages in de cloud echt testen (workflow starten, Pages-instelling controleren).

Niet getest door de lokale sessie: de GitHub Action zelf, de Pages-publicatie, en de import van `bookmarks.html` in een browser.

## Voortgang 2026-10-16 (lokale sessie)
Gedaan:
- Elke link is tegen de site zelf nagekeken (titel en beschrijving van de pagina, 2026-10-16). 48 van de 73 staan nu op `verified: true` met `verifiedOn`; de rest blijft AANNAME omdat de site te weinig zegt of niet te laden was.
- Gecorrigeerd: Open Data Brussels (opendata.brussels.be) is het portaal van de Stad Brussel, niet van het gewest; ETRMA heet nu Tyres Europe; beschrijvingen van Touring en VAB aangepast. Alles in NL/FR/EN.
- Veld `type` toegevoegd aan alle links (door Claude toegekend op basis van wat de pagina is) en zichtbaar op de site in 3 talen.
- Niet te controleren: ITF/OECD (2 links) en UNECE blokkeren elke automatische en ook de browsercontrole met een bot-controle; EUR-Lex, EUCAR en Trafiroutes tonen zonder JavaScript geen tekst. CEDR: het certificaat werd door de controle als verlopen gemeld, maar de site laadt gewoon in de browser.
- `format` en `license` blijven leeg: op de voorpagina's staat dat niet betrouwbaar.

Nog te doen:
1. Per dataportaal en dataset de pagina's lezen en `format` en `license` invullen.
2. De overige 25 links met `verified: false` nalezen (zie lijst via `data/links.json`).
3. Vraag aan Len: openbaar vervoer (STIB/MIVB, leeg onderdeel) erbij of niet.
4. Meer bronnen (DATEX II, NAP Belgium, Vlaamse en Waalse verkeersdata, buurlanden).
