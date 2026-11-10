# Versies en controle van de cursus

Deze cursus is inhoudelijk uitgewerkt voor de onderstaande basis. De voorbeelden zijn gecontroleerd zoals verderop beschreven. Dat is niet hetzelfde als elk labo volledig uitvoeren op de Proxmox- en Windows-omgeving van de opleiding.

## Basis per leseditie

Alle laboaccounts gebruiken `Student123`, inclusief herstelwachtwoorden en SSH-wachtzinnen. Bij Windows-laboaccounts staat een verplichte eerste wachtwoordwijziging uit. De MQTT-aanmeld-, rechten- en persistentietests zijn ook met `Student123` voor beide accounts herhaald en slagen.

| Onderdeel | Keuze in de cursus | Nog te doen op de opleiding |
| --- | --- | --- |
| Proxmox VE | 9.x | Exacte ISO, netwerk en opslag vastleggen |
| Hosthypervisor | Institutioneel geteste versie, bijvoorbeeld Workstation | Nested KVM en gastnetwerk controleren |
| Linux | Ubuntu Server en Xubuntu 24.04 LTS amd64 | ISO-checksums en pakketstand vastleggen |
| Windows | Server 2022 Desktop Experience; Windows 11 Pro/Education | Gelicentieerde/evaluatie-images, VirtIO, TPM en UEFI voorbereiden |
| NGINX, Jellyfin, Node Exporter | Native pakketten op Ubuntu; Jellyfin via eigen officiële bron | Pakketversies per editie bewaren |
| Docker Engine en Compose | Ubuntu-pakketten docker.io en docker-compose-v2 | Versies en opslagdriver vastleggen |
| Mosquitto | eclipse-mosquitto:2.0.22 | Digest registreren op lesmachine |
| Home Assistant | ghcr.io/home-assistant/home-assistant:2026.11.1 | UI-integratie en dashboard volledig doorlopen |
| Prometheus | prom/prometheus:v3.16.0 | Scrapes van de echte VM's controleren |
| Grafana | grafana/grafana:13.3.0 | Secret, dataopslag en dashboard testen |
| cAdvisor | ghcr.io/google/cadvisor:0.60.6 | Echt hostpad, cgroups, Docker API en alle containerlabels controleren |
| Blackbox | prom/blackbox-exporter:v0.27.0 | Pad naar de echte H1-website controleren |
| windows_exporter | 0.30.8 amd64 | MSI, firewall en gebruikte metrics controleren |
| NGINX-oefencontainer | nginx:1.28.0 | Testclientroute bevestigen |
| Marp CLI | 4.5.1, afhankelijkheden in package-lock.json | Bij een update opnieuw renderen |

Concrete tags zijn gekozen voor de eerste uitwerking, niet als belofte dat een versie onbeperkt geschikt blijft. Controleer vóór een nieuwe leseditie updates en advisories. Een tag kan opnieuw gepubliceerd worden; registreer bij een cursusrelease ook digests en bewaar de geteste images of pakketten.

## Uitgevoerde controles op 10 november 2026

- Alle zes hoofdstukken hebben theorie/herhaling, Marp-slides, opdrachten, oplossingen en een verslagsjabloon. H6 heeft twee opdrachtvarianten en één rubric.
- De aparte labkaart is verwijderd. Instellingen, code en bewijs horen in hetzelfde verslag. Alle lokale Markdown-links zijn gecontroleerd met `npm run check`.
- Alle zes presentaties bouwen naar HTML. Alle 95 slides zijn gerenderd en visueel bekeken. De aanvullende geometriecontrole vond geen tekst buiten het slidevlak.
- De Bash-codeblokken uit cursus en docentenhandleidingen zijn gecontroleerd met `bash -n`. De commando's zijn daarmee niet op een VM uitgevoerd.
- De losse YAML-bestanden, inclusief de alerttests, zijn geparseerd. Beide Compose-bestanden slagen voor `docker compose config --quiet`.
- De 17 PromQL-queryvoorbeelden slagen voor een syntaxiscontrole via promtool-recordingregels.
- Prometheus accepteert de configuratie en drie alertregels. [De alerttests](tests/alerts.test.yml) bevestigen wachttijden, de C:-filter, een gemeten andere schijfgrootte, de grenswaarde van 75 procent en herstel van de webproef.
- Een echte tijdelijke Mosquitto-container weigerde een fout wachtwoord, een verboden topic en publicatie door de leesgebruiker. Het retained bericht bleef bewaard na verwijderen en opnieuw maken van de container met hetzelfde volume. De test gebruikte dezelfde service-UID en bestandsrechten als het voorbeeld.
- De officiële Home Assistant-image accepteert de YAML van de binary sensor via zijn configuratiecontrole.
- NGINX accepteert de HTTPS-proxyconfiguratie met een tijdelijk testcertificaat. Blackbox accepteert zijn configuratie met de eigen checkfunctie.
- De opgegeven containerimages zijn opgehaald en bestaan. De gebruikte cAdvisor-opties zijn tegen zijn eigen helpuitvoer gecontroleerd, zonder de persoonlijke host met privileged-mounts te monitoren.

## Wat dit nog niet bewijst

De Windows-installatie, AD/GPO/RDP-matrix en MSI zijn hier niet op echte Windows-VM's uitgevoerd. Ook Proxmox-installatie, cloud-init-clones, native Jellyfin, CA-vertrouwen op twee echte clients, de volledige Home Assistant-onboarding, cAdvisor op de Ubuntu-leshost en de volledige dashboard-/restoreproeven moeten op de lesomgeving worden doorlopen. De optionele Apache/MariaDB-uitbreiding vraagt haar eigen pakket- en rechtencontrole.

De containercontroles zijn gerichte tests van onderdelen. Ze vervangen geen volledige proefles of tijdsmeting met studentenhardware. PDF-export is niet afzonderlijk gevalideerd; de Marp-bron en HTML-export zijn de gecontroleerde presentatieroute.

## De controles herhalen

Vanuit de repositoryroot:

```bash
npm ci
npm run check
npm run slides:build
docker compose -f cursus/04-containers/bestanden/compose.yaml config --quiet
docker compose -f cursus/05-monitoring/bestanden/compose.yaml config --quiet
```

De Prometheus-controles gebruiken alleen leesbare mounts van de cursusconfiguratie en tests:

```bash
docker run --rm -v "$PWD/cursus/05-monitoring/bestanden:/etc/prometheus:ro" --entrypoint promtool prom/prometheus:v3.16.0 check config /etc/prometheus/prometheus.yml
docker run --rm -v "$PWD/cursus/05-monitoring/bestanden:/etc/prometheus:ro" -v "$PWD/docenten/tests:/tests:ro" --entrypoint promtool prom/prometheus:v3.16.0 test rules /tests/alerts.test.yml
```

De installatie van Marp 4.5.1 meldde bij de eerste installatie twaalf npm-auditmeldingen in ontwikkelafhankelijkheden, waarvan tien hoog. Er is geen geforceerde downgrade of ongeteste override toegepast. De tooling wordt alleen gebruikt voor vertrouwde cursusbronnen. Beoordeel updates vóór een publicatie; een lockfile lost upstream meldingen niet op.

## Registratie van de volledige proefles

```text
Datum en uitvoerder:
Hoofdstuk en route:
Host-OS en hosthypervisor:
Proxmox-versie en ISO-checksum:
OS-images en checksums:
Pakketversies en containerdigests:
Docker-opslagdriver en datamap:
Netwerk, DNS en clientroute:
Certificaatuitgever en vervaldatum, geen private sleutels:
Snapshot- en back-upstorage:
Positieve en negatieve tests uitgevoerd:
Herstart-, persistentie- en hersteltests uitgevoerd:
Gemeten duur:
Afwijkingen en aanpassingen:
```
