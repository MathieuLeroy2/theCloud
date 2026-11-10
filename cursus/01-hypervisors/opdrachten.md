# Labo 1 Hypervisors en virtuele infrastructuur

Je bouwt een kleine virtuele serveromgeving. Ubuntu Server biedt je website aan. Xubuntu gebruikt die website. Daarna onderzoek je een storing en toon je aan dat je de omgeving kunt herstellen. Je bewaart de originele machines voor het vervolg van de cursus.

## Voorbereiding en eindresultaat

Lees de [theorie](theorie.md) en de [startgids](../00-start/README.md). De docent wijst route A of B toe en bevestigt je labkaart. Werk met de toegewezen images, accounts, netwerkbridge en opslag. Bij route B voer je installatie en infrastructuurwijzigingen uitsluitend uit binnen je eigen oefenomgeving.

Gebruik de volgende namen als je omgeving dat toelaat:

| Machine | Voorbeeldnaam | Resources | Voorbeeldadres |
| --- | --- | --- | --- |
| Proxmox | `pve-lab` | Route A: 4 vCPU, 8 GB RAM, 100 GB disk | `192.168.77.10/24` |
| Ubuntu Server | `cloud-web` | 2 vCPU, 2 GB RAM, 24 GB disk | `192.168.77.100/24` |
| Xubuntu | `cloud-client` | 2 vCPU, 3 GB RAM, 24 GB disk | `192.168.77.200/24` |

De voorbeelden veronderstellen gateway en DNS-forwarder `192.168.77.2`. Dat zijn functies van het voorbereide netwerk. Controleer ze in je labkaart. Op een gedeelde omgeving kunnen Proxmox-adres, VMID's en gastsubnet hiervan afwijken.

Voorzie ongeveer 270 minuten. De richttijden hieronder zijn samen 4,5 uur. ISO's staan vooraf klaar; downloadtijd is daarin niet voorzien.

## H1.1 Labkaart en resourceplan

**Richttijd: 15 minuten.**

1. Maak een eigen kopie van [de labkaart](bestanden/labkaart-sjabloon.md) en [het verslag](bestanden/verslag-sjabloon.md).
2. Noteer je route, beheeradres, bridge, eventuele VLAN-tag en de toegewezen VMID's.
3. Vul het subnet, de prefix, gateway, DNS en vaste gastadressen in. Laat de docent bevestigen dat de adressen gereserveerd zijn en buiten de DHCP-pool vallen.
4. Maak een resourceberekening. Toon bij route A hoeveel RAM binnen Proxmox voor de gasten en voor Proxmox zelf overblijft, en hoeveel de laptop daarnaast nodig heeft.
5. Noteer waar de back-up komt en tegen welk fysiek verlies die locatie bescherming biedt.

**Controlepunt:** je kunt uitleggen welke machine de gateway is en waarom `vmbr0` alleen geen internettoegang maakt. Je plan bevat geen onbevestigde adressen.

## H1.2 Proxmox installeren en bereiken

**Richttijd: 45 minuten.**

Bij route A maak je een VM voor Proxmox in de afgesproken hosthypervisor. Geef hardwarevirtualisatie door, koppel het voorbereide NAT-netwerk en installeer Proxmox vanaf de cursus-ISO. Controleer de schijfindeling vóór installatie. Bewaar zowel ruimte voor de ISO's als voor de gastdisks.

Bij route B installeer je Proxmox alleen op het expliciet toegewezen tijdelijke systeem. Gebruik daarna de afgesproken blijvende omgeving voor de gast-VM's. De docent voert niet-toegestane infrastructuuracties samen met je uit.

1. Stel een naam, uniek beheerwachtwoord en de bevestigde netwerkinstellingen in.
2. Open vanaf je beheerclient `https://PROXMOX-ADRES:8006`.
3. Controleer de identiteit van je eigen labnode voordat je een waarschuwing voor een eigen certificaat accepteert. Gebruik op school de afgesproken certificaatprocedure.
4. Bekijk de bridge, opslag en beschikbare resources.
5. Controleer in de Proxmox-console of KVM beschikbaar is. Bewaar een kort bewijsfragment.

**Controlepunt:** de beheerinterface werkt, de bridge is gekoppeld aan de juiste uplink of het toegewezen schoolsegment, en nested KVM werkt waar nodig.

## H1.3 Twee Linux-VM's bouwen

**Richttijd: 65 minuten.**

1. Maak de twee VM's uit de tabel. Gebruik vrije toegewezen VMID's, VirtIO-netwerkkaarten en de afgesproken bridge/VLAN. Gebruik snapshotgeschikte opslag voor de gastdisks.
2. Installeer Ubuntu Server. Stel het vaste IP-adres tijdens de installatie in. Maak een gewone gebruiker met `sudo`-rechten en installeer OpenSSH. Voorzie geen desktopomgeving.
3. Installeer Xubuntu als lichte desktopclient. Na de installatie stel je het vaste adres in via de terminal met NetworkManager. Bewaar de relevante commando's in je verslag.
4. Verwijder of ontkoppel na installatie de installer-ISO's uit de virtuele cd-roms.
5. Stel de hostnames in, controleer tijdsynchronisatie en installeer de QEMU Guest Agent. Schakel de agentoptie ook in Proxmox in.

**Controlepunt:** beide gasten starten vanaf hun eigen disk. Een hostnaam en IP-adres zijn zichtbaar in elke gast. Het RAM-budget blijft binnen de toegewezen capaciteit.

## H1.4 Netwerk en SSH controleren

**Richttijd: 25 minuten.**

Voer de tests op de aangeduide machines uit en noteer concrete resultaten.

| Test | Plaats | Verwacht resultaat |
| --- | --- | --- |
| Interface en route bekijken | Beide gasten | Juiste vaste adres, prefix en default gateway |
| Ubuntu Server pingen | Xubuntu | Antwoord van het serveradres |
| Xubuntu pingen | Ubuntu Server | Antwoord van het clientadres |
| DNS-naam opzoeken | Beide gasten | Een antwoord voor `archive.ubuntu.com` |
| Pakketlijsten bijwerken | Beide gasten | Werkende toegang tot de ingestelde repositories |
| SSH-verbinding openen | Xubuntu naar Ubuntu Server | Aanmelding na hostsleutelcontrole |
| Gasten herstarten | Beide gasten | De vaste netwerkinstellingen blijven geldig |

Vergelijk bij de eerste SSH-verbinding de vingerafdruk met die uit de vertrouwde serverconsole. Een mislukte ping naar een internetadres alleen bewijst geen defect internet: ICMP kan onderweg worden gefilterd.

**Controlepunt:** je kunt aangeven welke tests het lokale netwerk, DNS en de applicatietoegang onderzoeken.

## H1.5 NGINX en een eigen website

**Richttijd: 45 minuten.**

1. Installeer NGINX op Ubuntu Server en controleer de standaardpagina vanuit Xubuntu.
2. Maak een kleine website over je werkplek of een denkbeeldige IoT-installatie. Gebruik minimaal een HTML-bestand en een apart CSS-bestand. Je mag [de startwebsite](bestanden/website/index.html) aanpassen.
3. Breng de bestanden met SFTP over naar je home-directory op de server. Publiceer ze daarna met gerichte beheerdersrechten in de documentroot.
4. Zorg dat de webserver de website kan lezen en dat zijn servicegebruiker de gepubliceerde bestanden niet kan aanpassen.
5. Activeer een gastfirewall met toegang tot SSH en HTTP vanuit het toegestane labsubnet. Voeg de SSH-regel toe vóór je de firewall inschakelt. Behoud consoletoegang voor herstel.
6. Toon met `curl` de HTML-respons en de CSS-respons. Open de pagina ook in de browser op Xubuntu.

**Controlepunt:** je eigen pagina en CSS werken. Je legt de eigenaar, groep en rechten van de webbestanden uit. SSH blijft werken nadat de firewall actief is.

## H1.6 Een storing onderzoeken

**Richttijd: 20 minuten.**

Stop NGINX op je eigen Ubuntu Server-VM. Verander geen IP-adressen of firewallregels.

1. Test vanuit Xubuntu opnieuw ping en HTTP.
2. Controleer op Ubuntu Server de servicestatus en de luisterende TCP-poorten.
3. Formuleer een verklaring die bij deze waarnemingen past.
4. Herstel de dienst en toon opnieuw een geslaagde HTTP-test.

**Controlepunt:** je verklaart waarom de geslaagde ping de werking van HTTP niet bewees. Je verslag bevat het resultaat vóór, tijdens en na de storing.

## H1.7 Snapshot en back-up herstellen

**Richttijd: 40 minuten.**

### Snapshot

1. Sluit Ubuntu Server netjes af en maak een disksnapshot `h1-website` met een beschrijving. Neem geen RAM-toestand op.
2. Start de VM, wijzig één duidelijk herkenbare zin op de gepubliceerde website en controleer de wijziging.
3. Sluit de VM weer netjes af en herstel de snapshot.
4. Start de VM en toon dat de vorige inhoud is teruggekeerd.

### Back-up

1. Maak van de afgesloten Ubuntu Server-VM een back-up naar de toegewezen back-upstorage. Controleer het taaklog.
2. Herstel de back-up naar een nieuwe vrije VMID en geef die kopie een herkenbare naam.
3. Koppel de virtuele netwerkkaart van de kopie los vóór de eerste start. Controleer ook dat automatisch opstarten voor die kopie uitstaat.
4. Start de kopie en test via de console `curl http://localhost`. De oorspronkelijke website moet aanwezig zijn.
5. Sluit de kopie af. Start of behoud de originele server als actieve server voor het vervolg.

**Controlepunt:** je hebt de oorspronkelijke VM behouden en de kopie geïsoleerd getest. Je legt uit waarom je daarvoor de netwerkkaart loskoppelde en waarom een snapshot geen onafhankelijke back-up is.

## H1.8 Opleveren en bewaren

**Richttijd: 15 minuten.**

Lever één map in met:

- Je ingevulde labkaart en verslag in Markdown.
- De HTML- en CSS-bronbestanden.
- Je relevante netwerkconfiguratie, zonder wachtwoorden of private sleutels.
- Bewijs bij de controlepunten H1.1 tot en met H1.7 en antwoorden op de zelfcontrolevragen uit de theorie.

Laat de werking controleren via een korte demonstratie. Bij route A sluit je na afloop eerst de gasten, daarna Proxmox en ten slotte de buitenste VM netjes af. Bij route B volg je de afspraken over het bewaren en afsluiten van machines. Verwijder je originele omgeving niet.

## Beoordeling

| Onderdeel | Punten | Aantoonbaar resultaat |
| --- | --- | --- |
| H1.1 Plan | 2 | Kloppend netwerk- en resourceplan, back-uplocatie uitgelegd |
| H1.2 Hypervisor | 3 | Eigen installatie aangetoond, beheer bereikbaar, KVM beschikbaar |
| H1.3 VM's | 3 | Twee correct ingerichte en startende Linux-gasten |
| H1.4 Netwerk | 3 | Persistent adresplan, gastcommunicatie, DNS en SSH met sleutelcontrole |
| H1.5 Dienst | 4 | Eigen HTML/CSS, passende rechten, werkende beperkte firewall en HTTP-tests |
| H1.6 Diagnose | 2 | Storing onderbouwd met tests en aantoonbaar hersteld |
| H1.7 Herstel | 2 | Snapshotrollback en geïsoleerde back-uprestore aangetoond |
| H1.8 Oplevering | 1 | Overzichtelijk reproduceerbaar verslag en bruikbare bestanden |
| **Totaal** | **20** | |

De docent kan per onderdeel gedeeltelijke punten toekennen op basis van de gerealiseerde controles. Route A en B hebben dezelfde leerdoelen. Extra beheerrechten op gedeelde infrastructuur leveren geen extra punten op.
