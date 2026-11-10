# Slides bekijken en publiceren

De theorie, opdrachten en oplossingen zijn gewone Markdown-bestanden. `slides.md` gebruikt Marp-frontmatter. Het gezamenlijke thema staat in `thema/the-cloud.css`. De bronbestanden blijven per hoofdstuk samen, ook wanneer een export centraal in `dist/` terechtkomt.

## Lokale bouwomgeving

Installeer een recente Node.js LTS-versie die de vastgelegde Marp CLI ondersteunt. Installeer daarna vanuit de repositoryroot:

```bash
npm ci
npm run check
npm run slides:build
```

Dit bouwt alle zes presentaties in `dist/slides`. Open bijvoorbeeld `dist/slides/01-hypervisors.html` in een browser. De HTML-export bevat het thema. Met `npm run slides:build -- 04` bouw je alleen hoofdstuk 4. `npm run slides:preview -- 04` opent dat hoofdstuk in de Marp-previewomgeving; zonder nummer start de preview bij hoofdstuk 1.

De `package-lock.json` legt de afhankelijkheden vast. Voer geen automatische update naar de nieuwste Marp-versie uit vlak vóór een les zonder de exports opnieuw te controleren.

## PDF

Een PDF-export vraagt naast Marp ook een ondersteunde browser op de bouwmachine:

```bash
npm run slides:pdf
```

Als Marp de browser niet vindt, geef je een lokaal geïnstalleerde browser expliciet op. Bijvoorbeeld:

```bash
npm run slides:pdf -- --browser firefox --browser-path /pad/naar/firefox
```

Bekijk de uiteindelijke pagina's: een geslaagde build sluit afgekapt materiaal of ontbrekende tekens niet uit. Geef een HTML-export mee als op een publicatiemachine geen PDF-renderer beschikbaar is.

## Bewerken in een editor

Met Marp for VS Code kun je de slides tijdens het schrijven bekijken. De repository bevat de verwijzing naar het eigen thema in `.vscode/settings.json`. In andere editors of CLI-omgevingen geef je het thema via `--theme-set` mee, zoals in de npm-scripts.

Gebruik korte slides en plaats toelichting in Marp-commentaren als sprekersnotities. De theorie bevat de volledige uitleg. Ondersteunende illustraties horen bij het hoofdstuk; bronverwijzingen bij een slide staan in de bijbehorende notities.

## Studentenpublicatie

### Taal van de cursus

Schrijf voor studenten die het onderwerp voor het eerst in de praktijk gebruiken. Hoofdstuk 1 is hiervoor in gewone taal herwerkt. Gebruik die aanpak ook bij volgende hoofdstukken:

- Begin met iets dat de student gaat maken of zien, bijvoorbeeld een website op de server openen vanaf Xubuntu.
- Leg één nieuw begrip tegelijk uit. Introduceer eerst de handeling of het voorbeeld en geef daarna de vakterm. Schrijf bij een nieuwe afkorting de volledige naam én wat die in ons labo doet. Alleen de Engelse naam uitschrijven is niet genoeg.
- Zet die uitleg zichtbaar op de slide waar het begrip binnenkomt, niet alleen in notities of de theorie. Gebruik bij namen zoals GG-Rood ook de uitleg van het voorvoegsel en geef aan dat het een naamafspraak is.
- Splits een slide als uitleg anders te veel tekst geeft. Verklein de letters niet om nog meer nieuwe woorden op één slide te zetten.
- Gebruik korte zinnen en vaste namen voor de machines. Vermijd opeenvolgende onbekende afkortingen.
- Zet bij commando's waar de student ze uitvoert, wat ze doen en welk resultaat verwacht wordt.
- Verdeel opdrachten in kleine stappen. Eindig een deel met een concrete controle, zoals ‘zie je de pagina in je browser?’.
- Vraag uitleg over de eigen opstelling en testresultaten. Gebruik die als vertrekpunt voor de algemene begrippen.

Behoud de juiste vaktermen en leerdoelen. Eenvoudige taal betekent niet dat we een technisch onjuist beeld geven of studenten kinderachtig aanspreken.

### Welke bestanden geef je mee?

Een student dient per labo of praktijktest precies één `verslag.md` in. Gebruik de instellingenrubriek van dat verslag in plaats van een aparte labkaart. Laat ook configuraties, HTML/CSS, queries en dashboard-JSON in codeblokken opnemen. Gebruik tekstuitvoer voor bewijs, zodat geen losse screenshots, exportbestanden of externe bijlagen nodig zijn. De werkbestanden op de VM blijven wel nodig voor de demonstratie.

Alle laboaccounts en SSH-wachtzinnen gebruiken `Student123`. Dit vaste labowachtwoord mag in de voorbeelden en het verslag staan. Private sleutels en gehashte wachtwoordbestanden blijven buiten het verslag. Alleen negatieve aanmeldtests gebruiken bewust een fout wachtwoord.

Publiceer de benodigde theorie, opdrachten, slides en startbestanden. Bepaal per onderwijsfase of modeloplossingen beschikbaar zijn. Alleen een bestand weglaten uit een website verbergt het niet voor iemand met toegang tot de Git-repository en haar geschiedenis.

Neem `base/`, `node_modules/` en lokale testuitvoer niet op in een studentenexport. Bewaar bij een cursusrelease de gebruikte versies en validatiestatus uit [versies.md](versies.md).

## Bronnen

- [Marp CLI](https://github.com/marp-team/marp-cli)
- [Marpit-thema's](https://marpit.marp.app/theme-css)
