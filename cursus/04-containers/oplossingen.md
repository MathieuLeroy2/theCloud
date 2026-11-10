# Oplossingen bij labo 4

Gebruik je eigen serveradres. Hier heet de VM `cloud-containers` en heeft ze `.120`. De hoofdmap voor het werk wordt `~/thecloud-iot`.

## H4.1 Docker installeren

**Op de nieuwe Ubuntu Server 24.04-VM:**

```bash
sudo apt update
sudo apt install docker.io docker-compose-v2
sudo systemctl enable --now docker
sudo docker version
sudo docker compose version
```

We gebruiken de Ubuntu-pakketten in deze leseditie, niet een mengeling met pakketten uit de aparte Docker-repository. De opleiding zet de benodigde pakketbron en versies vooraf klaar. Staat er al een andere Docker-installatie op de machine? Laat de docent die eerst controleren.

We blijven `sudo docker` gebruiken. Een gebruiker in de groep docker heeft ook uitgebreide rechten op de VM; dat is geen gewone onschuldige gebruikersgroep.

## H4.2 De eerste CLI-container

**Op cloud-containers:**

```bash
sudo docker run -d --name h4-cli-web --label thecloud_app=cli-web -p 127.0.0.1:8088:80 nginx:1.28.0
sudo docker ps
curl -I http://127.0.0.1:8088
sudo docker logs h4-cli-web
```

`-d` laat de container op de achtergrond draaien. `--name` geeft een herkenbare naam. `--label` voegt een herkenningsteken toe dat we later bij monitoring gebruiken. `-p` verbindt poort 8088 van de VM-loopback met poort 80 in de container. Je verwacht een HTTP-antwoord zoals 200.

Bekijk het image en sluit alleen deze proef af:

```bash
sudo docker stop h4-cli-web
sudo docker rm h4-cli-web
sudo docker image ls
```

De container is weg, het image blijft. Maak geen algemene opruimactie met `prune`: die kan werk van andere opdrachten verwijderen.

## H4.3 Mappen en accounts

**Op cloud-containers, als student:**

```bash
mkdir -p ~/thecloud-iot/mosquitto ~/thecloud-iot/homeassistant
cd ~/thecloud-iot
```

Plaats `compose.yaml` hier. Plaats `mosquitto.conf` en `acl` in de map `mosquitto`. De submapstructuur moet gelijk zijn aan die in het cursusvoorbeeld. Een bestand met een verkeerde naam kan anders als directory worden gemount.

Maak eerst de twee brokeraccounts met de officiële Mosquitto-tool:

```bash
sudo docker run --rm --user 0 --entrypoint mosquitto_passwd -v "$PWD/mosquitto:/mosquitto/config" eclipse-mosquitto:2.0.22 -b -c /mosquitto/config/passwords sensor Student123
sudo docker run --rm --user 0 --entrypoint mosquitto_passwd -v "$PWD/mosquitto:/mosquitto/config" eclipse-mosquitto:2.0.22 -b /mosquitto/config/passwords dashboard Student123
sudo chown 1883:1883 mosquitto/passwords
sudo chmod 640 mosquitto/passwords
```

De optie `-b` gebruikt het opgegeven labowachtwoord `Student123` voor beide accounts. Gebruik `-c` alleen de eerste keer: het maakt een nieuw bestand en zou anders het eerste account overschrijven. **UID** betekent *User ID*, het Linux-gebruikersnummer. **GID** betekent *Group ID*, het groepsnummer. De image gebruikt voor de Mosquitto-service UID/GID 1883. Het bestand moet voor die service leesbaar zijn. Zet geen `chmod 777`.

Controleer en start:

```bash
sudo docker compose config --quiet
sudo docker compose up -d
sudo docker compose ps
sudo docker compose logs --tail 30 mosquitto
```

`config --quiet` controleert de Compose-file. Bij een fout start je niet verder. In de brokerlogs verwacht je geen fout over het wachtwoordbestand of de ACL.

Draaide de broker al met andere wachtwoorden? Voer na het bijwerken `sudo docker compose restart mosquitto` uit, zodat hij `Student123` opnieuw inleest. Pas ook het opgeslagen MQTT-wachtwoord in Home Assistant aan naar `Student123`.

## H4.4 De tunnel en Home Assistant

**Op Xubuntu:**

```bash
ssh -L 18123:127.0.0.1:8123 -L 11883:127.0.0.1:1883 student@192.168.77.120
```

Gebruik `-i` als jouw VM alleen je SSH-sleutel accepteert. Houd dit venster open. De clientpoort 18123 gaat naar Home Assistant; 11883 gaat naar MQTT. Beide verbindingen lopen door SSH.

Open op **Xubuntu** `http://localhost:18123`. Wacht bij de eerste start tot Home Assistant klaar is. Maak je Home Assistant-account met wachtwoord `Student123`. Dit is niet hetzelfde account als de Mosquitto-gebruiker.

Bij **Settings > Devices & services > Add integration** kies je MQTT. Vul broker `mosquitto`, poort `1883`, gebruiker `dashboard` en wachtwoord `Student123` in. Deze verbinding komt van de Home Assistant-container en gebruikt het Compose-netwerk.

**Op cloud-containers:** maak een back-up van `homeassistant/configuration.yaml`. Voeg de inhoud van het sensorvoorbeeld toe. Bestaat al een hoofdsleutel `mqtt:`? Voeg de sensor daaronder in; maak geen tweede sleutel met dezelfde naam.

```bash
sudo cp homeassistant/configuration.yaml homeassistant/configuration.yaml.h4-backup
sudoedit homeassistant/configuration.yaml
sudo docker compose restart homeassistant
sudo docker compose logs --tail 40 homeassistant
```

De standaardconfiguratie die Home Assistant al schreef, blijft behouden. De sensor krijgt `unique_id: thecloud_voordeur`. Zoek de entiteit Voordeur bij de entiteiten en voeg haar aan een dashboard toe. De toestand wordt pas bekend na een passend MQTT-bericht.

## H4.5 Berichten en weigeringen

**Op Xubuntu, in een tweede terminal:**

```bash
sudo apt install mosquitto-clients
```

De tunnel moet openstaan. Gebruik voor sensor en dashboard telkens `Student123`. Alleen de eerste fouttest hieronder gebruikt bewust een ander wachtwoord.

```bash
mosquitto_pub -V mqttv5 -h 127.0.0.1 -p 11883 -u sensor -P Student123 -t iot/labo/deur -m OPEN -r -q 1
mosquitto_pub -V mqttv5 -h 127.0.0.1 -p 11883 -u sensor -P Student123 -t iot/labo/deur -m DICHT -r -q 1
```

`-r` bewaart het laatste bericht, `-q 1` vraagt bevestiging van de broker. In Home Assistant verwacht je eerst open en daarna gesloten. MQTT 5 kan een publicatie-afwijzing duidelijker terugmelden dan oudere protocolversies.

Test vervolgens:

```bash
mosquitto_pub -V mqttv5 -h 127.0.0.1 -p 11883 -u sensor -P bewust-fout -t iot/labo/deur -m OPEN -q 1
mosquitto_pub -V mqttv5 -h 127.0.0.1 -p 11883 -u sensor -P Student123 -t ander/topic -m TEST -q 1
mosquitto_pub -V mqttv5 -h 127.0.0.1 -p 11883 -u dashboard -P Student123 -t iot/labo/deur -m OPEN -q 1
```

Het eerste commando moet bij de aanmelding mislukken. Bij de andere twee zijn de credentials geldig, maar staat de ACL de publicatie niet toe. Controleer de foutmeldingen en de brokerlogs op de server. De deur blijft DICHT. Een client-exitcode alleen is niet bij elke MQTT-versie voldoende bewijs.

Met de dashboardgebruiker kun je de bewaarde toestand lezen:

```bash
mosquitto_sub -h 127.0.0.1 -p 11883 -u dashboard -P Student123 -t iot/labo/deur -C 1 -W 5
```

Je verwacht `DICHT`.

## H4.6 Containers opnieuw maken

**Op cloud-containers, vanuit `~/thecloud-iot`:**

```bash
sudo docker compose down
sudo docker compose up -d
sudo docker compose ps
```

Er staat nadrukkelijk geen `-v` bij down. Home Assistant leest de bind mount terug en Mosquitto leest zijn volume. Sluit Home Assistant niet af door de VM hard uit te zetten. Een normale stop geeft de broker de kans zijn bewaarde berichten naar disk te schrijven.

Open het dashboard opnieuw en lees eventueel met de subscriber het laatste bericht terug. De accounts en DICHT-toestand horen behouden te zijn.

Noteer de gebruikte images en digests:

```bash
sudo docker image inspect eclipse-mosquitto:2.0.22 --format '{{json .RepoDigests}}'
sudo docker image inspect ghcr.io/home-assistant/home-assistant:2026.11.1 --format '{{json .RepoDigests}}'
```

## H4.7 Antwoorden en fouten zoeken

1. Je downloadt het image. Docker maakt daaruit een container.
2. De configuratie staat in de map op de VM, buiten de container die opnieuw gemaakt wordt.
3. Home Assistant gebruikt `mosquitto:1883`. Xubuntu gebruikt zijn tunnel op `127.0.0.1:11883`.
4. Bij een fout wachtwoord kom je niet binnen. Met goede credentials kan een ACL je nog verbieden een bepaald topic te gebruiken.
5. Docker-publicaties kunnen UFW omzeilen. De loopbackbinding houdt de poort lokaal; SSH verzorgt de clientverbinding.

Geen dashboard? Controleer tunnel en containerlogs. Geen brokerverbinding? Gebruik in Home Assistant `mosquitto`, niet `localhost`. Wachtwoordfout? Controleer of de tweede accountaanmaak het bestand niet overschreef. Onbekende deur? Controleer topic, exacte hoofdletters in de payload en de YAML. Data weg? Controleer of je dezelfde werkmap en hetzelfde Compose-project gebruikt en of het volume niet is verwijderd.

Alles voor de beoordeling staat in één `verslag.md`. Configuratiebestanden blijven voor het draaien van de toepassing ook op de VM staan; je kopieert hun inhoud als tekst in het verslag.
