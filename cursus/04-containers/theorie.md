# Twee programma's in containers

Je wilt berichten van een sensor op een scherm tonen. Daarvoor gebruiken we **MQTT**, de naam van een protocol voor korte berichten. Een **broker** is het programma dat de berichten ontvangt en doorgeeft. Een **dashboard** is het scherm waarop je de toestand bekijkt. Dat kan rechtstreeks op Ubuntu, zoals NGINX in hoofdstuk 1. Maar programma's hebben soms andere bibliotheken, versies en bestanden nodig. Containers helpen om de onderdelen van één toepassing bij elkaar te houden.

Vandaag laat je een fictieve deur open en dicht gaan. Je verstuurt een bericht en ziet de toestand in Home Assistant veranderen. Er is geen echte deursensor nodig.

## 1. Een image en een container

Een **image** is een pakket met een programma en wat het nodig heeft om te draaien. Je downloadt het bijvoorbeeld uit een **containerregister**: een online verzameling van images. **Docker Hub** is zo’n register. **GHCR** betekent *GitHub Container Registry*: het containerregister van GitHub. Je ziet bijvoorbeeld `ghcr.io` vooraan in een imagenaam.

Een **container** is een draaiende of gestopte uitvoering van zo'n image. Denk aan een installatiepakket en het programma dat je ermee start: de twee horen bij elkaar, maar zijn niet hetzelfde.

Van één image kun je meerdere containers starten. Elke container heeft zijn eigen instellingen en tijdelijke bestanden.

## 2. Het verschil met een VM

Een **VM** (*Virtual Machine*) is een virtuele computer. Haar **OS** (*Operating System*) is haar besturingssysteem, bijvoorbeeld Ubuntu. De **kernel** is het centrale deel van dat systeem dat processor, geheugen en apparaten regelt. Een VM heeft haar eigen kernel. Een container deelt de kernel van de computer waarop de containerengine draait. Een container is dus geen kleine hypervisor.

In ons labo is de volgorde:

```mermaid
flowchart TB
  pve[Proxmox] --> ubuntu[Ubuntu Server-VM]
  ubuntu --> docker[Docker Engine]
  docker --> mqtt[Mosquitto-container]
  docker --> ha[Home Assistant-container]
```

We installeren Docker in een gewone Ubuntu-VM, niet rechtstreeks op Proxmox en niet in een **LXC**-container. LXC betekent *Linux Containers* en is een andere manier om Linux-omgevingen te maken. Je hoeft die voor deze opdracht niet in te stellen. Zo blijven de stappen voor iedereen gelijk.

**Docker Engine** start en beheert de containers. Het commando `docker` praat met die engine. We gebruiken `sudo docker`, omdat toegang tot de Docker-engine veel rechten geeft op deze VM.

## 3. Wat blijft bewaard?

Verwijder je een container, dan verdwijnt zijn **schrijflaag**: de bestanden die alleen binnen die container zijn toegevoegd of gewijzigd. Daarom zet je belangrijke data erbuiten.

- Een **bind mount** maakt een map op de VM zichtbaar in de container. Onze Home Assistant-configuratie staat zo in `./homeassistant`.
- Een **volume** is opslag die Docker apart beheert. Mosquitto bewaart daarin onder meer de laatste berichten.

`docker compose down` verwijdert de containers en het bijbehorende netwerk. De genoemde volumes blijven staan. `down -v` verwijdert ook die volumes. Gebruik die laatste optie hier dus niet.

Een herstart en het opnieuw maken van een container zijn verschillende tests. Je oefent beide.

## 4. Poorten binnen en buiten de container

Mosquitto luistert **in** de container op poort 1883. Met `ports` verbind je een poort op de VM met die containerpoort.

Ons voorbeeld `127.0.0.1:1883:1883` betekent: alleen via het **loopbackadres** `127.0.0.1` van de VM is die poort bereikbaar. Loopback betekent hier ‘dezelfde computer’: dat verkeer verlaat de VM niet naar een andere machine. Niet rechtstreeks vanaf elke machine op het netwerk.

**SSH** betekent *Secure Shell*, de beveiligde verbinding voor werken op afstand. Vanaf Xubuntu maken we daarmee een **SSH-tunnel**: we sturen verkeer van één poort door die verbinding naar een andere poort op de server. Daarmee stuur je een lokale poort op Xubuntu veilig door naar de VM. Je gebruikt bijvoorbeeld op Xubuntu poort 11883 en bereikt daarmee Mosquitto op de server.

Docker-poorten kunnen gewone **UFW**-regels (*Uncomplicated Firewall*, de firewalltool op Ubuntu) omzeilen. Daarom vertrouwen we hier niet op alleen UFW om een gepubliceerde containerpoort af te schermen. We binden de poorten aan loopback en gebruiken SSH. Voor toegang vanaf een telefoon kan de opleiding later een passende **VPN** (*Virtual Private Network*, beveiligde verbinding naar het lab) of een tussenliggende server voorzien. Zo’n tussenliggende server heet een **proxy**.

## 5. Waarom Compose?

Met `docker run` beschrijf je één container in een commando. Dit is werken via de **CLI** (*Command Line Interface*): je typt opdrachten in plaats van op knoppen te klikken. Dat is nuttig om te leren wat de opties doen.

Bij meerdere programma's wordt zo'n reeks commando's snel onoverzichtelijk. **Docker Compose** leest een bestand `compose.yaml`. De extensie `.yaml` verwijst naar **YAML**, een tekstformaat voor instellingen. Het gebruikt onder andere inspringen met spaties om te tonen wat bij elkaar hoort. In dit bestand staan images, poorten, mappen en opstartinstellingen samen.

In één Compose-project kunnen containers elkaar via hun servicenaam vinden. Home Assistant gebruikt daarom `mosquitto` als brokeradres. Het hoeft het tijdelijke container-IP niet te kennen.

Die naam geldt **binnen** het containernetwerk. Op Xubuntu gebruik je de SSH-tunnel, niet zomaar het adres `mosquitto`.

## 6. MQTT met een deur als voorbeeld

MQTT werkt met berichten. Een **broker** ontvangt ze en geeft ze door aan geabonneerde clients.

Een bericht heeft een **topic**, bijvoorbeeld `iot/labo/deur`, en een inhoud of **payload**, bijvoorbeeld `OPEN`.

- De sensorclient **publiceert** `OPEN` of `DICHT`.
- Home Assistant **abonneert** zich op het topic en toont de toestand.

Met **retain** bewaart de broker het laatste bericht voor nieuwe abonnees. Home Assistant kan daardoor na een herstart meteen zien wat de laatste bekende deurtoestand was. Zonder nieuw bericht weet je daarmee niet of een echte sensor nog online is. Een beschikbaarheidstopic is een mogelijke uitbreiding.

We maken twee accounts, allebei met wachtwoord `Student123`. `sensor` mag alleen in `iot/labo/#` schrijven. `dashboard` mag die berichten lezen. **ACL** betekent *Access Control List*: een lijst met toegangsregels. Onze ACL legt vast welk account welk topic mag lezen of beschrijven. Een correct wachtwoord geeft dus nog niet automatisch toegang tot elk topic.

In dit labo gaat MQTT via een SSH-tunnel. Voor rechtstreeks gebruik over een onvertrouwd netwerk heb je bijvoorbeeld MQTT met **TLS** (*Transport Layer Security*, versleuteling van de verbinding) of een beschermde VPN-route nodig.

## 7. Home Assistant Container

We gebruiken de officiële Home Assistant Container-image. Dat is niet hetzelfde als Home Assistant OS, het eigen besturingssysteem van Home Assistant. Dat kan extra toepassingen beheren, **apps** genoemd; vroeger heetten die *add-ons*. Daarom installeren we Mosquitto als een aparte container.

Onze fictieve deur ontvangt alleen MQTT-berichten. We hoeven geen fysieke sensor op de VM aan te sluiten. Daarom voegen we geen extra apparaatdoorgifte toe en geven we de container geen **privileged**-modus: die zou zeer ruime rechten op de host geven. Het gewone Compose-netwerk volstaat.

Een **binary sensor** heeft twee toestanden. Met `payload_on: OPEN` en `payload_off: DICHT` vertel je hoe onze berichten moeten worden gelezen.

## 8. Versies en updates

Een **tag** is een versie-etiket, bijvoorbeeld `2.0.22` achter de dubbele punt in `eclipse-mosquitto:2.0.22`. We gebruiken concrete tags in plaats van `latest`, dat naar de laatst aangeboden versie kan verwijzen.

Een **digest** is een berekende code van de image-inhoud. Verandert de inhoud, dan verandert ook die code. Zo kun je preciezer vastleggen wat je hebt opgehaald.

Een **label** is nog iets anders: een zelfgekozen naam met een waarde op je container, bijvoorbeeld `thecloud_app=broker`. In H5 gebruiken we dat als herkenningsteken bij metingen.

Een update doe je bewust: maak een back-up van data en configuratie, wijzig de versie, haal het image op en maak de container opnieuw. Test daarna. Alleen de container opnieuw starten haalt geen nieuwe imageversie op.

Een **cluster** is een groep samenwerkende computers. Compose op één VM is ook nog geen cluster dat automatisch naar een andere fysieke server uitwijkt. Kubernetes en Swarm zijn voorbeelden van systemen om meerdere hosts te beheren. In dit labo zetten we geen extra cluster op.

## Kun je dit uitleggen?

1. Wat download je: een image of een draaiende container?
2. Waarom blijft de Home Assistant-configuratie bewaard als je de container opnieuw maakt?
3. Welk brokeradres gebruikt Home Assistant, en welk adres gebruikt de client op Xubuntu?
4. Wat is het verschil tussen een fout wachtwoord en een topic dat niet is toegestaan?
5. Waarom gebruiken we voor deze poorten een SSH-tunnel in plaats van alleen UFW?

## Bronnen

- [Docker installeren op Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Docker Compose](https://docs.docker.com/compose/intro/features-uses/)
- [Home Assistant Container](https://www.home-assistant.io/installation/linux/)
- [MQTT binary sensor](https://www.home-assistant.io/integrations/binary_sensor.mqtt/)
- [Mosquitto-authenticatie](https://mosquitto.org/documentation/authentication-methods/)
