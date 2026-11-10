---
marp: true
theme: the-cloud
size: 16:9
paginate: true
lang: nl
title: Hypervisors en virtuele infrastructuur
description: The Cloud voor het tweede jaar graduaat Internet of Things
header: 'The Cloud · Hoofdstuk 1'
footer: 'Graduaat Internet of Things'
---

<!-- _class: lead -->

# Hypervisors en virtuele infrastructuur

Een eigen serveromgeving voor je IoT-diensten

<!--
Laat studenten voorbeelden noemen van software achter een IoT-toepassing.
De bestaande hypervisorles en het Proxmox-labo uit base vormen het vertrekpunt.
-->

---

# De infrastructuur achter een sensor

Een meetwaarde heeft een bestemming nodig.

- Een broker ontvangt berichten.
- Een database bewaart gegevens.
- Een dashboard maakt gegevens zichtbaar.

Die software gebruikt **CPU, RAM, opslag en netwerk**.

<!--
Laat een student het pad van een temperatuurmeting naar een dashboard beschrijven.
Verbind dit met de infrastructuur die we vandaag bouwen.
-->

---

# Het resultaat van dit hoofdstuk

| Onderdeel | Functie |
| --- | --- |
| Proxmox VE | VM's en hun resources beheren |
| Ubuntu Server | Website aanbieden via NGINX |
| Xubuntu | De website als client gebruiken |
| Snapshot en back-up | Een eerdere toestand herstellen |

<!--
De twee gasten blijven behouden voor volgende hoofdstukken.
De telefoon is vandaag geen noodzakelijke client.
-->

---

# De hypervisor

Een hypervisor verdeelt fysieke resources over VM's.

Elke VM krijgt virtuele hardware en een eigen gast-OS.

De gasten delen de onderliggende host.
**Uitval van die ene host treft alle gasten daarop.**

<!--
Vraag welke fout een tweede VM op dezelfde laptop niet kan opvangen.
Virtualisatie en hoge beschikbaarheid zijn afzonderlijke onderwerpen.
-->

---

# Type I en type II

| Type | Plaats | Voorbeeld |
| --- | --- | --- |
| I | Virtualisatielaag op serverhardware | KVM in Proxmox VE |
| II | Toepassing op een host-OS | Workstation, VirtualBox |

Proxmox VE beheert onder meer **KVM-VM's** en LXC.
In dit hoofdstuk gebruiken we VM's.

<!--
Proxmox is het beheerplatform. De Debian/Linux-basis maakt KVM geen gewone type II-desktoptoepassing.
Bron: https://www.proxmox.com/en/products/proxmox-virtual-environment/features
-->

---

# Nested virtualisatie

Bij de laptoproute staan deze lagen boven elkaar:

1. Fysieke laptop en hostbesturingssysteem.
2. Hosthypervisor met een Proxmox-VM.
3. KVM in Proxmox met de twee Linux-gasten.

De buitenste hypervisor geeft hardwarevirtualisatie door.

<!--
Bij een fysieke schoolnode ontbreken de buitenste laptoplagen.
Laat studenten benoemen op welke laag een KVM-startfout onderzocht moet worden.
-->

---

# Het RAM-budget

| Binnen de Proxmox-VM | Werkbudget |
| --- | --- |
| Ubuntu Server | 2 GB |
| Xubuntu | 3 GB |
| Proxmox en overhead | Circa 3 GB |
| Totaal | 8 GB |

De laptop heeft daarnaast RAM nodig voor zijn eigen OS.

<!--
Dit is een cursusbudget voor hoofdstuk 1, geen officiële minimumvereiste.
Gebruik vaste geheugentoewijzing om de berekening zichtbaar te houden.
-->

---

# vCPU en fysieke capaciteit

Een vCPU krijgt uitvoeringstijd op een fysieke processor.

Meer toegewezen vCPU's kunnen dezelfde capaciteit delen.
Bij gelijktijdige belasting ontstaat wachttijd.

**Bespreek:** helpt meer vCPU's instellen altijd bij een trage VM?

<!--
Bespreek overcommitment. Laat ook RAM-tekort en opslagvertraging als oorzaken noemen.
-->

---

# Virtuele disks en thin provisioning

Een disk van 24 GB kan aanvankelijk minder fysiek innemen.

De fysieke behoefte groeit wanneer de gast data schrijft.

Controleer daarom vrije ruimte **in de gast én op de host**.
Een volle thin pool kan meerdere VM's treffen.

<!--
Gebruik de vraag: de gast toont vrije ruimte, maar de Proxmox-storage is vol. Waar zoek je?
-->

---

# De virtuele netwerkbridge

`vmbr0` verbindt netwerkinterfaces op laag 2.
Vergelijk de rol met die van een switch.

De bridge koppelt in ons lab beide gasten aan hun segment.

**Routering, DHCP en NAT zijn afzonderlijke functies.**

<!--
Toon tijdens de demonstratie de uplink van de bridge.
Een lege bridge zonder uplink maakt niet automatisch internet.
-->

---

# Het voorbeeldnetwerk

| Functie | Adres |
| --- | --- |
| Gateway en bevestigde DNS-forwarder | `192.168.77.2` |
| Proxmox-beheer bij route A | `192.168.77.10` |
| Ubuntu Server | `192.168.77.100` |
| Xubuntu | `192.168.77.200` |

Subnet: `192.168.77.0/24`. **Jouw labkaart is bepalend.**

<!--
De opleiding of buitenste hypervisor moet dit subnet daadwerkelijk voorzien.
Op route B kan het beheeradres in een ander netwerk liggen.
-->

---

# Gateway, DNS en NAT

- De **gateway** routeert naar andere netwerken.
- **DNS** vertaalt namen naar adressen.
- **NAT** vertaalt adressen bij het doorsturen.

Ubuntu en Xubuntu communiceren in hetzelfde subnet
rechtstreeks, zonder de default gateway.

<!--
Vraag of een DNS-fout verkeer naar een bekend IP verhindert.
De NAT-gateway staat bij route A op de buitenste hypervisor, niet vanzelf op Proxmox.
-->

---

# De route naar een gast

Uitgaande internettoegang vanuit een VM is één verbinding.

Toegang vanaf een telefoon is een andere route.
Die vraagt een geschikt netwerkpad of VPN.

Vandaag testen we vanuit **Xubuntu op het labsegment**.

<!--
Laat studenten het verschil tussen de laptop-hostadapter en wifi op de telefoon uitleggen.
Er is voor dit labo geen publieke portforward nodig.
-->

---

# Vaste netwerkinstellingen

| Gast | Methode in deze cursus |
| --- | --- |
| Ubuntu Server | Tijdens installatie, daarna Netplan controleren |
| Xubuntu | Na installatie via een NetworkManager-profiel |

Eerst de echte interface en het actieve profiel opzoeken.
Daarna pas de instellingen wijzigen.

<!--
Bronnen:
https://documentation.ubuntu.com/server/explanation/networking/configuring-networks/
https://networkmanager.dev/docs/api/latest/nmcli.html
-->

---

# Het netwerk onderzoeken

```bash
ip -br address
ip route
resolvectl query archive.ubuntu.com
```

Welke uitvoer helpt bij een verkeerd adres?
Welke uitvoer helpt bij een DNS-probleem?

<!--
Voer deze controles live uit in de console van een gast.
Een ontbrekende route is iets anders dan een onbereikbare DNS-server.
-->

---

# IP-verkeer en een toepassing

Een geslaagde `ping` onderzoekt ICMP-bereikbaarheid.
Voor HTTP moet ook een webdienst op TCP 80 luisteren.

```bash
curl -I http://192.168.77.100
```

**Bespreek:** wat kan nog fout zijn als ping wel slaagt?

<!--
Verwachte voorbeelden: NGINX gestopt, firewall blokkeert TCP 80, verkeerd luisteradres.
-->

---

# SSH en SFTP

**SSH** biedt een versleutelde shell op de server.
Vergelijk bij de eerste verbinding de hostsleutelvingerafdruk.

**SFTP** gebruikt dezelfde SSH-dienst voor bestandsoverdracht.
Upload eerst naar je eigen home-directory.

Daarna publiceer je met gerichte beheerdersrechten.

<!--
Laat de vingerafdruk in de serverconsole en bij de client zien.
SFTP betekent SSH File Transfer Protocol.
-->

---

# De statische website

| Onderdeel | Locatie in de voorbeeldopstelling |
| --- | --- |
| HTML en CSS | `/var/www/html` |
| Beheerder van gepubliceerde bestanden | `root` |
| NGINX-worker | `www-data` |
| Toegang voor de webdienst | Lezen en directories doorlopen |

Schrijven door de webdienst is voor deze site overbodig.

<!--
Verklaar 0644 voor bestanden en 0755 voor de directory.
Bron voor het Ubuntu-pakket: https://documentation.ubuntu.com/server/how-to/web-services/install-nginx/
-->

---

# Poorten en toegang

| Poort | Functie | Toegestane bron |
| --- | --- | --- |
| TCP 8006 | Proxmox-beheer | Bevestigde beheerroute |
| TCP 22 | SSH en SFTP op de gast | Toegestane labbron |
| TCP 80 | HTTP op de gast | Toegestane labbron |

Voeg de SSH-regel toe vóór je de gastfirewall activeert.

<!--
De Ubuntu-firewallregels horen bij de gast, niet bij Proxmox.
HTTP is hier beperkt tot statische oefeninhoud in het afgeschermde lab.
-->

---

# Een gestopte webdienst

| Controle | Tijdens onze storing |
| --- | --- |
| VM-status | De VM draait |
| Ping | De server antwoordt |
| NGINX-service | Gestopt |
| HTTP | Mislukt |

De combinatie van controles onderbouwt de diagnose.

<!--
Laat studenten voorspellen voordat je NGINX stopt.
Vraag ook hoe ze na herstel bewijzen dat het netwerkpad weer werkt.
-->

---

# Snapshot en back-up

| Snapshot | Back-up |
| --- | --- |
| Snel terugkeerpunt | Afzonderlijke herstelkopie |
| Afhankelijk van de VM-storage | Kan buiten die storage staan |
| Geschikt vóór een wijziging | Geschikt om een VM te herstellen |

Bescherming tegen opslagverlies vraagt een kopie elders.

<!--
We maken in dit labo een disksnapshot en back-up van een netjes afgesloten gast.
Een tweede virtuele disk op dezelfde laptop is geen onafhankelijke fysieke locatie.
-->

---

# De hersteltest

1. Back-up herstellen naar een vrije nieuwe VMID.
2. Automatisch starten uit, netwerkkaart losgekoppeld.
3. Website controleren via de console en `localhost`.
4. Kopie afsluiten en het origineel behouden.

Het vaste gast-IP zit ook in de back-up.

<!--
Laat uitleggen waarom een nieuw MAC-adres alleen het IP-conflict niet oplost.
De Proxmox-naam van de kopie verandert de hostname binnen de gast niet automatisch.
-->

---

# Het labo

**H1.1–H1.3** Plan, hypervisor en twee Linux-gasten.

**H1.4–H1.6** Netwerk, eigen website en diagnose.

**H1.7–H1.8** Herstellen, verklaren en opleveren.

Gebruik de labkaart en noteer bewijs per controlepunt.

<!--
Verwijs naar opdrachten.md en verslag-sjabloon.md.
Richttijd is 4,5 uur met vooraf beschikbare ISO's en ingericht netwerk.
-->

---

# Controle aan het einde

- Beide gasten behouden hun adressen na een herstart.
- Xubuntu bereikt je eigen HTML en CSS.
- Je verklaart de storing met concrete tests.
- Snapshotrollback en geïsoleerde restore werken.
- Je originele omgeving blijft bewaard voor het vervolg.

<!--
Gebruik deze slide voor de demonstratie en de korte mondelinge controle.
-->
