# Voorstel voor de herwerking van The Cloud

Dit voorstel vertrekt van alle twintig bestanden in `base` en richt zich op het tweede jaar graduaat Internet of Things. Het beschrijft de inhoudelijke wijzigingen vóór we de nieuwe cursus hoofdstuk per hoofdstuk uitschrijven. De bronbestanden blijven behouden als referentie.

De vijf bestaande hoofdstukken blijven de basis. We vervangen de Azure-afhankelijkheden door eigen infrastructuur, versterken de uitleg achter de opdrachten en maken opdrachten en oplossingen reproduceerbaar. Er komt geen verplichte commerciële cloudaccount of kredietkaart in het leerpad. Ook Grafana Cloud en Chrome Remote Desktop zijn niet nodig voor de basisopdrachten.

**Aanvulling na feedback:** alle hoofdstukken worden in gewone taal uitgewerkt. Studenten dienen per labo of toets één `verslag.md` in, met instellingen, code en testresultaten. Er komt geen aparte labkaart of verzameling bijlagen. De cursusbronbestanden blijven per hoofdstuk gegroepeerd. De praktijktesten gebruiken een website of MQTT-broker die in de nieuwe lessen geoefend zijn.

## 1. Analyse van het bronmateriaal

De tekst, opdrachten, beoordelingscriteria en links van alle bestanden zijn doorgenomen. De screenshotdocumenten bevatten aanvullende uitwerkingen die bij de herwerking als bron kunnen dienen. De bestaande labo's zijn nog niet opnieuw technisch uitgevoerd; dit document is een inhoudelijk voorstel, geen validatie van de bestaande commando's of een afgewerkte cursus.

| Bestanden in `base` | Inhoud en verwerking |
| --- | --- |
| `01 - Les 1 - Hypervisors.pptx` | Acht slides over virtualisatie, type I en II en voorbeelden. Behouden en aanvullen met resources, netwerken en herstel. |
| `01 - Labo 1 - Hypervisors.docx` | Nested Proxmox met Ubuntu Server, Xubuntu, vaste IP-adressen en NGINX. Dit wordt de startomgeving voor de cursus. |
| `01 - Labo 1 - Hypervisors - Screens.docx` | Uitwerking met installatie, netplan, bestandsoverdracht en automatisch opstarten. Omzetten naar geschreven stappen en verklaringen. |
| `01 - Labo 1 - Hypervisors.txt` | Workarounds voor nested virtualisatie en Hyper-V. Verwerken in gerichte troubleshooting, niet als algemene verplichte systeemwijziging. |
| `02 - Les 2 - Netwerkservices.pptx` | Overzicht van netwerkservices, RDP en AD. Meer samenhang aanbrengen tussen DNS, identiteit, toegang en beheer. |
| `02 - Labo 2 - Netwerkservices.docx` | Windows Server 2022 met AD en twee Windows 11-clients. Behouden, met Proxmox als standaardplatform. |
| `02 - Labo 2 - Netwerkservices - Screens.docx` | Aanvullende configuratie van AD, DNS, gebruikers, RDP en mRemoteNG. Opschonen en expliciete toegangscontroles toevoegen. |
| `03 - Les 3 - The Cloud.pptx` | Cloudvoorbeelden en Azure-overzicht. Cloudtheorie uitbreiden en Azure-portaalslides vervangen. |
| `03 - Labo 3 - The Cloud.docx` | Azure-netwerk en Debian-VM met desktop, Chrome Remote Desktop en Jellyfin. Infrastructuur en beheerroute vervangen. |
| `03 - Labo 3 - The Cloud - Screens.docx` | Uitwerking met Azure, Jellyfin, bestandsrechten en clients. Jellyfin-stappen inhoudelijk hergebruiken. |
| `04 - Les 4 - Containers.pptx` | Images, containers, CLI, poorten, volumes en orkestratie. Begrippen corrigeren en Compose toevoegen. |
| `04 - Labo 4 - Containers.docx` | Home Assistant en Mosquitto op Azure. Casus behouden op een Linux-VM in Proxmox. |
| `04 - Labo 4 - Containers - Screens.docx` | Docker-installatie en integratie van Home Assistant, MQTT en telefoon. Authenticatie en configuratie corrigeren. |
| `04 - Labo 4 - Containers.txt` | Extra Mosquitto-, MariaDB- en phpMyAdmin-commando's. Alleen bruikbare patronen overnemen; onveilige rechten en oude koppelingen vervangen. |
| `05 - Les 5 - Monitoring.pptx` | Korte inleiding en productvoorbeelden. Uitbreiden tot uitleg over verzamelen, opslaan, bevragen en alarmeren. |
| `05 - Labo 5 - Monitoring.docx` | Windows/Linux/LAMP met Grafana Cloud, Alloy, dashboards en optionele alerts. Zelfgehoste basis maken. |
| `05 - Labo 5 - Monitoring - Screens.docx` | Uitwerking van integraties en queries. Inhoud hergebruiken, vaste capaciteit in formules en rootgebruik corrigeren. |
| `06 - PraktijkTest.docx` | Lokale Xubuntu, Azure Debian, Transmission en Grafana Cloud. Behouden als mogelijke toetsvariant met eigen VM's en lokale monitoring. |
| `06 - PraktijkTest2.docx` | Ubuntu, KiCad-container, Windows in Azure en Grafana Cloud. Aanpassen naar eigen infrastructuur en eenvoudiger toegang. |
| `AccountAzure2024.docx` | Accountaanmaak en studentenverificatie. Vervalt als cursusonderdeel en wordt vervangen door instructies voor toegang tot de labomgeving. |

De bron bevat soms verschillende versies van dezelfde eis. Voorbeelden zijn 12 tegenover 16 GB RAM bij labo 2, tegenstrijdige puntenaantallen bij dat labo en Plex tegenover Jellyfin in labo 3. Bij de nieuwe uitwerking krijgt elk hoofdstuk één consistente opdracht en beoordelingsrubric.

## 2. Gezamenlijke infrastructuur en didactiek

### Eén leerpad met twee uitvoeringsmogelijkheden

1. De student gebruikt de eigen nested Proxmox uit labo 1 en bouwt daarop verder.
2. De opleiding voorziet een Proxmox-omgeving of VM's als alternatief bij beperkte hardware of problemen met nested virtualisatie.

De leerdoelen en acceptatiecriteria blijven gelijk. Als de opleiding alleen losse VM's aanbiedt, moet voor de hypervisordoelen van hoofdstuk 1 nog een afzonderlijke Proxmox-oefenomgeving beschikbaar zijn. Een gedeelde omgeving krijgt individuele accounts, beperkte rechten, afgescheiden studentnetwerken en afspraken over resources en herstel.

We documenteren vooraf het netwerk: beheertoegang, subnetten, DNS, gateway, uitgaand internet en toegang vanaf laptop en telefoon. NAT betekent niet automatisch dat een telefoon de VM kan bereiken. Een voorzien school-VPN of een expliciet ingerichte route maakt externe toegang mogelijk. Studenten hoeven geen publieke IPv4-adressen of portforwarding op hun thuisrouter te voorzien.

Een Proxmox-installatie is op zichzelf nog geen volledige private cloud. We gebruiken ze als infrastructuur om provisioning, gedeelde resources, isolatie en beheer te oefenen en benoemen welke cloudkenmerken de onderwijsomgeving wel en niet realiseert. De theorie behandelt ook selfservice, elasticiteit en gemeten verbruik. Dat sluit aan op de [NIST-definitie van cloud computing](https://csrc.nist.gov/pubs/sp/800/145/final).

### Opbouw van de opdrachten

Elk labo bevat leerdoelen, voorkennis, benodigdheden, een netwerkschema, opdrachten, controlepunten, in te dienen bewijs en beoordelingscriteria. Studenten leggen naast het resultaat kort uit waarom hun configuratie werkt. Een fout kunnen onderzoeken telt mee.

Oplossingen krijgen commando's en configuratiebestanden als tekst, uitleg bij belangrijke keuzes, verwachte resultaten en troubleshooting. Screenshots ondersteunen alleen waar ze iets verduidelijken. Een oplossing moet bruikbaar blijven wanneer een knop verplaatst wordt.

We kiezen vóór het uitschrijven één geteste Linux-serverbasis en registreren versies van OS, Proxmox en containerimages. Versies worden per cursusrelease vastgelegd en vóór een volgende editie gecontroleerd. Referenties naar `latest` zijn geen garantie op reproduceerbaarheid. Netwerkbeveiliging, accounts, bestandsrechten en herstel keren terug in elk relevant hoofdstuk.

## 3. Hoofdstuk 1 — Hypervisors en virtuele infrastructuur

### Behouden

Het onderscheid tussen type I en type II, de installatie van Proxmox, de Ubuntu Server- en Xubuntu-VM, vaste IP-adressen en de NGINX-website. Deze opdracht is al Azure-vrij en levert een bruikbare basis voor de rest van de cursus.

### Wijzigen en aanvullen

- Uitleggen welke lagen studenten bouwen: fysieke laptop, eventueel een hosthypervisor, Proxmox en de VM's daarin. Nested virtualisatie verandert het onderliggende type van Proxmox niet.
- vCPU, RAM, virtuele disks, thin provisioning, bridges en NAT behandelen vanuit de concrete opstelling.
- Een expliciet adresplan gebruiken in plaats van alleen `x.x.x.100` en `x.x.x.200`. Elk plan vermeldt subnetmasker, gateway, DNS en bereikbaarheid van de beheerinterface.
- De hardwarevereisten voor het volledige leerpad begroten. De oorspronkelijke 6 GB voor Proxmox is geen onderbouwd budget voor alle latere machines tegelijk.
- SSH en SFTP correct benoemen. SFTP is het SSH File Transfer Protocol, geen FTP over SSH.
- Bestandsrechten correct instellen bij het publiceren van de website. Brede schrijfrechten vervangen door een begrijpbare eigenaar/groep en gerichte installatie van bestanden.
- Een snapshot vóór een wijziging en een back-up met hersteltest toevoegen. Het verschil tussen een snapshot en een onafhankelijke back-up uitleggen.
- De Hyper-V-workarounds uit het tekstbestand alleen aanbieden na diagnose van de gebruikte hostconfiguratie.

### Voorgesteld labo en controle

Studenten bouwen de bestaande opstelling, publiceren hun website en tonen communicatie tussen de VM's aan. Ze onderzoeken ook één fout, bijvoorbeeld een verkeerd adres of gestopte webservice. Daarna herstellen ze een eerdere toestand. De VM's worden bewaard en krijgen duidelijke namen en een korte inventaris in Markdown.

**Omvang:** bestaande sessie van ongeveer 4,5 uur als uitgangspunt. Back-up/herstel blijft een korte afgebakende oefening; uitgebreide storageconfiguratie wordt verdieping.

## 4. Hoofdstuk 2 — Netwerkservices en centraal toegangsbeheer

### Behouden

Windows Server, Active Directory, twee Windows-clients, domeingebruikers en RDP. Azure verwijderen betekent niet dat de Windows- en AD-leerdoelen moeten verdwijnen. De bestaande sprookjescasus kan blijven als herkenbare oefencontext.

### Wijzigen en aanvullen

- De machines op Proxmox plaatsen. De opleiding kan vooraf geschikte installatiebeelden of templates aanbieden zodat installatiewachttijd het labo niet domineert.
- DNS en tijdsynchronisatie behandelen als onderdelen die nodig zijn voor de domeinwerking. AD uitleggen via directory, authenticatie en policies, met DNS, LDAP en Kerberos in hun juiste rol.
- Met één domein, enkele gebruikers en groepen werken. Forests en trusts blijven op overzichtsniveau.
- Een matrix opnemen met wie op welke machine lokaal en via RDP mag aanmelden. Zowel toegelaten als geweigerde toegang aantonen.
- Wolf alleen de vereiste beheertoegang op de betrokken clients geven. Geen Domain Admins-lidmaatschap gebruiken als algemene oplossing voor lokale beheertaken.
- Voor alle laboaccounts het vaste wachtwoord `Student123` gebruiken. Gewone accounts en beheerdersaccounts blijven apart.
- Eén eenvoudige Group Policy toevoegen, bijvoorbeeld voor de bedoelde RDP-toegang.
- mRemoteNG als hulpmiddel behandelen, met een alternatief voor studenten op een ander hostbesturingssysteem. Beoordelen op verbinding en begrip, niet op het specifieke programma.
- Verwijzingen naar XP, Windows 7 en andere niet-gebruikte systemen verwijderen. Accountomwegen vervangen door een door de opleiding voorbereide installatieprocedure en passende licentie- of evaluatieafspraken.

### Voorgesteld labo en controle

Studenten bouwen het domein, koppelen twee clients en voeren de toegangsmatrix uit. Vervolgens krijgen ze een DNS- of rechtenprobleem om gericht te onderzoeken. Hostnames, adressen, relevante groepen en testresultaten komen in een kort verslag.

**Omvang:** ongeveer 4,5 uur met voorbereide installatiebeelden. Extra homedirectories, Windows Admin Center en Linux-domeinintegratie worden verdieping.

## 5. Hoofdstuk 3 — Cloudprincipes en diensten aanbieden

### Behouden

Een serverdienst beschikbaar maken voor meerdere clients, SSH, bestandsrechten, opslag en Jellyfin. De mediacase is concreet en laat dezelfde dienst vanaf laptop en telefoon testen.

### Vervangen en aanvullen

- Azure-account, resource group, VM-SKU, publiek IP, krediet en automatische afsluiting vervangen door een VM op eigen of school-Proxmox.
- De clouddefinitie verbreden. Externe hosting alleen is onvoldoende om de essentiële cloudkenmerken te verklaren. IaaS, PaaS en SaaS, public/private/hybrid cloud, gedeelde verantwoordelijkheid, beschikbaarheid en kosten komen aan bod.
- Eén VM vanuit een voorbereid template uitrollen met eigen naam, netwerkconfiguratie en SSH-sleutel. Cloud-init is een passend onderwerp voor deze oefening; uitgebreide automatisering kan later als verdieping.
- De rollen van Proxmox-resources vergelijken met die van een provider, zonder een Proxmox-pool als volledig equivalent van een Azure resource group voor te stellen.
- Jellyfin eenduidig gebruiken en de resterende Plex-verwijzingen verwijderen.
- De desktopomgeving en Chrome Remote Desktop uit het basispad halen. Beheer gebeurt via SSH en de webinterface. Grafisch beheer kan als optionele oefening blijven.
- Toegang beperken tot het labnetwerk of school-VPN. Voor HTTPS een door de opleiding ondersteunde certificaatroute beschrijven, inclusief vertrouwen op de clients. Een publiek domein is geen voorwaarde.
- Opslag buiten de systeemconfiguratie behandelen: datarechten, servicegebruiker en een kleine hersteltest. Voor media gebruiken we eigen of meegeleverde testbestanden.
- Kafka uit het rijtje MQTT-brokers halen. Het gebruikt een eigen protocol; zie de [Kafka-protocoldocumentatie](https://kafka.apache.org/protocol.html).

### Voorgesteld labo en controle

Een student rolt een VM uit, installeert Jellyfin en maakt een mediabibliotheek beschikbaar. De student toont toegang vanaf twee clients aan en verklaart de route van client naar dienst, de toegestane poorten en de scheiding tussen applicatie en data. Een browser is een geldig alternatief als een specifieke mobiele app niet beschikbaar is.

**Omvang:** ongeveer vier uur met voorbereid template en werkende toegangsroute. Een IoT-telemetriedienst kan later als alternatieve casus dienen, maar is niet nodig om de bestaande Jellyfin-opdracht te behouden.

## 6. Hoofdstuk 4 — Containers en een IoT-toepassing

### Behouden

Docker Engine op Linux, images, containers, CLI, volumes en poorten. Home Assistant met een Mosquitto-broker en de gesimuleerde voordeur vormen een geschikte IoT-opdracht.

### Wijzigen en aanvullen

- De Azure-VM vervangen door een Linux-VM op Proxmox. Docker in een VM is de standaardroute; Docker in LXC wordt geen extra afhankelijkheid in het basispad.
- Containers uitleggen als procesisolatie met een gedeelde hostkernel. Het onderscheid tussen VM, systeemcontainer en applicatiecontainer expliciet maken.
- Eerst één container met `docker run` starten en daarna de twee diensten in `compose.yaml` beschrijven. Compose maakt de configuratie van meerdere containers deelbaar en herhaalbaar; zie [Docker Compose](https://docs.docker.com/compose/intro/features-uses/).
- Een bewust gekozen container-netwerk gebruiken. Bij bridge networking communiceren diensten via hun servicenaam, bijvoorbeeld `mosquitto`, in plaats van via een gekopieerd tijdelijk container-IP. Host networking alleen gebruiken als de concrete Home Assistant-functionaliteit dat vraagt.
- De officiële Home Assistant Container-installatie als referentie nemen. Uitleggen dat deze installatie geen beheerde apps/add-ons aanbiedt en dat Mosquitto daarom apart draait. Zie [Home Assistant op Linux](https://www.home-assistant.io/installation/linux/).
- MQTT-authenticatie verplicht maken en toegang tot topics beperken. De huidige opdracht vraagt credentials, terwijl de screenshotoplossing `allow_anonymous true` instelt. Dit wordt één consistente configuratie met een negatieve aanmeldtest. Zie [Mosquitto-authenticatie](https://mosquitto.org/documentation/authentication-methods/).
- `chmod 777`, typefouten zoals `mosquito` en `eclipse-mosquito`, verouderde `--link`-voorbeelden uit de aanvullingen vervangen. Alle labowachtwoorden worden `Student123`.
- Persistentie aantonen door containers opnieuw aan te maken met behoud van configuratie. Logs, restartbeleid en een gecontroleerde update bespreken.
- KMI als uitbreiding aanbieden, zodat externe bereikbaarheid of een gewijzigde integratie de kernopdracht niet blokkeert. Een desktop-MQTT-client of CLI blijft een alternatief voor de telefoonapp.
- Kubernetes en Swarm kort situeren. Geen extra cluster opzetten binnen dit labo.

### Voorgesteld labo en controle

Studenten starten beide diensten, configureren MQTT en maken de toestand van een fictieve deur zichtbaar in Home Assistant. Ze tonen aan dat een client met verkeerde credentials wordt geweigerd en dat de configuratie een herstart en heraanmaak overleeft. De Compose-file en brokerconfiguratie behoren tot het in te dienen materiaal; echte secrets niet.

**Omvang:** ongeveer vier uur. MariaDB en phpMyAdmin uit het losse tekstbestand zijn verdiepingsmateriaal, geen extra verplichte stack naast deze casus.

## 7. Hoofdstuk 5 — Monitoring, dashboards en foutdetectie

### Behouden

Linux en Windows monitoren, een webserver en database opvolgen, zelf een Grafana-dashboard bouwen en een storing veroorzaken om de detectie te testen.

### Vervangen en aanvullen

- Azure en de verplichte Grafana Cloud-account vervangen door een eigen monitoring-VM met Grafana en Prometheus. Studenten hergebruiken een Windows-client uit hoofdstuk 2 en een Linux-VM uit eerdere hoofdstukken.
- De rollen uitleggen: een exporter biedt metrics aan, Prometheus haalt ze op en bewaart ze, Grafana bevraagt en visualiseert ze. Dit is een ander basispad dan Alloy dat naar Grafana Cloud doorstuurt. Zie het [Prometheus-overzicht](https://prometheus.io/docs/introduction/overview/).
- Node Exporter voor Linux en windows_exporter voor Windows gebruiken. Alloy behouden als optionele uitbreiding, bijvoorbeeld voor een latere oefening met remote write of logs.
- Eén webserver kiezen voor de kernopdracht. NGINX uit hoofdstuk 1 kan worden hergebruikt; de bestaande Apache/MariaDB-uitwerking blijft bruikbaar als voorbereide toepassing of uitbreiding. Het opnieuw installeren van een volledige LAMP-stack is geen leerdoel voor monitoring.
- Metrics, logs, events en sensordata onderscheiden. Counters, gauges, labels, scrape-interval, retentie en PromQL behandelen.
- Formules baseren op gemeten totale capaciteit. Geen vaste 8.192 GB geheugen of 60 GB schijfruimte aftrekken. Voor verkeer een rate van een counter gebruiken en de eenheid tonen.
- Bereikbaarheid van een exporter onderscheiden van de toestand van de applicatie. Een geslaagde scrape bewijst niet dat de webdienst voor gebruikers werkt.
- Container-CPU, geheugen en netwerk toevoegen als voorbereiding op de praktijktest. Docker-daemonmetrics volstaan daarvoor niet; een passende collector zoals cAdvisor is nodig. Zie [Docker-metrics](https://docs.docker.com/engine/daemon/prometheus/) en de [Prometheus-cAdvisor-handleiding](https://prometheus.io/docs/guides/cadvisor/).
- Monitoringaccounts met beperkte rechten gebruiken, ook voor MariaDB. Geen database-rootaccount als standaardcollector.
- Twee alerts verplicht maken: dienst onbereikbaar en een resource boven een drempel. Studenten tonen ook herstel en de overgang terug naar normaal aan. Voor een volle-schijftest gebruiken we een begrensde testlocatie of tijdelijk aangepaste drempel.
- De uitspraak ‘Elasticsearch, vroeger Kibana’ corrigeren. Het zijn verschillende componenten: Kibana biedt onder meer visualisatie van Elasticsearch-data. Zie [Elastic](https://www.elastic.co/kibana/).

### Voorgesteld labo en controle

Met een voorbereide monitoringbasis koppelen studenten de Windows- en Linux-targets en een container. Ze bouwen een dashboard met correcte eenheden en filters. Daarna stoppen ze gecontroleerd een dienst, verklaren wat de metrics tonen en bewijzen dat de alert afgaat én herstelt. Dashboard-JSON, queries en relevante configuratie worden bijgehouden.

**Omvang:** ongeveer vijf uur. Apache- en MariaDB-exporters samen zijn verdieping, tenzij de opleiding daar een tweede sessie voor voorziet. Container-monitoring moet vóór de toets wel geoefend zijn.

## 8. Hoofdstuk 6 — Geïntegreerde praktijktest

Dit is een evaluatiehoofdstuk, geen nieuw theorieblok. Beide bestaande varianten kunnen behouden blijven als basis, maar alle Azure- en Grafana Cloud-afhankelijkheden verdwijnen.

### Variant A uit PraktijkTest

De lokale client en Debian-server draaien op de beschikbare infrastructuur. Transmission blijft mogelijk met een door de docent gekozen vrije Linux-image of eigen testtorrent. De bestaande externe torrentsitelink vervalt. De test beoordeelt deployment, persistentie, toegang, hostmetrics en containermetrics.

### Variant B uit PraktijkTest2

De Ubuntu-server met KiCad-container en de Windows-client draaien op eigen infrastructuur. Toegang verloopt rechtstreeks via de bedoelde webinterface over het labnetwerk of VPN. Een extra desktopomgeving met Chrome Remote Desktop vervalt. De gebruikte containerimage en toegangsvereisten worden vooraf getest.

### Gemeenschappelijke wijzigingen

- Eén gedeelde rubric gebruiken voor gelijkwaardige moeilijkheid en weging. Bij een CLI-opdracht mag `docker run` verplicht blijven; Compose wordt dan afzonderlijk in hoofdstuk 4 beoordeeld.
- Alleen eerder geoefende technieken beoordelen. In de huidige cursus moet container-monitoring dus eerst aan hoofdstuk 5 worden toegevoegd.
- Configuratie, aantoonbare werking, databehoud, monitoring, toegangsbeveiliging en diagnose beoordelen.
- Een kleine storing en een korte mondelinge toelichting toevoegen.
- Voor de drie uur toetstijd vooraf aangeven welke VM's en monitoringbasis al klaar mogen staan. Het installeren van alle OS'en en de hele stack vanaf nul maakt de toets sterk afhankelijk van downloads en hardware.
- Een modeloplossing, controlelijst en puntenrubric in Markdown maken. Het uitsluiten van oplossingen uit een studentenexport regelt geen vertrouwelijkheid als studenten toegang tot dezelfde repository hebben; een echte afscherming vraagt een aparte publicatie of private docentenrepository.

Een derde variant met een kleine MQTT-toepassing is mogelijk als IoT-alternatief. Dat is een latere keuze, geen noodzakelijke vervanging van beide bestaande toetscases.

## 9. Bestandsstructuur van de nieuwe cursus

```text
README.md
CURSUSVOORSTEL.md
base/                              # originele referentiebestanden
cursus/
  00-start/README.md                # toegang, tools, versies, afspraken
  01-hypervisors/
    README.md                      # leerdoelen, voorkennis en leesvolgorde
    theorie.md
    slides.md                      # Marp
    opdrachten.md
    oplossingen.md
    assets/
    bestanden/                     # configuraties en startbestanden
  02-netwerkservices/               # dezelfde indeling
  03-cloudprincipes/
  04-containers/
  05-monitoring/
  06-praktijktest/
    README.md
    opdrachten-a.md
    opdrachten-b.md
    oplossingen-a.md
    oplossingen-b.md
    beoordeling.md
docenten/
  infrastructuur.md
  versies.md
  publicatie.md
thema/
  the-cloud.css
```

De hoofdstukmappen bevatten alles wat bij het onderwerp hoort. De praktijktest krijgt geen kunstmatige theorie of slides die alleen eerdere inhoud herhalen. Gemeenschappelijke infrastructuurafspraken en het Marp-thema staan centraal.

`theorie.md` is zelfstandig leesbaar en legt het waarom uit. `slides.md` ondersteunt de les met kernbegrippen, schema's, voorbeelden en korte vragen. Het is geen volledige kopie van de theorie. Opdrachten krijgen stabiele nummers die terugkomen in oplossingen en beoordeling.

Marp-bestanden gebruiken frontmatter met minstens `marp: true`, een afgesproken thema en paginanummering. Commando's, YAML en scripts blijven tekstbestanden in versiebeheer. Assets krijgen beschrijvende namen en relatieve links. Publicatie kan later HTML en PDF opleveren; Markdown blijft de bron.

## 10. Voorgestelde uitvoeringsvolgorde

1. Het netwerk, de toegangsroute en de beschikbare capaciteit van beide infrastructuurpaden vastleggen. Daar hoort ook de Windows-installatie- en licentievoorziening bij.
2. Hoofdstuk 1 volledig uitschrijven, uitvoeren en als model gebruiken voor theorie, Marp, opdrachten en oplossingen.
3. Hoofdstuk 2 overzetten en daarna hoofdstuk 3 uitwerken met een voorbereid template en een geteste clientroute.
4. Hoofdstuk 4 met reproduceerbare configuraties uitwerken en technisch testen.
5. Hoofdstuk 5 bouwen op de eerder gemaakte systemen en de voor de toets nodige containermetrics oefenen.
6. Beide praktijktesten afstemmen op de definitieve leerdoelen en tijdsbegroting.

Pas na uitvoering op een schone testomgeving noemen we een hoofdstuk technisch gevalideerd. Daarbij controleren we ook herstarts, persistentie, negatieve toegangstests, herstel en de opbouw van de Marp-slides.
