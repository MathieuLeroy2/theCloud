# Oplossingen bij labo 1

Hier zie je één manier om het labo uit te voeren. Vergelijk de stappen met wat jij hebt gedaan. Lees ook de uitleg bij de commando's: die vertelt wat je controleert en wat je zou moeten zien.

We gebruiken deze voorbeeldadressen:

| Machine of instelling | Voorbeeld |
| --- | --- |
| Proxmox | `192.168.77.10` |
| Ubuntu Server | `192.168.77.100` |
| Xubuntu | `192.168.77.200` |
| Gateway en DNS-server | `192.168.77.2` |
| Subnetmasker | `/24`, dus `255.255.255.0` |

**Gebruik de waarden van je eigen verslag als die anders zijn.** Doe dat ook in de commando's hieronder. De docent heeft het netwerk vooraf voorbereid.

Boven elk groepje commando's staat waar je werkt. De console is het scherm van een VM dat je in Proxmox opent. De terminal is het venster waarin je commando's typt.

## H1.1 Je instellingen opschrijven

### De adressen

In ons voorbeeld hebben Ubuntu Server en Xubuntu elk een vast adres. De gateway staat in hetzelfde netwerk. Die router helpt de machines om internet te bereiken.

De docent bevestigt dat de vaste adressen niet door DHCP aan andere machines worden gegeven. In het voorbeeld kan DHCP bijvoorbeeld `.128` tot en met `.191` uitdelen. `.10`, `.100` en `.200` vallen daarbuiten.

Een adres pingen is geen betrouwbare manier om te bewijzen dat het vrij is. Een computer kan uitstaan of ping blokkeren en dat adres toch gebruiken.

### Het geheugen

De Proxmox-VM krijgt 8 GB RAM. Daarvan geven we 2 GB aan Ubuntu Server en 3 GB aan Xubuntu. Er blijft ongeveer 3 GB over voor Proxmox en het werk dat Proxmox zelf doet.

Je laptop heeft daarnaast geheugen nodig voor zijn eigen Windows of Linux. Houd daar rekening mee als je andere programma's open hebt staan.

### De back-up

Noteer de opslagplaats die je docent opgeeft. Vraag ook op welke fysieke schijf of server de kopie staat.

Een back-up op dezelfde laptop is bruikbaar om het terugzetten te oefenen. Als je die laptop verliest, ben je die back-up ook kwijt. Daarvoor heb je een kopie op een andere plaats nodig.

## H1.2 Proxmox installeren

### Stap 1 Maak de Proxmox-VM op je laptop

**Waar? Op je laptop, bijvoorbeeld in VMware Workstation.**

Gebruik je de schoolomgeving? Ga dan naar stap 2 en voer de installatie alleen uit op de oefenmachine die de docent aanwijst.

**VM** betekent *Virtual Machine*: een virtuele computer. Het bestand waarmee je Proxmox installeert heet een **ISO**: een bestand dat een installatieschijf voorstelt.

1. Maak een nieuwe VM voor een 64-bits Linux-systeem.
2. Koppel de Proxmox-ISO. Een ISO is het bestand waarmee je het besturingssysteem installeert.
3. Geef de VM 4 vCPU's, 8 GB RAM en een virtuele schijf van 100 GB.
4. Zet het doorgeven van hardwarevirtualisatie aan. In Workstation heet die optie bijvoorbeeld `Virtualize Intel VT-x/EPT or AMD-V/RVI`. Intel en AMD zijn de processormerken; VT-x/AMD-V geven VM’s hulp van de echte processor. **EPT** betekent *Extended Page Tables* en **RVI** *Rapid Virtualization Indexing*. Die processorfuncties helpen met de geheugenvertaling voor VM’s. Je kiest hier de optie die bij je processor hoort.
5. Kies het voorbereide NAT-netwerk. Controleer met je verslag welk subnet en welke gateway daarbij horen.
6. Start de VM.

### Stap 2 Doorloop de Proxmox-installatie

**Waar? Op het scherm van de nieuwe Proxmox-VM of de toegewezen oefenmachine.**

1. Start de installer en accepteer de licentievoorwaarden.
2. Kies de virtuele schijf waarop je Proxmox wilt installeren. Controleer dat dit de schijf van je oefenmachine is.
3. Laat de docent de verdeling van de schijfruimte nakijken. Je hebt ruimte nodig voor Proxmox, de ISO-bestanden en de schijven van de twee Linux-VM's. Voor de Proxmox-systeemschijf gebruiken we bijvoorbeeld **ext4**, een indeling om Linux-bestanden op een schijf te bewaren. De gastschijven komen op **LVM-thin**. LVM betekent *Logical Volume Manager*: software die schijfruimte verdeelt in volumes. *Thin* betekent dat de fysieke ruimte groeit wanneer je gegevens toevoegt. Daarop kunnen we ook snapshots maken.
4. Stel België, tijdzone `Europe/Brussels` en het juiste toetsenbord in.
5. Gebruik `Student123` als beheerwachtwoord en vul de opgegeven contactgegevens in.
6. Stel de naam en netwerkgegevens in. In ons voorbeeld is de volledige naam `pve-lab.lab.test`, het adres `192.168.77.10/24`, de gateway `192.168.77.2` en de DNS-server `192.168.77.2`.
7. Bekijk de samenvatting en start de installatie.
8. Ontkoppel na afloop de ISO en herstart. Anders kun je opnieuw in de installer terechtkomen.

Een bestaande gedeelde Proxmox-server van de opleiding installeer je niet opnieuw. Je oefent de installatie dan op een aparte machine en gebruikt daarna de omgeving die de docent opgeeft.

### Stap 3 Open Proxmox in de browser

**Waar? Op je laptop of de computer die in je verslag staat.**

Open in het voorbeeld:

```text
https://192.168.77.10:8006
```

Een eigen nieuwe Proxmox-installatie kan een certificaatwaarschuwing tonen. Controleer eerst het adres via het scherm van de Proxmox-machine. Vraag hulp als je niet zeker bent dat je de juiste server opent. Op school volg je de afgesproken manier om aan te melden.

Op je eigen installatie meld je aan als `root`. Kies bij **Realm** voor `Linux PAM`. *Realm* betekent hier welke aanmeldmethode Proxmox gebruikt. **PAM** (*Pluggable Authentication Modules*) laat Proxmox de lokale Linux-accounts controleren. Op de schoolomgeving gebruik je het account en de aanmeldmethode die de docent geeft.

### Stap 4 Kijk of Proxmox klaar is voor je VM's

**Waar? In de Proxmox-beheerpagina.**

Zoek de netwerkbridge, meestal `vmbr0`. Bekijk ook de opslagplaatsen. Vaak zie je namen zoals `local` en `local-lvm`. Controleer welke plaats bedoeld is voor ISO's en welke voor VM-schijven.

Open op je **eigen Proxmox-machine** de shell. Op een gedeelde schoolserver kan de docent deze controle tonen:

```bash
pveversion
ls -l /dev/kvm
```

Het eerste commando toont de versie. Het tweede hoort een regel voor `/dev/kvm` te tonen. Staat er `No such file or directory`? Laat de docent de virtualisatie-instelling nakijken.

De echte eindtest volgt bij het starten van Ubuntu en Xubuntu: die moeten ook met KVM kunnen starten.

## H1.3 Ubuntu Server en Xubuntu installeren

### Stap 1 Maak de twee VM's

**Waar? In Proxmox.**

Zet de twee cursus-ISO's op de afgesproken opslagplaats. Op school kunnen ze al klaarstaan.

Maak daarna de machines uit deze tabel. Gebruik je eigen vrije VM-nummers. Zo’n nummer heet een **VMID** (*Virtual Machine ID*): Proxmox gebruikt het om de juiste machine te kiezen.

De schijfcontroller **VirtIO SCSI** is een virtueel onderdeel waarmee Linux de schijf aanspreekt. **SCSI** betekent *Small Computer System Interface*: de naam van de gebruikte afspraken voor opslagapparaten. Je hoeft daarvoor in dit labo geen fysieke kabels aan te sluiten.

| Instelling | Ubuntu Server | Xubuntu |
| --- | --- | --- |
| Naam in Proxmox | `cloud-web` | `cloud-client` |
| Processor | 2 vCPU | 2 vCPU |
| RAM | 2048 MiB | 3072 MiB |
| Schijf | 24 GB | 24 GB |
| Schijfcontroller | VirtIO SCSI | VirtIO SCSI |
| Netwerkkaart | VirtIO | VirtIO |
| Bridge | Volgens verslag | Dezelfde bridge |
| Installatiebestand | Ubuntu Server-ISO | Xubuntu-ISO |

Zet de schijven op de opslagplaats waarop snapshots mogelijk zijn. Laat de processor- en opstartkeuzes overeenkomen met de afspraken van de docent. **BIOS** (*Basic Input/Output System*) en **UEFI** (*Unified Extensible Firmware Interface*) zijn twee soorten startsoftware waarmee de VM haar besturingssysteem kan laden. UEFI gebruikt soms een extra **EFI-schijf** voor zijn instellingen; EFI betekent *Extensible Firmware Interface*.

Een **VLAN** (*Virtual Local Area Network*) is een apart netwerk binnen gedeelde netwerkinfrastructuur. De **VLAN-tag** is het nummer waarmee die scheiding wordt aangeduid. Vul alleen een tag in als de docent die opgeeft. Houd het RAM voor deze oefening vast ingesteld. Proxmox vraagt dat in **MiB** (*mebibyte*). 1.024 MiB is 1 **GiB** (*gibibyte*); 2.048 MiB is dus 2 GiB, vaak afgerond ‘2 GB RAM’ genoemd.

### Stap 2 Installeer Ubuntu Server

**Waar? In de console van `cloud-web`.**

1. Kies taal, toetsenbord en de gewone serverinstallatie. Een grafisch bureaublad is hier niet nodig.
2. Kies bij de netwerkkaart voor handmatige IPv4-instellingen.
3. Vul bij **Subnet** `192.168.77.0/24` in en bij **Address** `192.168.77.100`. Let op het verschil: het eerste is het netwerk, het tweede is het adres van deze machine.
4. Vul `192.168.77.2` in als gateway en DNS-server, of gebruik je eigen waarden.
5. Gebruik de virtuele schijf van 24 GB voor Ubuntu. Volg de eenvoudige schijfindeling van de installer.
6. Geef de computer de naam `cloud-web`. Maak de gebruiker `student` met wachtwoord `Student123`. In de commando's hieronder gebruiken we die gebruikersnaam.
7. Vink de installatie van **OpenSSH Server** aan. Extra serverprogramma's zijn nu niet nodig.
8. Rond af, ontkoppel de ISO en herstart.

**Controle op Ubuntu Server:**

```bash
hostnamectl
ip -br address
ip route
```

Je wilt de naam `cloud-web`, het adres `192.168.77.100/24` en een regel met `default via 192.168.77.2` zien. De naam van de netwerkkaart kan bij jou verschillen.

### Alleen als het serveradres niet goed staat

Heeft de installer alles goed ingesteld? Sla dit stukje dan over.

**Waar? In de Proxmox-console van Ubuntu Server.**

Bekijk eerst welke netwerkkaart en instellingen er zijn:

```bash
ip -br address
sudo netplan get
sudo ls -l /etc/netplan
```

Netplan bewaart de instellingen in een YAML-bestand. YAML is een tekstformaat voor instellingen waarin inspringen met spaties belangrijk is. `renderer: networkd` kiest het programma dat die netwerkinstellingen uitvoert. `ethernets` groepeert de bekabelde netwerkkaarten. `addresses` is het eigen adres; `routes` bevat de weg naar andere netwerken; `nameservers` bevat de DNS-servers. Maak eerst een kopie van de huidige bestanden:

```bash
sudo mkdir -p /root/h1-netwerk-backup
sudo cp -a /etc/netplan/. /root/h1-netwerk-backup/
```

Pas het bestand aan dat jouw netwerkkaart al instelt. Maak geen tweede bestand dat dezelfde kaart ook probeert in te stellen. Je kunt [dit voorbeeld](bestanden/01-lab-server.yaml.example) gebruiken. Vervang daarin de kaartnaam, bijvoorbeeld `enp6s18`, door je echte kaartnaam.

Stel dat het bestaande bestand `50-cloud-init.yaml` heet. Dan gebruik je:

```bash
sudoedit /etc/netplan/50-cloud-init.yaml
sudo chmod 600 /etc/netplan/50-cloud-init.yaml
sudo netplan generate
```

Met `sudoedit` bewerk je het bestand. `chmod 600` beperkt de toegang tot de beheerder. `netplan generate` controleert of Netplan de instellingen kan verwerken. Verschijnt een foutmelding? Los die eerst op.

Probeer daarna de instellingen tijdelijk:

```bash
sudo netplan try --timeout 120
```

Je krijgt tijd om te controleren en te bevestigen. Kijk opnieuw naar adres en gateway en test de verbinding. Bevestig alleen als het werkt. Na een mislukte poging controleer je ook het bestand op schijf voordat je herstart.

Werk je met een schooltemplate die de instellingen zelf opnieuw schrijft? Laat de docent dat aanpassen. De tekstbestanden mogen elkaar niet blijven overschrijven.

### Stap 3 Installeer Xubuntu

**Waar? In de console van `cloud-client`.**

Installeer Xubuntu met het Xfce-bureaublad, een gewone gebruiker en een browser. Kies de minimale installatie als die beschikbaar is. Je mag tijdens het installeren tijdelijk een adres via DHCP gebruiken.

Ontkoppel na afloop de ISO en start Xubuntu opnieuw. Open daarna de terminal.

### Stap 4 Geef Xubuntu een vast adres

**Waar? In de terminal op Xubuntu.**

```bash
sudo hostnamectl set-hostname cloud-client
nmcli device status
nmcli -f NAME,UUID,TYPE,DEVICE connection show --active
```

Het eerste commando stelt de computernaam in. De andere twee tonen je netwerkkaart en de actieve verbinding.

Zoek de regel van de bekabelde verbinding. Kopieer de waarde in de kolom **UUID**. **UUID** betekent *Universally Unique Identifier*: een lange unieke code. Hier is dat de code van het verbindingsprofiel, de bewaarde instellingen van één netwerkverbinding. Zo kiezen we zeker het juiste profiel, ook als de naam spaties bevat.

Vervang `UUID-UIT-JOUW-LIJST` hieronder door die waarde. De variabele `LAB_CONNECTION` bewaart het nummer voor de volgende commando's:

```bash
LAB_CONNECTION='UUID-UIT-JOUW-LIJST'
sudo nmcli connection modify "$LAB_CONNECTION" \
  ipv4.method manual \
  ipv4.addresses '192.168.77.200/24' \
  ipv4.gateway '192.168.77.2' \
  ipv4.dns '192.168.77.2' \
  ipv4.ignore-auto-dns yes
sudo nmcli connection up "$LAB_CONNECTION"
```

De regels met `\` vormen samen één commando. Je geeft daarmee het vaste adres, de gateway en DNS op. Het laatste commando activeert de aangepaste verbinding.

Controleer het resultaat:

```bash
ip -br address
ip route
nmcli device show
```

Je verwacht het adres `.200/24` en de gateway uit je verslag. Gebruik op Xubuntu NetworkManager. Kopieer het Netplan-voorbeeld voor de server hier niet zomaar naartoe.

### Stap 5 Werk beide machines bij

**Waar? Eerst in Proxmox.**

Zet bij de opties van beide VM's **QEMU Guest Agent** aan. Sluit de gasten netjes af en start ze opnieuw, zodat de virtuele verbinding voor de agent beschikbaar is.

**Daarna op beide Linux-machines:**

```bash
sudo apt update
sudo apt upgrade
sudo apt install qemu-guest-agent curl
```

`apt update` haalt de lijst met beschikbare pakketten op. `apt upgrade` werkt geïnstalleerde pakketten bij. Met het laatste commando installeer je de agent en `curl`, waarmee we de website gaan testen.

Start de agent en bekijk de klok:

```bash
sudo systemctl start qemu-guest-agent
systemctl status qemu-guest-agent --no-pager
timedatectl status
```

De agent hoort te draaien. De datum en tijd horen te kloppen; de klok moet automatisch worden bijgewerkt. In Proxmox kun je nu ook informatie uit de VM zien.

Start de agent niet? Controleer eerst de optie in Proxmox en of de VM daarna opnieuw gestart is. De docent kan helpen als de virtuele verbinding voor de agent ontbreekt.

## H1.4 Het netwerk testen

### Stap 1 Test vanaf Xubuntu

**Waar? In de terminal op Xubuntu.**

```bash
ping -c 3 192.168.77.100
resolvectl query archive.ubuntu.com
sudo apt update
```

- `ping -c 3` stuurt drie testberichten. Je verwacht antwoorden van je server.
- `resolvectl query` vraagt DNS om een adres bij de naam te zoeken. Je verwacht één of meer IP-adressen.
- `apt update` moet de pakketlijsten zonder netwerkfout kunnen ophalen.

### Stap 2 Test vanaf Ubuntu Server

**Waar? In de terminal of console van Ubuntu Server.**

```bash
ping -c 3 192.168.77.200
resolvectl query archive.ubuntu.com
sudo apt update
```

Nu verwacht je bij ping antwoorden van Xubuntu. Ook DNS en het ophalen van pakketlijsten moeten werken.

### Stap 3 Controleer SSH op de server

**Waar? Op Ubuntu Server.**

```bash
sudo systemctl status ssh --no-pager
```

Staat de dienst op `active (running)`? Dan draait de SSH-server. `--no-pager` zorgt dat het resultaat gewoon in je terminal verschijnt.

Is OpenSSH nog niet geïnstalleerd? Voer dan uit:

```bash
sudo apt install openssh-server
sudo systemctl enable --now ssh
```

Daarmee installeer en start je SSH. Het programma start voortaan ook mee met Ubuntu.

### Stap 4 Vergelijk de servercode en meld aan

**Waar? In de vertrouwde console van Ubuntu Server.**

```bash
sudo ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

Noteer de code die met `SHA256:` begint. Dit is de vingerafdruk die je straks vergelijkt. **SHA** betekent *Secure Hash Algorithm*. SHA256 berekent uit de sleutel een herkenningscode met een vaste lengte. Je vergelijkt die code; je hoeft de berekening niet zelf uit te voeren. Ze hoort bij de hostsleutel van deze server.

**Waar? Op Xubuntu.**

```bash
ssh -o HostKeyAlgorithms=ssh-ed25519 student@192.168.77.100
```

Bij de eerste verbinding toont SSH een vingerafdruk. Is die gelijk aan de code in de serverconsole? Dan kun je bevestigen en aanmelden. We geven hier het sleuteltype mee zodat je dezelfde soort code vergelijkt.

Voer na het aanmelden `hostname` uit. Je hoort `cloud-web` te zien: je werkt nu op de server. Typ `exit` om terug te keren naar de terminal van Xubuntu.

Herstart beide machines en controleer daarna opnieuw hun adressen en de pingverbinding. Je vaste instellingen moeten bewaard zijn.

## H1.5 Je website op de server zetten

### Stap 1 Installeer NGINX

**Waar? Op Ubuntu Server.**

```bash
sudo apt update
sudo apt install nginx ufw
sudo systemctl enable --now nginx
```

Je installeert NGINX en de firewall UFW. Daarna start je NGINX en laat je het programma automatisch met Ubuntu starten.

Controleer de webserver op de server zelf:

```bash
sudo nginx -t
curl -I http://localhost
```

`nginx -t` hoort te melden dat de instellingen goed zijn. Bij `curl` verwacht je een antwoord zoals `200 OK`.

**Waar? Op Xubuntu.**

Open `http://192.168.77.100` in de browser. Je hoort de standaardpagina van NGINX te zien.

### Stap 2 Maak en upload je eigen website

**Waar? Op Xubuntu.**

Pas [de voorbeeldwebsite](bestanden/website/index.html) aan of maak je eigen HTML en CSS. Bewaar `index.html` en `style.css` samen, bijvoorbeeld in `~/Downloads/website`.

**Waar? Op Ubuntu Server, als gebruiker `student`.**

Maak een map waarin je de bestanden mag uploaden:

```bash
mkdir -p ~/upload-website
```

`~` betekent je eigen gebruikersmap. Je maakt dus nog niets in de webmap.

**Waar? Terug op Xubuntu.**

```bash
cd ~/Downloads/website
sftp student@192.168.77.100
```

Je komt in de SFTP-prompt. Typ daar:

```text
put index.html upload-website/index.html
put style.css upload-website/style.css
ls upload-website
bye
```

`put` verstuurt het bestand. `ls` toont of de bestanden in de servermap staan. `bye` sluit SFTP af.

Je mag ook een grafische SFTP-client gebruiken. Kies **SFTP**, poort **22**, je serveradres en je gebruikersnaam. Upload naar de map `upload-website` in je gebruikersmap.

### Stap 3 Zet de bestanden in de webmap

**Waar? Op Ubuntu Server, als gebruiker `student`.**

```bash
sudo install -d -o root -g root -m 0755 /var/www/html
sudo install -o root -g root -m 0644 ~/upload-website/index.html /var/www/html/index.html
sudo install -o root -g root -m 0644 ~/upload-website/style.css /var/www/html/style.css
```

Deze commando's zorgen dat de webmap bestaat en kopiëren de bestanden ernaartoe.

- `-o root -g root` maakt de beheerder eigenaar van de geplaatste bestanden.
- `-m 0644` laat anderen de bestanden lezen, maar niet wijzigen.
- `-m 0755` laat anderen de map openen en er bestanden in opzoeken, maar niets toevoegen of verwijderen.

NGINX gebruikt de gebruiker `www-data`. Die gebruiker kan de pagina zo wel lezen, maar niet wijzigen.

### Stap 4 Controleer de rechten

**Waar? Op Ubuntu Server.**

```bash
ls -ld /var/www/html
ls -l /var/www/html/index.html /var/www/html/style.css
sudo -u www-data head -n 1 /var/www/html/index.html
```

Bij de eerste regels zie je `root root` als eigenaar en groep. Het laatste commando leest de eerste HTML-regel als gebruiker `www-data`. Zie je bijvoorbeeld `<!doctype html>`? Dan kan die gebruiker het bestand lezen.

Controleer ook of die gebruiker mag schrijven:

```bash
sudo -u www-data test -w /var/www/html/index.html
echo $?
```

Voer die twee regels direct na elkaar uit. `test -w` controleert het schrijfrecht. `echo $?` toont het resultaat van die controle: **1 betekent hier nee**, **0 betekent ja**. Je verwacht **1**.

Voor een wijziging aan HTML of CSS hoef je NGINX niet te herstarten. De browser kan wel een oude versie bewaren. Vernieuw de pagina volledig als je nog de oude tekst ziet.

### Stap 5 Zet de firewall aan

**Waar? Op je eigen Ubuntu Server-VM. Niet op Proxmox.**

Je laat eerst SSH en HTTP toe vanuit jouw labnetwerk. Gebruik hieronder je eigen netwerk als dat afwijkt van het voorbeeld. Verbind je via een ander beheernetwerk? Laat de docent ook daarvoor de juiste SSH-regel aangeven vóór je de firewall aanzet.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow from 192.168.77.0/24 to any port 22 proto tcp
sudo ufw allow from 192.168.77.0/24 to any port 80 proto tcp
```

De eerste twee regels blokkeren nieuwe binnenkomende verbindingen, behalve wat je toestaat, en laten uitgaande verbindingen toe. De andere regels laten SSH op 22 en HTTP op 80 toe vanuit het labnetwerk.

Houd de Proxmox-console open. Zet nu de firewall aan:

```bash
sudo ufw enable
sudo ufw status verbose
```

Controleer of de regels voor poorten 22 en 80 erbij staan.

### Stap 6 Test opnieuw vanaf Xubuntu

**Waar? Op Xubuntu.**

Open eerst een **nieuwe** SSH-verbinding. Die moet nog werken. Vraag daarna beide websitebestanden op:

```bash
curl -I http://192.168.77.100/index.html
curl -I http://192.168.77.100/style.css
```

Je verwacht bij beide een antwoord zoals `200 OK`. Open de pagina ook in de browser en controleer de opmaak.

Een firewall van de opleiding kan verkeer ook blokkeren. Je eigen UFW-regel verandert die schoolfirewall niet. Vraag de docent om dat samen na te kijken als de lokale tests wel werken.

## H1.6 De website werkt niet meer

### Stap 1 Stop alleen NGINX

**Waar? Op Ubuntu Server.**

```bash
sudo systemctl stop nginx
systemctl is-active nginx
sudo ss -ltnp
```

`is-active` hoort `inactive` te tonen. Met `ss` bekijk je welke programma's op TCP-poorten wachten. NGINX hoort nu niet meer op poort 80 te staan.

### Stap 2 Test vanaf Xubuntu

**Waar? Op Xubuntu.**

```bash
ping -c 3 192.168.77.100
curl --max-time 5 -I http://192.168.77.100
```

Normaal krijg je nog pingantwoorden, maar geen werkende webpagina. Met `--max-time 5` laat je `curl` maximaal vijf seconden wachten.

**Wat betekent dit?** De server staat nog aan en het netwerk kan nog werken. Alleen het programma dat de webpagina verstuurt, staat uit. Daarom is ping alleen niet genoeg om je website te testen.

### Stap 3 Start NGINX opnieuw

**Waar? Op Ubuntu Server.**

Je kunt eerst de laatste meldingen bekijken:

```bash
sudo journalctl -u nginx -n 20 --no-pager
```

Dit toont de laatste twintig logregels van NGINX. Een log is een lijst met meldingen van een programma.

Controleer daarna de instellingen en start de dienst:

```bash
sudo nginx -t
sudo systemctl start nginx
systemctl is-active nginx
```

Je verwacht nu `active`. Open vanaf Xubuntu de website opnieuw. Werkt die ook daar? Dan is de fout hersteld.

## H1.7 Een vorige versie terugzetten

### Stap 1 Maak de snapshot

**Waar? Op Ubuntu Server.**

```bash
sudo shutdown -h now
```

Dit sluit de VM netjes af. Wacht tot Proxmox toont dat de machine gestopt is.

**Daarna in Proxmox:** selecteer de originele server-VM. Open **Snapshots** en maak `h1-website`. Zet in de beschrijving dat de eigen website werkt. Laat het bewaren van RAM uitstaan.

Kun je geen snapshot maken? Vraag of je de juiste opslagplaats en rechten gebruikt. De docent helpt bij stappen die op een gedeelde server niet voor jouw account beschikbaar zijn.

### Stap 2 Verander de pagina en zet de snapshot terug

1. Start Ubuntu Server.
2. Open daar met `sudoedit /var/www/html/index.html` het HTML-bestand.
3. Verander één herkenbare zin naar `TEST NA SNAPSHOT` en bewaar.
4. Open de pagina vanaf Xubuntu en controleer of die tekst verschijnt.
5. Sluit Ubuntu Server weer netjes af.
6. Selecteer in Proxmox de snapshot en kies **Rollback**.
7. Start Ubuntu Server en vernieuw de pagina op Xubuntu.

De tekst van vóór de wijziging moet weer verschijnen. Noteer dat resultaat. Ook andere wijzigingen sinds de snapshot zijn nu teruggedraaid.

### Stap 3 Maak een back-up

**Waar? In Proxmox, bij de originele Ubuntu Server-VM.**

1. Sluit de VM netjes af en controleer dat haar status `stopped` is.
2. Open **Backup** en kies de opslagplaats van je verslag.
3. Maak een back-up in modus **Stop**. De VM staat al uit, dus er veranderen tijdens de kopie geen bestanden in de VM.
4. Wacht tot de taak zonder fouten klaar is. Noteer het tijdstip, de naam of ID van de back-up en de opslagplaats.

Kies niet zomaar `local` als daar weinig ruimte is. Gebruik de afgesproken plaats. Je mag de originele VM na de back-up weer starten.

### Stap 4 Zet de back-up terug als aparte kopie

**Waar? In Proxmox.**

1. Selecteer de back-up die je net hebt gemaakt en kies **Restore**.
2. Geef een **nieuw, vrij VMID** op. Gebruik alleen een nummer dat je mag gebruiken. Overschrijf geen bestaande VM.
3. Kies de afgesproken opslag voor de schijven. Laat **Start after restore** uitstaan. Kies een nieuw MAC-adres als die optie beschikbaar is.
4. Geef de kopie de naam `cloud-web-hersteltest`. Zet automatisch opstarten uit.
5. Open bij de kopie de instellingen van de netwerkkaart en vink **Disconnect** aan. Doe dit vóór je haar start.
6. Start de kopie en open haar console in Proxmox.

**Waarom zonder netwerk?** De back-up bevat nog het vaste IP-adres van de originele server. Twee actieve machines met datzelfde adres op één netwerk veroorzaken problemen. Alleen een nieuw MAC-adres kiezen verandert het vaste IP-adres in Linux niet.

### Stap 5 Test de kopie

**Waar? In de console van de herstelde kopie.**

```bash
hostname
systemctl is-active nginx
curl -I http://localhost
curl http://localhost
```

Je hoort de oorspronkelijke computernaam, een actieve NGINX en je website terug te zien. De naam die je in Proxmox aan de kopie gaf, verandert de naam in Ubuntu niet automatisch.

Test eventueel ook de CSS:

```bash
curl -I http://localhost/style.css
```

`localhost` werkt ook zonder aangesloten netwerkkaart. Je vraagt de pagina immers op dezelfde computer op.

Sluit de kopie na de test af en laat haar netwerkkaart losgekoppeld. Bewaar de originele server voor het volgende hoofdstuk. De docent zegt wanneer de testkopie weg mag.

Je hebt nu twee dingen geoefend: teruggaan naar een snapshot en een machine terugzetten uit een aparte back-up. Alleen een back-up op andere fysieke opslag helpt ook bij verlies van de oorspronkelijke schijf.

## H1.8 Indienen en bewaren

Vul het [verslagsjabloon](bestanden/verslag-sjabloon.md) aan met je eigen resultaten. Werkt iets niet? Schrijf op wat je ziet en wat je hebt geprobeerd. Dat helpt meer dan een screenshot met alleen de tekst ‘werkt niet’.

Bewaar je originele server en client. Werk je op je laptop? Sluit eerst de twee Linux-machines af en daarna Proxmox. Op de schoolomgeving volg je de afspraken van de docent.

## Als iets niet werkt

### Ubuntu of Xubuntu start niet en je ziet een KVM-fout

Controleer met de docent of Workstation hardwarevirtualisatie doorgeeft. Verander nog geen IP-adressen: de VM kan nog niet eens starten. Lukt dit niet op jouw laptop, dan gebruik je de schoolomgeving.

### Je kunt de Proxmox-pagina niet openen

Kijk op het scherm van de Proxmox-machine welk IP-adres ze heeft. Gebruik in de browser `https://` en poort `:8006`. Controleer daarna de verbinding van je laptop met dat netwerk.

### De VM's bereiken elkaar niet

Controleer hun adressen met `ip -br address`. Kijk in Proxmox of beide netwerkkaarten aan de juiste bridge en, indien gebruikt, hetzelfde toegewezen VLAN hangen. Controleer ook of de kaarten verbonden zijn.

### Een adres werkt, maar een naam niet

Bekijk je DNS-instelling. Gebruik de DNS-server van de verslag. Test met `resolvectl query archive.ubuntu.com`.

### De pagina werkt op de server, maar niet op Xubuntu

Controleer eerst of je op Xubuntu het serveradres gebruikt en niet `localhost`. Bekijk daarna de firewallregels en of NGINX op poort 80 bereikbaar is. De docent helpt bij de firewall van de opleiding.

### Je krijgt 403 of je CSS ontbreekt

Bij `403` kijk je naar `/var/www/html` en de leesrechten. Ontbreekt alleen de opmaak? Controleer of `style.css` in die map staat en of de naam in de HTML exact overeenkomt, ook de hoofdletters. Vernieuw daarna de pagina volledig.

### SSH zegt dat de hostsleutel gewijzigd is

Mogelijk is de server opnieuw geïnstalleerd, maar je kunt ook bij de verkeerde machine uitkomen. Vergelijk de vingerafdruk eerst via de console. Wis niet zomaar de waarschuwing.

### Instellingen verdwijnen na een herstart

Controleer of je het juiste netwerkprofiel hebt aangepast. Op Ubuntu Server kunnen meerdere YAML-bestanden dezelfde kaart instellen. Een schooltemplate kan ook instellingen terugschrijven. Laat de docent dat samen met je bekijken.

### De back-up of snapshot lukt niet

Bekijk de fout in het taakvenster van Proxmox. Is er nog vrije ruimte? Ondersteunt de gekozen opslag snapshots? Mag je account die taak uitvoeren? Gebruik de opslag en begeleiding die in je verslag staan.

### Alles wordt erg traag

Kijk hoeveel RAM en schijfruimte op je laptop en in Proxmox vrij zijn. Sluit onnodige programma's en VM's af. Extra virtuele processoren maken de echte processor niet krachtiger.

## Antwoorden op de zelfcontrole

1. Als Proxmox op die laptop draait, stoppen Ubuntu Server en Xubuntu mee wanneer je de laptop uitzet. Ze gebruiken de echte computer onder Proxmox.
2. Je kunt de bridge vergelijken met een switch waaraan beide VM's hangen. De gateway is de router waarmee ze andere netwerken bereiken, bijvoorbeeld om updates van internet te downloaden.
3. De server staat nog aan en kan op ping antwoorden. NGINX staat uit, dus er is geen webserver die de pagina verstuurt.
4. Controleer DNS. Die dienst zoekt het adres bij een naam op.
5. Nee. `www-data` moet het bestand kunnen lezen en de map kunnen openen. Voor het versturen van de HTML zijn geen schrijfrechten nodig.
6. Nee, de snapshot stond op de verloren schijf. Je had een bruikbare back-up op andere fysieke opslag nodig.
7. De kopie heeft nog hetzelfde IP-adres als het origineel. Zonder netwerkverbinding kan ze daarmee geen conflict veroorzaken. Je test haar eigen website via de console met `localhost`.
