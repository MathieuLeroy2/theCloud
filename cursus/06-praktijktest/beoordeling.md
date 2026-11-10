# Beoordeling van de praktijktest

Beide varianten gebruiken dezelfde schaal. De docent kiest de variant vooraf en probeert haar op de lesomgeving uit. De ene variant is geen onverwachte vervanging tijdens de toets.

| Onderdeel | Punten | Waarop letten? |
| --- | --- | --- |
| H6.1 Plan | 2 | Juiste machines, poorten, namen en opslag beschreven. |
| H6.2 Toepassing | 5 | CLI-opdracht correct; toepassing vanaf client bruikbaar; poortbinding en rechten passend; code herkenbaar. |
| H6.3 Bewaren | 3 | Alleen eigen toetscontainer vervangen; data blijft zonder opnieuw invoeren; bewijs vóór/na. |
| H6.4 Dashboard | 5 | Per paneel 1 punt: juiste target/label, betekenisvolle query en juiste eenheid. |
| H6.5 Alert | 2 | Firing en herstel met verklaarde testdrempel en uiteindelijke normale instelling. |
| H6.5 Foutonderzoek | 2 | Gerichte test, bruikbare verklaring en herstel. |
| H6.6 Eén verslag | 1 | Alles staat leesbaar in één Markdown-bestand zonder private sleutels. |
| **Totaal** | **20** | |

Bij toepassing A horen zowel HTML- als CSS-toegang bij de werking. Bij toepassing B horen de toegestane én geweigerde MQTT-acties bij de werking. De mondelinge controle gebruikt steeds het eigen werk van de student.

## Voor de docent

Reserveer vooraf de volgende zaken: werkende VM's, SSH-route, Docker, cursusimages lokaal, cAdvisor, Prometheus, Grafana en Node Exporter op cloud-web. Test de vijf benodigde metricfamilies en labels. Laat afhankelijkheden van Windows uit H5 tijdens deze toets niet onnodig RAM vragen; leg vast welke targets bij de toets beoordeeld worden.

De toets start met een lege eigen werkmap en zonder de nieuwe toetscontainer of het toetsdashboard. De monitoringbasis mag wel al draaien. OS-installatie en grote downloads tellen niet mee in de drie uur.

Kies één herstelbare fout, noteer wat je veranderde en bewaar de begintoestand. Voorbeelden: stop alleen de toetscontainer; laat de student een fout doelpoortnummer onderzoeken; wijzig bij variant A één CSS-bestandsnaam. Kies geen fout die onbekende technieken vraagt of bestaande labo's beschadigt.

De oude Transmission- en KiCad-toetsen toetsten ook VM's, containers en monitoring. Deze nieuwe varianten beoordelen diezelfde combinatie met programma's die nu expliciet in de lessen geoefend zijn. Zo hangt de toets niet af van torrents, een externe downloadsite of een extra grafische desktop op een server.

Een studentenexport bevat deze rubric en de toegewezen opdracht, maar geen modeloplossingen of docentfoutkeuze. Als studenten deze hele repository kunnen lezen, zijn de oplossingen uiteraard ook zichtbaar; publiceer de toets zo nodig apart.
