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

Je maakt een VM uit een voorbereid template.

Daarop installeer je Jellyfin en speel je een testbestand af
vanaf twee clients.

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

# Wie beheert welk deel?

| Vorm | Wat krijg je? |
| --- | --- |
| IaaS | Bijvoorbeeld een VM die je zelf beheert |
| PaaS | Een plek om je eigen toepassing te draaien |
| SaaS | Een afgewerkt programma om te gebruiken |

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
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

Een template bespaart de gewone OS-installatie.

**Cloud-init** vult bij de eerste start je naam, netwerk
en publieke SSH-sleutel in.
Iedere nieuwe VM krijgt eigen instellingen.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Twee SSH-sleutelbestanden

**Publiek (.pub):** mag naar Proxmox of de server.

**Privé:** blijft op je eigen computer, met een wachtzin.

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

Het certificaat moet bij het echte serveradres passen.
De client moet de uitgever vertrouwen.

De opleiding voorziet die labcertificaten.
Een waarschuwing overslaan is niet de eindoplossing.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Een route blijft nodig

HTTPS versleutelt de verbinding.
Het maakt geen ontbrekende netwerkroute.

Test vanaf twee clients die de server echt kunnen bereiken.
Een telefoon is mogelijk, maar niet verplicht.

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

Geen private sleutels, echte wachtwoorden of mediabijlagen.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->
