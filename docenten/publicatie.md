# Slides bekijken en publiceren

De theorie, opdrachten en oplossingen zijn gewone Markdown-bestanden. `slides.md` gebruikt Marp-frontmatter. Het gezamenlijke thema staat in `thema/the-cloud.css`. De bronbestanden blijven per hoofdstuk samen, ook wanneer een export centraal in `dist/` terechtkomt.

## Lokale bouwomgeving

Installeer een recente Node.js LTS-versie die de vastgelegde Marp CLI ondersteunt. Installeer daarna vanuit de repositoryroot:

```bash
npm ci
npm run check
npm run slides:build
```

Open `dist/slides/01-hypervisors.html` in een browser. De HTML-export bevat het thema en kan als presentatie worden gebruikt. `npm run slides:preview` opent de bron in de Marp-previewomgeving.

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

Publiceer de benodigde theorie, opdrachten, slides en startbestanden. Bepaal per onderwijsfase of modeloplossingen beschikbaar zijn. Alleen een bestand weglaten uit een website verbergt het niet voor iemand met toegang tot de Git-repository en haar geschiedenis.

Neem `base/`, `node_modules/` en lokale testuitvoer niet op in een studentenexport. Bewaar bij een cursusrelease de gebruikte versies en validatiestatus uit [versies.md](versies.md).

## Bronnen

- [Marp CLI](https://github.com/marp-team/marp-cli)
- [Marpit-thema's](https://marpit.marp.app/theme-css)
