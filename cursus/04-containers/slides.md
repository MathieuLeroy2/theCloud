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

Je verstuurt **OPEN** of **DICHT**.
Mosquitto ontvangt het bericht.
Home Assistant toont de toestand.

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

Een VM heeft haar eigen OS en kernel.
Containers delen de kernel van hun Linux-host.

In dit labo draait Docker **in een Ubuntu-VM**.
We installeren het niet op de Proxmox-node.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Eerst docker run

Met `docker run` beschrijf je één container.

Je kiest image, naam, label, poort en opslag.
Test de kleine oefenwebsite vóór de IoT-stack.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Daarna Compose

**compose.yaml** bewaart de instellingen van beide diensten.

Met `docker compose up -d` start je ze samen.
Met `docker compose ps` bekijk je hun toestand.

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

# Wat betekent deze poort?

`127.0.0.1:1883:1883`

Alleen via de loopbackpoort van de VM kom je bij de broker.
Vanaf Xubuntu gebruiken we een **SSH-tunnel**.

Alleen UFW is geen garantie bij Docker-poortpublicaties.

<!--
Bron: https://docs.docker.com/engine/install/ubuntu/
-->

---

# Berichten via de broker

**Topic:** `iot/labo/deur`
**Payload:** `OPEN` of `DICHT`

De sensor publiceert. Het dashboard abonneert zich.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Twee accounts, twee taken

**sensor:** mag op iot/labo/# schrijven.

**dashboard:** mag die berichten lezen.

Een ACL legt de topicrechten vast.
Anonieme toegang staat uit.

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

Dit is de containeruitvoering, niet Home Assistant OS.
Mosquitto draait daarom apart.

Onze fictieve deur vraagt geen USB, Bluetooth
of extra brede apparaatrechten.

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

# Versies en verslag

Noteer image-tags en de gebruikte digests.

Zet Compose, ACL, broker- en sensorconfiguratie samen
met je tests in **verslag.md**.

Wachtwoorden en hun hashbestand blijven eruit.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->
