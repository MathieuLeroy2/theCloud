# Zien of je systemen goed werken

Je website werkt tijdens de les. Maar wat gebeurt er als niemand ernaar kijkt? De schijf kan vollopen, een programma kan stoppen of een VM kan veel geheugen gebruiken.

Met **monitoring** verzamel je regelmatig meetgegevens van computers en programma's. Je bekijkt die op een dashboard en laat een waarschuwing tonen als iets fout gaat.

Vandaag volg je de Linux-server uit hoofdstuk 1, een Windows-client uit hoofdstuk 2 en containers uit hoofdstuk 4 op. Je hebt geen Grafana Cloud-account nodig.

## 1. Wat meet je?

Een **metric** is een meetwaarde, bijvoorbeeld vrije schijfruimte in bytes. Je meet steeds opnieuw en bewaart ook het tijdstip. Zo kun je zien hoe de waarde verandert.

Een enkele meting ‘2 GB vrij’ zegt minder dan een grafiek die van 10 GB naar 2 GB daalt. Misschien loopt de schijf straks vol.

We onderscheiden:

- Een **gauge** kan stijgen en dalen: vrije RAM of temperatuur.
- Een **counter** telt verder: het totaal aantal verstuurde bytes sinds een start. Na een herstart kan die teller weer bij nul beginnen.

Wil je netwerkverkeer per seconde zien, dan gebruik je de stijging van die teller per tijdseenheid, niet zomaar het totaal. Daarvoor dient de functie `rate()`.

Een log is iets anders. Die bevat meldingen, bijvoorbeeld dat NGINX gestart is. Een sensormeting zoals 22 graden is ook nog niet hetzelfde als de gezondheid van de server die het bericht ontvangt.

## 2. Drie taken en drie namen

| Onderdeel | Wat doet het? |
| --- | --- |
| Exporter | Biedt meetgegevens aan via een HTTP-pagina. |
| Prometheus | Haalt die gegevens regelmatig op en bewaart ze. |
| Grafana | Vraagt gegevens aan Prometheus en tekent je dashboard. |

Dit lab gebruikt meestal **pull**: Prometheus gaat zelf naar de exporters. Dat is anders dan een agent die alles naar een clouddienst doorstuurt.

We gebruiken Node Exporter voor Linux, windows_exporter voor Windows en **cAdvisor** (*Container Advisor*, het meetprogramma voor containers) voor containers. De standaardmetingen van Docker zelf vertellen niet automatisch hoeveel geheugen elke toepassing gebruikt.

Een doel dat Prometheus meet heet een **target**. Een **job** bundelt targets met eenzelfde soort taak, bijvoorbeeld `linux`. Het label **instance** bevat gewoonlijk het concrete doeladres, bijvoorbeeld `192.168.77.100:9100`.

Een **label** is een naam met een waarde die bij een meting staat. `job="linux"` kiest de Linux-metingen. `instance="192.168.77.100:9100"` kiest één meetpunt. Met zulke filters toon je niet per ongeluk de verkeerde machine.

## 3. ‘De meting lukt’ is niet ‘de website werkt’

Prometheus maakt de waarde `up`. Staat die op 1, dan kon Prometheus de gegevens van die exporter ophalen. Dat betekent niet dat de webpagina voor gebruikers werkt.

Daarom gebruiken we ook **Blackbox Exporter**. Die vraagt de webpagina echt op. De waarde `probe_success` vertelt of die proef slaagt.

Voorbeeld: je stopt NGINX. Node Exporter blijft draaien en zijn `up` blijft 1. De webtest krijgt geen goede pagina en `probe_success` wordt 0. Zo zie je wat er precies fout is.

Als Blackbox zelf onbereikbaar is, kunnen ook de webmetingen ontbreken. Kijk dan naar targets en `up`; een lege grafiek betekent niet automatisch ‘alles is goed’.

## 4. Getallen begrijpen

**PromQL** betekent *Prometheus Query Language*: de taal waarmee je Prometheus een vraag stelt. Zo’n vraag heet een **query**. Je kunt één meetwaarde opvragen of een berekening laten uitvoeren. Je leert telkens een formule vanuit de vraag die je wilt beantwoorden.

**Hoeveel Linux-RAM is beschikbaar?** Vraag de gemeten beschikbare bytes op. Grafana kan de eenheid omzetten naar GiB. Je hoeft geen getal zoals ‘deze machine heeft altijd 4 GB’ in je formule te zetten.

**Hoeveel procent van C: is gebruikt?** Deel gemeten vrije ruimte door gemeten totale ruimte. Dat geeft het vrije deel. Trek af van 1 en vermenigvuldig met 100. Die berekening blijft werken als de schijf groter wordt.

Kies ook passende labels. Zonder `volume="C:"` kun je per ongeluk een andere schijf meten. Een te strenge filter kan juist alle gegevens weghalen.

## 5. Containers herkennen

In H4 gaven we de containers een label `thecloud_app`. cAdvisor biedt dat als `container_label_thecloud_app` aan. Zo kun je de broker volgen, ook als een container na opnieuw aanmaken een ander intern **ID**, dus identificatienummer, krijgt.

Met de werkset van het geheugen zie je het RAM dat de container actief gebruikt. Met een CPU-teller bereken je CPU-gebruik per seconde. **CPU** (*Central Processing Unit*) betekent processor; **RAM** (*Random Access Memory*) is werkgeheugen. Een resultaat van 150 procent betekent bij onze berekening ongeveer anderhalve CPU-kern; het is geen percentage van een zelfgekozen VM-limiet.

cAdvisor heeft veel toegang tot de host nodig. In deze cursus is dat alleen onze eigen container-VM, niet de Proxmox-node van de opleiding.

### Bytes, MiB en GiB

Een **byte** is een kleine eenheid voor gegevens. In de gereedschappen zie je verschillende grotere eenheden:

| Eenheid | Voluit | Hoeveel? |
| --- | --- | --- |
| MB | Megabyte | 1.000.000 bytes |
| GB | Gigabyte | 1.000.000.000 bytes |
| MiB | Mebibyte | 1.048.576 bytes |
| GiB | Gibibyte | 1.024 MiB |

Daarom kunnen twee programma’s voor dezelfde hoeveelheid data een iets ander getal tonen. **Bytes per seconde** is een snelheid; **bytes** alleen is een hoeveelheid.

## 6. Een nuttig dashboard

Een dashboard moet je helpen beslissen. Geef elk paneel een duidelijke naam, eenheid en machinefilter.

- Een **stat** toont één getal, zoals vrije ruimte.
- Een **gauge** toont een waarde met een schaal.
- Een **time series** toont het verloop in de tijd.

Een mooie grafiek met een verkeerde eenheid is misleidend. Controleer je dashboard daarom naast een gewone systeemcontrole op de machine zelf.

## 7. Een waarschuwing laten afgaan

Een **alert** is een regel zoals ‘de website geeft langer dan één minuut geen goed antwoord’. De wachttijd voorkomt dat één korte storing meteen als langdurig probleem wordt behandeld.

Je ziet doorgaans drie stappen: normaal, **pending** terwijl de wachttijd loopt, en **firing** wanneer de regel lang genoeg waar is. Na herstel wordt de alert weer normaal.

**Alertmanager** is een apart programma dat waarschuwingen groepeert en naar een meldkanaal kan sturen. We tonen alerts in Prometheus. Dat is nog geen e-mail of bericht naar je telefoon. Voor zulke meldingen heb je bijvoorbeeld Alertmanager en een meldkanaal nodig. Dat blijft een uitbreiding.

Je test bewust. Stop alleen je eigen NGINX om de webalert te proberen. Vul niet je echte systeemschijf om een schijfalert uit te lokken. We zetten daarvoor de testdrempel tijdelijk lager en herstellen haar daarna.

## 8. Instellingen en een dashboard bewaren

De instellingen van Prometheus en Compose staan in **YAML**: leesbare tekst met inspringing die toont welke regels bij elkaar horen.

Een Grafana-dashboard kun je bewaren als **JSON** (*JavaScript Object Notation*). Dat is ook tekst, maar met velden, waarden en accolades, bijvoorbeeld `{"title":"Mijn dashboard"}`. De export bevat de beschrijving van je panelen. Je plakt die volledige tekst in je verslag; je hoeft er geen JavaScript-programma voor te schrijven.

## Kun je dit uitleggen?

1. Welk programma bewaart de metingen en welk tekent de grafiek?
2. Waarom kan Linux `up=1` hebben terwijl de website niet werkt?
3. Waarom gebruik je voor netwerkverkeer `rate()`?
4. Waarom deel je door de gemeten schijfgrootte in plaats van een vaste 64 GB?
5. Waarom toon je zowel het afgaan als het verdwijnen van een alert?

## Bronnen

- [Prometheus uitgelegd](https://prometheus.io/docs/introduction/overview/)
- [PromQL-functies](https://prometheus.io/docs/prometheus/latest/querying/functions/)
- [cAdvisor en Prometheus](https://prometheus.io/docs/guides/cadvisor/)
- [windows_exporter](https://github.com/prometheus-community/windows_exporter)
