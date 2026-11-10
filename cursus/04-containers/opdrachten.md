# Labo 4 Een fictieve deur in Home Assistant

Je installeert Docker op een Ubuntu-VM. Je laat Home Assistant en Mosquitto samenwerken en test ook wat een gebruiker niet mag. Reken op vier uur. Gebruik alleen [verslag.md](bestanden/verslag-sjabloon.md) voor je in te dienen werk.

## H4.1 Je container-VM

Maak `cloud-containers` met als voorbeeld `192.168.77.120/24`, 2 vCPU, 4 GB RAM en 40 GB schijf. Gebruik een nieuw exemplaar van het Ubuntu-template uit H3. Bewaar de andere VM's, maar sluit af wat je nu niet gebruikt.

Controleer SSH en updates. Installeer Docker Engine met de Compose-plugin via de gekozen Ubuntu-pakketten zoals in de oplossing. Noteer de versies.

**Klaar als:** `docker version` en `docker compose version` werken.

## H4.2 Eerst één container met de CLI

Start een kleine NGINX-container met `docker run`, alleen bereikbaar op `127.0.0.1:8088` van de server. Test met `curl` op die server. Bekijk de container met `docker ps` en de logs. Stop en verwijder alleen die oefencontainer. Noteer wat image, container en poort betekenen.

**Klaar als:** je dezelfde container kunt starten en weet dat het image daarna nog aanwezig is.

## H4.3 Mosquitto beveiligen

Zet de [Compose-file](bestanden/compose.yaml), [brokerinstellingen](bestanden/mosquitto/mosquitto.conf) en [ACL](bestanden/mosquitto/acl) op de VM in één werkmap. Maak de accounts `sensor` en `dashboard` met eigen wachtwoorden. Controleer de leesrechten van het gehashte wachtwoordbestand. Anonieme toegang staat uit.

**Klaar als:** de broker start en verkeerde credentials worden geweigerd.

## H4.4 Home Assistant verbinden

Start beide diensten met Compose. Maak vanaf Xubuntu een SSH-tunnel naar de twee loopbackpoorten. Open Home Assistant en maak je beheeraccount.

Voeg de MQTT-integratie toe met broker `mosquitto`, poort 1883 en gebruiker `dashboard`. Voeg [de sensorconfiguratie](bestanden/homeassistant-mqtt.yaml.example) aan het bestaande configuratiebestand toe en maak de deur zichtbaar op een dashboard.

**Klaar als:** Home Assistant de broker bereikt en de deur verschijnt. Vóór het eerste bericht kan de toestand nog onbekend zijn.

## H4.5 Open, dicht en verboden

Publiceer vanaf Xubuntu als `sensor` het behouden bericht `OPEN` en daarna `DICHT` op `iot/labo/deur`. Test drie fouten apart: verkeerde credentials, publiceren door sensor op `ander/topic`, en publiceren door dashboard op het deurtopic. Toon bij iedere fout dat de beschermde toestand niet wijzigt. Gebruik MQTT 5 en de brokerlogs om de weigering te controleren.

**Klaar als:** correcte berichten de deur veranderen en de drie verboden acties geen effect hebben.

## H4.6 Opnieuw maken zonder verlies

Laat de deur op DICHT staan met retain. Stop de stack met `docker compose down` en maak haar opnieuw met `up -d`. Gebruik niet `down -v`. Test het account, dashboard en de laatste deurtoestand opnieuw.

**Klaar als:** de bewaarde instellingen en data terugkomen na het opnieuw maken van de containers.

## H4.7 Uitleg en indienen

Beantwoord de vijf theorievragen. Neem in je enige verslag de Compose-file, brokerconfiguratie, ACL, sensor-YAML, commando's en testuitvoer op. Wachtwoorden en het gehashte wachtwoordbestand neem je niet over. Noteer alleen hoe je dat bestand gemaakt en beschermd hebt.

KMI en een echte telefoonclient zijn extra: alleen doen als de docent de benodigde toegang en actuele integratie bevestigt. De kernopdracht moet zonder externe weerdata werken.

| Onderdeel | Punten |
| --- | --- |
| H4.1 VM en Docker | 2 |
| H4.2 CLI-container begrijpen en testen | 2 |
| H4.3 Broker, accounts en ACL | 4 |
| H4.4 Home Assistant en MQTT | 4 |
| H4.5 Positieve en negatieve tests | 4 |
| H4.6 Bewaarde data | 2 |
| H4.7 Uitleg en één verslag | 2 |
| **Totaal** | **20** |
