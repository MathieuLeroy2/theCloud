# Mijn verslag van labo 1

Naam:
Klas:
Datum:
Route A of B:

Dit is je enige in te dienen bestand: `verslag.md`. Schrijf hierin je instellingen, stappen en testresultaten. Plaats ook je HTML, CSS en netwerkinstellingen in codeblokken onderaan. Gebruik tekstuitvoer als bewijs; er zijn geen aparte afbeeldingen of bijlagen nodig.

Neem geen wachtwoorden of private SSH-sleutels op.

## H1.1 Mijn plan

### Waar werk ik?

| Vraag | Mijn antwoord |
| --- | --- |
| Mijn naam en klas | In te vullen |
| Route A: eigen laptop, of route B: opleiding? | In te vullen |
| Welk besturingssysteem staat op mijn laptop? | In te vullen |
| Welk programma gebruik ik om de Proxmox-VM te starten? | In te vullen of niet van toepassing |
| Op welke machine oefen ik de Proxmox-installatie? | In te vullen |
| Welke Proxmox-machine gebruik ik daarna verder? | In te vullen |
| Welk adres open ik om Proxmox te beheren? | In te vullen |
| Met welke gebruikersnaam meld ik aan? | In te vullen, zonder wachtwoord |
| Welke aanmeldmethode kies ik bij Realm? | Docent vult aan |

### Mijn netwerk

| Instelling | Mijn waarde |
| --- | --- |
| Netwerkadres, bijvoorbeeld `192.168.77.0/24` | In te vullen |
| Subnetmasker, bijvoorbeeld `255.255.255.0` | In te vullen |
| Gateway: de router naar andere netwerken | In te vullen |
| DNS-server: zoekt adressen bij namen | In te vullen |
| Bridge in Proxmox, bijvoorbeeld `vmbr0` | In te vullen |
| VLAN-tag, alleen als de docent die opgeeft | In te vullen of niet van toepassing |
| Welke adressen deelt DHCP automatisch uit? | Docent vult aan of geen DHCP |
| Zijn mijn vaste IP-adressen vrijgehouden? | Bevestigd door: ... |
| Vanaf welke computer open ik de Proxmox-website? | In te vullen |
| Vanaf welke adressen mag ik SSH en HTTP gebruiken? | Docent vult aan |
| Heb ik een VPN of andere verbinding nodig? | Docent vult aan |

### Mijn virtuele machines

VMID is het nummer dat Proxmox aan een VM geeft. Een hostname is de naam die je in Linux instelt.

| Machine | VMID | Hostname | IP-adres met `/24` of andere prefix |
| --- | --- | --- | --- |
| Proxmox, als ik die als VM gebruik | In te vullen | In te vullen | In te vullen |
| Ubuntu Server | In te vullen | In te vullen | In te vullen |
| Xubuntu | In te vullen | In te vullen | In te vullen |
| Kopie voor de hersteltest | Nieuw vrij nummer | In te vullen | Niet met het netwerk verbinden |

| Waarvoor? | Hoeveel? |
| --- | --- |
| RAM in mijn laptop of toegewezen computer | In te vullen |
| RAM voor Proxmox, inclusief de Linux-VM's | In te vullen |
| RAM voor Ubuntu Server | In te vullen |
| RAM voor Xubuntu | In te vullen |
| RAM dat binnen Proxmox overblijft | In te vullen |
| Vrije ruimte op de fysieke schijf vóór installatie | In te vullen |

Noteer ook het aantal vCPU's en de virtuele schijfgrootte van beide Linux-VM's. Gebruik de tabel uit de opdracht als vertrekpunt.

### Waar bewaar ik de bestanden?

De namen hieronder zijn de namen die ik in Proxmox zie. De docent helpt om de juiste opslag te kiezen.

| Vraag | Antwoord |
| --- | --- |
| Waar staan de ISO-installatiebestanden? | In te vullen |
| Waar komen de VM-schijven? Kan ik daar snapshots maken? | In te vullen |
| Waar komt de back-up? Hoeveel ruimte is er vrij? | In te vullen |
| Staat de back-up op dezelfde fysieke schijf of ergens anders? | In te vullen |
| Hoelang moet ik mijn VM's en back-ups bewaren? | In te vullen |
| Welke stappen moet ik samen met de docent uitvoeren? | In te vullen |


- Welke adressen gebruik ik?
- Hoe verdeel ik het RAM binnen Proxmox?
- Waar bewaar ik mijn back-up? Staat die op een andere fysieke schijf?

## H1.2 Proxmox installeren

- Waar heb ik Proxmox geïnstalleerd?
- Welke versie gebruik ik?
- Via welk adres open ik de beheerpagina?
- Hoe heb ik gecontroleerd dat KVM werkt?

Plak relevante uitvoer uit de console in een codeblok in dit verslag.

## H1.3 Mijn twee VM's

Noteer voor elke machine de naam, het VM-nummer, de processor, het RAM en de schijfgrootte.

- Waar heb ik het vaste adres ingesteld op Ubuntu Server?
- Welk netwerkprofiel heb ik aangepast op Xubuntu?
- Heb ik de installatie-ISO's losgekoppeld?
- Werkt de QEMU Guest Agent?

## H1.4 Mijn netwerktests

Vul in wat je werkelijk hebt gezien. Werkt iets niet? Schrijf de fout op en vertel wat je hebt geprobeerd.

| Test | Op welke machine? | Wat zag ik? |
| --- | --- | --- |
| IP-adres en gateway bekijken | Beide machines | In te vullen |
| De andere machine pingen | Beide machines | In te vullen |
| `archive.ubuntu.com` opzoeken met DNS | Beide machines | In te vullen |
| `sudo apt update` | Beide machines | In te vullen |
| SSH naar Ubuntu Server | Xubuntu | In te vullen |
| SSH-vingerafdruk vergelijken met de serverconsole | Xubuntu en Ubuntu Server | In te vullen |
| Opnieuw testen na een herstart | Beide machines | In te vullen |

## H1.5 Mijn website

- Waar heb ik de HTML en CSS gemaakt?
- Hoe heb ik de bestanden geüpload en in de webmap geplaatst?
- Wie is eigenaar van de gepubliceerde bestanden?
- Kan `www-data` de bestanden lezen? Kan die gebruiker ze ook wijzigen?
- Welke verbindingen laat mijn firewall toe?
- Werkt een nieuwe SSH-verbinding nadat de firewall aanstaat?

Plak de `curl`-resultaten voor HTML en CSS in codeblokken. Beschrijf ook wat je in de browser zag.

## H1.6 De fout met NGINX

| Moment | Kreeg ik antwoord op ping? | Werkte de website? | Stond NGINX aan? |
| --- | --- | --- | --- |
| Vóór het stoppen van NGINX | In te vullen | In te vullen | In te vullen |
| Terwijl NGINX uitstaat | In te vullen | In te vullen | In te vullen |
| Na het starten van NGINX | In te vullen | In te vullen | In te vullen |

Leg in twee of drie zinnen uit waarom je deze resultaten kreeg. Wat zag je bij poort 80?

## H1.7 Terugzetten

### Mijn snapshot

- Naam en tijdstip:
- Welke zin stond eerst op de website?
- Wat heb ik ervan gemaakt?
- Welke zin zag ik na Rollback?

### Mijn back-up

- Naam of ID van de back-up en tijdstip:
- Waar staat de back-up?
- VM-nummer van het origineel:
- Nieuw VM-nummer van de kopie:
- Heb ik de netwerkkaart vóór de eerste start losgekoppeld?
- Wat toonde `curl http://localhost` in de console van de kopie?
- Is de kopie nu afgesloten en het origineel bewaard?

Waarom heb ik de kopie zonder netwerk getest? Wat is het verschil tussen mijn snapshot en mijn back-up?

## H1.8 Wat heb ik geleerd?

Beantwoord de zeven vragen onderaan de theorie in je eigen woorden.

1. De laptop uitzetten:
2. De bridge vergelijken met een netwerkapparaat en de taak van de gateway:
3. Ping terwijl NGINX uitstaat:
4. Een IP-adres werkt, een naam niet:
5. Wat `www-data` mag:
6. Een kapotte schijf met de snapshot erop:
7. De netwerkkaart van de herstelde kopie:

Beschrijf tot slot één probleem dat je had. Welke test hielp je om het te vinden? Wat zou je de volgende keer anders doen?

## Mijn bestanden

Plaats hieronder de volledige inhoud van `index.html`, `style.css` en je gebruikte netwerkinstellingen in afzonderlijke codeblokken. Schrijf de bestandsnaam boven elk blok. Geen extra bijlagen of links naar bestanden op je laptop.

Laat wachtwoorden weg. Vervang ze in configuraties door `<WEGGELATEN>`.
