# Modeloplossingen van de praktijktest

Dit is docentenmateriaal voor na de test. De toegewezen herkenningscode en adressen verschillen per student. De basisstappen zijn geoefend in H4 en H5. Een andere correcte uitvoering krijgt dezelfde beoordeling.

## Variant A Website

**Op cloud-containers:**

```bash
mkdir -p ~/praktijk-a/site
cd ~/praktijk-a
```

Maak `site/index.html` met een titel, herkenningscode, korte projectbeschrijving en `<link rel="stylesheet" href="style.css">`. Maak `site/style.css` met zichtbare opmaak. De bestanden zijn leesbaar voor de webserver maar worden alleen door de student op de VM aangepast.

```bash
sudo docker run -d --name praktijk-web --label thecloud_app=praktijk --restart unless-stopped -p 127.0.0.1:8088:80 -v "$PWD/site:/usr/share/nginx/html:ro" nginx:1.28.0
curl -I http://127.0.0.1:8088/index.html
curl -I http://127.0.0.1:8088/style.css
```

Dit gebruikt de documentroot van de NGINX-image. Die is anders dan `/var/www/html` van de native Ubuntu-installatie uit H1.

**Op Xubuntu:**

```bash
ssh -L 18088:127.0.0.1:8088 student@192.168.77.120
```

Open `http://localhost:18088` en controleer code en opmaak. Vraag beide bestanden ook op met curl vanaf Xubuntu.

**Op cloud-containers**, nadat het resultaat genoteerd is:

```bash
sudo docker stop praktijk-web
sudo docker rm praktijk-web
```

Voer daarna dezelfde volledige `docker run` opnieuw uit vanuit dezelfde werkmap. HTML, CSS en code blijven in de hostmap en zijn weer beschikbaar. Deze verwijdering geldt alleen voor de tijdens de toets gemaakte container.

## Variant B MQTT

**Op cloud-containers:**

```bash
mkdir -p ~/praktijk-b/mosquitto
cd ~/praktijk-b
```

Maak `mosquitto/mosquitto.conf` en `acl` volgens H4. Je mag de daar geleerde instellingen als vertrekpunt gebruiken, maar maakt nieuwe toetsaccounts. Gebruik de mosquitto_passwd-container uit H4 met deze nieuwe map. Maak sensor en dashboard, bescherm het wachtwoordbestand met de juiste eigenaar en rechten. De hash en geheimen komen niet in het verslag.

```bash
sudo docker volume create praktijk-mqtt-data
sudo docker run -d --user 1883:1883 --name praktijk-mqtt --label thecloud_app=praktijk --restart unless-stopped -p 127.0.0.1:1884:1883 -v "$PWD/mosquitto:/mosquitto/config:ro" -v praktijk-mqtt-data:/mosquitto/data eclipse-mosquitto:2.0.22
sudo docker logs praktijk-mqtt
```

**Op Xubuntu:**

```bash
ssh -L 11884:127.0.0.1:1884 student@192.168.77.120
```

In een tweede terminal lees je de wachtwoorden tijdelijk in variabelen zoals in H4. Publiceer de eigen code:

```bash
mosquitto_pub -V mqttv5 -h 127.0.0.1 -p 11884 -u sensor -P "$LAB_SENSOR_PASS" -t iot/labo/deur -m 'OPEN-MIJN-CODE' -r -q 1
mosquitto_sub -h 127.0.0.1 -p 11884 -u dashboard -P "$LAB_DASH_PASS" -t iot/labo/deur -C 1 -W 5
```

Vervang de payload door de toegewezen code. Test fout wachtwoord en een verboden publicatie zoals in H4, nu op 11884. Lees opnieuw met dashboard: het behouden bericht mag niet door de verboden publicatie vervangen zijn.

Stop en verwijder op de server alleen praktijk-mqtt en voer de runopdracht opnieuw uit. Laat `praktijk-mqtt-data` bestaan. De nieuwe subscriber krijgt opnieuw de code zonder nieuwe publicatie. Sluit netjes af zodat de broker zijn retained bericht opslaat.

## Beide varianten Monitoring

Maak een dashboard met deze queries:

```promql
sum(container_memory_working_set_bytes{job="cadvisor",container_label_thecloud_app="praktijk"})
100 * sum(rate(container_cpu_usage_seconds_total{job="cadvisor",container_label_thecloud_app="praktijk"}[2m]))
sum(rate(container_network_receive_bytes_total{job="cadvisor",container_label_thecloud_app="praktijk",interface="eth0"}[2m]))
node_filesystem_avail_bytes{job="linux",mountpoint="/",fstype!~"tmpfs|overlay"}
100 * (1 - avg by (instance) (rate(node_cpu_seconds_total{job="linux",mode="idle"}[2m])))
```

De eerste drie volgen de toetscontainer, de laatste twee cloud-web. Kies respectievelijk MiB, procent van één kern, bytes/seconde, GiB en procent. Gebruik een tabelweergave om de echte labels te bekijken als een query niets teruggeeft.

Bij vervangen van een container ontstaan nieuwe tijdreeksen. Controleer na de proef de actuele waarden en wacht minstens twee minuten voor de rate-grafieken. Kijk niet alleen naar een oude waarde op een historisch tijdstip.

Voeg een eigen regel aan een nieuwe groep in `alerts.yml` toe, bijvoorbeeld:

```yaml
- name: praktijk
  rules:
    - alert: PraktijkGeheugen
      expr: sum(container_memory_working_set_bytes{job="cadvisor",container_label_thecloud_app="praktijk"}) > 134217728
      for: 1m
      labels:
        severity: warning
      annotations:
        summary: 'De toetscontainer gebruikt meer dan 128 MiB'
```

Deze groep komt onder de bestaande hoofdsleutel `groups`, naast de andere groep. De normale drempel is hier 128 MiB. Voor de test kies je tijdelijk een drempel onder de actuele waarde. Test de config met promtool, herstart Prometheus en wacht op firing. Zet daarna 128 MiB terug of de door de docent opgegeven normale grens en controleer herstel. Geen synthetisch vullen van de fysieke schijf.

## Foutonderzoek en verslag

Bij een gestopte container: `docker ps -a`, logs en een lokale clienttest laten zien waar het stopt. Bij een fout clientpad: de lokale server werkt, de client-URL of tunnel niet. Bij ontbrekende CSS: HTML geeft 200 maar CSS bijvoorbeeld 404. De student moet juist dat verschil benoemen en de kleinste passende correctie doen.

Alle instellingen, eigen HTML/CSS of MQTT-configuraties, testuitvoer, querytekst, dashboard-JSON en alert-YAML staan in één `verslag.md`. Een werkende VM blijft nodig voor de demonstratie, maar is geen extra in te dienen bestand.
