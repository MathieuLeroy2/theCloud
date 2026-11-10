---
marp: true
theme: the-cloud
size: 16:9
paginate: true
lang: nl
title: Zien of je systemen goed werken
header: 'The Cloud · Hoofdstuk 5'
footer: 'Graduaat Internet of Things'
---

<!-- _class: lead -->

# Zien of je systemen goed werken

The Cloud · Hoofdstuk 5

---

# Je website werkt nu

Maar wat gebeurt er als niemand ernaar kijkt?

Met **monitoring** verzamel je regelmatig meetgegevens
en zie je wanneer iets fout gaat.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Wat is een metric?

Een **metric** is een meetwaarde, bijvoorbeeld vrije RAM in bytes.
**RAM = Random Access Memory**, het werkgeheugen.

Bewaar ook het tijdstip. Dan zie je veranderingen.
Een dalende grafiek kan een volle schijf aankondigen.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Drie taken

| Onderdeel | Taak |
| --- | --- |
| Exporter | Een programma dat meetgegevens aanbiedt |
| Prometheus | Haalt die meetgegevens op en bewaart ze |
| Grafana | Vraagt gegevens op en tekent het dashboard |

Een **dashboard** is het overzichtsscherm met je metingen.

<!--
Bron: https://prometheus.io/docs/introduction/overview/
-->

---

# Welke exporter?

**Node Exporter:** Linux.
**windows_exporter:** Windows.
**cAdvisor:** containers.

We volgen de machines uit de vorige labo’s.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Gauge of counter?

**Gauge:** kan omhoog en omlaag, bijvoorbeeld vrije RAM.

**Counter:** telt verder, bijvoorbeeld verstuurde bytes.
Gebruik `rate()` om bytes per seconde te berekenen.

<!--
Bron: https://prometheus.io/docs/prometheus/latest/querying/functions/
-->

---

# De juiste machine kiezen

Een **target** is een meetpunt, bijvoorbeeld 192.168.77.100:9100.
Een **job** bundelt zulke meetpunten, bijvoorbeeld linux.
**Instance** is het label met het concrete doeladres.

Een **label** is een naam met waarde bij een meting.
Daarmee filter je de juiste computer of schijf.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Een query is een vraag aan je meetgegevens

**PromQL = Prometheus Query Language**.
De taal waarmee je metingen opvraagt en berekent.

Zo’n vraag heet een **query**.
Bijvoorbeeld: toon alleen de metingen met job="linux".

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# up is niet hetzelfde als een werkende site

`up=1` betekent: Prometheus kon de exporter lezen.

NGINX kan intussen uitstaan.
Daarom vraagt **Blackbox Exporter** de webpagina echt op.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# De webproef

**probe_success=1:** de webproef slaagt.
**probe_success=0:** de webproef mislukt.

Geen meting? Controleer ook Blackbox en de targets.
Een lege grafiek is niet automatisch goed nieuws.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Vrije en totale ruimte meten

Gebruikt percentage:

**100 × (1 − vrije ruimte / totale ruimte)**

Gebruik gemeten totalen, geen vaste schijfgrootte.
Kies op Windows ook echt volume C:.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Je container herkennen

In H4 kreeg de broker het label **thecloud_app=broker**.

cAdvisor toont dat als **container_label_thecloud_app**.
Zo kies je de juiste container zonder tijdelijk ID.

<!--
Bron: https://prometheus.io/docs/guides/cadvisor/
-->

---

# Eenheden horen bij de uitleg

**CPU = Central Processing Unit**, de processor.
100 procent bij onze containerquery is één CPU-kern.

**MiB = mebibyte:** 1.048.576 bytes.
**GiB = gibibyte:** 1.024 MiB.
Bytes is een hoeveelheid; bytes per seconde is een snelheid.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Een dashboard dat helpt

Geef elk paneel een naam, machinefilter en eenheid.

Vergelijk de waarde met de machine zelf.
Een mooie grafiek met de verkeerde eenheid blijft fout.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Wanneer gaat de alert af?

**Normaal:** de voorwaarde is niet waar.
**Pending:** wel waar, maar de wachttijd loopt nog.
**Firing:** lang genoeg waar.

Na herstel moet de alert weer normaal worden.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Veilig testen

Stop alleen je eigen NGINX en start het daarna weer.

Voor de schijfalert verlaag je tijdelijk de drempel.
Schrijf geen echte systeemschijf vol.
Zet na de test de normale drempel terug.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Nog geen e-mailmelding

We bekijken de alert in Prometheus.

Voor een bericht naar buiten heb je ook een meldkanaal
en bijvoorbeeld Alertmanager nodig.
Dat is een uitbreiding.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# YAML voor instellingen, JSON voor het dashboard

**YAML** is een tekstformaat voor instellingen met inspringing.
Daarin staan onze Compose- en Prometheus-instellingen.

**JSON = JavaScript Object Notation**, ook een tekstformaat.
Grafana exporteert daarin de beschrijving van je dashboard.
Je plakt die tekst in je verslag, zonder JavaScript te schrijven.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Eén bestand indienen

In **verslag.md** staan targets, queries, YAML, testtijden
en de volledige dashboard-JSON.

Grafana gebruikt **Student123**.
Geen los exportbestand of secretbestand nodig.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->
