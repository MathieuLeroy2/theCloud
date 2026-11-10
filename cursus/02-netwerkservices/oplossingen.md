# Oplossingen bij labo 2

Gebruik de adressen uit je verslag. De voorbeelden gebruiken `.20` voor SprookjesBoom, `.30` voor RoodkapjesHuis en `.40` voor BiggetjesHuis. Menunamen hieronder zijn Engels; op een Nederlandstalige image kunnen ze vertaald zijn.

## H2.1 De Windows-machines

Maak in Proxmox de drie VM's uit de opdracht. Windows 11 gebruikt de door de opleiding geteste UEFI- en TPM 2.0-instellingen. Koppel de VirtIO-driver-ISO als de installer de schijf of netwerkkaart niet ziet. De docent zet die drivers vooraf klaar. Gebruik geen omweg die de installatie-eisen van Windows uitschakelt.

Installeer op de server **Desktop Experience**, zodat je een bureaublad krijgt. Installeer op de clients de Pro- of Education-editie. Gebruik de account- en licentieprocedure van de opleiding. Stel lokale labaccounts en Administrator in met `Student123`. Gebruik op de Windows-clients bijvoorbeeld `labbeheer` als lokaal beheeraccount. Het is niet nodig om voor deze cursus een eigen Microsoft-cloudaccount aan te maken.

**Op elke machine, als beheerder:** open `sysdm.cpl`, kies **Change** en geef de juiste computernaam. Herstart. Open daarna `ncpa.cpl`, kies de Ethernet-kaart en open de IPv4-eigenschappen. Vul adres, masker, gateway en DNS in. De server gebruikt zijn eigen adres `.20` als DNS; beide clients gebruiken ook `.20`.

In een opdrachtvenster:

```powershell
hostname
ipconfig /all
```

Controleer naam, adres en DNS. Op de clients mag geen tweede publieke DNS-server als uitwijkadres staan.

## H2.2 AD DS en DNS

**Op SprookjesBoom:** open Server Manager, **Add roles and features**, kies de lokale server en voeg **Active Directory Domain Services** met de beheertools toe. Na installatie kies je bij de melding **Promote this server to a domain controller**.

1. Kies **Add a new forest**, met naam `sprookjes.test`.
2. Laat DNS en Global Catalog aanstaan. Gebruik de voorgestelde functionele niveaus die bij de serverversie passen.
3. Gebruik `Student123` als DSRM-herstelwachtwoord.
4. De korte NetBIOS-naam wordt `SPROOKJESBOS`; pas ze aan als de wizard iets anders voorstelt.
5. Laat de voorgestelde databasepaden staan en controleer de vereisten. Een melding over het ontbreken van een DNS-delegatie is in dit aparte testdomein mogelijk. Andere fouten los je vóór installatie op.
6. Installeer en laat de server herstarten. Meld aan met `SPROOKJESBOS\Administrator`.

Open **DNS Manager**. Bij de eigenschappen van de DNS-server, **Forwarders**, voeg je de bevestigde lab-DNS toe, in het voorbeeld `.2`. Die stuurt vragen over internetnamen verder. De client-DNS blijft `.20`.

**Op elke client:**

```powershell
nslookup SprookjesBoom.sprookjes.test
nslookup -type=SRV _ldap._tcp.dc._msdcs.sprookjes.test
```

Je verwacht het adres van de server en een verwijzing naar de domeincontroller. Als dat niet werkt, herstel eerst DNS. Controleer datum en tijd op alle drie de machines.

Open op de client `sysdm.cpl`, **Change**, kies **Domain** en vul `sprookjes.test` in. Meld voor deze beheerstap aan met het domeinbeheeraccount. Herstart en controleer in **Active Directory Users and Computers** op de server of het computeraccount bestaat.

## H2.3 Gebruikers en groepen

**Op de server, Active Directory Users and Computers:**

1. Maak onder het domein een OU `LabGebruikers`. Maak daarin de gebruikers `Roodkapje`, `Big1` en `Wolf`.
2. Gebruik voor alle drie `Student123`. Vink **User must change password at next logon** uit en **Password never expires** aan voor deze laboaccounts. Zo blijft het wachtwoord gedurende de labo’s hetzelfde.
3. Maak in dezelfde OU drie **Global Security**-groepen: `GG-Rood`, `GG-Big`, `GG-Beheer`.
4. Voeg Roodkapje, Big1 en Wolf aan hun bijbehorende groep toe.
5. Maak naast LabGebruikers de OU's `PcRood` en `PcBig`. Verplaats de computeraccounts van de twee clients uit `Computers` naar de juiste OU. Verplaats de domeincontroller niet.

Een eenvoudige groepscontrole op de server, in PowerShell:

```powershell
Get-ADGroupMember GG-Rood
Get-ADGroupMember GG-Big
Get-ADGroupMember GG-Beheer
```

**Op beide clients, in 64-bits PowerShell als domeinbeheerder:**

```powershell
$LabAdmins = (Get-LocalGroup -SID 'S-1-5-32-544').Name
Add-LocalGroupMember -Group $LabAdmins -Member 'SPROOKJESBOS\GG-Beheer'
Get-LocalGroupMember -Group $LabAdmins
```

Het SID kiest de ingebouwde beheerdersgroep, ook als die in het Nederlands anders heet. `GG-Beheer` hoort nu bij de lokale beheerders van de client. Voer deze commando's niet op de domeincontroller uit. Wolf blijft een gewone domeingebruiker met extra rechten op alleen de twee clients.

## H2.4 Wie mag aanmelden?

**Op de server:** open **Group Policy Management**. Maak bij OU `PcRood` een nieuwe gekoppelde GPO `Toegang-Rood`. Bewerk:

```text
Computer Configuration
  Policies
    Windows Settings
      Security Settings
        Local Policies
          User Rights Assignment
```

Vink bij de volgende twee rechten **Define these policy settings** aan en stel expliciet deze lijst in:

| Recht | Toegang-Rood | Toegang-Big, gekoppeld aan PcBig |
| --- | --- | --- |
| Allow log on locally | BUILTIN\Administrators en SPROOKJESBOS\GG-Rood | BUILTIN\Administrators en SPROOKJESBOS\GG-Big |
| Allow log on through Remote Desktop Services | BUILTIN\Administrators en SPROOKJESBOS\GG-Rood | BUILTIN\Administrators en SPROOKJESBOS\GG-Big |

Gebruik de knop om groepen op te zoeken en namen te controleren. Kies voor Administrators de ingebouwde groep met SID `S-1-5-32-544`, niet zomaar een gelijknamige zelfgemaakte groep. Wolf mag aanmelden omdat GG-Beheer lokaal lid is van Administrators.

Maak de tweede GPO op dezelfde manier bij `PcBig`. Laat de standaardbeveiligingsfilter op de GPO staan; de **computer** in de gekoppelde OU moet de instellingen mogen lezen en toepassen. Wijzig geen Deny-rechten: een bestaande Deny-regel kan voorrang krijgen op Allow.

**Op elke client, als beheerder:** zet via **Settings > System > Remote Desktop** RDP aan. Houd NLA aan. Voeg de bijbehorende groep ook toe via **Remote Desktop users**, zodat ze bij de lokale groep Remote Desktop Users hoort. Controleer in Windows Defender Firewall de ingebouwde RDP-inboundregels: alleen het domeinprofiel en het bevestigde labsubnet als bron. Zet de firewall niet volledig uit.

Daarna op de client:

```powershell
gpupdate /force
gpresult /r /scope computer
```

Je verwacht de GPO voor die client in de lijst met toegepaste computerinstellingen. Herstart indien nodig en meld gebruikers opnieuw aan. Houd een console en een beheerdersaccount beschikbaar tot de tests klaar zijn.

## H2.5 De twaalf tests

Voer elke combinatie uit voor **console** en **RDP**:

| Gebruiker | RoodkapjesHuis | BiggetjesHuis |
| --- | --- | --- |
| SPROOKJESBOS\Roodkapje | Toegestaan | Geweigerd |
| SPROOKJESBOS\Big1 | Geweigerd | Toegestaan |
| SPROOKJESBOS\Wolf | Toegestaan | Toegestaan |

Open op de Windows-machine waarvan je vertrekt `mstsc`. Vul de volledige naam van de doel-pc in. Kies expliciet **Use a different account** en de juiste domeingebruiker. Controleer de doelnaam ook als er een certificaatmelding verschijnt. Vermijd opgeslagen credentials die de test met een vorig account zouden uitvoeren.

Meld volledig af na elke poging. Windows-clientedities bieden hier geen onbeperkt aantal gelijktijdige actieve bureaubladsessies.

**Beheertest:** meld Wolf aan op een client en open PowerShell met **Run as administrator**. Dat moet als Wolf kunnen na de UAC-bevestiging. Roodkapje moet voor diezelfde actie gegevens van een afzonderlijke beheerder opgeven. Gebruik bij de gevraagde beheerder ook `Student123` en noteer de uitkomst.

Gaat een geweigerde test toch door? Controleer de groepen van de gebruiker, zijn lokale rechten op de doel-pc en `gpresult`. Staat de computer nog in de verkeerde OU? Dan wordt de bedoelde GPO niet toegepast.

## H2.6 De DNS-fout

Op één client wijzig je alleen de DNS-server in `ncpa.cpl` naar `192.0.2.1`. Dit adres gebruiken we als bewust onbruikbare DNS-instelling in het lab. Noteer eerst `.20` als juiste waarde.

```powershell
ipconfig /flushdns
nslookup -type=SRV _ldap._tcp.dc._msdcs.sprookjes.test
```

De opzoeking hoort nu te mislukken of een timeout te geven. Een al aangemelde gebruiker kan nog een sessie hebben; dat bewijst niet dat DNS werkt.

Zet DNS terug naar SprookjesBoom, voer dezelfde twee commando's opnieuw uit en controleer het resultaat. Je verwacht weer het domeincontrollerrecord. Verander geen serverdiensten en laat de juiste DNS ingesteld staan.

## H2.7 Antwoorden en verslag

1. SprookjesBoom kent de DNS-records van ons domein. Een publieke DNS-server kent die niet.
2. Oma wordt lid van GG-Rood.
3. Wolf beheert alleen de twee clients. Domain Admins zou veel meer rechten geven, ook in het domein.
4. Nee. Voor RDP bestaan aparte instellingen en aanmeldrechten.
5. Afmelden stopt de sessie en programma's. Een verbinding verbreken kan de sessie laten doorlopen.

Neem alles op in één `verslag.md`. Beschrijf GPO's als een tabel met pad, instelling en waarde. Plak alleen de nuttige regels van `ipconfig`, `gpresult` en de tests. Een exportbestand of screenshot is geen extra in te dienen bestand.
