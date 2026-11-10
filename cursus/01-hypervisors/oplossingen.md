# Modeloplossingen bij labo 1

Deze uitwerking gebruikt één voorbeeldnetwerk. Neem de adressen, bridge, storage en VMID's uit jouw labkaart over. Voer infrastructuuracties uitsluitend uit op je eigen oefenomgeving. De voorbeelden zijn bedoeld voor Ubuntu Server en Xubuntu 24.04 LTS; controle op de concrete Proxmox- en hosthypervisorversie van de opleiding blijft nodig.

Bij elk codeblok staat waar je het uitvoert. Een werkend alternatief is geldig wanneer je dezelfde controlepunten kunt aantonen en je keuzes kunt verklaren.

## H1.1 Labkaart en resourceplan

Voor route A gebruiken we dit voorbereide netwerk:

| Instelling | Voorbeeldwaarde |
| --- | --- |
| Subnet | `192.168.77.0/24` |
| Gateway | `192.168.77.2` op het buitenste NAT-netwerk |
| DNS | Bevestigde DNS-forwarder `192.168.77.2` |
| Beheerclient | Laptop met virtuele hostadapter `192.168.77.1` |
| Proxmox | `192.168.77.10` |
| Ubuntu Server | `192.168.77.100` |
| Xubuntu | `192.168.77.200` |
| DHCP indien actief | `.128` tot en met `.191` |

De voorbeeldadressen `.10`, `.100` en `.200` vallen buiten de DHCP-pool. De docent of netwerkbeheerder bevestigt de reservering. Een machine die niet op ping antwoordt, kan het adres toch gebruiken.

De twee gasten vragen samen 5 GB uit de 8 GB van de Proxmox-VM. Er blijft circa 3 GB voor Proxmox en overhead. Op de laptop moet ook het eigen OS voldoende geheugen behouden. De vCPU's zijn ingeplande rekencapaciteit, geen garantie op exclusieve cores.

Bij route B kan het beheeradres van Proxmox buiten het gastsubnet liggen. De server en client zitten wel in het aan jou toegewezen labsegment. Gebruik de opgegeven bridge en eventueel VLAN; maak geen eigen uplink naar het algemene schoolnetwerk.

## H1.2 Proxmox installeren en bereiken

### Route A De buitenste VM

Op de **laptop**, in de institutioneel gekozen hosthypervisor:

1. Maak een nieuwe VM voor een 64-bits Linux-gast. Gebruik de Proxmox-cursus-ISO als installatiemedium.
2. Wijs 4 vCPU's, 8 GB RAM en een virtuele disk van 100 GB toe. Houd het RAM-budget ook op de laptop in het oog.
3. Schakel het doorgeven van Intel VT-x/EPT of AMD-V/RVI aan de gast in. De precieze naam hangt af van de hosthypervisor.
4. Verbind de VM met het voorbereide NAT-netwerk. Noteer de subnet-, gateway- en DHCP-instellingen. Controleer dat de hostadapter bestaat en dat verkeer van de geneste gast-MAC-adressen wordt ondersteund.
5. Start de Proxmox-installer. Selecteer uitsluitend de disk van je nieuwe oefen-VM.

### Installatie van Proxmox

Op de **console van de Proxmox-oefenmachine**:

1. Start de grafische of terminalinstaller en accepteer de licentievoorwaarden.
2. Selecteer de cursusdisk. Gebruik de afgesproken opslagindeling, bijvoorbeeld ext4 met LVM-thin voor de gastdisks. Controleer in de geavanceerde diskopties dat root voldoende ruimte voor de ISO's krijgt. Voor de cursusdisk kan circa 24 GiB root en 2 GiB swap een uitgangspunt zijn; de docent controleert de werkelijke verdeling.
3. Stel België, tijdzone `Europe/Brussels` en je toetsenbord in.
4. Kies een uniek beheerwachtwoord en de opgegeven contactgegevens voor de oefenomgeving.
5. Vul de bevestigde beheerinstellingen in. Gebruik in het voorbeeld een hostname zoals `pve-lab.lab.test`, adres `192.168.77.10/24`, gateway `192.168.77.2` en DNS `192.168.77.2`.
6. Controleer de samenvatting en start de installatie. Ontkoppel daarna de installer-ISO en herstart.

Op de **beheerclient** open je `https://192.168.77.10:8006`. Bij een eigen nieuwe labnode gebruikt Proxmox aanvankelijk een eigen certificaat. Controleer het adres en de node-identiteit in je console. Op de schoolomgeving volg je de afgesproken certificaatprocedure.

Meld je op een eigen node aan met het lokale beheeraccount en de juiste realm, bijvoorbeeld `root` in `Linux PAM`. Op gedeelde infrastructuur gebruik je het persoonlijke toegewezen account.

### Route B

De installatie hierboven gebeurt alleen in het toegewezen tijdelijke systeem. Op een reeds geïnstalleerde schoolnode controleer je bridge, segment, resources en opslag samen met de docent. Maak de node niet opnieuw klaar en wijzig geen gedeelde netwerkconfiguratie.

### Controles op de Proxmox-node

Voer onderstaande alleen uit in de **shell van je eigen Proxmox-node**, of laat ze door de docent aantonen:

```bash
pveversion
ls -l /dev/kvm
ip -br address
ip route
```

`/dev/kvm` hoort als character device te bestaan. Uiteindelijk moet ook een echte gast met ingeschakelde KVM kunnen starten. Alleen het bestaan van het device bewijst nog geen volledig werkende nested opstelling.

Bekijk in de interface de netwerkbridge. In route A verwacht je `vmbr0` met de juiste uplink en het beheeradres. Een bridge zonder aangesloten uplink of route kan onderlinge gastcommunicatie toelaten maar geen pakketinstallatie vanaf internet.

## H1.3 Twee Linux-VM's bouwen

### ISO's en virtuele hardware

Upload de cursus-ISO's naar de toegewezen storage die ISO-images ondersteunt. In een gedeelde omgeving kunnen ze al beschikbaar zijn. Controleer vóór upload of er voldoende ruimte vrij is.

Maak in **Proxmox** twee VM's met je vrije toegewezen VMID's. De voorbeelden hieronder gebruiken `101` en `102`.

| Instelling | Ubuntu Server | Xubuntu |
| --- | --- | --- |
| Naam | `cloud-web` | `cloud-client` |
| CPU | 2 vCPU, passend CPU-model voor deze omgeving | 2 vCPU, zelfde afspraak |
| RAM | 2048 MiB, vast | 3072 MiB, vast |
| Disk | 24 GB op snapshotgeschikte storage | 24 GB op snapshotgeschikte storage |
| Controller | VirtIO SCSI | VirtIO SCSI |
| Netwerkmodel | VirtIO | VirtIO |
| Bridge/VLAN | Volgens labkaart | Hetzelfde studentsegment |
| ISO | Ubuntu Server | Xubuntu |

Gebruik een firmwarekeuze die de cursusimages ondersteunen. De standaard BIOS-opstelling volstaat voor deze Linux-oefening; als de opleiding UEFI gebruikt, horen de benodigde EFI-disk en instellingen bij de template. CPU-type `host` kan nuttig zijn in een eigen nested lab, maar volgt op gedeelde infrastructuur het beleid voor migratie en compatibiliteit.

### Ubuntu Server installeren

Op de **serverconsole**:

1. Kies taal en toetsenbord en de gewone serverinstallatie. Gebruik geen extra desktop.
2. Bewerk de actieve Ethernet-interface en kies handmatige IPv4-configuratie.
3. Vul bij `Subnet` in het voorbeeld `192.168.77.0/24` in, bij `Address` `192.168.77.100`, bij `Gateway` `192.168.77.2` en bij nameserver de bevestigde DNS-server.
4. Gebruik de volledige virtuele gastdisk voor Ubuntu. Dit is de disk van de gast, niet de Proxmox-installatiedisk. Een eenvoudige standaardindeling volstaat.
5. Geef de machine de naam `cloud-web`. Maak de gewone gebruiker `student` met een eigen wachtwoord. In de cursus gebruiken we die naam in de commando's.
6. Selecteer de installatie van OpenSSH Server. Extra serverrollen zijn hier niet nodig.
7. Voltooi de installatie, ontkoppel de ISO en start vanaf disk.

Controleer op **Ubuntu Server**:

```bash
hostnamectl
ip -br address
ip route
resolvectl status
```

Als de installer de juiste vaste instellingen schreef, hoef je geen extra Netplan-bestand toe te voegen. Meerdere configuraties voor dezelfde interface kunnen elkaar aanvullen of overschrijven.

### Netplan controleren of herstellen

Werk in de **Proxmox-console van Ubuntu Server**, zodat een fout je toegang niet volledig blokkeert:

```bash
sudo netplan get
sudo ls -l /etc/netplan
sudo mkdir -p /root/h1-netwerk-backup
sudo cp -a /etc/netplan/. /root/h1-netwerk-backup/
```

Bekijk welke YAML de bedoelde interface instelt. Pas dat bestand aan in plaats van blind een tweede definitie toe te voegen. [Het voorbeeldbestand](bestanden/01-lab-server.yaml.example) toont de gewenste inhoud. Vervang de interfacenaam door die uit `ip -br address` en gebruik je labkaart. Het voorbeeldbestand is geen installatie-script.

Met bijvoorbeeld `/etc/netplan/50-cloud-init.yaml` als werkelijk gebruikte bestandsnaam:

```bash
sudoedit /etc/netplan/50-cloud-init.yaml
sudo chmod 600 /etc/netplan/50-cloud-init.yaml
sudo netplan generate
sudo netplan try --timeout 120
```

Bevestig alleen als de instellingen werken. Controleer na een mislukte test zowel de actuele verbinding als de YAML op disk voordat je opnieuw start. Als het bestand echt door actieve cloud-init-netwerkconfiguratie wordt gegenereerd, hoort de blijvende wijziging in de bronconfiguratie van die template. De handmatig geïnstalleerde cursus-VM moet geen tweede netwerkbeheerpad krijgen. [Netplan try](https://netplan.readthedocs.io/en/stable/netplan-try/)

### Xubuntu installeren en daarna een vast adres geven

Op de **clientconsole** installeer je Xubuntu met Xfce, de gewone gebruiker en de benodigde browser. Kies een minimale installatie als de cursusimage die optie biedt. Een tijdelijk DHCP-adres tijdens de installatie is toegestaan. Ontkoppel de installer-ISO na de installatie.

Open de terminal op **Xubuntu**:

```bash
sudo hostnamectl set-hostname cloud-client
nmcli device status
nmcli -f NAME,UUID,TYPE,DEVICE connection show --active
```

Zoek de UUID van het actieve bekabelde Ethernet-profiel. Gebruik de UUID om ook bij namen met spaties het juiste profiel te wijzigen. Vul de eerste regel zelf in:

```bash
LAB_CONNECTION='UUID-UIT-JOUW-LIJST'
sudo nmcli connection modify "$LAB_CONNECTION" \
  ipv4.method manual \
  ipv4.addresses '192.168.77.200/24' \
  ipv4.gateway '192.168.77.2' \
  ipv4.dns '192.168.77.2' \
  ipv4.ignore-auto-dns yes
sudo nmcli connection up "$LAB_CONNECTION"
ip -br address
ip route
nmcli device show
```

Gebruik hier de terminal in de desktopconsole. Het opnieuw activeren van het profiel kan een externe verbinding kort verbreken. Voeg geen concurrerende `networkd`-configuratie toe aan deze desktop. [NetworkManager nmcli](https://networkmanager.dev/docs/api/latest/nmcli.html)

### Updates, tijd en guest agent

Schakel eerst in **Proxmox**, bij de opties van elke VM, de QEMU Guest Agent in. Sluit de gasten netjes af en start ze opnieuw als het virtuele agentkanaal pas na een nieuwe start beschikbaar wordt.

Voer daarna uit op **beide gasten**:

```bash
sudo apt update
sudo apt upgrade
sudo apt install qemu-guest-agent curl
sudo systemctl start qemu-guest-agent
timedatectl status
```

Een agentservice kan pas starten als het virtuele agentkanaal bestaat. Controleer na installatie in de gast `systemctl status qemu-guest-agent` en in Proxmox de gerapporteerde gastinformatie.

Bij Ubuntu-installaties kan de agent via de device-afhankelijke unit starten; `systemctl enable` is daarom niet in elke situatie nodig. Werkt de agent niet, controleer het kanaal en de VM-optie in plaats van netwerkdrivers te verwijderen.

## H1.4 Netwerk en SSH controleren

Op **Xubuntu**:

```bash
ping -c 3 192.168.77.100
resolvectl query archive.ubuntu.com
sudo apt update
```

Op **Ubuntu Server**:

```bash
ping -c 3 192.168.77.200
resolvectl query archive.ubuntu.com
sudo apt update
sudo systemctl status ssh --no-pager
```

Als OpenSSH niet geïnstalleerd is, installeer en start je de dienst op **Ubuntu Server**:

```bash
sudo apt install openssh-server
sudo systemctl enable --now ssh
```

Bekijk in de **vertrouwde serverconsole** de Ed25519-hostsleutelvingerafdruk:

```bash
sudo ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

Open vanaf **Xubuntu** de verbinding. We kiezen hier expliciet hetzelfde sleuteltype om de vergelijking duidelijk te houden:

```bash
ssh -o HostKeyAlgorithms=ssh-ed25519 student@192.168.77.100
```

Vergelijk de getoonde `SHA256:...`-waarde met de consolewaarde voordat je accepteert. Na aanmelden controleer je met `hostname` op welke machine je werkt. Verlaat de sessie met `exit`.

Herstart elke gast en herhaal de adres-, route- en communicatietests. Daarmee toon je aan dat de configuratie persistent is. Bewaar relevante uitvoer in je verslag; wachtwoorden horen daar niet bij.

## H1.5 NGINX en een eigen website

### NGINX installeren

Op **Ubuntu Server**, via console of de gecontroleerde SSH-verbinding:

```bash
sudo apt update
sudo apt install nginx ufw
sudo systemctl enable --now nginx
sudo nginx -t
curl -I http://localhost
```

Bij een standaardinstallatie verwacht je een succesvolle configuratietest en een HTTP-antwoord zoals `200 OK`. Test daarna op **Xubuntu**:

```bash
curl -I http://192.168.77.100
```

De standaardsite van het Ubuntu-pakket gebruikt `/var/www/html`. Controleer de actieve siteconfiguratie als je een andere image gebruikt. [NGINX op Ubuntu Server](https://documentation.ubuntu.com/server/how-to/web-services/install-nginx/)

### Bestanden uploaden

Maak op **Ubuntu Server**, als `student`, een stagingmap:

```bash
mkdir -p ~/upload-website
```

Pas op **Xubuntu** de voorbeeldwebsite aan. Bewaar `index.html` en `style.css` bijvoorbeeld samen in `~/Downloads/website`. Open daar een terminal:

```bash
cd ~/Downloads/website
sftp student@192.168.77.100
```

In de **SFTP-prompt**:

```text
put index.html upload-website/index.html
put style.css upload-website/style.css
ls upload-website
bye
```

Een grafische SFTP-client is ook geldig. Gebruik protocol SFTP, het serveradres en TCP 22. Het uploadpad is de home-directory van `student`, niet meteen de webroot.

### Publiceren met passende rechten

Op **Ubuntu Server**, aangemeld als `student`:

```bash
sudo install -d -o root -g root -m 0755 /var/www/html
sudo install -o root -g root -m 0644 ~/upload-website/index.html /var/www/html/index.html
sudo install -o root -g root -m 0644 ~/upload-website/style.css /var/www/html/style.css
ls -ld /var/www/html
ls -l /var/www/html/index.html /var/www/html/style.css
sudo -u www-data test -r /var/www/html/index.html
```

De laatste controle geeft bij succes exitcode 0 en gewoonlijk geen tekst. Controleer ook dat de servicegebruiker niet kan schrijven:

```bash
if sudo -u www-data test -w /var/www/html/index.html; then
  echo 'FOUT: de webserver kan index.html wijzigen'
else
  echo 'OK: de webserver heeft geen schrijfrecht op index.html'
fi
```

De HTML en CSS moeten wel leesbaar zijn. Er is geen NGINX-herstart nodig voor een wijziging aan deze statische bestanden. Configuratiewijzigingen test je eerst met `nginx -t` en laad je daarna opnieuw in.

### Gastfirewall

Onderstaande regels zijn voor de **nieuwe eigen Ubuntu Server-gast**, niet voor de Proxmox-node of een bestaande gedeelde server. Vervang het bronnetwerk als je labkaart afwijkt. Bij een aparte beheerroute voeg je vóór activering ook de bevestigde beheerbron toe aan de SSH-regel.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow from 192.168.77.0/24 to any port 22 proto tcp
sudo ufw allow from 192.168.77.0/24 to any port 80 proto tcp
sudo ufw enable
sudo ufw status verbose
```

De console blijft beschikbaar voor herstel. Open na activering vanaf **Xubuntu** een nieuwe SSH-verbinding en test HTTP opnieuw. De gastfirewall kan geen blokkade in een schoolfirewall of Proxmox-firewall opheffen; die regels beheert de opleiding.

Op **Xubuntu**:

```bash
curl -I http://192.168.77.100/index.html
curl -I http://192.168.77.100/style.css
curl http://192.168.77.100/index.html
```

Beide bestanden moeten een succesvolle respons geven. Bekijk de pagina in de browser. Controleer in de browser ook dat de CSS geladen is. Gebruik een harde refresh bij vermoeden van cache.

## H1.6 Een storing onderzoeken

Op **Ubuntu Server** stop je alleen de webdienst:

```bash
sudo systemctl stop nginx
systemctl is-active nginx
sudo ss -ltnp
```

`is-active` meldt normaal `inactive` en retourneert een niet-nul exitcode. In de luisterpoorten hoort NGINX op TCP 80 verdwenen te zijn. SSH op 22 kan gewoon blijven werken.

Op **Xubuntu**:

```bash
ping -c 3 192.168.77.100
curl --max-time 5 -I http://192.168.77.100
```

De ping kan slagen terwijl HTTP mislukt. Bij de bedoelde storing antwoordt de host nog op IP-verkeer maar luistert de webdienst niet. Of `curl` een directe weigering of een timeout meldt, hangt ook af van de netwerkfilters. Gebruik daarom meerdere waarnemingen.

Op **Ubuntu Server** bekijk en herstel je de dienst:

```bash
sudo journalctl -u nginx -n 20 --no-pager
sudo nginx -t
sudo systemctl start nginx
systemctl is-active nginx
curl -I http://localhost
```

Herhaal daarna op Xubuntu de externe HTTP-test. Alleen de lokale test bewijst nog niet dat de client de dienst weer kan bereiken.

## H1.7 Snapshot en back-up herstellen

### Een disksnapshot maken

Op **Ubuntu Server**:

```bash
sudo shutdown -h now
```

Wacht tot de VM in **Proxmox** gestopt is. Selecteer de oorspronkelijke VM en maak in het onderdeel snapshots een snapshot `h1-website` met een beschrijving zoals ‘Werkende eigen website vóór wijziging’. Schakel het bewaren van RAM uit. Is de snapshotactie niet beschikbaar, controleer dan de storageondersteuning of vraag de docent de actie uit te voeren.

Start de server en wijzig in de gepubliceerde `index.html` een zin naar bijvoorbeeld `TEST NA SNAPSHOT`. Controleer de gewijzigde pagina vanaf Xubuntu. Sluit de server daarna opnieuw netjes af.

Selecteer in **Proxmox** de snapshot van de juiste VM, voer rollback uit en start de VM. De pagina hoort weer de inhoud van vóór de wijziging te tonen. Bewaar bewijs van beide toestanden en het taakresultaat. Een rollback verwerpt wijzigingen na het gekozen terugkeerpunt; daarom doe je deze proef alleen op de oefen-VM.

### Back-up maken

1. Sluit de oorspronkelijke server netjes af. Controleer dat de status in Proxmox `stopped` is.
2. Selecteer die VM, open het back-uponderdeel en kies de toegewezen storage die back-ups accepteert.
3. Start een back-up in modus `Stop`. Bij deze reeds gestopte VM schrijven toepassingen niet meer naar de gastdisk.
4. Wacht op een succesvolle taak en noteer VMID, tijdstip, bestandsnaam of snapshot-ID van de back-up en storage.

Maak geen back-up naar een willekeurige kleine `local`-partitie. De labkaart bepaalt het doel. Start de oorspronkelijke server na de back-up opnieuw als die actief moet blijven.

### Naar een nieuwe VM herstellen

In **Proxmox**:

1. Kies de zojuist gemaakte back-up en herstel naar een **vrije nieuwe VMID**, bijvoorbeeld `901`, als die aan jou is toegewezen. Gebruik geen bestaande VMID.
2. Kies de toegewezen doelstorage voor VM-disks. Laat ‘start na herstel’ uitstaan. Gebruik een nieuw MAC-adres als de restorefunctie die optie aanbiedt.
3. Geef de kopie een naam zoals `cloud-web-hersteltest`. Zet automatisch opstarten uit.
4. Bewerk vóór het starten de netwerkkaart van de kopie en vink ‘Disconnect’ aan. Laat op gedeelde infrastructuur de docent dit controleren. Het vaste gast-IP is immers nog hetzelfde als in de originele VM.
5. Start de kopie en meld je via de console aan. Gebruik geen SSH-verbinding naar het oude adres: die kan bij het origineel uitkomen.

Op de **console van de herstelde kopie**:

```bash
hostname
ls -l /var/www/html
systemctl is-active nginx
curl -I http://localhost
curl http://localhost
```

Controleer dat de juiste website en CSS aanwezig zijn. De nieuwe Proxmox-naam wijzigt de hostname in de gast niet automatisch. Lokale HTTP werkt met de losgekoppelde netwerkkaart via loopback.

Sluit de kopie na de test netjes af. Laat de netwerkkaart losgekoppeld en behoud de originele server voor het volgende hoofdstuk. Ruim de kopie pas op volgens de bewaartermijn van de docent. Deze modeloplossing bevat bewust geen verwijdercommando voor VM's.

**Verklaring:** de snapshot oefent snel terugkeren binnen dezelfde opslag. De back-uprestore toont herstel vanuit een afzonderlijke kopie aan. Alleen een back-up buiten de oorspronkelijke fysieke opslag beschermt ook tegen uitval van die opslag.

## H1.8 Opleveren en bewaren

Gebruik het [verslagsjabloon](bestanden/verslag-sjabloon.md). Noteer de werkelijk gebruikte waarden en relevante uitvoer. Voeg geen fictieve ‘geslaagde’ tests toe. Als een controle mislukt, beschrijf je de waarneming en je onderzoek.

Beantwoord de zelfcontrole hieronder in je eigen woorden. Bewaar de originele server en client. Bij route A sluit je eerst de gasten af en daarna Proxmox, voordat je de buitenste VM afsluit. Bij route B bepaalt de docent wanneer VM's moeten draaien of uitgeschakeld worden.

## Troubleshooting

| Waarneming | Eerst onderzoeken | Mogelijke gerichte actie |
| --- | --- | --- |
| Gast start niet met KVM-fout | Doorgegeven virtualisatie, hostcompatibiliteit, `/dev/kvm` | Buitenste VM correct configureren of route B gebruiken |
| Proxmox-webinterface onbereikbaar | Nodeconsole, adres, hostroute, TCP 8006 | Juiste beheeradres/route gebruiken; toegewezen firewall laten controleren |
| Beide gasten hebben geen netwerk | Bridge, uplink en VLAN | VM-kaarten aan juiste segment koppelen |
| Eén gast heeft geen netwerk | Linkstatus, eigen profiel en adres | Interfacenaam en profiel corrigeren in de console |
| IP-connectie werkt, pakketnamen niet | DNS-configuratie en bereikbaarheid van resolver | Bevestigde resolver instellen |
| Netplan-wijziging verdwijnt of conflicteert | Alle YAML's en mogelijke templategeneratie | Eén bewuste bron voor de interfaceconfiguratie gebruiken |
| Pakketrepository geeft 401 op Proxmox | Repositorykeuze en abonnement | Docent configureert passende officiële repository |
| NGINX lokaal OK, client faalt | Luisteradres, subnet, gast- en infrastructuurfirewalls | Bedoelde route en beperkte poortregel herstellen |
| HTTP geeft 403 | Webroot en directory-/bestandsrechten | Gerichte lees- en doorlooprechten herstellen |
| Pagina werkt, CSS ontbreekt | Bestandspad, hoofdletters, HTTP-status en cache | Link en publicatie van `style.css` controleren |
| SSH meldt gewijzigde hostsleutel | Herinstallatie, verkeerde host of dubbele identiteit | Identiteit via console controleren vóór wijziging aan `known_hosts` |
| Snapshotactie niet beschikbaar | Type gastdiskstorage en rechten | Geschikte opslag of begeleide beheeractie gebruiken |
| Back-updoel vol | Capaciteit en retentie op toegewezen storage | Doel met voldoende ruimte laten toewijzen |
| Host of gasten zeer traag | RAM op alle lagen, diskruimte, gelijktijdige belasting | Onnodige gasten stoppen en resourcebudget herzien |

## Antwoorden op de zelfcontrole

1. De gasten delen fysieke CPU-capaciteit, RAM-capaciteit, opslag en netwerk via de hypervisor. Uitval van de enige host treft beide gasten.
2. Een bridge verbindt interfaces op laag 2. Een gateway routeert verkeer naar andere netwerken. NAT vertaalt adressen bij het doorsturen. Die functies zijn niet onderling uitwisselbaar.
3. Ping gebruikt ICMP. De webserver moet daarnaast op TCP 80 luisteren en het verkeer moet toegestaan zijn. Een gestopte NGINX-service kan HTTP blokkeren terwijl ping blijft werken.
4. Een IP-adres rechtstreeks gebruiken vraagt geen naamomzetting. Pakketbronnen worden meestal via namen benaderd en hebben dus werkende DNS nodig.
5. Voor statische inhoud moet `www-data` lezen en directories doorlopen. Schrijfrechten zijn daarvoor overbodig en zouden de mogelijkheden van een gecompromitteerde webdienst vergroten.
6. Een snapshot kan een foutieve wijziging terugdraaien. Een snapshot op dezelfde storage beschermt niet tegen verlies van die storage.
7. Herstel naar een vrije nieuwe VMID, start niet automatisch, koppel de netwerkkaart los en test via de console. Bewaar het origineel. Zo voorkom je overschrijven en dubbele netwerkidentiteit.
