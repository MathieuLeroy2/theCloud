---
marp: true
theme: the-cloud
size: 16:9
paginate: true
lang: nl
title: Virtuele machines met Proxmox
description: The Cloud voor het tweede jaar graduaat Internet of Things
header: 'The Cloud · Hoofdstuk 1'
footer: 'Graduaat Internet of Things'
---

<!-- _class: lead -->

# Virtuele machines met Proxmox

Een website op de ene computer.
Een browser op de andere.

<!--
Begin met het concrete resultaat. De studenten bouwen een websiteomgeving.
Vraag wie al eens een virtuele machine heeft gebruikt en wat die ermee deed.
-->

---

# Een virtuele machine

**VM = Virtual Machine**, Engels voor virtuele machine.
Een computer die met software wordt nagebouwd.

Je installeert er een besturingssysteem op, zoals Ubuntu.
Dat heet ook **OS = Operating System**.

<!--
Laat een VM zien voordat je nieuwe termen introduceert.
Een VM is geen tweede fysieke computer in de laptop.
-->

---

# Dit gaan we bouwen

| Onderdeel | Wat doe je ermee? |
| --- | --- |
| Proxmox | Twee virtuele machines maken |
| Ubuntu Server | Je website aanbieden |
| Xubuntu | Je website openen in de browser |

Daarna zet je een oude versie terug met een snapshot en back-up.

<!--
Maak het verschil zichtbaar tussen de server die de pagina verstuurt en de client die ze opvraagt.
Beide machines blijven bewaard voor latere hoofdstukken.
-->

---

# De hypervisor verdeelt het werk

De **hypervisor** laat de VM's de echte computer gebruiken.
Hij verdeelt processor, geheugen en opslag.

- **Host:** de computer waarop de VM's draaien.
- **Gast:** het besturingssysteem in een VM.

Zet je de host uit, dan stoppen de VM's daarop ook.

<!--
Gebruik een concreet voorbeeld: een Windows-laptop met een Ubuntu-VM.
Vraag wat er gebeurt als de batterij van de laptop leeg is.
-->

---

# Type I en type II

| Type | Hoe gebruik je het? |
| --- | --- |
| I | Virtualisatie rechtstreeks op de serverhardware |
| II | Een programma op je bestaande computer, zoals Workstation |

Proxmox gebruikt **KVM: Kernel-based Virtual Machine**.
Dat Linux-onderdeel laat de VM’s draaien.

<!--
Laat studenten de programma's koppelen aan hun eigen opstelling.
VirtualBox is een ander voorbeeld van type II.
Bron: https://www.proxmox.com/en/products/proxmox-virtual-environment/features
-->

---

# Een VM in een VM

Op je eigen laptop kan het zo werken:

1. Je opent Workstation.
2. Daarin start je de VM met Proxmox.
3. In Proxmox start je Ubuntu Server en Xubuntu.

Dit heet **nested virtualisatie**.

<!--
Toon de vensters in die volgorde. Op een fysieke schoolserver ontbreken de Workstation-stappen.
Workstation moet de virtualisatiefunctie aan Proxmox doorgeven.
-->

---

# Hoeveel gegevens is een GB?

**GB = gigabyte**, ongeveer een miljard bytes.
Het is een eenheid voor de hoeveelheid gegevens.

Zowel werkgeheugen als een schijf hebben een grootte.
RAM is voor het werk dat nu draait; de schijf bewaart bestanden.

---

# Je kunt RAM niet dubbel gebruiken

**RAM = Random Access Memory**, het werkgeheugen.
De Proxmox-VM krijgt in ons voorbeeld **8 GB**.

| Daarvan gebruikt ... | Hoeveel? |
| --- | --- |
| Ubuntu Server | 2 GB |
| Xubuntu | 3 GB |
| Proxmox zelf en zijn andere werk | Ongeveer 3 GB |

Je laptop heeft daarnaast geheugen nodig voor zijn eigen OS.

<!--
Laat studenten 2 + 3 + 3 optellen. De gasten gebruiken geheugen binnen de Proxmox-VM.
Dit is het werkbudget van het labo, geen universeel minimum.
-->

---

# De processor doet het rekenwerk

**CPU = Central Processing Unit**: de processor.
Een **vCPU** is een virtuele processor van een VM.

De echte processor verdeelt zijn tijd over de VM’s.
Installeren Ubuntu en Xubuntu tegelijk updates?
Dan kunnen beide trager reageren.

<!--
Vraag of studenten dit herkennen wanneer meerdere programma's tegelijk veel werk doen.
Noem de vakterm overcommitment alleen als daar tijdens de les behoefte aan is.
-->

---

# Een virtuele schijf

Elke Linux-VM krijgt een schijf van **24 GB**.
Die gebruikt uiteindelijk ruimte op je echte schijf.

Bij **thin provisioning** groeit de gebruikte ruimte
naarmate je bestanden toevoegt.

Controleer vrije ruimte in de VM, in Proxmox en op je laptop.

<!--
Voorbeeld: Ubuntu ziet nog ruimte, maar de opslag waarop alle VM's staan is vol.
Laat in Proxmox zien waar studenten die ruimte kunnen bekijken.
-->

---

# De bridge is je virtuele switch

Een **switch** verbindt computers in hetzelfde netwerk.
Een **bridge** doet dat hier in software.

In Proxmox heet ze bijvoorbeeld **vmbr0**.
Je verbindt beide VM’s met die virtuele switch.
Voor internet blijft ook een verbinding met een router nodig.

<!--
Wijs vmbr0 en de netwerkkaarten aan in de echte opstelling.
Vermijd een uitleg over OSI-lagen voordat studenten zien wat ze moeten verbinden.
-->

---

# Elke machine krijgt een adres

**IP = Internet Protocol**, de afspraken voor netwerkadressen.
Een IP-adres hoort hier bij de netwerkkaart van een machine.

| Machine | Voorbeeldadres |
| --- | --- |
| Proxmox | 192.168.77.10 |
| Ubuntu Server | 192.168.77.100 |
| Xubuntu | 192.168.77.200 |

Gebruik de adressen en het subnetmasker uit je verslag.

<!--
De voorbeeldadressen werken pas als dat netwerk voorbereid is.
De docent bevestigt dat de vaste adressen vrijgehouden zijn.
-->

---

# Een vast adres of DHCP

**DHCP = Dynamic Host Configuration Protocol**.
Daarmee krijgt een computer automatisch netwerkinstellingen.

Bij een **vast IP-adres** vul je ze zelf in.
Onze server krijgt een vast adres, zodat je hem terugvindt.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Gateway en DNS hebben elk een taak

**Gateway:** de router naar andere netwerken.
Bijvoorbeeld om updates van internet te downloaden.

**DNS = Domain Name System:** zoekt adressen bij namen.
Bijvoorbeeld het adres van archive.ubuntu.com.

In ons voorbeeld doet 192.168.77.2 beide taken.

<!--
Vraag wat er kan mislopen als toegang via een IP werkt, maar via een naam niet.
Ubuntu en Xubuntu hebben in ditzelfde subnet geen default gateway nodig om elkaar te bereiken.
-->

---

# Internet via je laptop

**NAT = Network Address Translation**, adresvertaling.
Workstation vertaalt de adressen bij de verbinding naar buiten.
Zo kunnen je VM’s via de laptop naar internet.

Dat maakt nog geen route vanaf je telefoon naar de VM.
Vandaag openen we de website vanaf **Xubuntu**.

<!--
NAT vertaalt de adressen bij het verkeer naar buiten.
Laat studenten op hun verslag aanwijzen via welke verbinding ze Proxmox bereiken.
-->

---

# Een vast IP-adres instellen

| Machine | Wanneer en waarmee? |
| --- | --- |
| Ubuntu Server | Tijdens de installatie; Netplan bewaart het |
| Xubuntu | Na de installatie, met NetworkManager |

De oplossing toont beide manieren stap voor stap.
Gebruik overal de waarden van je verslag.

<!--
Leg uit dat nmcli het commando is om NetworkManager te bedienen.
Bronnen:
https://documentation.ubuntu.com/server/explanation/networking/configuring-networks/
https://networkmanager.dev/docs/api/latest/nmcli.html
-->

---

# Wat is mijn adres?

Op de Linux-machine waarop je werkt:

```bash
ip -br address
```

Zoek het adres van de netwerkkaart.
Komt het overeen met je verslag?

<!--
Voer het commando live uit op beide machines.
Toon ook de kaartnaam en wijs 127.0.0.1 aan als het eigen loopbackadres.
Laat de student eerst deze uitvoer lezen vóór je meer commando's toevoegt.
-->

---

# Browser en webserver spreken HTTP

**NGINX** is de naam van onze webserversoftware.

**HTTP = Hypertext Transfer Protocol:**
de afspraken waarmee een browser pagina’s opvraagt.

**HTTPS** is de beveiligde vorm: de verbinding is versleuteld.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Ping werkt, maar de website niet

`ping` vraagt of de andere machine antwoordt.
Een website vraagt ook een werkende webserver.

```bash
curl -I http://192.168.77.100
```

Dit vraagt een antwoord aan NGINX op je server.
Bij een werkende pagina verwacht je bijvoorbeeld **200 OK**.

<!--
Leg -I uit als het tonen van antwoordinformatie zonder de hele HTML.
Vraag wat er gebeurt als NGINX gestopt is maar Ubuntu nog draait.
-->

---

# HTML voor inhoud, CSS voor opmaak

**HTML = HyperText Markup Language**.
Daarmee schrijf je de inhoud en structuur van de pagina.

**CSS = Cascading Style Sheets**.
Daarmee kies je bijvoorbeeld kleuren en lettergroottes.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Waar typ je de commando’s?

Een **terminal** is een venster waarin je commando’s typt.

De **console** in Proxmox toont het scherm van je VM,
alsof je rechtstreeks voor die computer zit.

Controleer altijd op welke machine je werkt.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Op de server werken vanaf Xubuntu

**SSH = Secure Shell**.
Daarmee open je op afstand een beveiligde terminal.
Vergelijk bij de eerste verbinding de servervingerafdruk.

**SFTP = SSH File Transfer Protocol**.
Daarmee verstuur je bestanden via dezelfde SSH-dienst.

<!--
Demonstreer het vergelijken van de SHA256-code met de console.
SFTP is SSH File Transfer Protocol en gebruikt hier dezelfde SSH-dienst op poort 22.
-->

---

# Wie mag je website aanpassen?

De website staat in **/var/www/html**.

- Jij maakt en bewerkt je HTML en CSS in je eigen map.
- Je plaatst de bestanden met `sudo install` in de webmap.
- NGINX mag de bestanden lezen en versturen.

NGINX hoeft je HTML niet te kunnen wijzigen.

<!--
NGINX gebruikt hier www-data voor het verwerken van webvragen.
Leg de bestandsrechten pas uit bij het tonen van de gepubliceerde bestanden.
Bron: https://documentation.ubuntu.com/server/how-to/web-services/install-nginx/
-->

---

# Een firewall laat verbindingen toe of blokkeert ze

Op Ubuntu gebruiken we **UFW = Uncomplicated Firewall**.
Dat is het programma waarmee je firewallregels instelt.

Laat SSH toe vóór je de firewall aanzet.
Zo sluit je je eigen verbinding niet per ongeluk af.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Poorten: bij welk programma kom je uit?

**TCP = Transmission Control Protocol**.
Het levert gegevens via een verbinding in de juiste volgorde af.
Een poortnummer helpt de juiste dienst kiezen.

| Dienst | TCP-poort |
| --- | --- |
| Proxmox-beheer | 8006 |
| SSH en SFTP | 22 |
| HTTP-website | 80 |

<!--
Een poortnummer helpt de verbinding bij het juiste programma te brengen.
Laat de studenten na het aanzetten een nieuwe SSH-verbinding testen.
-->

---

# We zetten NGINX even uit

| Wat test je? | Wat zie je normaal? |
| --- | --- |
| Staat de Ubuntu-VM aan? | Ja |
| Krijg je antwoord op ping? | Ja |
| Opent de website? | Nee |

Start NGINX weer. Test daarna ook vanaf Xubuntu.

<!--
Laat studenten voorspellen en voer de proef daarna uit.
We veranderen tijdens deze oefening geen IP-adressen of firewallregels.
-->

---

# Je oude website terughalen

**Snapshot:** een toestand om naar terug te keren.
Handig vóór je iets verandert.

**Back-up:** een aparte kopie om uit te herstellen.
Bewaar die ook op een andere fysieke schijf of server.

Een snapshot op een kapotte schijf ben je ook kwijt.

<!--
Concrete proef: verander een zin en zet de snapshot terug.
Maak duidelijk dat ook andere wijzigingen na de snapshot verdwijnen bij rollback.
-->

---

# Een back-up testen

1. Zet de back-up terug naar een **nieuw VM-nummer**.
2. Koppel de netwerkkaart los vóór je de kopie start.
3. Test in haar console met `curl http://localhost`.
4. Sluit de kopie af. Bewaar het origineel.

De kopie bevat nog het IP-adres van de originele server.

<!--
Localhost betekent de machine waarop je nu werkt.
Twee actieve machines met hetzelfde vaste adres kunnen het netwerk verstoren.
-->

---

# Aan het werk

**H1.1–H1.3:** instellingen noteren en machines installeren.

**H1.4–H1.6:** verbinding testen, website maken en fout zoeken.

**H1.7–H1.8:** terugzetten en je werk indienen.

Schrijf tijdens het werken kort op wat je doet en ziet.

<!--
Verwijs naar opdrachten.md en het verslagsjabloon.
De richttijd is 4,5 uur met vooraf beschikbare ISO's en een voorbereid netwerk.
-->

---

# Dit laat je aan het einde zien

- Je adressen blijven na een herstart juist staan.
- Je eigen website met CSS opent op Xubuntu.
- Je legt uit wat er gebeurt als NGINX uitstaat.
- Je zet de snapshot en back-up met succes terug.
- Je bewaart je originele machines voor de volgende les.

<!--
Gebruik deze slide bij de korte demonstratie aan het einde van het labo.
Laat studenten met hun eigen testresultaten uitleggen wat ze hebben geleerd.
-->
