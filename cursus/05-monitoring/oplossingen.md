# Oplossingen bij labo 5

We gebruiken cloud-web `.100`, RoodkapjesHuis `.30` en cloud-containers `.120`. Pas de adressen aan jouw verslag aan. Alleen op je eigen Ubuntu-container-VM mag cAdvisor de hier beschreven toegang krijgen.

## H5.1 Eerst de verbinding controleren

**Op cloud-containers:**

```bash
curl -I http://192.168.77.100
```

Dit moet HTTP 200 opleveren. De firewall uit H1 moet de bron van deze webtest toelaten. Controleer of Docker uit H4 werkt. Laat de Mosquitto- en Home Assistant-container staan.

## H5.2 Exporters

### Linux

**Op cloud-web:**

```bash
sudo apt update
sudo apt install prometheus-node-exporter
sudo systemctl enable --now prometheus-node-exporter
sudo ufw allow from 192.168.77.120 to any port 9100 proto tcp
curl -s http://127.0.0.1:9100/metrics | head
```

Je verwacht tekstregels met metricnamen, geen gewone webpagina. De installatie is het Ubuntu-distributiepakket. Gebruik geen extra tweede Node Exporter op dezelfde poort.

### Windows

De docent zet de officiële MSI van **windows_exporter 0.30.8 amd64** klaar en controleert de herkomst. We kiezen deze versie zodat de gebruikte metricnamen bij de uitleg passen. Een nieuwe leseditie controleert updates en queries opnieuw.

**Op RoodkapjesHuis, in PowerShell als beheerder**, vanuit de map met de MSI:

```powershell
msiexec /i windows_exporter-0.30.8-amd64.msi ENABLED_COLLECTORS="cpu,memory,logical_disk,os,system" REMOTE_ADDR="192.168.77.120"
Get-Service windows_exporter
```

Doorloop de installer. Hij maakt een service en een firewalluitzondering voor de opgegeven monitoringbron. Controleer in Windows Defender Firewall dat er geen oudere, bredere exporterregel is blijven staan. Laat alleen `.120` op TCP 9182 toe. De service hoort Running te zijn.

**Op cloud-containers:**

```bash
curl -s http://192.168.77.100:9100/metrics | head
curl -s http://192.168.77.30:9182/metrics | head
```

Geen uitvoer? Test zonder `-s` om de fout te zien. Controleer de service, het doeladres en de firewall. Een GPO kan lokale firewallregels beperken; bekijk dat met de docent.

## H5.3 De stack

**Op cloud-containers:** maak `~/thecloud-monitoring` en kopieer de complete map `bestanden` van dit hoofdstuk ernaartoe, met behoud van de submappen. Je hebt onder meer `compose.yaml`, `prometheus.yml`, `alerts.yml`, `blackbox.yml` en `grafana/provisioning/datasources/prometheus.yml` nodig.

De meegeleverde monitoringcontainers gebruiken het netwerk van deze Linux-VM en luisteren op loopback. Dat is bewust anders dan het bridge-netwerk uit H4: Prometheus bereikt zo cAdvisor op dezelfde host zonder de meetpoorten voor de hele klas te openen. Deze instelling is voor een Linux Docker Engine op je eigen VM, niet Docker Desktop.

Maak het Grafana-secretbestand zonder het wachtwoord te tonen:

```bash
cd ~/thecloud-monitoring
read -r -s -p 'Nieuw Grafana-beheerwachtwoord: ' LAB_GRAFANA_PASS
printf '%s' "$LAB_GRAFANA_PASS" > grafana-admin.txt
unset LAB_GRAFANA_PASS
sudo chown 472:472 grafana-admin.txt
sudo chmod 400 grafana-admin.txt
```

De Grafana-image gebruikt UID 472. Het secretbestand moet voor die gebruiker leesbaar zijn. Neem het niet op in je verslag. Het stelt het eerste adminwachtwoord in; bij een bestaand Grafana-volume verandert alleen dit bestand het bestaande accountwachtwoord niet.

Pas de targetadressen aan in `prometheus.yml`. Controleer of de hostpaden van cAdvisor op jouw Ubuntu-VM bestaan. Docker hoort hier zijn gewone datafolder `/var/lib/docker` te gebruiken. Bij een afwijkende opslagdriver of datamap moet de docent de cAdvisor-mounts passend maken.

```bash
sudo docker compose config --quiet
sudo docker compose run --rm --no-deps --entrypoint promtool prometheus check config /etc/prometheus/prometheus.yml
sudo docker compose up -d
sudo docker compose ps
```

Je verwacht een geslaagde configuratiecontrole. cAdvisor is de enige service met privileged-toegang en hostmappen. Voer dit niet uit op de fysieke laptop of de gedeelde Proxmox-node.

**Op Xubuntu:**

```bash
ssh -L 13000:127.0.0.1:3000 -L 19090:127.0.0.1:9090 student@192.168.77.120
```

Voeg indien nodig je SSH-sleutel met `-i` toe. Open `http://localhost:19090` voor Prometheus en `http://localhost:13000` voor Grafana. Meld bij Grafana aan als `admin` met je gekozen wachtwoord.

Bij Prometheus **Targets** verwacht je de jobs linux, windows, cadvisor, web en prometheus op UP. De webtarget is de scrape van Blackbox; controleer daarnaast `probe_success{job="web"}`. In Grafana staat de databron al klaar dankzij het provisioningbestand.

## H5.4 Queries en dashboard

Kies eerst in Prometheus de tabelweergave. Controleer of de query een waarde teruggeeft. Bouw daarna in Grafana via **Dashboards > New** de panelen. Kies de databron Prometheus en de codeweergave van de query-editor.

### 1 Beschikbaar Linux-geheugen

```promql
node_memory_MemAvailable_bytes{job="linux"}
```

Gebruik gauge en een bytes-eenheid die GiB toont. Grafana kan de eenheid omrekenen; de bronwaarde blijft bytes.

### 2 Gebruikt Windows-geheugen

```promql
windows_memory_physical_total_bytes{job="windows"} - windows_memory_available_bytes{job="windows"}
```

Gebruik gauge, GiB. Beide waarden komen uit de memory-collector van de gekozen exporter. Er staat geen vaste RAM-grootte in de formule.

### 3 Gebruikte C-schijf

```promql
100 * (1 - windows_logical_disk_free_bytes{job="windows",volume="C:"} / windows_logical_disk_size_bytes{job="windows",volume="C:"})
```

Gebruik stat en procent van 0 tot 100. Controleer de waarde naast de eigenschappen van C: op Windows.

### 4 Website

```promql
probe_success{job="web"}
```

Gebruik stat met waardemapping `1 = werkt` en `0 = fout`. Een ontbrekende waarde krijgt de tekst ‘geen meting’, niet automatisch ‘werkt’.

### 5 Linux-CPU

```promql
100 * (1 - avg by (instance) (rate(node_cpu_seconds_total{job="linux",mode="idle"}[2m])))
```

De teller meet hoeveel tijd de CPU niets deed. We berekenen het gemiddelde vrije deel en trekken dat van 100 procent af. Gebruik een tijdgrafiek.

### 6 Geheugen van de brokercontainer

```promql
sum(container_memory_working_set_bytes{job="cadvisor",container_label_thecloud_app="broker"})
```

Gebruik bytes en laat MiB tonen. Zoek eerst in de ruwe metrics of het label echt `broker` bevat. Verwijder bij lege uitvoer tijdelijk de labelfilter om het probleem te vinden.

### 7 CPU van de brokercontainer

```promql
100 * sum(rate(container_cpu_usage_seconds_total{job="cadvisor",container_label_thecloud_app="broker"}[2m]))
```

Dit is procent van één CPU-kern. Het kan bij meerdere gebruikte kernen boven 100 uitkomen. Zet dat ook in de paneeltitel.

### 8 Ontvangen netwerkverkeer

```promql
sum(rate(container_network_receive_bytes_total{job="cadvisor",container_label_thecloud_app="broker",interface="eth0"}[2m]))
```

Gebruik bytes per seconde en een tijdgrafiek. Verstuur opnieuw MQTT-berichten om verkeer te veroorzaken. Kijk in de ruwe metrics hoe de interface heet als ze niet `eth0` is. Voeg eventueel het verkeer naar buiten toe met `container_network_transmit_bytes_total`.

Wacht voor `[2m]`-berekeningen op genoeg samples. Een container die niets doet kan terecht heel kleine waarden tonen.

## H5.5 Alerts

De regels staan in `alerts.yml`. Prometheus bekijkt ze elke 15 seconden. Open zijn pagina **Alerts**.

### Website stoppen

**Op cloud-web:**

```bash
sudo systemctl stop nginx
```

Je verwacht `probe_success=0` en daarna pending, gevolgd door firing na ongeveer één minuut plus de meet-/evaluatietijd. De linux-exporter kan intussen gewoon UP blijven.

```bash
sudo systemctl start nginx
```

Controleer de pagina vanaf een client. Prometheus hoort weer `probe_success=1` te krijgen en de webalert herstelt. Noteer de tijdstippen.

### Schijfalert zonder een schijf vol te schrijven

Lees eerst het huidige percentage van C:. Is dat bijvoorbeeld 28 procent, wijzig in `alerts.yml` alleen de drempel van `WindowsSchijfVol` tijdelijk van 75 naar 20. Kies je eigen testwaarde onder de gemeten waarde.

**Op cloud-containers:**

```bash
sudo docker compose run --rm --no-deps --entrypoint promtool prometheus check config /etc/prometheus/prometheus.yml
sudo docker compose restart prometheus
```

Wacht op firing na de ingestelde twee minuten. Zet de drempel daarna terug op 75, controleer opnieuw en herstart Prometheus. Is de schijf echt al meer dan 75 procent gevuld? Maak geen data zomaar weg; bespreek het met de docent en noteer waarom de echte alert terecht actief blijft.

De derde regel, ExporterOnbereikbaar, helpt wanneer de meetgegevens zelf niet kunnen worden opgehaald. Dat is een ander probleem dan een webpagina die fout antwoordt.

## H5.6 Bewaren, antwoorden en fouten zoeken

Sla het dashboard op. Kies de dashboardexport als JSON en plak die inhoud in een codeblok in `verslag.md`. De losse exportfile dien je niet in. Neem ook de aangepaste YAML op, maar laat het Grafana-secret weg.

1. Prometheus bewaart; Grafana tekent.
2. Node Exporter kan blijven antwoorden terwijl NGINX gestopt is. Daarom testen we de webpagina ook met Blackbox.
3. Een netwerkteller is een totaal. `rate()` berekent hoeveel die per seconde stijgt en houdt rekening met tellerresets.
4. De gemeten schijfgrootte past bij de werkelijke machine, ook na vergroten van de disk.
5. Het herstel bewijst dat de regel ook terug normaal wordt en dat je de storing echt hebt opgelost.

Geen targets? Kijk naar de fout bij Targets en probeer de `/metrics`-URL vanaf cloud-containers. Geen containerlabels? Controleer cAdvisor, de gewone Docker-datamap en het label uit H4. Geen Grafana? Controleer de SSH-tunnel en leesrechten van het secretbestand. Verkeerde data? Controleer job, instance, volume en eenheid. Geen alert? Controleer de echte waarde, drempel, wachttijd en de geladen regels. Maak ‘geen data’ niet groen.
