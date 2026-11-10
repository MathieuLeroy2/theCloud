# Labo 2 Een klein Windows-domein

Je maakt een domein met één server en twee pc's. Daarna test je wie op welke pc mag werken. Reken op ongeveer 4,5 uur met voorbereide Windows-installatiebestanden of templates.

Gebruik één [verslag.md](bestanden/verslag-sjabloon.md). Vul daarin eerst je instellingen in. Gebruik de voorbeeldadressen alleen als de docent ze voor jouw netwerk bevestigt.

## H2.1 Machines klaarzetten

| Machine | Voorbeeldadres | vCPU | RAM | Virtuele schijf |
| --- | --- | --- | --- | --- |
| SprookjesBoom, Windows Server 2022 Desktop Experience | `192.168.77.20/24` | 2 | 3 GB | 64 GB |
| RoodkapjesHuis, Windows 11 Pro/Education | `192.168.77.30/24` | 2 | 4 GB | 64 GB |
| BiggetjesHuis, Windows 11 Pro/Education | `192.168.77.40/24` | 2 | 4 GB | 64 GB |

Stop de Linux-VM's als je ze nu niet nodig hebt. De 8 GB van je oude Proxmox-VM is niet genoeg voor deze drie Windows-machines. Vergroot de omgeving alleen als je laptop dat aankan, of gebruik de schoolomgeving. De docent voorziet geldige Windows-images, licenties/evaluaties en de benodigde UEFI- en TPM-instellingen.

Installeer de machines, geef ze hun namen en vaste adressen. Noteer gateway, VMID's en opslag in je verslag.

**Klaar als:** de drie machines starten en je de juiste namen en adressen kunt tonen.

## H2.2 Het domein maken

Installeer op SprookjesBoom AD DS met DNS en maak het domein `sprookjes.test`, met korte naam `SPROOKJESBOS`. Stel een DNS-forwarder in naar de bevestigde lab-DNS. Gebruik ook voor het DSRM-herstelwachtwoord `Student123`.

Laat beide clients alleen SprookjesBoom als DNS-server gebruiken. Voeg ze aan het domein toe en herstart ze.

**Klaar als:** beide pc's zichtbaar zijn in Active Directory en de clients de domeincontroller via DNS vinden.

## H2.3 Accounts, groepen en OU's

Maak de gebruikers Roodkapje, Big1 en Wolf met wachtwoord `Student123`. Maak de groepen `GG-Rood`, `GG-Big` en `GG-Beheer` en voeg de gebruikers toe zoals in de theorie.

Maak twee aparte computer-OU's. Verplaats RoodkapjesHuis en BiggetjesHuis elk naar hun eigen OU. Geef `GG-Beheer` lokale beheerdersrechten op beide clients. Voeg Wolf niet toe aan Domain Admins.

**Klaar als:** je kunt laten zien welke gebruiker in welke groep zit en waar de computers staan.

## H2.4 Toegang instellen

Maak voor elke client-OU één GPO. Stel daarin de toegestane groepen in voor lokaal aanmelden en voor RDP. Houd de lokale groep Administrators toegestaan, zodat je beheertoegang behoudt. Koppel de GPO's niet aan de domeincontroller.

Zet RDP aan op de twee clients en laat NLA aanstaan. Laat de benodigde RDP-firewallregel alleen toe op het domeinprofiel en vanuit het afgesproken labnetwerk. De oplossing toont de instellingen.

**Klaar als:** `gpresult` op de clients de bedoelde GPO toont en RDP ingeschakeld is.

## H2.5 Alle aanmeldingen testen

Test elk vakje van de toegangstabel uit de theorie via de console én via RDP. Dat zijn twaalf tests. RDP start je vanaf de server of de andere oefen-pc met de ingebouwde client; mRemoteNG mag ook.

Meld na elke test af. Noteer account, doel-pc, manier van aanmelden en resultaat. Controleer bij Wolf ook dat hij een beheertaak mag uitvoeren. Controleer dat Roodkapje dat niet mag zonder een apart beheerdersaccount.

**Klaar als:** zowel de toegestane als de geweigerde aanmeldingen kloppen.

## H2.6 Een DNS-fout onderzoeken

Noteer op één client de juiste DNS-instelling. Vervang die tijdelijk door `192.0.2.1`, een voor documentatie gereserveerd adres, en voer `ipconfig /flushdns` uit. Voer daarna `nslookup -type=SRV _ldap._tcp.dc._msdcs.sprookjes.test` uit.

Beschrijf de fout. Zet de juiste DNS terug en herhaal de zoekopdracht. Test geen afmelding of herstart zolang de DNS fout staat: een oude aanmeldcache kan het resultaat bovendien verwarrend maken.

**Klaar als:** de DNS-zoekopdracht na herstel weer werkt en je weet waarom een ping alleen niet voldoende was.

## H2.7 Indienen

Dien alleen `verslag.md` in. Daarin staan de instellingen, relevante PowerShell-/commandouitvoer, de twee GPO-instellingen per pc, de twaalf testresultaten en de antwoorden op de vijf theorievragen. Private sleutels blijven eruit; het vaste labowachtwoord mag in de voorbeelden staan. Bewaar de machines, maar sluit ze af volgens de afspraken van de docent.

| Onderdeel | Punten |
| --- | --- |
| H2.1 Drie machines en instellingen | 3 |
| H2.2 Werkend domein en DNS | 4 |
| H2.3 Accounts, groepen en OU's | 3 |
| H2.4 GPO en RDP | 4 |
| H2.5 Toegangstests en beheerrechten | 3 |
| H2.6 DNS-fout en herstel | 2 |
| H2.7 Eén volledig verslag | 1 |
| **Totaal** | **20** |
