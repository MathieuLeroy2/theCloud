# Hoofdstuk 1 Virtuele machines met Proxmox

**Vast labowachtwoord:** gebruik voor alle accounts in dit hoofdstuk `Student123`. Gebruik dezelfde waarde voor herstelwachtwoorden en SSH-wachtzinnen. Alleen bij een test die bewust moet mislukken vul je een fout wachtwoord in.


In dit hoofdstuk maak je twee virtuele computers. Op de eerste zet je een website. Op de tweede open je die website in een browser. Je gebruikt daarvoor Proxmox: software waarmee je virtuele computers maakt en beheert.

Daarna maak je de website even onbereikbaar. Je zoekt uit wat er misloopt en zet alles weer recht. Je oefent ook hoe je een vorige versie van je machine terugzet.

Je houdt beide machines bij. We gebruiken ze opnieuw in de volgende hoofdstukken.

## Wat leer je?

Na dit hoofdstuk kun je:

1. Uitleggen wat een virtuele machine is en wat een hypervisor doet.
2. Proxmox installeren en de beheerpagina openen.
3. Twee virtuele machines maken en er Linux op installeren.
4. De machines een vast IP-adres geven en hun verbinding testen.
5. Een eigen website op de server zetten en vanuit de andere machine openen.
6. Een fout zoeken en een machine herstellen met een snapshot of back-up.

Je leert ook het verschil tussen een hypervisor van type I en type II. We leggen die woorden uit met de computers die je zelf gebruikt.

## Waar begin je?

1. Lees de [theorie](theorie.md). Daar staat wat je gaat bouwen en waarom.
2. Volg de [opdrachten](opdrachten.md) tijdens het labo.
3. Vul je [verslag](bestanden/verslag-sjabloon.md) aan terwijl je werkt. Je dient alleen dit ene Markdown-bestand in.
4. Zit je vast? Vergelijk je stappen met de [oplossingen](oplossingen.md).

De [slides](slides.md) ondersteunen de uitleg in de les.

## Wat heb je nodig?

De docent vertelt of je op je eigen laptop werkt of op een omgeving van de opleiding. De [startgids](../00-start/README.md) beschrijft de voorbereiding. Voorzie ongeveer 4,5 uur voor het labo. De installatiebestanden staan vooraf klaar.

In de voorbeelden heeft de server het adres `192.168.77.100`. Dat adres kan bij jou anders zijn. Op je verslag schrijf je samen met de docent op welke adressen jij gebruikt.

Je krijgt ook een [voorbeeldwebsite](bestanden/website/index.html) met [CSS](bestanden/website/style.css) en een [voorbeeld van de netwerkinstellingen](bestanden/01-lab-server.yaml.example). Pas die bestanden aan waar de opdracht dat vraagt.

Deze eerste versie moet nog volledig worden uitgeprobeerd op de computers van de opleiding.
