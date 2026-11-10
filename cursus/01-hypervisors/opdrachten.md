# Labo 1 Twee virtuele machines en een website

Vandaag maak je twee virtuele computers. Ubuntu Server biedt je website aan. Op Xubuntu open je die website in een browser.

Daarna stop je de webserver even. Je onderzoekt waarom de pagina niet meer opent en zet de webserver weer aan. Tot slot oefen je hoe je een eerdere versie van je machine terugzet.

Bewaar je machines. We gebruiken ze later opnieuw.

## Voor je begint

Lees de [theorie](theorie.md). Leg een eigen kopie van [het verslagsjabloon](bestanden/verslag-sjabloon.md) klaar.

De docent vertelt waar je werkt:

- **Route A:** je installeert Proxmox in een virtuele machine op je eigen laptop.
- **Route B:** je gebruikt een oefenomgeving van de opleiding. De docent zegt waar je Proxmox mag installeren en welke omgeving je daarna blijft gebruiken.

Installeer een bestaande schoolserver niet opnieuw. Werk alleen op de machine die voor jouw oefening bedoeld is.

### Dit bouwen we

| Machine | Naam | Processor | RAM | Schijf |
| --- | --- | --- | --- | --- |
| Proxmox op je laptop | `pve-lab` | 4 vCPU | 8 GB | 100 GB |
| Ubuntu Server in Proxmox | `cloud-web` | 2 vCPU | 2 GB | 24 GB |
| Xubuntu in Proxmox | `cloud-client` | 2 vCPU | 3 GB | 24 GB |

Op een schoolomgeving geeft de docent aan hoeveel je mag gebruiken.

### Welke adressen gebruik je?

In de voorbeelden gebruiken we:

- Proxmox: `192.168.77.10`
- Ubuntu Server: `192.168.77.100`
- Xubuntu: `192.168.77.200`
- Subnetmasker: `/24`, dus `255.255.255.0`
- Gateway en DNS-server: `192.168.77.2`

**Neem die adressen niet zomaar over.** Laat de docent eerst je verslag nakijken. Zijn jouw adressen anders? Gebruik dan overal je eigen waarden, ook in commando's en firewallregels.

Voor het hele labo krijg je ongeveer 4,5 uur. De installatiebestanden staan vooraf klaar.

## H1.1 Je instellingen opschrijven

**Ongeveer 15 minuten.**

1. Schrijf in je verslag of je route A of B gebruikt.
2. Vul samen met de docent de netwerkadressen en de opslagplaatsen in.
3. Noteer de nummers die je voor je VM's mag gebruiken. Zo'n nummer heet in Proxmox een **VMID**.
4. Bereken hoeveel RAM je voor de twee Linux-machines gebruikt. Hoeveel blijft binnen de Proxmox-VM over voor Proxmox zelf?
5. Noteer waar je straks je back-up bewaart. Staat die kopie op dezelfde fysieke schijf als je VM's of ergens anders?

**Je bent klaar als:** je weet welke adressen en VM-nummers je gebruikt. Je kunt ook aanwijzen waar de back-up zal staan.

## H1.2 Proxmox installeren

**Ongeveer 45 minuten.**

### Op je eigen laptop

1. Open de hosthypervisor die de docent opgeeft, bijvoorbeeld VMware Workstation.
2. Maak daarin een VM voor Proxmox met de instellingen uit de tabel.
3. Zet de optie aan die hardwarevirtualisatie doorgeeft aan Proxmox. De docent toont welke optie dat in jouw programma is.
4. Verbind de VM met het voorbereide NAT-netwerk. Gebruik de gegevens van je verslag.
5. Start vanaf het Proxmox-installatiebestand, de **ISO**. Controleer vóór installatie welke virtuele schijf je gebruikt en hoe de ruimte verdeeld wordt.

### Op een omgeving van de opleiding

De docent wijst de machine aan waarop je de installatie oefent. Soms gebruik je daarna een andere, al voorbereide Proxmox-omgeving voor je Linux-machines. Noteer dat in je verslag.

### Na de installatie

1. Open op je laptop of de opgegeven beheercomputer een browser.
2. Ga naar `https://PROXMOX-ADRES:8006`. Vervang `PROXMOX-ADRES` door het adres van je eigen verslag.
3. Meld je aan met je beheeraccount. Krijg je een certificaatwaarschuwing? Controleer eerst via de console of je bij jouw Proxmox-machine zit. Vraag hulp als dat niet duidelijk is.
4. Zoek de pagina met de netwerkbridge, bijvoorbeeld `vmbr0`. Dit is de virtuele switch waaraan je straks de Linux-machines koppelt.
5. Bekijk waar ISO-bestanden en VM-schijven mogen staan.
6. Controleer met de docent of KVM werkt. KVM is het onderdeel waarmee Proxmox de VM's laat draaien.

De [oplossing](oplossingen.md) toont de installatie en de controles uitgebreider.

**Je bent klaar als:** je Proxmox in de browser kunt openen en weet waar je de VM's gaat maken.

## H1.3 Ubuntu Server en Xubuntu installeren

**Ongeveer 65 minuten.**

### Ubuntu Server

1. Maak in Proxmox een VM met de naam `cloud-web`. Gebruik je afgesproken VMID, processor, RAM en schijf.
2. Kies voor de netwerkkaart **VirtIO** en verbind ze met de bridge van je verslag. De docent geeft een eventuele VLAN-tag op.
3. Start de installatie vanaf de Ubuntu Server-ISO.
4. Vul tijdens de installatie het vaste IP-adres, subnet, gateway en DNS in.
5. Maak de gewone gebruiker `student` met wachtwoord `Student123`. Die gebruiker mag met `sudo` beheertaken uitvoeren.
6. Laat OpenSSH Server installeren. Daarmee kun je later vanaf Xubuntu op de server aanmelden.
7. Rond af en ontkoppel de ISO. Start de VM opnieuw vanaf haar eigen schijf.

### Xubuntu

1. Maak de tweede VM met de naam `cloud-client` en de afgesproken instellingen.
2. Gebruik opnieuw VirtIO en dezelfde netwerkbridge als bij de server.
3. Installeer Xubuntu. Je mag tijdens de installatie tijdelijk DHCP gebruiken.
4. Ontkoppel de ISO na installatie en start Xubuntu opnieuw.
5. Open de terminal en geef Xubuntu zijn vaste IP-adres met `nmcli`. De oplossing helpt je het juiste verbindingsprofiel te kiezen.

### Nog controleren op beide machines

1. Controleer de computernaam en het IP-adres.
2. Controleer of datum en tijd kloppen en de klok automatisch wordt bijgewerkt.
3. Zet in Proxmox de optie **QEMU Guest Agent** aan. Installeer daarna dat programma in beide Linux-machines. Het geeft informatie over de VM door aan Proxmox.

**Je bent klaar als:** beide machines vanaf hun eigen schijf starten en hun juiste naam en adres tonen.

## H1.4 Het netwerk testen

**Ongeveer 25 minuten.**

Voer elke test uit op de machine die in de tabel staat. Schrijf in je verslag wat je zag.

| Waar werk je? | Wat doe je? | Wat verwacht je? |
| --- | --- | --- |
| Ubuntu Server en Xubuntu | Bekijk adres en gateway. | De waarden komen overeen met je verslag. |
| Xubuntu | Ping het adres van Ubuntu Server. | De server antwoordt. |
| Ubuntu Server | Ping het adres van Xubuntu. | Xubuntu antwoordt. |
| Beide machines | Zoek met DNS `archive.ubuntu.com` op. | Je krijgt een IP-adres terug. |
| Beide machines | Voer `sudo apt update` uit. | De machine haalt de pakketlijsten op zonder netwerkfout. |
| Xubuntu | Meld je met SSH aan op Ubuntu Server. | Je komt in de terminal van de server terecht. |

Bij de eerste SSH-verbinding vergelijk je de getoonde vingerafdruk met die uit de console van Ubuntu Server. De oplossing toont hoe je die code opvraagt.

Herstart daarna beide machines. Bekijk hun adressen opnieuw en herhaal de pingtests. Zo zie je of je instellingen ook na een herstart bewaard blijven.

**Je bent klaar als:** de machines elkaar bereiken, DNS werkt en je via SSH op de server kunt aanmelden.

## H1.5 Je website op de server zetten

**Ongeveer 45 minuten.**

### Eerst de standaardpagina

1. Installeer NGINX op Ubuntu Server. NGINX is de software die de webpagina verstuurt.
2. Open op Xubuntu een browser en ga naar het IP-adres van de server.
3. Controleer of de standaardpagina van NGINX verschijnt.

### Daarna je eigen pagina

1. Maak een kleine website over je werkplek of een denkbeeldig IoT-project. Je hebt minstens een HTML-bestand en een apart CSS-bestand nodig. Je mag [het voorbeeld](bestanden/website/index.html) aanpassen.
2. Upload beide bestanden met SFTP naar je eigen gebruikersmap op Ubuntu Server.
3. Zet ze daarna met `sudo install` in `/var/www/html`. De oplossing toont de volledige commando's.
4. Controleer dat `www-data`, de gebruiker van NGINX, de bestanden kan lezen maar niet wijzigen.

### De firewall aanzetten

1. Voeg op Ubuntu Server regels toe die SSH en HTTP vanuit jouw labnetwerk toelaten.
2. Zet pas daarna de firewall aan. Houd de console van Ubuntu Server open voor het geval je iets moet herstellen.
3. Open vanaf Xubuntu een nieuwe SSH-verbinding. Werkt die nog?
4. Open je eigen website in de browser. Zie je ook de CSS-opmaak?
5. Vraag met `curl` apart het HTML-bestand en het CSS-bestand op.

**Je bent klaar als:** je eigen pagina met opmaak verschijnt, SSH blijft werken en je kunt uitleggen wie de websitebestanden mag lezen en wijzigen.

## H1.6 De website werkt niet meer

**Ongeveer 20 minuten.**

Je veroorzaakt nu bewust een kleine fout op je eigen server.

1. Stop op Ubuntu Server het programma NGINX. Laat de VM zelf aanstaan.
2. Ping vanaf Xubuntu het serveradres. Krijg je nog antwoord?
3. Open vanaf Xubuntu de website. Werkt die nog?
4. Bekijk op Ubuntu Server of NGINX draait en of er nog een programma op poort 80 luistert.
5. Schrijf in twee of drie zinnen op waarom ping wel of niet werkt en waarom de website niet opent.
6. Start NGINX weer en open de website opnieuw vanaf Xubuntu.

Verander tijdens deze proef geen netwerkadressen of firewallregels. We willen zien wat alleen het stoppen van NGINX doet.

**Je bent klaar als:** je de fout hebt verklaard en de website opnieuw werkt. Je verslag toont de tests vóór, tijdens en na de fout.

## H1.7 Een vorige versie terugzetten

**Ongeveer 40 minuten.**

### Eerst met een snapshot

1. Sluit Ubuntu Server netjes af.
2. Maak in Proxmox een snapshot met de naam `h1-website`. Laat het opslaan van RAM uitstaan.
3. Start de VM. Verander één zin op de website en bekijk de gewijzigde pagina vanaf Xubuntu.
4. Sluit de VM weer netjes af.
5. Zet in Proxmox de snapshot terug met **Rollback**.
6. Start de VM en open de website. De oude zin moet terug zijn.

### Daarna met een back-up

1. Sluit Ubuntu Server af en maak een back-up op de plaats die in je verslag staat. Controleer of de taak zonder fouten eindigt.
2. Zet de back-up terug naar een **nieuw, vrij VM-nummer**. Overschrijf je oorspronkelijke VM niet.
3. Geef de kopie een herkenbare naam, bijvoorbeeld `cloud-web-hersteltest`. Laat automatisch starten uitstaan.
4. Koppel vóór de eerste start de netwerkkaart van de kopie los. Het IP-adres is nog hetzelfde als bij het origineel.
5. Start de kopie en open haar console in Proxmox.
6. Voer daar `curl http://localhost` uit. Zie je de HTML van je website terug?
7. Sluit de kopie af. Laat haar netwerkkaart losgekoppeld. Je originele server blijft de server waarmee je verder werkt.

**Je bent klaar als:** de snapshot je oude pagina terugbracht en je de back-up als aparte kopie hebt getest. Je kunt uitleggen waarom de kopie tijdens de test geen netwerkverbinding kreeg.

## H1.8 Indienen en je machines bewaren

**Ongeveer 15 minuten.**

Lever precies één bestand in: **`verslag.md`**. Zet daarin:

- Je instellingen, stappen en antwoorden.
- De volledige HTML en CSS in codeblokken met de bestandsnamen erboven.
- De gebruikte netwerkinstellingen en commando's in codeblokken.
- De resultaten van de controles en je antwoorden op de zeven vragen onderaan de theorie.

Gebruik tekstuitvoer voor de controles en beschrijf wat je in de browser zag. Voeg geen aparte screenshots of bestanden toe. Het vaste labowachtwoord mag in je configuratievoorbeelden staan. Neem geen private SSH-sleutels op. Toon de werking ook kort aan de docent.

Werk je op je laptop? Sluit eerst Ubuntu en Xubuntu netjes af, daarna Proxmox. Werk je op school? Volg de afspraken van de docent. Verwijder je oorspronkelijke machines niet.

## Waarop krijg je punten?

| Onderdeel | Punten | Wat toon je? |
| --- | --- | --- |
| H1.1 Je plan | 2 | Je kent je adressen, RAM-verdeling en plaats voor de back-up. |
| H1.2 Proxmox | 3 | Je hebt de installatie geoefend, opent de beheerpagina en toont dat KVM werkt. |
| H1.3 Twee VM's | 3 | Ubuntu Server en Xubuntu starten met de juiste instellingen. |
| H1.4 Netwerk | 3 | Adressen blijven na een herstart bewaard. Ping, DNS en SSH werken. Je controleert de SSH-vingerafdruk. |
| H1.5 Website | 4 | Je eigen HTML en CSS werken. Bestandsrechten en firewall staan goed. |
| H1.6 Fout zoeken | 2 | Je legt de fout uit met je testresultaten en herstelt de website. |
| H1.7 Terugzetten | 2 | Je test een snapshot en een back-up zonder je origineel te overschrijven. |
| H1.8 Indienen | 1 | Je verslag en bestanden zijn volledig en begrijpelijk. |
| **Totaal** | **20** | |

De docent kan een deel van de punten geven als een onderdeel nog niet helemaal werkt. Voor route A en route B gelden dezelfde leerdoelen. Op school voer je sommige beheerstappen samen met de docent uit.
