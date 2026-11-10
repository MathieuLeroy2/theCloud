---
marp: true
theme: the-cloud
size: 16:9
paginate: true
lang: nl
title: Eén account voor meerdere computers
header: 'The Cloud · Hoofdstuk 2'
footer: 'Graduaat Internet of Things'
---

<!-- _class: lead -->

# Eén account voor meerdere computers

The Cloud · Hoofdstuk 2

---

# Je schoolaccount op twee pc’s

De pc vraagt aan een centrale server wie je bent.

Vandaag bouw je dat zelf met **SprookjesBoom** en twee clients.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Lokaal of in het domein

**Lokaal account:** bestaat op één pc.

**Domeinaccount:** wordt centraal beheerd.
Je gebruikt het op de pc’s waar je toegang krijgt.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Active Directory

**AD DS** bewaart accounts, groepen en computers.

De server met die taak heet een **domeincontroller**.
Ons oefendomein is **sprookjes.test**.

<!--
Bron: https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/deploy/install-active-directory-domain-services--level-100-
-->

---

# DNS vindt de domeinserver

Beide clients gebruiken **SprookjesBoom als DNS-server**.

Een publieke DNS-server kent ons oefendomein niet.
De server kan onbekende vragen wel doorsturen.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Ook de klok moet kloppen

Windows gebruikt onder meer **Kerberos** bij aanmelden.
Een groot tijdsverschil kan de controle laten mislukken.

Ping werkt? Controleer daarnaast DNS en tijd.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Groepen besparen werk

| Groep | Wie? |
| --- | --- |
| GG-Rood | Roodkapje |
| GG-Big | Big1 |
| GG-Beheer | Wolf |

Oma krijgt toegang door lid te worden van de juiste groep.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Beheer alleen waar het nodig is

Wolf mag beide oefen-pc’s beheren.

Daarvoor hoeft hij geen beheerder van het hele domein te zijn.
**GG-Beheer wordt lokaal beheerder op de twee clients.**

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Een OU is een beheermap

Je zet computeraccounts in een **OU**.

RoodkapjesHuis komt in PcRood.
BiggetjesHuis komt in PcBig.

Een OU is geen gedeelde map voor bestanden.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Een GPO bevat centrale afspraken

Met een **GPO** stel je in wie op een pc mag aanmelden.

Koppel de juiste GPO aan de OU van die pc.
Laat de OU van de domeincontroller met rust.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Wie mag waar werken?

| Account | RoodkapjesHuis | BiggetjesHuis |
| --- | --- | --- |
| Roodkapje | Ja | Nee |
| Big1 | Nee | Ja |
| Wolf | Ja | Ja |

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Het scherm of RDP

**Console:** aanmelden op het scherm in Proxmox.

**RDP:** via het netwerk het bureaublad van de pc openen.

Beide hebben eigen rechten. Test dus beide manieren.

<!--
Bron: https://learn.microsoft.com/en-us/windows/security/threat-protection/security-policy-settings/allow-log-on-through-remote-desktop-services
-->

---

# Ook “Nee” moet je testen

Een werkende beheerlogin bewijst niet dat de rechten kloppen.

Test de zes combinaties via console én RDP.
Meld na iedere test volledig af.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Een domein niet gevonden

Controleer eerst:

- `ipconfig /all`: welk adres en welke DNS?
- `nslookup`: vindt DNS de domeinserver?
- De tijd, groepen, OU en toegepaste GPO.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Wat lever je in?

Eén **verslag.md** met instellingen en testresultaten.

Ook de groepen, GPO-waarden en twaalf toegangstests
staan daarin. Geen losse screenshots of exportbestanden.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->
