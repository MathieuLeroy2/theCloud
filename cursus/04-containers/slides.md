---
marp: true
theme: the-cloud
size: 16:9
paginate: true
lang: nl
title: Twee programma’s in containers
header: 'The Cloud · Hoofdstuk 4'
footer: 'Graduaat Internet of Things'
---

<!-- _class: lead -->

# Twee programma’s in containers

The Cloud · Hoofdstuk 4

---

# Een deur zonder echte sensor

**MQTT** is een berichtenprotocol: afspraken voor korte berichten.
Een **broker** ontvangt die berichten en geeft ze door.

Je verstuurt OPEN of DICHT naar Mosquitto, onze broker.
Het **dashboard**, je overzichtsscherm, toont de toestand.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Image en container

**Image:** het pakket dat je downloadt.

**Container:** een uitvoering die je uit dat pakket maakt.

Van één image kun je meerdere containers starten.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# VM of container?

**VM = Virtual Machine**, een virtuele computer.
**OS = Operating System**, het besturingssysteem.

De **kernel** is de kern die processor, geheugen en apparaten regelt.
Een VM heeft haar eigen kernel; containers delen de hostkernel.
In dit labo draait Docker in een Ubuntu-VM.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Eerst docker run

**CLI = Command Line Interface**: opdrachten typen in de terminal.

Met docker run beschrijf je één container.
Je kiest image, naam, poort en opslag.

Een **label** is een naam met waarde om de container te herkennen.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Daarna Compose

**Compose** start meerdere diensten vanuit één instellingenbestand.

Dat bestand heet **compose.yaml**.
**YAML** is leesbare tekst met inspringing voor wat bij elkaar hoort.

Met docker compose up -d start je de diensten samen.

<!--
Bron: https://docs.docker.com/compose/intro/features-uses/
-->

---

# Je data buiten de container

**Bind mount:** een map op de VM.
**Volume:** opslag die Docker apart beheert.

Belangrijke configuratie staat buiten de container.
Gebruik hier geen `down -v`: dat verwijdert ook volumes.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Loopback en de SSH-tunnel

**Loopback** betekent dat je dezelfde computer aanspreekt.
Daarvoor gebruiken we **127.0.0.1**.

**SSH = Secure Shell**, de beveiligde verbinding naar je server.
Een **SSH-tunnel** stuurt één poort door die verbinding door.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Wat betekent deze poort?

**127.0.0.1:1883:1883**

Het eerste deel houdt de hostpoort lokaal op de VM.
De laatste 1883 is de poort in de container.

Vanaf Xubuntu gebruiken we de SSH-tunnel.

<!--
Bron: https://docs.docker.com/engine/install/ubuntu/
-->

---

# Waarom niet alleen de Ubuntu-firewall?

**UFW = Uncomplicated Firewall**, de firewalltool op Ubuntu.

Docker kan gepubliceerde poorten buiten gewone UFW-regels
om bereikbaar maken. Daarom binden wij ze aan loopback
en gebruiken we SSH voor toegang vanaf de client.

<!--
Bron: https://docs.docker.com/engine/install/ubuntu/
-->

---

# Berichten via de broker

**Topic:** het onderwerpadres van een bericht, hier iot/labo/deur.
**Payload:** de inhoud, hier OPEN of DICHT.

**Publiceren:** een bericht naar de broker sturen.
**Abonneren:** de broker vragen berichten op een topic door te geven.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Twee accounts, twee taken

**ACL = Access Control List**, een lijst met toegangsregels.

**sensor:** mag op iot/labo/# schrijven.
**dashboard:** mag die berichten lezen.

Beide gebruiken Student123; de ACL bepaalt wat ze mogen.

<!--
Bron: https://mosquitto.org/documentation/authentication-methods/
-->

---

# Het laatste bericht bewaren

Met **retain** bewaart de broker het laatste bericht.

Een nieuwe abonnee krijgt meteen die laatste toestand.
Dat bewijst nog niet dat een echte sensor nog online is.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Welk adres vul je in?

Home Assistant gebruikt binnen Compose **mosquitto:1883**.

Xubuntu gebruikt zijn eigen tunnelpoort **localhost:11883**.

Die twee verbindingen vertrekken niet vanaf dezelfde plaats.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Home Assistant Container

Home Assistant Container is de uitvoering in een container.

Home Assistant **OS (Operating System)** is een volledig
besturingssysteem dat ook extra apps kan beheren.

Wij gebruiken de container en installeren Mosquitto apart.

<!--
Bron: https://www.home-assistant.io/installation/linux/
-->

---

# Een binary sensor

Een binary sensor heeft twee toestanden.

`OPEN` wordt de actieve deurtoestand.
`DICHT` wordt de gesloten toestand.

Let op de exacte topicnaam en hoofdletters.

<!--
Bron: https://www.home-assistant.io/integrations/binary_sensor.mqtt/
-->

---

# Drie dingen die moeten mislukken

- Aanmelden met een fout wachtwoord.
- Schrijven op een verboden topic.
- Schrijven met het alleen-lezen-account.

De bewaarde deurtoestand mag niet veranderen.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Opnieuw maken is een andere test

Stop de stack met `down` en maak haar opnieuw met `up -d`.

Blijven accounts, dashboard en deurtoestand bewaard?
Gebruik dezelfde werkmap en verwijder geen volumes.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Tag en digest kiezen verschillende dingen

Een **tag** is een versie-etiket, bijvoorbeeld 2.0.22.

Een **digest** is een berekende code van de image-inhoud.
Verandert de inhoud, dan verandert de code.

Noteer beide om bij te houden welke image je gebruikte.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Versies en verslag

Noteer image-tags en de gebruikte digests.

Zet Compose, ACL, broker- en sensorconfiguratie samen
met je tests in **verslag.md**.

Beide accounts gebruiken **Student123**.
Het gehashte wachtwoordbestand blijft eruit.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->
