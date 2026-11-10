---
marp: true
theme: the-cloud
size: 16:9
paginate: true
lang: nl
title: Een dienst aanbieden op een server
header: 'The Cloud · Hoofdstuk 3'
footer: 'Graduaat Internet of Things'
---

<!-- _class: lead -->

# Een dienst aanbieden op een server

The Cloud · Hoofdstuk 3

---

# Sneller een nieuwe server

Een **VM (Virtual Machine)** is je virtuele computer.
Een **template** is een voorbereid vertrekpunt voor een nieuwe VM.

Vandaag maak je daarvan een kopie en installeer je Jellyfin.
Je gebruikt de dienst vanaf twee andere computers: de **clients**.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Wat hoort bij cloud?

Je vraagt capaciteit aan uit een gedeelde verzameling servers.

Je gebruikt ze via het netwerk, kunt capaciteit aanpassen
en volgt het verbruik op.

<!--
Bron: https://csrc.nist.gov/pubs/sp/800/145/final
-->

---

# Wat doet ons lab echt?

We oefenen VM’s maken, hardware delen en netwerktoegang.

Proxmox geeft je niet vanzelf onbeperkte capaciteit
of een volledig automatische cloud.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# IaaS: je krijgt infrastructuur

**IaaS = Infrastructure as a Service**, infrastructuur als dienst.

Je krijgt bijvoorbeeld een VM.
Jij beheert het besturingssysteem en de toepassing.
Dat lijkt op onze oefening.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# PaaS: je krijgt een plek voor je toepassing

**PaaS = Platform as a Service**, een platform als dienst.

Je plaatst je eigen toepassing op een voorbereid platform.
De aanbieder beheert meer van de software eronder.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# SaaS: je gebruikt een afgewerkt programma

**SaaS = Software as a Service**, software als dienst.

Je gebruikt het programma via het netwerk, bijvoorbeeld webmail.
De aanbieder installeert en beheert de toepassing.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Eigen infrastructuur of een aanbieder

**Public:** capaciteit van een externe aanbieder.
**Private:** bedoeld voor één organisatie.
**Hybride:** een combinatie.

Ook eigen servers kosten opslag, stroom en beheer.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Een template als vertrekpunt

Een **template** bespaart de gewone installatie van het OS.
**OS = Operating System**, je besturingssysteem.

**Cloud-init** is het programma voor de eerste inrichting.
Het stelt naam, netwerk en publieke SSH-sleutel in.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# SSH en een wachtzin

**SSH = Secure Shell**, een beveiligde opdrachtverbinding.
Met een sleutelpaar kun je je bij de server aanmelden.

De **wachtzin** beschermt je private sleutelbestand.
In dit labo is die **Student123**.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Twee SSH-sleutelbestanden

**Publiek (.pub):** mag naar Proxmox of de server.

**Privé:** blijft op je eigen computer.
Gebruik als wachtzin **Student123**.

De hostsleutel van de server controleer je ook nog.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Jellyfin leest je media

Je bewaart kleine testbestanden in **/srv/media**.

Student mag uploaden. Jellyfin moet kunnen lezen.
Maak een beheeraccount en een apart kijkaccount.

<!--
Bron: https://jellyfin.org/docs/general/installation/linux/
-->

---

# NGINX staat vóór Jellyfin

De browser spreekt NGINX aan via **HTTPS 443**.
NGINX geeft de vraag lokaal door naar Jellyfin op **8096**.

Zo’n tussenschakel heet een **reverse proxy**.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# HTTPS vraagt een passend certificaat

**HTTPS** is de beveiligde vorm van HTTP.
**TLS = Transport Layer Security** versleutelt de verbinding.

Een **certificaat** koppelt het serveradres aan een publieke sleutel.
De browser controleert het adres en de uitgever.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# CA: de uitgever van het certificaat

**CA = Certificate Authority**, certificaatuitgever.
Die ondertekent het certificaat van je server.

De opleiding levert een lab-CA die je op de client vertrouwt.
Zo kan je browser controleren wie het certificaat uitgaf.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Een route blijft nodig

HTTPS beveiligt de verbinding, maar maakt geen netwerkroute.

Een **VPN = Virtual Private Network** kan een beveiligde
verbinding van buiten het lokaal naar het labnetwerk maken.

Test vanaf twee clients die je server echt kunnen bereiken.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Na een herstart

Herstart Jellyfin en speel opnieuw een klein bestand af.

Zijn je account, bibliotheek en bestanden er nog?
Test ook dat 8096 niet direct vanaf de client openstaat.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Jouw verantwoordelijkheid

De opleiding beheert de fysieke server.
Jij beheert je VM en de Jellyfin-gebruikers.

Welke taken zouden verdwijnen als je dit als SaaS gebruikte?

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Alles in één verslag

Noteer template, netwerk, tests en proxyconfiguratie
in **verslag.md**.

Gebruik **Student123**. Geen private sleutels of mediabijlagen.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->
