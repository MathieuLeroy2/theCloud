# Infrastructuur voor de cursus

## Vast labowachtwoord

Alle door studenten gebruikte laboaccounts krijgen **`Student123`**. Dat geldt ook voor Proxmox, lokale OS-accounts, domeinaccounts, DSRM-herstel, applicatieaccounts, MQTT, Grafana, het database-monitoringaccount en SSH-wachtzinnen. Geef dit wachtwoord ook mee in templates en voorbereide VM's. De publieke/private SSH-sleutels en de machine-identiteit blijven per student/VM apart.

Bij Windows-laboaccounts staat **User must change password at next logon** uit en **Password never expires** aan. Gebruik bijvoorbeeld `labbeheer` als lokaal Windows-beheeraccount; zo bevat het vaste wachtwoord niet de volledige accountnaam `student` wanneer Windows wachtwoordcomplexiteit controleert. Pas op een gedeelde node alleen de toegewezen studentaccounts aan, niet het beheeraccount van de opleiding.

Voor reeds ingerichte laboaccounts wordt het bestaande wachtwoord aangepast naar `Student123`, met behoud van hun data. Een bestaand Grafana-volume leest niet opnieuw een initiële adminwaarde in: wijzig dat accountwachtwoord via Grafana of het beheerpad van de docent.

Dit document beschrijft de voorbereiding voor hoofdstuk 1 en de afspraken waarop latere hoofdstukken kunnen voortbouwen. Vul de definitieve omgevingswaarden in de verslagen in. De cursus veronderstelt geen bestaand school-VPN, vast subnet of gekozen hosthypervisor.

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

De beheerder legt de toegestane bridge en eventuele VLAN-tag vast. Het labsubnet mag andere studenten en het fysieke beheernetwerk niet ongecontroleerd bereiken. Bij een gedeelde node kan het Proxmox-beheeradres in een ander netwerk liggen dan de Linux-gasten. De verslag heeft daarvoor aparte velden.

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

Voorzie een back-updoel buiten de actieve gastdisks, bij voorkeur op andere fysieke opslag. Een gemounte directory, netwerkstorage of Proxmox Backup Server is mogelijk. Noem die storage in de verslag. Een tweede virtuele disk in hetzelfde laptopbestand is hoogstens een oefendoel en beschermt niet tegen verlies van de laptop.

Voor de korte restoretest volstaat een gestopte back-up van Ubuntu Server. Herstel naar een vrije nieuwe VMID. Start de kopie eerst met de virtuele netwerkkaart losgekoppeld, zodat hetzelfde vaste IP en dezelfde identiteit niet dubbel op het netwerk verschijnen. Test de website in de console via `localhost`. Laat de originele VM behouden.

## Voorbereiding van een les

1. Kies de ISO-versies, verifieer de checksums en noteer ze in [versies.md](versies.md).
2. Probeer één volledige studentenroute uit, inclusief snapshot en restore naar een andere VMID.
3. Vul de verslagen in en bevestig de netwerkisolatie en capaciteit.
4. Voorzie de kleine websitebestanden lokaal, zodat een externe download geen opdracht blokkeert.
5. Controleer eventuele Proxmox-abonnementsrepositories. Configureer een passende repository via de officiële repository-instructies. Schakel controles of handtekeningverificatie niet uit om een foutmelding te verbergen.
6. Begroot ongeveer 4,5 uur voor het labo na de theorie. Installeerbestanden staan vooraf klaar. Bij trage installaties kan de onafhankelijke restoretest als korte begeleide vervolgcontrole plaatsvinden.

## Bronnen

- [Proxmox VE kenmerken](https://www.proxmox.com/en/products/proxmox-virtual-environment/features)
- [Proxmox VE documentatie](https://www.proxmox.com/en/downloads/proxmox-virtual-environment/documentation)
- [Proxmox VE pakketrepositories](https://pve.proxmox.com/wiki/Package_Repositories)

## Voorbereiding voor hoofdstukken 2 tot en met 6

Studenten schrijven alle omgevingsgegevens in hun enige verslag. Deel de benodigde waarden uit via de lesinstructie; laat geen apart in te dienen omgevingsdocument maken.

| Hoofdstuk | Wat staat vooraf klaar? | Machines die tegelijk nodig zijn |
| --- | --- | --- |
| 2 | Windows Server 2022 Desktop Experience en Windows 11 Pro/Education met licentie/evaluatie, VirtIO-drivers, UEFI/TPM en lokaal installatiepad | Domeincontroller 3 GB, twee clients elk 4 GB, Proxmox zelf |
| 3 | Ubuntu-cloud-init-template, individueel consolebeheerpad, certificaat/CA en twee bereikbare clients | Media-VM 2 GB en client(s) |
| 4 | Ubuntu-template, Ubuntu Docker-pakketten en images | Container-VM 4 GB en Xubuntu/client |
| 5 | Windows-exporter MSI, Linux-pakketten, monitoringimages en bereikbare meetpoorten | cloud-web, container-VM, Windows-client, eventueel DC voor domeindiensten, client |
| 6 | Werkende basis van H4/H5, lokaal beschikbare toetsimages en gecontroleerde metriclabels | Container-VM, cloud-web en client; niet-benodigde Windows-VM's mogen uit |

De Proxmox-VM van 8 GB uit H1 is geen budget voor het hele vak. H2 vraagt al 11 GB voor alleen de gasten. Voor H5 kan inclusief desktopclient en DC circa 18–20 GB binnen Proxmox nodig zijn. Bied een schoolomgeving aan als de laptop dit niet aankan. Vergroot ook de oorspronkelijke schijf niet blind: begroot alle bewaarde virtuele disks, ISO's, thin-poolmarge en back-ups. Een grotere toegewezen VM-disk maakt nog geen fysieke SSD-ruimte vrij.

### Voorbeeldadressen

Alle voorbeelden horen bij hetzelfde per student geïsoleerde subnet. Vervang het netwerk als de omgeving anders is.

| Rol | Voorbeeld |
| --- | --- |
| Windows-domeincontroller | `.20` |
| Windows-clients | `.30` en `.40` |
| Bestaande native webserver | `.100` |
| Jellyfin-server | `.110` |
| Docker en monitoring | `.120` |
| Optionele Apache/MariaDB-VM | `.140` |
| Xubuntu | `.200` |

Let op: `.140` zit in de voorbeeld-DHCP-pool van route A. Reserveer dit adres expliciet of kies voor de uitbreiding een ander vrij adres buiten de pool. In de hoofdopdrachten zitten `.110` en `.120` buiten die pool. De gastclients van H2 gebruiken `.20` als DNS. De overige Linux-VM's blijven de door de opleiding opgegeven lab-DNS gebruiken.

### Ubuntu-template voor H3 en H4

Maak dit vooraf op een eigen beheerde Proxmox-oefenomgeving. Gebruik een officiële Ubuntu 24.04 cloud image, registreer de checksum en bewaar die image voor de leseditie. De URL `https://cloud-images.ubuntu.com/noble/current/` wijzigt in de tijd en is dus geen versiebevriezing.

Een mogelijke voorbereiding via de Proxmox-shell, met **vrije** template-ID 9000, bridge en storage aangepast aan de omgeving:

```bash
qm create 9000 --name ubuntu2404-template --memory 2048 --cores 2 --net0 virtio,bridge=vmbr0
qm importdisk 9000 noble-server-cloudimg-amd64.img local-lvm
qm config 9000
```

Lees de exacte volumenaam bij `unused0` uit de laatste uitvoer. Gebruik die bij het koppelen; de voorbeeldnaam hieronder is niet universeel:

```bash
qm set 9000 --scsihw virtio-scsi-pci --scsi0 local-lvm:vm-9000-disk-0
qm set 9000 --ide2 local-lvm:cloudinit --boot order=scsi0 --serial0 socket --vga serial0
qm resize 9000 scsi0 32G
qm template 9000
```

Start de basisimage niet eerst als een al gebruikte student-VM. Studenten vullen op hun clone vóór de eerste start een eigen gebruiker, publieke sleutel, IP/DNS en naam in. Verifieer dat iedere clone eigen machine-identiteit en SSH-hostsleutels opbouwt en dat cloud-init de disk benut. Voor H4 vergroot je de clonedisk tot 40 GB en controleer je de guestfilesystemgrootte.

Voorzie op elke student-VM een lokaal consoleaccount met `Student123`, zodat de student de servervingerafdruk kan controleren. Een cloud image met alleen SSH-sleutels geeft niet automatisch een werkende wachtwoordlogin via de Proxmox-console. Stel dat account vóór de eerste les expliciet in.

### Labcertificaten voor H3

Beheer een lab-CA buiten de studentenrepository. De private CA-sleutel blijft bij de docent. Lever per student een certificaat met de juiste Subject Alternative Name voor diens werkelijke IP of DNS-naam. Laat alleen de publieke CA aan clients toevoegen, nooit de private CA-sleutel.

Een voorbeeld voor een **afzonderlijke tijdelijke lab-CA**, in een afgeschermde docentmap:

```bash
umask 077
openssl req -x509 -newkey rsa:3072 -nodes -keyout lab-ca.key -out lab-ca.crt -days 30 -subj '/CN=The Cloud Lab CA' -addext 'basicConstraints=critical,CA:TRUE' -addext 'keyUsage=critical,keyCertSign,cRLSign'
openssl req -new -newkey rsa:2048 -nodes -keyout media.key -out media.csr -subj '/CN=media.lab.test'
```

Maak `media.ext` met de echte waarden:

```ini
subjectAltName=IP:192.168.77.110,DNS:media.lab.test
basicConstraints=critical,CA:FALSE
keyUsage=critical,digitalSignature,keyEncipherment
extendedKeyUsage=serverAuth
```

```bash
openssl x509 -req -in media.csr -CA lab-ca.crt -CAkey lab-ca.key -CAcreateserial -out media.crt -days 14 -sha256 -extfile media.ext
```

Voor een echte opleiding-CA volg je het bestaande beleid in plaats van een extra uitgever te maken. Kopieer de server-private sleutel alleen via een vertrouwde route naar de eigen VM en geef root leesrecht. Bewaar geen private sleutels in Git of in studentverslagen.

Op Xubuntu kan de publieke lab-CA na verificatie in `/usr/local/share/ca-certificates/thecloud-lab.crt` geplaatst worden en met `sudo update-ca-certificates` worden geladen. Controleer afzonderlijk Firefox, de tweede client en eventuele apps: niet elke client gebruikt dezelfde certificaatopslag. Geef zo nodig de concrete importstappen via Certificate Authorities mee. Een certificaatuitzondering of `curl -k` telt niet als geslaagde eindtest.

### Docker en meetpoorten

De verplichte Docker-applicatiepoorten zijn aan `127.0.0.1` gebonden en bereikbaar via SSH-tunnels. Zo is de taak niet afhankelijk van publiek bereikbare poorten of veronderstelde UFW-filtering van Docker. Bij een andere netwerkroute moet de opleiding de afscherming op de passende laag toepassen.

Node Exporter op cloud-web accepteert alleen de monitoring-VM als bron. De Windows MSI krijgt `REMOTE_ADDR` met dezelfde bron. cAdvisor draait met brede leesrechten en privileged uitsluitend in de eigen Ubuntu-VM. De hostnetwerkmodus van H5 is bewust bedoeld voor Linux Docker Engine, niet voor rechtstreeks gebruik op een persoonlijke desktop of een gedeelde Proxmox-node.

Controleer `/dev/kmsg`, `/dev/disk` en het echte Docker Data Root. Een **cgroup** (*control group*) is een Linux-mechanisme om processen samen te volgen en hun middelen te begrenzen. De **Docker API** (*Application Programming Interface*) is de programma-interface waarmee cAdvisor informatie bij Docker opvraagt. Docker met een andere opslagopzet, cgroup-instelling of containerd-image store kan aangepaste cAdvisor-mounts of flags vragen. Bevestig vóór de les dat de label-, geheugen-, CPU- en netwerkmetrics voor een eigen proefcontainer bestaan. Een succesvolle start van cAdvisor alleen is onvoldoende.

### Praktijktest en extra oefening

De kernhoofdstukken bevatten geen afhankelijkheid van weerservices, torrents, cloudaccounts of nieuwe GUI-containerimages. H5 bewaart Apache/MariaDB als optionele uitbreiding. H6 toetst de eerder geoefende website of MQTT-broker. Probeer de tijdsduur en moeilijkheid van de gekozen variant vooraf met dezelfde images uit.

## Eén bestand als studentresultaat

Elk labo en iedere toets heeft één `verslag.md`. Instellingen, antwoorden, commando's, configbestanden, HTML/CSS, queries en dashboard-JSON staan daarin als tekst. De toepassingen blijven uiteraard hun eigen werkbestanden op de VM gebruiken. Een VM-demonstratie vervangt geen verslag en een verslag vervangt geen werkende toepassing.
