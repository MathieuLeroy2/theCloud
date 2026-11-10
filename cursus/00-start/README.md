# Starten met The Cloud

In deze cursus maak je zelf een kleine serveromgeving. Je begint met twee virtuele computers en een website. Later komen daar onder andere gebruikersbeheer, containers en monitoring bij. Met monitoring volg je op of je machines en programma's goed werken.

Je gebruikt je machines in meerdere hoofdstukken. Bewaar ze tot de docent zegt dat ze weg mogen.

## Eén wachtwoord voor alle labo's

Gebruik altijd **`Student123`**, met hoofdletter S. Kies geen eigen wachtwoord en laat het ook niet leeg.

| Waar? | Wachtwoord |
| --- | --- |
| Proxmox en de lokale Linux-/Windows-accounts | `Student123` |
| Domeinbeheerder, Roodkapje, Big1 en Wolf | `Student123` |
| DSRM-herstelwachtwoord van Active Directory | `Student123` |
| Jellyfin-beheerder en kijkaccount | `Student123` |
| Home Assistant, MQTT-sensor en MQTT-dashboard | `Student123` |
| Grafana-admin en database-monitoringaccount | `Student123` |
| Wachtzin van je SSH-private sleutel | `Student123` |

Schakel bij de laboaccounts geen verplichte wachtwoordwijziging bij de eerste aanmelding in. Alleen wanneer een opdracht bewust een verkeerde aanmelding test, gebruik je daar een fout wachtwoord. Je maakt nog steeds aparte accounts met verschillende rechten, ook al is het wachtwoord hetzelfde.

Heb je een labo al gemaakt met een ander wachtwoord? Wijzig dat account dan naar `Student123`. Bewaar de bestaande VM's en gegevens.

## Wat moet je al kunnen?

Je hebt al gewerkt met IP-adressen en subnetmaskers. Je kunt bestanden en mappen beheren, eenvoudige HTML en CSS schrijven en basiscommando's in een Linux-terminal uitvoeren.

Je hoeft Proxmox nog niet te kennen. Dat leren we in hoofdstuk 1. Begrijp je een commando niet? Lees eerst de uitleg erbij en vraag hulp voor je het uitvoert.

## Waar ga je werken?

De docent vertelt welke van deze twee mogelijkheden jij gebruikt:

| Route | Wat gebruik je? |
| --- | --- |
| A Eigen laptop | Je maakt een VM met Proxmox in bijvoorbeeld VMware Workstation. In Proxmox maak je daarna twee Linux-VM's. |
| B Opleiding | Je gebruikt de Proxmox-oefenomgeving die de docent aanwijst. Daarin maak je de twee Linux-VM's. |

Een VM is een virtuele machine: een computer die met software wordt nagebouwd. De theorie legt dit verder uit.

Op school oefen je de Proxmox-installatie eventueel op een aparte tijdelijke machine. Installeer een bestaande gedeelde schoolserver niet opnieuw.

### Wat heeft je laptop nodig?

Voor hoofdstuk 1 rekenen we op een x86-64-laptop met minstens 16 GB RAM en ongeveer 120 GB vrije ruimte op de SSD. Je geeft de Proxmox-VM 8 GB RAM en een virtuele schijf van 100 GB.

32 GB RAM op je laptop geeft meer ruimte voor de volgende hoofdstukken. Dit betekent niet dat alle machines van de hele cursus tegelijk op een laptop met 16 GB kunnen draaien.

De docent controleert ook of jouw laptop VM's binnen een VM kan draaien. Lukt dat niet, of heb je een ander type processor? Dan gebruik je een omgeving van de opleiding.

## Leg dit klaar

- Een browser en een terminal met een SSH-client. Met SSH meld je later op de server aan.
- Voor route A: het programma dat de docent opgeeft om VM's te maken.
- De installatiebestanden voor Proxmox, Ubuntu Server en Xubuntu. Die bestanden heten ISO's.
- De cursusbestanden en een map voor je eigen verslag.
- De plaats die de docent opgeeft voor je back-up.

Gebruik de versies die de docent klaarzet. Zo werkt iedereen met dezelfde basis. De [versielijst voor docenten](../../docenten/versies.md) houdt bij welke versies gekozen en getest zijn.

## Schrijf je instellingen op

Maak een eigen kopie van de tabel met instellingen in [je verslag](../01-hypervisors/bestanden/verslag-sjabloon.md). Vul die samen met de docent in. Daarop staan je adressen, VM-nummers en opslagplaatsen.

De cursus gebruikt voorbeeldadressen zoals `192.168.77.100`. Die kunnen bij jou anders zijn. Gebruik dan overal je eigen waarden, ook in de commando's en firewallregels.

## Zo werk je door een hoofdstuk

1. Lees wat je gaat maken en bekijk de theorie.
2. Volg de uitleg met de slides tijdens de les.
3. Voer de opdrachten stap voor stap uit. Controleer telkens of het werkt.
4. Schrijf kort op wat je deed en wat je zag.
5. Gebruik de oplossingen om je werk te vergelijken of om een fout te vinden.

De oplossingen tonen één mogelijke aanpak. Een naam of VM-nummer kan bij jou verschillen. Gebruik daarvoor je verslag.

## Let op waar je typt

Boven de commando's staat op welke machine je werkt. Een terminal op Xubuntu is niet hetzelfde als een terminal op Ubuntu Server. Controleer dat voordat je een commando uitvoert.

Gebruik `sudo` waar de opdracht beheerdersrechten nodig heeft. Op een gedeelde schoolserver voert de docent sommige stappen samen met je uit.

Gebruik overal het vaste labowachtwoord `Student123`. Dat mag ook in je configuratievoorbeelden staan. Neem geen private SSH-sleutels op in je verslag of in Git. Test fouten alleen op je eigen oefenmachines. Zet geen eigen DHCP-server op het schoolnetwerk en maak de beheerpagina van Proxmox niet bereikbaar voor iedereen op internet.

## Je verslag

Je dient per labo één bestand **`verslag.md`** in. Gebruik het verslagsjabloon van dat hoofdstuk. Daarin staan ook je adressen, VM-nummers, antwoorden en testresultaten. Plak commando's en de inhoud van gebruikte configuratiebestanden in codeblokken. Je dient geen aparte labkaart, screenshots, zip of codebestanden in. Bestanden die nodig zijn om je website of toepassing te laten draaien, blijven uiteraard wel op je VM staan.

Je kunt nu beginnen aan [hoofdstuk 1](../01-hypervisors/README.md).
