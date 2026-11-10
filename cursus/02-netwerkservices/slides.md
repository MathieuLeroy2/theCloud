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

De **server** beheert de accounts.
De **clients** zijn de pc’s waarop je ermee werkt.

Vandaag is SprookjesBoom de server.
RoodkapjesHuis en BiggetjesHuis zijn de clients.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Lokaal of in het domein

**Lokaal account:** bestaat op één pc.

Een **domein** bundelt centraal beheerde accounts en computers.
Een **domeinaccount** kan op de toegestane pc’s aanmelden.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Active Directory

**AD DS = Active Directory Domain Services**.
Microsofts software om accounts, groepen en pc’s te beheren.

De server met die taak heet een **domeincontroller**.
Hier is dat SprookjesBoom in het domein sprookjes.test.

<!--
Bron: https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/deploy/install-active-directory-domain-services--level-100-
-->

---

# DNS vindt de domeinserver

**DNS = Domain Name System**: namen naar adressen opzoeken.
Het helpt de client ook de domeincontroller te vinden.

Beide clients gebruiken daarom **SprookjesBoom als DNS-server**.
Een publieke DNS-server kent ons oefendomein niet.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Kerberos gebruikt een tijdelijk aanmeldbewijs

**Kerberos** controleert aanmeldingen met tijdelijke
digitale bewijzen, **tickets** genoemd.

De pc vraagt daarmee toegang tot diensten zonder
telkens opnieuw het wachtwoord te versturen.
Een ticket heeft een geldigheidsduur: daarom moet de klok kloppen.

<!--
Bron: https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview

Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# LDAP zoekt accountgegevens op

**LDAP = Lightweight Directory Access Protocol**.
Afspraken om gegevens uit de centrale directory op te vragen.

Een **directory** is hier een georganiseerde accountverzameling.
Voorbeeld: opvragen bij welke groepen Roodkapje hoort.
Dat is een andere taak dan haar aanmelding controleren.

<!--
Bron: https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups
-->

---

# Wat betekent GG in een groepsnaam?

**GG = Global Group**, een globale groep.
We verzamelen daarin gebruikers uit ons eigen domein.

Bij het aanmaken kies je bereik **Global**, type **Security**.
GG is onze naamafspraak, geen automatische instelling.
Voorbeeld: GG-Rood is de groep voor RoodkapjesHuis.

<!--
Bron: https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups
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

**OU = Organizational Unit**, een beheermap in Active Directory.

Een **computeraccount** is de registratie van de pc in het domein.
Dat van RoodkapjesHuis zet je in OU PcRood.
De instellingen aan die OU gelden dan voor deze pc.

Dit is geen map waarin de gebruiker documenten bewaart.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->

---

# Een GPO bevat centrale afspraken

**GPO = Group Policy Object**.
Een pakket instellingen dat je vanuit het domein beheert.

Voorbeeld: je koppelt een pakket met aanmeldrechten aan PcRood.
De computers in die OU krijgen die instellingen.
De groep GG-Rood bepaalt vervolgens welke gebruikers erbij mogen.

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

**Console:** het scherm van de pc, hier geopend in Proxmox.

**RDP = Remote Desktop Protocol**.
Daarmee open je het bureaublad van die pc via het netwerk.

Console en RDP hebben aparte aanmeldrechten.

<!--
Bron: https://learn.microsoft.com/en-us/windows/security/threat-protection/security-policy-settings/allow-log-on-through-remote-desktop-services
-->

---

# NLA controleert vóór het bureaublad opent

**NLA = Network Level Authentication**.
RDP controleert eerst de aanmelding en opent daarna de sessie.

Laat die beveiliging aan.
Gebruik voor alle laboaccounts **Student123**.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
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

# Het herstelwachtwoord in de wizard

**DSRM = Directory Services Restore Mode**.
Dat is de herstelstand van de domeincontroller.

Het gevraagde DSRM-wachtwoord hoort bij die herstelstand.
In dit labo gebruiken we ook daar **Student123**.

<!--
Gebruik de concrete machines van het labo. Laat de student dit in eigen woorden uitleggen.
-->

---

# Wat lever je in?

Eén **verslag.md** met instellingen en testresultaten.

Ook de groepen, GPO-waarden en twaalf toegangstests
staan daarin. Geen losse screenshots of exportbestanden.

<!--
Bespreek dit met de concrete opstelling uit het labo. Laat de student aanwijzen op welke machine deze stap gebeurt.
-->
