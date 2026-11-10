# Praktijktest B Een kleine MQTT-dienst

**Tijd: drie uur.** Gebruik de voorbereide Ubuntu-container-VM uit H4/H5 en cloud-web met Node Exporter uit H1/H5. Je levert één `verslag.md` in. De docent geeft je een korte herkenningscode voor je testbericht.

## H6.1 Plan

Noteer VM's, adressen, poorten, Docker-image en gegevensopslag. Gebruik de nieuwe containernaam `praktijk-mqtt` en label `thecloud_app=praktijk`. Laat de bestaande containers van H4/H5 intact.

## H6.2 De toepassing

Maak een nieuwe broker met de afgesproken Mosquitto-image via **docker run**, niet Compose. Gebruik een eigen configuratiemap en een apart gegevensvolume. Maak accounts `sensor` en `dashboard` met eigen wachtwoorden, zonder anonieme toegang.

Sensor mag schrijven op `iot/labo/#`, dashboard mag daar alleen lezen. Gebruik als payload bijvoorbeeld `OPEN-<jouw-code>`. Kies als hostpoort `127.0.0.1:1884`, zodat de H4-broker op 1883 blijft werken.

Maak vanaf Xubuntu een SSH-tunnel naar die loopbackpoort. Publiceer een retained bericht en lees het met de andere gebruiker. Toon ook dat een fout wachtwoord en een verboden publicatie niet werken.

## H6.3 Gegevens bewaren

Stop en verwijder alleen je toetscontainer. Maak hem opnieuw met dezelfde configuratie en hetzelfde gegevensvolume. Lees het laatste bericht terug zonder opnieuw te publiceren. Je code moet behouden zijn.

## H6.4 Vijf panelen

Maak in je eigen Grafana-dashboard:

- RAM van de toetscontainer in MiB.
- CPU van de toetscontainer als procent van één kern.
- Ontvangen netwerkverkeer van die container in bytes per seconde.
- Vrije ruimte van de rootpartitie op cloud-web in GiB.
- CPU-gebruik van cloud-web in procent.

Gebruik het label `praktijk`, niet de H4-broker. Genereer MQTT-verkeer. Kleine waarden op een rustige broker zijn mogelijk; leg ze uit.

## H6.5 Alert en fout zoeken

Maak een eigen Prometheus-alert voor geheugen van de toetscontainer. Test met een drempel onder de gemeten waarde en toon firing en herstel. Zet daarna de afgesproken normale drempel terug.

De docent brengt één kleine fout aan in je toetsopstelling, bijvoorbeeld een verkeerde lokale tunnelpoort of gestopte broker. Onderzoek en herstel de fout zonder algemene firewall- of netwerkbeveiliging uit te zetten.

## H6.6 Indienen

Neem alles op in één `verslag.md`: instellingen, docker-runopdracht, brokerconfiguratie, ACL, commando's om accounts te maken zonder hun geheimen, testresultaten, vijf queries, dashboard-JSON, alert-YAML en foutonderzoek. Neem het echte wachtwoordbestand niet over. Toon de werking kort aan de docent. Zie de [beoordeling](beoordeling.md).
