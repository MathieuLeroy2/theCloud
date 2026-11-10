# Infrastructuur voor de cursus

Dit document beschrijft de voorbereiding voor hoofdstuk 1 en de afspraken waarop latere hoofdstukken kunnen voortbouwen. Vul de definitieve omgevingswaarden in de labkaarten in. De cursus veronderstelt geen bestaand school-VPN, vast subnet of gekozen hosthypervisor.

## Route A Eigen nested Proxmox

Gebruik een x86-64-host met hardwarevirtualisatie en een hosthypervisor die dit aan een gast kan doorgeven. Het oorspronkelijke materiaal gebruikt VMware Workstation Pro. Kies de institutioneel beschikbare en vooraf geteste versie. Een andere hosthypervisor is mogelijk als nested KVM én het netwerk met meerdere gast-MAC-adressen werken.

Werkbudget voor hoofdstuk 1:

| Onderdeel | RAM | vCPU | Disk |
| --- | --- | --- | --- |
| Proxmox-VM inclusief haar gasten | 8 GB vast toegewezen | 4 | 100 GB virtueel |
| Ubuntu Server binnen Proxmox | 2 GB | 2 | 24 GB virtueel |
| Xubuntu binnen Proxmox | 3 GB | 2 | 24 GB virtueel |

De 2 en 3 GB voor de gasten komen uit de 8 GB van Proxmox. Begroot voor de laptop daarnaast het eigen besturingssysteem, browser, hosthypervisor en back-upbestanden. Voor het vervolg is 32 GB laptop-RAM wenselijk of kan een deel naar de opleiding verhuizen. Dit budget moet op de gekozen images worden beproefd.

Controleer vooraf dat `/dev/kvm` beschikbaar is in de Proxmox-VM en dat beide gasten met KVM starten. Schakel Hyper-V, VBS of andere hostbeveiliging niet standaard uit. Onderzoek de concrete incompatibiliteit en bied route B aan als een oplossing op de persoonlijke laptop niet passend is.

### Netwerk van route A

Gebruik een eigen NAT-netwerk in de hosthypervisor, met een virtuele hostadapter en ondersteuning voor verkeer van de geneste gasten. Proxmox en beide Linux-gasten gebruiken dezelfde uplink via `vmbr0`. NAT gebeurt op de hosthypervisor. In hoofdstuk 1 hoeft Proxmox niet zelf als NAT-router te worden ingericht.

Het voorbeeld is alleen bruikbaar wanneer dit netwerk zo is ingericht:

| Functie | Voorbeeld |
| --- | --- |
| Subnet | `192.168.77.0/24` |
| Virtuele hostadapter laptop | `192.168.77.1` |
| NAT-gateway en DNS-forwarder | `192.168.77.2` |
| Proxmox | `192.168.77.10` |
| Ubuntu Server | `192.168.77.100` |
| Xubuntu | `192.168.77.200` |
| Eventuele DHCP-pool | `192.168.77.128` tot en met `192.168.77.191` |

De gateway en DNS-forwarder zijn functies van de buitenste hypervisor. Controleer hun werkelijke adressen. `.2` is geen universele standaard. Houd alle vaste adressen buiten de DHCP-pool en voorkom overlap met thuisnetwerk en VPN-routes. Via een IP-conflicttest alleen kun je niet bewijzen dat een adres gereserveerd is.

De laptop hoort via de virtuele hostadapter het subnet te bereiken. Een telefoon op wifi heeft die route niet automatisch. Voor latere hoofdstukken voorziet de opleiding een route of VPN, of verhuizen de services naar route B. Een publieke portforward is geen vereiste.

## Route B Opleiding

Voorzie per student een geïsoleerde oefenomgeving met een toegewezen subnet, gateway, DNS en VMID-bereik. Dit kan een eigen nested Proxmox zijn of beperkte toegang tot een bestaande node. Geef geen nodebrede beheerrechten op een gedeeld cluster. Gebruik een aparte wegwerpomgeving om Proxmox te installeren.

De beheerder legt de toegestane bridge en eventuele VLAN-tag vast. Het labsubnet mag andere studenten en het fysieke beheernetwerk niet ongecontroleerd bereiken. Bij een gedeelde node kan het Proxmox-beheeradres in een ander netwerk liggen dan de Linux-gasten. De labkaart heeft daarvoor aparte velden.

Verifieer vanuit de studentverbinding:

- Bereikbaarheid van Proxmox via HTTPS op TCP 8006.
- Bereikbaarheid van de gasten via SSH en HTTP.
- Uitgaand pakketverkeer naar de goedgekeurde OS-repositories en werkende DNS.
- Gast-gastcommunicatie binnen het studentsegment.
- Afwezigheid van ongewenste toegang tot andere studentsegmenten.

Als beheerbeleid een student blokkeert om ISO's, snapshots, back-ups of restores te maken, voert de docent de beheerstap samen met de student uit. Beoordeel het leerdoel en het gecontroleerde resultaat, niet het verkrijgen van meer rechten.

## Opslag en herstel

Gebruik voor de gastdisks opslag die VM-snapshots ondersteunt, bijvoorbeeld LVM-thin. ISO's en back-upbestanden vragen opslag die dat contenttype accepteert. Laat studenten via de interface controleren welke storage waarvoor dient.

Een installatiedisk van 100 GB met standaardpartities biedt mogelijk te weinig ruimte in `local` voor ISO's. Bij een eigen Proxmox-installatie kan op de cursusdisk bijvoorbeeld circa 24 GiB voor root en 2 GiB swap worden voorzien, met ruimte voor de thin pool en vrije marge. De exacte indeling hangt af van de installer en schijfgrootte. Laat de docent de indeling controleren vóór installatie. Gebruik hier geen ZFS-opstelling als extra afhankelijkheid.

Voorzie een back-updoel buiten de actieve gastdisks, bij voorkeur op andere fysieke opslag. Een gemounte directory, netwerkstorage of Proxmox Backup Server is mogelijk. Noem die storage in de labkaart. Een tweede virtuele disk in hetzelfde laptopbestand is hoogstens een oefendoel en beschermt niet tegen verlies van de laptop.

Voor de korte restoretest volstaat een gestopte back-up van Ubuntu Server. Herstel naar een vrije nieuwe VMID. Start de kopie eerst met de virtuele netwerkkaart losgekoppeld, zodat hetzelfde vaste IP en dezelfde identiteit niet dubbel op het netwerk verschijnen. Test de website in de console via `localhost`. Laat de originele VM behouden.

## Voorbereiding van een les

1. Kies de ISO-versies, verifieer de checksums en noteer ze in [versies.md](versies.md).
2. Probeer één volledige studentenroute uit, inclusief snapshot en restore naar een andere VMID.
3. Vul de labkaarten in en bevestig de netwerkisolatie en capaciteit.
4. Voorzie de kleine websitebestanden lokaal, zodat een externe download geen opdracht blokkeert.
5. Controleer eventuele Proxmox-abonnementsrepositories. Configureer een passende repository via de officiële repository-instructies. Schakel controles of handtekeningverificatie niet uit om een foutmelding te verbergen.
6. Begroot ongeveer 4,5 uur voor het labo na de theorie. Installeerbestanden staan vooraf klaar. Bij trage installaties kan de onafhankelijke restoretest als korte begeleide vervolgcontrole plaatsvinden.

## Bronnen

- [Proxmox VE kenmerken](https://www.proxmox.com/en/products/proxmox-virtual-environment/features)
- [Proxmox VE documentatie](https://www.proxmox.com/en/downloads/proxmox-virtual-environment/documentation)
- [Proxmox VE pakketrepositories](https://pve.proxmox.com/wiki/Package_Repositories)
