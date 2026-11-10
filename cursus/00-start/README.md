# Starten met The Cloud

In deze cursus bouw je een omgeving die je over meerdere hoofdstukken gebruikt. Je begint met virtuele machines en een webserver. Daarna voeg je centraal toegangsbeheer, andere diensten, containers en monitoring toe. Bewaar je machines en configuraties tot de docent aangeeft dat ze weg mogen.

## Wat je vooraf moet kennen

Je kent de basis van IPv4, subnetmaskers en client-servercommunicatie. Je kunt bestanden en mappen beheren, eenvoudige HTML en CSS schrijven en basiscommando's uitvoeren in een Linux-terminal. Zoek een onbekend commando op voordat je het uitvoert. Je hoeft Proxmox nog niet te kennen.

## Je werkomgeving

Er zijn twee mogelijkheden. De docent geeft aan welke jij gebruikt.

| Route | Wat je gebruikt | Wat je zelf doet in hoofdstuk 1 |
| --- | --- | --- |
| A Eigen laptop | Proxmox als VM in een geschikte hosthypervisor | Proxmox installeren en daarin twee VM's bouwen |
| B Opleiding | Een toegewezen Proxmox-oefenomgeving | De toegewezen omgeving configureren en daarin twee VM's bouwen |

Bij route B kan de installatieoefening op een aparte tijdelijke Proxmox-VM plaatsvinden. Een bestaande gedeelde Proxmox-server van de opleiding installeer je nooit opnieuw. Met alleen twee vooraf gemaakte Linux-VM's kun je het installatieleerdoel voor de hypervisor nog niet aantonen.

Voor route A is een x86-64-laptop met minstens 16 GB RAM en ongeveer 120 GB vrije SSD-ruimte een werkbudget voor het eerste hoofdstuk. Voorzie 8 GB RAM en een virtuele disk van 100 GB voor de Proxmox-VM. 32 GB RAM op de laptop geeft meer ruimte voor latere hoofdstukken. Dit zijn cursusbudgetten, geen officiële minimumvereisten of garantie dat alle latere VM's tegelijk passen. De opleiding voorziet een alternatief als nested virtualisatie niet mogelijk is, bijvoorbeeld op een laptop met een andere architectuur.

Je hebt nodig:

- Een browser en een terminal met SSH-client.
- De door de docent gekozen hosthypervisor voor route A, met doorgegeven hardwarevirtualisatie.
- De afgesproken ISO's voor Proxmox VE, Ubuntu Server en Xubuntu.
- Toegang tot de cursusbestanden en een plaats voor je eigen verslag en configuraties.
- Een back-updoel dat de docent toewijst.

De [versielijst](../../docenten/versies.md) beschrijft de gekozen basis en wat nog op de lesinfrastructuur moet worden gevalideerd. Gebruik de meegeleverde ISO's in plaats van tijdens de les telkens een andere release te downloaden.

## Eerst je labkaart invullen

Maak een eigen kopie van [de labkaart](../01-hypervisors/bestanden/labkaart-sjabloon.md). De docent bevestigt het netwerk en de toegestane adressen voordat je machines vaste IP-adressen geeft. Voor route A noteer je ook het werkelijke NAT-subnet en de gateway van je hosthypervisor.

In de voorbeelden gebruiken we `192.168.77.0/24`. Dat netwerk moet eerst bestaan. Als jouw labkaart een ander subnet vermeldt, vervang je de adressen overal: in de installer, commando's, configuraties, firewallregels en tests. De Proxmox-bridge maakt zelf geen router of DHCP-server aan.

## Hoe je met de cursus werkt

1. Lees de leerdoelen en de theorie van het hoofdstuk.
2. Gebruik de slides tijdens de les en bespreek de controlevragen.
3. Voer de genummerde opdrachten uit en test elk controlepunt.
4. Noteer je eigen keuzes en resultaten. Gebruik de oplossingen om een fout te onderzoeken of je aanpak achteraf te vergelijken.

De oplossingen tonen één mogelijke uitvoering. Interface-namen, VMID's en opslaglabels verschillen per omgeving. Begrijpen welke waarde je moet aanpassen hoort bij de opdracht.

## Werkafspraken

Voer commando's uit op de machine die boven het codeblok staat. Een terminal op Proxmox is een andere omgeving dan een terminal op Ubuntu Server of je laptop. Gebruik `sudo` alleen voor de stap die beheerdersrechten nodig heeft. Op een eigen Proxmox-node gebruik je voor het infrastructuurbeheer het toegewezen beheeraccount; op een gedeelde node werk je met de rechten die de opleiding toekent.

Bewaar wachtwoorden en private SSH-sleutels buiten je verslag en buiten Git. Een screenshot van een aanmeldscherm hoeft geen wachtwoord te tonen. Neem configuratiebestanden als tekst op, zodat je ze later kunt vergelijken en hergebruiken.

Installeer geen eigen DHCP-server op het schoolnetwerk. Maak beheerinterfaces niet publiek bereikbaar. Test storingen alleen op je eigen machines. De docent duidt aan welke taken op gedeelde infrastructuur door de beheerder worden uitgevoerd.

## Je verslag

Gebruik [het verslagsjabloon](../01-hypervisors/bestanden/verslag-sjabloon.md). Schrijf per controle wat je test, wat je verwacht en wat je vaststelt. Een terminalfragment met uitleg is vaak bruikbaarder dan een reeks screenshots zonder context.

Begin daarna aan [hoofdstuk 1](../01-hypervisors/README.md).
