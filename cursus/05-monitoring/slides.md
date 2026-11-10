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

Een getal met een betekenis, bijvoorbeeld vrije RAM in bytes.

Bewaar ook het tijdstip. Dan zie je veranderingen.
Een dalende grafiek kan waarschuwen voor een volle schijf.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Drie taken

| Onderdeel | Taak |
| --- | --- |
| Exporter | Biedt metingen aan |
| Prometheus | Haalt op en bewaart |
| Grafana | Tekent het dashboard |

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

Een **job** is de naam van een groep targets.
Een **instance** wijst een target aan.

Labels helpen je de juiste machine en schijf te selecteren.
Controleer ze als een query geen gegevens toont.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
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

RAM en schijf: bytes, MiB of GiB.
Netwerk: bytes per seconde.
CPU: procent, met een duidelijk gekozen schaal.

Bij onze containerquery is 100 procent één CPU-kern.

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

# Eén bestand indienen

In **verslag.md** staan targets, queries, YAML, testtijden
en de volledige dashboard-JSON.

Grafana gebruikt **Student123**.
Geen los exportbestand of secretbestand nodig.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->
