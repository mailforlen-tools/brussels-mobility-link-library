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
