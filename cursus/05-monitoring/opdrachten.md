# Labo 5 Machines en diensten opvolgen

Je bouwt een eigen dashboard en test twee waarschuwingen. Reken op vijf uur met voorbereide startbestanden. Gebruik één [verslag.md](bestanden/verslag-sjabloon.md).

## H5.1 Wat ga je volgen?

Gebruik `cloud-web` uit H1, RoodkapjesHuis uit H2 en `cloud-containers` uit H4. Zet de nodige machines aan. Plan het RAM samen met de docent; de oude 8 GB Proxmox-VM volstaat niet om alles tegelijk te draaien.

De monitoringcontainers draaien op `cloud-containers`. Ze kunnen zo ook de containers van H4 volgen. Noteer alle adressen, versies en de route van Prometheus naar de exporters in je verslag.

**Klaar als:** SSH werkt, de website bereikbaar is vanaf de container-VM en je Windows-client beschikbaar is.

## H5.2 Exporters toevoegen

Een **exporter** is een programma dat meetgegevens aanbiedt aan Prometheus. Installeer Node Exporter op cloud-web en windows_exporter op de Windows-client. Laat de meetpoorten alleen toe vanaf cloud-containers. Test de `/metrics`-pagina's vanaf die machine. Noteer één voorbeeldwaarde per exporter.

**Klaar als:** de monitoringmachine beide exporters kan bereiken en de firewall niet onnodig breed openstaat.

## H5.3 Je monitoringstack starten

Kopieer de [startbestanden](bestanden/compose.yaml) met hun submappen naar `~/thecloud-monitoring` op cloud-containers. Pas de targetadressen in `prometheus.yml` aan. Maak het Grafana-beheerwachtwoordbestand met `Student123`, zoals in de oplossing.

Controleer de YAML en Prometheus-configuratie en start de stack. Open Grafana en Prometheus via een SSH-tunnel. Bekijk de **targets**: de meetpunten waarvan Prometheus de gegevens moet ophalen.

**Klaar als:** de targets die je gebruikt op UP staan en Grafana Prometheus als databron heeft.

## H5.4 Zelf een dashboard maken

Maak minstens deze acht panelen, met de queries uit de oplossing als vertrekpunt:

1. Beschikbaar Linux-geheugen, gauge in GiB.
2. Gebruikt Windows-geheugen, gauge in GiB.
3. Gebruikte C-schijf, stat in procent.
4. Status van de website, 0 of 1 duidelijk vertaald naar fout of goed.
5. Linux-CPU, grafiek in procent.
6. Geheugen van de Mosquitto-container, in MiB.
7. CPU van de Mosquitto-container, in procent van één kern.
8. Ontvangen netwerkverkeer van de Mosquitto-container, bytes per seconde.

**Klaar als:** je de juiste machines volgt en bij elk paneel eenheid en betekenis kunt uitleggen. Wacht voor rate-grafieken minstens twee minuten op genoeg samples.

## H5.5 Twee alerts testen

Stop NGINX op cloud-web. Kijk naar de webmeting en de webalert. Start NGINX terug en wacht tot de alert herstelt.

Test ook de schijfalert door de drempel tijdelijk lager te zetten dan het huidige gebruik. Vul de echte schijf niet. Na de test zet je de drempel terug op 75 procent. Controleer opnieuw de configuratie.

**Klaar als:** je bij beide proeven de gemeten waarde, wachttijd, firing en herstel hebt genoteerd.

## H5.6 Bewaren en indienen

Sla je dashboard op. Exporteer het dashboard als **JSON** (*JavaScript Object Notation*, een tekstformaat voor de beschrijving van je panelen) en plak die JSON in je enige verslag, samen met queries, aangepaste YAML en testuitvoer. Het vaste labowachtwoord mag in voorbeelden staan. Neem geen private sleutels of persoonlijke geheimen op. De Grafana-export is dus geen aparte bijlage.

Beantwoord de vijf theorievragen. Laat het dashboard ook aan de docent zien. Apache/MariaDB-monitoring staat als extra oefening in [de uitbreiding](uitbreiding-web-database.md).

| Onderdeel | Punten |
| --- | --- |
| H5.1 Plan | 2 |
| H5.2 Linux en Windows exporteren | 3 |
| H5.3 Stack en targets | 3 |
| H5.4 Acht begrijpelijke panelen | 6 |
| H5.5 Twee alerts en herstel | 4 |
| H5.6 Uitleg en één verslag | 2 |
| **Totaal** | **20** |
