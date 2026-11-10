# Eén account voor meerdere computers

Op school meld je je op verschillende computers aan met hetzelfde account. De school maakt dat account niet apart op elke pc. De computers vragen aan een centrale server wie je bent en wat je mag doen.

In dit hoofdstuk bouw je zelf zo'n klein netwerk. We behouden de sprookjesnamen uit het oorspronkelijke labo: de server heet **SprookjesBoom**, de pc's **RoodkapjesHuis** en **BiggetjesHuis**.

## 1. Een account op één pc of in een domein

Een **lokaal account** staat op één computer. Maak je op pc A een gebruiker `student`, dan bestaat die gebruiker niet automatisch op pc B. Ook twee lokale accounts met dezelfde naam zijn aparte accounts.

Een **domeinaccount** wordt centraal beheerd. De pc vraagt de domeinserver om de aanmelding te controleren. Zo kan Roodkapje hetzelfde account gebruiken op alle pc's waar ze toegang heeft.

Een **domein** is hier een groep computers en accounts die samen beheerd worden. Ons oefendomein heet `sprookjes.test`. Dat is een naam voor het lab, geen website die je op internet moet registreren.

Microsofts software hiervoor heet **Active Directory Domain Services**, afgekort **AD DS**. Een server met die taak heet een **domeincontroller**. In ons labo is dat SprookjesBoom.

## 2. DNS helpt de pc de server te vinden

Denk terug aan hoofdstuk 1: DNS zoekt adressen bij namen. Een domein gebruikt DNS ook om te vinden welke server de aanmelding kan controleren.

Daarom krijgen beide Windows-pc's **SprookjesBoom als DNS-server**. Ze gebruiken niet rechtstreeks een publieke DNS-server. Die kent ons oefendomein niet.

SprookjesBoom kan onbekende vragen doorsturen naar de DNS-server van het lab. Dat heet een **forwarder**. De clients houden gewoon SprookjesBoom als hun enige DNS-server.

Ook de klok moet kloppen. Windows gebruikt onder meer **Kerberos** om een aanmelding veilig af te handelen. Een groot tijdsverschil kan die aanmelding laten mislukken. AD gebruikt daarnaast **LDAP** om gegevens in de directory op te vragen. Je hoeft die protocollen nu niet zelf te bouwen; je moet wel weten waarom DNS en tijd belangrijk zijn.

**Voorbeeld:** de server is bereikbaar via ping, maar de client vindt het domein niet. Kijk eerst welke DNS-server op de client is ingevuld.

## 3. Gebruikers in groepen zetten

Je kunt rechten één voor één aan gebruikers geven. Bij veel gebruikers raak je dan snel het overzicht kwijt. Daarom maken we **groepen**.

- `GG-Rood`: gebruikers die op RoodkapjesHuis mogen werken.
- `GG-Big`: gebruikers die op BiggetjesHuis mogen werken.
- `GG-Beheer`: gebruikers die beide pc's mogen beheren.

Roodkapje wordt lid van `GG-Rood`, Big1 van `GG-Big` en Wolf van `GG-Beheer`. Als Oma later ook op RoodkapjesHuis mag werken, voeg je haar aan `GG-Rood` toe. Je hoeft de rechten van de pc dan niet opnieuw uit te tekenen.

**Beheren** betekent meer mogen dan een gewoon programma gebruiken. Een beheerder kan bijvoorbeeld software installeren voor alle gebruikers. Wolf krijgt die rechten alleen op de twee oefen-pc's. Wolf hoeft daarvoor geen beheerder van het hele domein te zijn.

Gebruik een gewoon account voor dagelijks werk en een apart beheeraccount voor beheertaken. Voor alle accounts in deze labo-omgeving gebruiken we `Student123`. De accounts en hun rechten blijven wel apart.

## 4. Mappen voor computers en centrale afspraken

In Active Directory kun je computers en gebruikers in beheermappen zetten. Zo'n map heet een **Organizational Unit**, kort **OU**. Ze is geen gedeelde map voor bestanden.

Wij maken twee computer-OU's. In de ene staat RoodkapjesHuis, in de andere BiggetjesHuis. Zo kunnen we per pc een andere afspraak toepassen.

Een verzameling centrale instellingen heet een **Group Policy Object**, kort **GPO**. Wij gebruiken een GPO om te bepalen wie op een pc mag aanmelden. De pc haalt die instellingen op bij het domein.

Een GPO voor RoodkapjesHuis koppelen we alleen aan de OU van die pc. Als je ze per ongeluk aan het hele domein koppelt, kun je ook andere computers blokkeren. In dit labo verander je daarom niet de standaardinstellingen van het hele domein of de OU van de domeincontroller.

## 5. Aanmelden aan het scherm of via RDP

Je kunt op twee manieren op onze pc's werken:

- **Lokaal aanmelden:** via het pc-scherm, in dit labo de console in Proxmox.
- **RDP:** Remote Desktop Protocol. Je opent het bureaublad van de pc via het netwerk.

Voor die twee manieren bestaan aparte aanmeldrechten. Toegang bij de ene test bewijst niet dat de andere ook goed staat.

Ook moet RDP op de doel-pc aanstaan en moet de firewall de verbinding toelaten. Windows Home kan niet als de bedoelde RDP-host en domeinclient dienen. Gebruik de Pro- of Education-editie van de opleiding.

Met **Network Level Authentication**, NLA, controleert RDP de aanmelding voordat het een volledige sessie opent. Laat die beveiliging aanstaan.

## 6. Eerst opschrijven wie waar mag werken

Dit is onze afspraak. ‘Ja’ geldt zowel voor aanmelden via het scherm als via RDP:

| Account | RoodkapjesHuis | BiggetjesHuis | Beheertaken op clients |
| --- | --- | --- | --- |
| Roodkapje | Ja | Nee | Nee |
| Big1 | Nee | Ja | Nee |
| Wolf | Ja | Ja | Ja, op beide |

Het domeinbeheeraccount blijft beschikbaar om fouten te herstellen. Gewone gebruikers mogen niet op de domeincontroller aanmelden.

Test ook de vakjes met ‘Nee’. Alleen een werkende beheerderslogin tonen is niet genoeg: een beheerder heeft vaak meer rechten dan een gewone gebruiker.

Meld volledig af voordat je een andere gebruiker test. Een sessie loskoppelen laat de programma's van die gebruiker verder draaien. Na een groepswijziging meld je opnieuw aan, zodat Windows de nieuwe groepsinformatie gebruikt.

## 7. Als een aanmelding mislukt

Begin bij wat je ziet. ‘Domein niet gevonden’ vraagt een andere controle dan ‘deze aanmeldmethode is niet toegestaan’.

1. Controleer het adres en DNS met `ipconfig /all`.
2. Zoek de domeinnaam en server op met `nslookup`.
3. Controleer de tijd.
4. Controleer de groep van de gebruiker en de OU van de doel-pc.
5. Controleer of de GPO op de doel-pc is toegepast met `gpresult /r /scope computer` in een beheerdersvenster.

Je stopt de DNS-dienst niet om een fout te oefenen. We veranderen straks alleen tijdelijk de DNS-instelling van één eigen client. Zo raken andere studenten hun verbinding niet kwijt.

## Kun je dit uitleggen?

1. Waarom vul je op de client het adres van SprookjesBoom in als DNS-server?
2. Oma mag voortaan op RoodkapjesHuis werken. Aan welke groep voeg je haar toe?
3. Waarom hoeft Wolf geen lid van Domain Admins te zijn?
4. Roodkapje mag via de console aanmelden. Bewijst dat dat RDP ook werkt?
5. Wat is het verschil tussen afmelden en de RDP-verbinding sluiten?

## Bronnen

- [AD DS installeren](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/deploy/install-active-directory-domain-services--level-100-)
- [Recht om lokaal aan te melden](https://learn.microsoft.com/en-us/windows/security/threat-protection/security-policy-settings/allow-log-on-locally)
- [Recht om via RDP aan te melden](https://learn.microsoft.com/en-us/windows/security/threat-protection/security-policy-settings/allow-log-on-through-remote-desktop-services)
