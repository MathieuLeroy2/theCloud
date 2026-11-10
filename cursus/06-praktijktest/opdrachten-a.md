# Praktijktest A Een website in een container

**Tijd: drie uur.** Gebruik de voorbereide Ubuntu-container-VM uit H4/H5 en cloud-web met Node Exporter uit H1/H5. Je levert één `verslag.md` in. De docent geeft je een eigen korte herkenningscode.

## H6.1 Plan

Noteer in je verslag de VM's, adressen, poorten, Docker-image en map voor de website. Gebruik een nieuwe containernaam `praktijk-web` en label `thecloud_app=praktijk`. Je laat de bestaande labo's intact.

## H6.2 De toepassing

Maak een kleine eigen pagina met aparte CSS. De pagina toont je herkenningscode en beschrijft kort een IoT-project. Start haar via **docker run**, niet Compose, met de afgesproken NGINX-image.

De serverpoort is alleen op loopback bereikbaar, bijvoorbeeld `127.0.0.1:8088`. Zet de HTML en CSS via een bind mount buiten de container en gebruik een herstartbeleid. Open de website vanaf Xubuntu via een SSH-tunnel. Test HTML én CSS met curl.

## H6.3 Gegevens bewaren

Stop en verwijder alleen je nieuwe toetscontainer. Maak hem opnieuw met dezelfde gegevensmap. Toon dat de pagina en herkenningscode terugkomen. De oorspronkelijke containers van H4/H5 blijven bewaard.

## H6.4 Vijf panelen

Maak in je eigen Grafana-dashboard:

- RAM van de toetscontainer in MiB.
- CPU van de toetscontainer als procent van één kern.
- Ontvangen netwerkverkeer van die container in bytes per seconde.
- Vrije ruimte van de rootpartitie op cloud-web in GiB.
- CPU-gebruik van cloud-web in procent.

Gebruik het label `praktijk`, niet de metingen van Mosquitto. Genereer enkele webvragen en leg het resultaat uit. Een rustige container mag kleine waarden hebben.

## H6.5 Alert en fout zoeken

Maak een eigen Prometheus-alert voor geheugengebruik van je toetscontainer. Test hem door de drempel kort onder de gemeten waarde te zetten. Laat firing en herstel zien. Zet daarna een afgesproken normale drempel terug.

De docent geeft bovendien één kleine fout in je toetsopstelling, bijvoorbeeld een gestopte container of een fout CSS-pad. Zoek die met gerichte tests en herstel haar. Je mag geen andere student of gedeelde dienst verstoren.

## H6.6 Indienen

Neem in één `verslag.md` op: instellingen, HTML, CSS, volledige docker-runopdracht, testuitvoer, vijf queries, dashboard-JSON, alert-YAML en je foutonderzoek. Gebruik `Student123` waar een wachtwoord nodig is. Geen private sleutels of losse bijlagen. Toon de werking kort aan de docent. De [beoordeling](beoordeling.md) geldt voor beide varianten.
